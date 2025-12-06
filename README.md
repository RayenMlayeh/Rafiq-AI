# 🤖 Rafiq-AI

**Rafiq-AI** is an intelligent virtual secretary chatbot designed for the **Nuit de l'Info 2025** national challenge. It helps businesses and participants access event information through a conversational interface with voice support and multilingual capabilities (French, English, and Hassaniya).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12+-blue.svg)
![React](https://img.shields.io/badge/react-19.2-blue.svg)

---

## 🌟 Features

- **🎤 Voice Interaction**: Speech-to-text input and text-to-speech output with French language support
- **🌍 Multilingual Support**: Understands French, English, and Hassaniya (Mauritanian Arabic dialect)
- **🧠 RAG System**: Hybrid TF-IDF + BM25 search for accurate knowledge retrieval
- **💬 Natural Conversations**: Powered by LangChain and OpenRouter GPT-3.5-turbo
- **📚 Knowledge Base Management**: Easy JSON-based knowledge ingestion for businesses
- **🎨 Modern UI**: Clean, responsive interface built with React and TypeScript

---

## 🏗️ Architecture

```
Rafiq-AI/
├── backend/              # FastAPI server
│   ├── app/
│   │   ├── main.py       # Application entry point
│   │   ├── routes.py     # API endpoints
│   │   ├── rag.py        # RAG system (TF-IDF + BM25)
│   │   ├── llm.py        # LLM integration
│   │   └── schemas.py    # Pydantic models
│   ├── data/
│   │   └── knowledge_base.json  # Pre-loaded Nuit de l'Info data
│   └── requirements.txt
│
└── frontend/             # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── ChatInterface.tsx
    │   │   └── MessageBubble.tsx
    │   ├── services/
    │   │   └── api.ts
    │   └── App.tsx
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+**
- **Node.js 18+**
- **OpenRouter API Key** ([Get one here](https://openrouter.ai/))

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Create .env file
echo "OPENROUTER_API_KEY=your_api_key_here" > .env

# Run server
uvicorn app.main:app --reload
```

Backend will run at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run development server
npm run dev
```

Frontend will run at `http://localhost:5173`

---

## 📖 Usage Guide

### For Businesses: Adding Your Knowledge Base

1. **Prepare your data** in JSON format:
```json
[
  {
    "id": "company.service.1",
    "title": "Service Title",
    "content": "Detailed description of your service...",
    "category": "services",
    "tags": ["tag1", "tag2"]
  }
]
```

2. **Send to API**:
```bash
curl -X POST http://localhost:8000/knowledge-base \
  -H "Content-Type: application/json" \
  -d @your_knowledge.json
```

3. **Test the chatbot** by asking questions about your services!

### For Users: Interacting with the Chatbot

- **Type your question** in the chat interface
- **Click the microphone** icon to speak your question (French)
- **Click the speaker** icon on any message to hear the response
- **Toggle auto-read** to automatically hear all responses

---

## 🌐 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new **Web Service** on Render
3. Set environment variables:
   - `OPENROUTER_API_KEY`: Your API key
   - `PYTHON_VERSION`: 3.12.0
4. Deploy with start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
4. Deploy automatically!

**⚠️ Important**: Update CORS settings in `backend/app/main.py` with your production frontend URL.

---

## 🛠️ Technologies

**Backend:**
- FastAPI 0.115.0
- LangChain 0.2.10 + OpenRouter
- scikit-learn 1.5.2 (TF-IDF)
- rank-bm25 0.2.2
- NLTK 3.9.1

**Frontend:**
- React 19.2.1
- TypeScript 5.8.2
- Vite 6.2.0
- Web Speech API

---

## 🎯 Nuit de l'Info 2025 Compliance

This project meets all challenge requirements:

✅ **Conversational Interface**: Natural language chatbot  
✅ **Knowledge Integration**: RAG system with business knowledge  
✅ **Voice Support**: Speech-to-text and text-to-speech  
✅ **Multilingual**: French, English, and Hassaniya support  
✅ **Deployment Ready**: Configured for Vercel + Render  

---

## 📝 API Endpoints

### `GET /health`
Health check endpoint

### `POST /knowledge-base`
Ingest new knowledge
```json
{
  "paragraphs": [
    {
      "id": "unique-id",
      "title": "Title",
      "content": "Content...",
      "category": "category",
      "tags": ["tag1"]
    }
  ],
  "merge": true
}
```

### `POST /chat`
Send chat message
```json
{
  "question": "Your question here"
}
```

Response:
```json
{
  "answer": "AI response",
  "context": [
    {
      "id": "doc-id",
      "title": "Title",
      "content": "Content...",
      "score": 0.85
    }
  ]
}
```

---

## 🤝 Contributing

This project was created for **Nuit de l'Info 2025**. Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

**Team Rafiq-AI** - Nuit de l'Info 2025 Challenge

---

## 🙏 Acknowledgments

- **Nuit de l'Info** for organizing the challenge
- **OpenRouter** for LLM API access
- **Vercel & Render** for hosting solutions
- The open-source community for amazing tools and libraries

---

## 📞 Support

For questions or support regarding adding your business knowledge to the chatbot:

- Create an issue on GitHub
- Follow the deployment guide in `DEPLOYMENT.md` (if available)
- Check the API documentation above

---

**Made with ❤️ for Nuit de l'Info 2025**
