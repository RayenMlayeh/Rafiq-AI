import React from 'react';
import Header from './components/Header';
import KnowledgePanel from './components/KnowledgePanel';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col font-body text-vintage-ink selection:bg-vintage-brass/20">
      <Header />
      <main className="flex-1 p-4 md:px-8 md:py-10 lg:px-12 animate-fade-in">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <section className="lg:col-span-5 flex flex-col space-y-6">
              <KnowledgePanel />
            </section>
            <section className="lg:col-span-7 flex flex-col">
              <ChatInterface />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;