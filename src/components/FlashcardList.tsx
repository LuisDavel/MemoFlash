import { useState, useCallback, useRef } from 'react';
import { useFlashcardStore, Flashcard } from '@/lib/store';

export function FlashcardList() {
  const flashcards = useFlashcardStore(state => state.flashcards);
  const removeFlashcard = useFlashcardStore(state => state.removeFlashcard);
  const clearAllFlashcards = useFlashcardStore(state => state.clearAllFlashcards);
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteMessage, setDeleteMessage] = useState<{
    show: boolean;
    message: string;
    deletedCard?: {id: string; question: string; answer: string; createdAt: string; lastReviewed?: string; difficulty?: 'fácil' | 'médio' | 'difícil'};
  }>({
    show: false,
    message: ''
  });
  
  const deleteTimeoutRef = useRef<number | null>(null);
  
  const filteredFlashcards = searchTerm
    ? flashcards.filter(card => 
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        card.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : flashcards;
  
  const handleUndoDelete = useCallback(() => {
    if (deleteMessage.deletedCard && deleteTimeoutRef.current) {
      window.clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
      
      const flashcardStore = useFlashcardStore.getState();
      
      flashcardStore.addFlashcard(
        deleteMessage.deletedCard.question,
        deleteMessage.deletedCard.answer
      );
      
      setDeleteMessage({
        show: false,
        message: ''
      });
    }
  }, [deleteMessage]);
  
  const handleDeleteFlashcard = useCallback((id: string, question: string) => {
    const deletedCard = {...flashcards.find(card => card.id === id)!};
    
    removeFlashcard(id);
    
    setDeleteMessage({
      show: true,
      message: `Flashcard excluído com sucesso.`,
      deletedCard: deletedCard as any
    });
    
    if (deleteTimeoutRef.current) {
      window.clearTimeout(deleteTimeoutRef.current);
    }
    
    deleteTimeoutRef.current = window.setTimeout(() => {
      setDeleteMessage({ show: false, message: '' });
      deleteTimeoutRef.current = null;
    }, 5000);
  }, [flashcards, removeFlashcard]);
  
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Nenhum flashcard encontrado</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Comece a criar seus flashcards para revisar o conteúdo de forma eficiente.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meus Flashcards</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar flashcards..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowConfirmation(true)}
            className="btn btn-secondary flex items-center text-sm"
          >
            <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpar Todos
          </button>
        </div>
      </div>
      
      {deleteMessage.show && (
        <div className="mb-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 rounded-2xl shadow-md toast-undo fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between min-w-96 border border-gray-700/30">
          <div className="flex items-center">
            <div className="bg-red-500/20 p-2 rounded-full mr-3">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium">{deleteMessage.message}</p>
          </div>
          <button 
            onClick={handleUndoDelete}
            className="ml-4 px-4 py-1.5 text-xs bg-white text-gray-800 rounded-full hover:bg-gray-200 transition-all duration-200 font-medium flex items-center group"
          >
            <svg className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 group-hover:-translate-x-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Desfazer
          </button>
        </div>
      )}
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-700/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full scale-in border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Confirmar exclusão</h3>
            <p className="text-gray-600 mb-8 text-center">Tem certeza que deseja excluir todos os flashcards? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllFlashcards();
                  setShowConfirmation(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all flex-1 font-medium"
              >
                Excluir Todos
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFlashcards.map(flashcard => (
          <FlashcardItem 
            key={flashcard.id} 
            flashcard={flashcard}
            onDelete={() => handleDeleteFlashcard(flashcard.id, flashcard.question)}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        Total de {filteredFlashcards.length} flashcard{filteredFlashcards.length !== 1 ? 's' : ''}
        {searchTerm && flashcards.length !== filteredFlashcards.length && 
          ` (filtrando de ${flashcards.length})`
        }
      </div>
    </div>
  );
}

interface FlashcardItemProps {
  flashcard: Flashcard;
  onDelete: () => void;
}

function FlashcardItem({ flashcard, onDelete }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const formattedDate = new Date(flashcard.createdAt).toLocaleDateString('pt-BR');
  
  let difficultyColor = 'bg-gray-100 text-gray-600';
  if (flashcard.difficulty) {
    switch (flashcard.difficulty) {
      case 'fácil':
        difficultyColor = 'bg-green-100 text-green-800';
        break;
      case 'médio':
        difficultyColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'difícil':
        difficultyColor = 'bg-red-100 text-red-800';
        break;
    }
  }
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    setTimeout(() => {
      onDelete();
      setShowDeleteConfirm(false);
    }, 300);
  };
  
  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };
  
  return (
    <div className="relative" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer h-64 flashcard-container relative ${isDeleting ? 'zoom-fade-out' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard-front p-5">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  {formattedDate}
                </div>
                {flashcard.difficulty && (
                  <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
                    {flashcard.difficulty}
                  </span>
                )}
              </div>
              <div className="flex-grow flex items-center justify-center">
                <p className="text-lg font-medium text-center">{flashcard.question}</p>
              </div>
              <div className="mt-4 text-center text-xs text-indigo-500 flex items-center justify-center">
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Toque para virar
              </div>
            </div>
          </div>
          
          <div className="flashcard-back p-5">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  {formattedDate}
                </div>
                {flashcard.difficulty && (
                  <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
                    {flashcard.difficulty}
                  </span>
                )}
              </div>
              <div className="flex-grow flex items-center justify-center">
                <p className="text-lg text-center">{flashcard.answer}</p>
              </div>
              <div className="mt-4 text-center text-xs text-indigo-500 flex items-center justify-center">
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Toque para virar
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className={`absolute top-3 right-3 p-2.5 bg-white text-red-500 rounded-full shadow-sm z-10 hover:bg-red-500 hover:text-white transition-all transform ${isHovering ? 'opacity-100 scale-100 pulse-animation' : 'opacity-0 scale-75'}`}
          onClick={handleDeleteClick}
          title="Excluir flashcard"
          aria-label="Excluir flashcard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-gray-700/25 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={cancelDelete}
        >
          <div 
            className="bg-white p-8 rounded-2xl shadow-md max-w-sm w-full modal-confirm border border-gray-100"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Excluir Flashcard</h3>
            <p className="text-center text-gray-600 mb-8">
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir este flashcard?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium"
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 