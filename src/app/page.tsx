'use client';

import { useState } from 'react';
import { FlashcardForm } from '@/components/FlashcardForm';
import { FlashcardList } from '@/components/FlashcardList';
import { StudyMode } from '@/components/StudyMode';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'study'>('create');
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Flashcard Master</h1>
        <p className="text-lg opacity-90">Aprenda de forma eficiente e divertida</p>
      </header>
      
      <main className="container mx-auto px-4 py-8 -mt-6 relative z-10">
        <div className="tab-container">
          <button
            onClick={() => setActiveTab('create')}
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          >
            Criar Flashcard
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          >
            Meus Flashcards
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`tab-button ${activeTab === 'study' ? 'active' : ''}`}
          >
            Modo Estudo
          </button>
        </div>
        
        <div className="content-card fade-in">
          {activeTab === 'create' && <FlashcardForm />}
          {activeTab === 'list' && <FlashcardList />}
          {activeTab === 'study' && <StudyMode />}
        </div>
        
        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>Desenvolvido com 💜 por Luis Davel</p>
        </footer>
      </main>
    </div>
  )
}
