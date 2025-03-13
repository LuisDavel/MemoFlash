'use client';

import { useState } from 'react';
import { FlashcardForm } from '@/components/FlashcardForm';
import { FlashcardList } from '@/components/FlashcardList';
import { StudyMode } from '@/components/StudyMode';
import { LucideSquarePen } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'study'>('create');
  
  return (
    <div className="app-container">
      <main className="container mx-auto px-4 py-10 relative z-10">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <div className="flex items-center">
              <div className="rounded-md p-1">
                <LucideSquarePen className='w-8 h-8 text-indigo-600' />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-0 ml-2">
                Memo Flash
              </h1>
            </div>
            
            <nav className="nav-simple flex space-x-2 bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
              <button
                onClick={() => setActiveTab('create')}
                className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
                title="Criar novo flashcard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className='text-sm'>Criar</span>
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
                title="Ver todos os flashcards"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Biblioteca</span>
              </button>
              <button
                onClick={() => setActiveTab('study')}
                className={`nav-btn ${activeTab === 'study' ? 'active' : ''}`}
                title="Iniciar modo de estudo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
                <span>Estudar</span>
              </button>
            </nav>
          </div>
        </div>
        
        <div className="content-card fade-in mb-12">
          {activeTab === 'create' && <FlashcardForm />}
          {activeTab === 'list' && <FlashcardList />}
          {activeTab === 'study' && <StudyMode />}
        </div>
        
        <footer className="text-center text-gray-500 text-sm pb-6 mt-6">
          <p className="text-sm text-gray-400">
            Criado por <a href="https://luisdavel.com" target="_blank" rel="noopener noreferrer">Luis Davel</a> 💜 {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  )
}
