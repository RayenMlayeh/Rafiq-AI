from typing import List, Dict, Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi
import re
import json
from pathlib import Path
import numpy as np
from unidecode import unidecode
import nltk
from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

MIN_SCORE = 0.02


class KnowledgeBase:
    """RAG system with hybrid TF-IDF and BM25 search, query expansion, and metadata filtering."""
    
    def __init__(self, auto_load: bool = True):
        self.documents: List[Dict] = []
        self.paragraphs: List[str] = []
        self.metadata: List[Dict] = []
        self.tfidf_vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self.bm25: Optional[BM25Okapi] = None
        self.tokenized_corpus: List[List[str]] = []
        
        try:
            self.stop_words = set(stopwords.words('french'))
        except:
            self.stop_words = {'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'mais', 'pour', 'dans', 'sur', 'avec'}
        
        if auto_load:
            self.load_from_json()
            self.load_user_knowledge()

    def reset(self):
        self.documents = []
        self.paragraphs = []
        self.metadata = []
        self.tfidf_vectorizer = None
        self.tfidf_matrix = None
        self.bm25 = None
        self.tokenized_corpus = []

    def _preprocess_text(self, text: str) -> str:
        text = unidecode(text)
        text = text.lower()
        return re.sub(r'\s+', ' ', text).strip()

    def _tokenize(self, text: str) -> List[str]:
        try:
            tokens = word_tokenize(text, language='french')
        except:
            tokens = text.split()
        return [t for t in tokens if t not in self.stop_words and len(t) > 2]

    def _expand_query(self, query: str) -> str:
        expansions = {
            'horaire': ['horaire', 'heure', 'debut', 'fin', 'quand'],
            'contact': ['contact', 'email', 'telephone', 'joindre', 'contacter'],
            'equipe': ['equipe', 'groupe', 'participant', 'membre'],
            'prix': ['prix', 'recompense', 'gain', 'dotation'],
            'inscription': ['inscription', 'inscrire', 'enregistrement', 'participer'],
            'defi': ['defi', 'challenge', 'epreuve', 'competition'],
            'reglement': ['reglement', 'regle', 'consigne', 'condition'],
        }
        
        query_lower = query.lower()
        expanded_terms = []
        for key, synonyms in expansions.items():
            if key in query_lower:
                expanded_terms.extend(synonyms)
        
        return query + ' ' + ' '.join(expanded_terms) if expanded_terms else query

    def ingest(self, text: str, merge: bool = True):
        raw_parts = re.split(r"\n\s*\n", text)
        new_paragraphs = [p.strip() for p in raw_parts if p.strip() and len(p.strip()) > 20]

        if not new_paragraphs:
            if not merge:
                self.reset()
            return

        if merge:
            start_idx = len(self.paragraphs)
            self.paragraphs.extend(new_paragraphs)
            new_metadata = [{"source": "text_input", "index": start_idx + i} for i in range(len(new_paragraphs))]
            self.metadata.extend(new_metadata)
        else:
            self.paragraphs = new_paragraphs
            self.metadata = [{"source": "text_input", "index": i} for i in range(len(new_paragraphs))]
        
        self._build_indices()

    def _build_indices(self):
        if not self.paragraphs:
            return
        
        preprocessed_texts = [self._preprocess_text(p) for p in self.paragraphs]
        num_docs = len(preprocessed_texts)
        
        if num_docs < 5:
            max_df_val, min_df_val = 1.0, 1
        else:
            max_df_val, min_df_val = 0.85, 1
        
        self.tfidf_vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=5000,
            min_df=min_df_val,
            max_df=max_df_val,
            sublinear_tf=True,
            stop_words=list(self.stop_words)
        )
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(preprocessed_texts)
        
        self.tokenized_corpus = [self._tokenize(text) for text in preprocessed_texts]
        if self.tokenized_corpus:
            self.bm25 = BM25Okapi(self.tokenized_corpus)

    def is_empty(self) -> bool:
        return not self.paragraphs

    def _tfidf_search(self, query: str, top_k: int = 10) -> List[Tuple[int, float]]:
        if self.tfidf_vectorizer is None or self.tfidf_matrix is None:
            return []
        
        query_preprocessed = self._preprocess_text(query)
        query_vec = self.tfidf_vectorizer.transform([query_preprocessed])
        scores = cosine_similarity(query_vec, self.tfidf_matrix)[0]
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(idx, scores[idx]) for idx in top_indices]

    def _bm25_search(self, query: str, top_k: int = 10) -> List[Tuple[int, float]]:
        if self.bm25 is None:
            return []
        
        query_preprocessed = self._preprocess_text(query)
        query_tokens = self._tokenize(query_preprocessed)
        if not query_tokens:
            return []
        
        scores = self.bm25.get_scores(query_tokens)
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(idx, scores[idx]) for idx in top_indices]

    def _hybrid_search(self, query: str, top_k: int = 5, alpha: float = 0.5) -> List[Tuple[int, float]]:
        tfidf_results = dict(self._tfidf_search(query, top_k=15))
        bm25_results = dict(self._bm25_search(query, top_k=15))
        
        if tfidf_results:
            max_tfidf = max(tfidf_results.values())
            tfidf_results = {k: v/max_tfidf for k, v in tfidf_results.items()}
        
        if bm25_results:
            max_bm25 = max(bm25_results.values())
            bm25_results = {k: v/max_bm25 for k, v in bm25_results.items()}
        
        all_indices = set(tfidf_results.keys()) | set(bm25_results.keys())
        combined_scores = {idx: alpha * tfidf_results.get(idx, 0) + (1 - alpha) * bm25_results.get(idx, 0) 
                          for idx in all_indices}
        
        return sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)[:top_k]

    def retrieve(self, query: str, top_k: int = 5, use_expansion: bool = True, 
                 filter_tags: Optional[List[str]] = None) -> List[Dict]:
        if self.is_empty():
            return []
        
        search_query = self._expand_query(query) if use_expansion else query
        results = self._hybrid_search(search_query, top_k=top_k * 2)
        
        if filter_tags and self.metadata:
            filtered_results = []
            for idx, score in results:
                doc_tags = self.metadata[idx].get('tags', [])
                if any(tag in doc_tags for tag in filter_tags):
                    filtered_results.append((idx, score))
            results = filtered_results[:top_k]
        else:
            results = results[:top_k]
        
        formatted_results = []
        for idx, score in results:
            if score >= MIN_SCORE:
                result = {
                    "index": int(idx),
                    "text": self.paragraphs[idx],
                    "score": float(score),
                }
                if idx < len(self.metadata):
                    result["metadata"] = self.metadata[idx]
                formatted_results.append(result)
        
        return formatted_results
    
    def load_from_json(self, file_path: str | None = None) -> bool:
        if file_path is None:
            current_dir = Path(__file__).parent.parent
            file_path = current_dir / "data" / "knowledge_base.json"
        else:
            file_path = Path(file_path)
        
        if not file_path.exists():
            return False
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, list):
                self.documents = data
                self.paragraphs = []
                self.metadata = []
                
                for doc in data:
                    text = doc.get('texte', '')
                    if text and len(text) > 20:
                        self.paragraphs.append(text)
                        self.metadata.append({
                            'id': doc.get('id', ''),
                            'titre': doc.get('titre', ''),
                            'type': doc.get('type', ''),
                            'tags': doc.get('tags', []),
                            'source': 'json'
                        })
            
            elif isinstance(data, dict) and "content" in data:
                self.paragraphs = []
                self.metadata = []
                
                for item in data["content"]:
                    if isinstance(item, dict) and "text" in item:
                        category = item.get("category", "")
                        text = item["text"]
                        full_text = f"{category}: {text}" if category else text
                        
                        if len(full_text) > 20:
                            self.paragraphs.append(full_text)
                            self.metadata.append({'category': category, 'source': 'json'})
            
            if self.paragraphs:
                self._build_indices()
                return True
            return False
            
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading knowledge base: {e}")
            return False

    def get_statistics(self) -> Dict:
        if self.is_empty():
            return {"status": "empty"}
        
        avg_length = sum(len(p.split()) for p in self.paragraphs) / len(self.paragraphs)
        all_tags = [tag for meta in self.metadata for tag in meta.get('tags', [])]
        tag_counts = Counter(all_tags)
        
        return {
            "status": "loaded",
            "total_paragraphs": len(self.paragraphs),
            "average_words_per_paragraph": round(avg_length, 1),
            "unique_tags": len(tag_counts),
            "top_tags": dict(tag_counts.most_common(10)),
            "has_metadata": bool(self.metadata),
        }

    def load_user_knowledge(self, file_path: str | None = None) -> bool:
        if file_path is None:
            current_dir = Path(__file__).parent.parent
            file_path = current_dir / "data" / "user_knowledge.json"
        else:
            file_path = Path(file_path)
        
        if not file_path.exists():
            return False
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if not isinstance(data, list):
                return False
            
            for item in data:
                text = item.get('text', '')
                if text and len(text) > 20:
                    self.paragraphs.append(text)
                    meta = item.get('metadata', {})
                    meta['source'] = 'user_input'
                    self.metadata.append(meta)
            
            if self.paragraphs:
                self._build_indices()
            return True
            
        except (IOError, json.JSONDecodeError) as e:
            print(f"Error loading user knowledge: {e}")
            return False
    
    def save_to_json(self, file_path: str | None = None) -> bool:
        if file_path is None:
            current_dir = Path(__file__).parent.parent
            file_path = current_dir / "data" / "user_knowledge.json"
        else:
            file_path = Path(file_path)
        
        try:
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            data = []
            for i, para in enumerate(self.paragraphs):
                meta = self.metadata[i] if i < len(self.metadata) else {}
                if meta.get('source') in ['text_input', 'user_input']:
                    data.append({"text": para, "metadata": meta})
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
            
        except IOError as e:
            print(f"Error saving knowledge base: {e}")
            return False
