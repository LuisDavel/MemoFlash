import { useState, useEffect, useRef } from 'react';
import { useFlashcardStore, Flashcard } from '@/lib/store';

export function StudyMode() {
  const flashcards = useFlashcardStore(state => state.flashcards);
  const updateFlashcard = useFlashcardStore(state => state.updateFlashcard);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animation, setAnimation] = useState('');
  
  // Flag para controlar a inicialização
  const initialized = useRef(false);
  
  // Inicializar os cartões apenas na primeira montagem ou quando a contagem de flashcards mudar
  useEffect(() => {
    setIsLoading(true);
    
    // Só reembaralhar quando a contagem de flashcards mudar ou na primeira montagem
    if (!initialized.current || flashcards.length !== studyCards.length) {
      if (flashcards.length > 0) {
        // Pequeno atraso para mostrar o loader
        setTimeout(() => {
          // Embaralha os flashcards para estudo
          const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
          setStudyCards(shuffled);
          setCurrentIndex(0);
          setShowAnswer(false);
          setIsLoading(false);
          initialized.current = true;
        }, 600);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [flashcards.length, studyCards.length]);
  
  const handleNextCard = (difficulty?: 'fácil' | 'médio' | 'difícil') => {
    setAnimation('slide-out-right');
    
    // Permitir que a animação ocorra
    setTimeout(() => {
      if (difficulty) {
        try {
          // Atualiza o flashcard no store
          updateFlashcard(studyCards[currentIndex].id, {
            difficulty,
            // Convertemos explicitamente para string para evitar problemas de tipo
            lastReviewed: new Date().toISOString()
          });
        } catch (error) {
          console.error("Erro ao classificar o flashcard:", error);
        }
      }
      
      // Avança para o próximo cartão
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setAnimation('slide-in-left');
      
      // Remover a classe de animação depois que estiver completa
      setTimeout(() => {
        setAnimation('');
      }, 300);
    }, 200);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loader"></div>
        <p className="mt-4 text-gray-600">Preparando flashcards...</p>
      </div>
    );
  }
  
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Nenhum flashcard para estudar</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Crie flashcards para começar seu estudo.
        </p>
      </div>
    );
  }
  
  if (currentIndex >= studyCards.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Parabéns!</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Você completou todos os flashcards desta sessão. Continue estudando para fixar o conhecimento.
        </p>
        <button
          className="btn btn-primary inline-flex items-center px-6 py-3"
          onClick={() => {
            const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
            setStudyCards(shuffled);
            setCurrentIndex(0);
            setShowAnswer(false);
          }}
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Estudar Novamente
        </button>
      </div>
    );
  }
  
  const currentCard = studyCards[currentIndex];
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Modo de Estudo</h2>
        <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          {currentIndex + 1} de {studyCards.length}
        </div>
      </div>
      
      <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 min-h-64 flex flex-col ${animation}`}>
        <div className="flex-1 flex items-center justify-center mb-6">
          {showAnswer ? (
            <div className="max-w-md w-full">
              <div className="text-sm text-gray-500 mb-2">Resposta:</div>
              <p className="text-xl text-center font-medium">{currentCard.answer}</p>
            </div>
          ) : (
            <div className="max-w-md w-full">
              <div className="text-sm text-gray-500 mb-2">Pergunta:</div>
              <p className="text-xl text-center font-medium">{currentCard.question}</p>
            </div>
          )}
        </div>
        
        {!showAnswer ? (
          <button
            className="btn btn-primary w-full py-3 text-lg"
            onClick={() => setShowAnswer(true)}
          >
            Mostrar Resposta
          </button>
        ) : (
          <div>
            <p className="text-center text-gray-600 mb-3">Quão bem você conhecia essa resposta?</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                className="py-3 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium"
                onClick={() => handleNextCard('fácil')}
              >
                Fácil
              </button>
              <button
                className="py-3 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors font-medium"
                onClick={() => handleNextCard('médio')}
              >
                Médio
              </button>
              <button
                className="py-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium"
                onClick={() => handleNextCard('difícil')}
              >
                Difícil
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          className="px-4 py-2 text-gray-500 hover:text-gray-700 flex items-center"
          onClick={() => handleNextCard()}
        >
          <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Pular
        </button>
        
        <div className="text-sm text-gray-500">
          {currentCard.difficulty ? (
            <span>Classificação anterior: <span className="font-medium">{currentCard.difficulty}</span></span>
          ) : (
            <span>Primeira vez estudando</span>
          )}
        </div>
      </div>
    </div>
  );
} 