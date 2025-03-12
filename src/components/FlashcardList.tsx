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
  
  // Guarda referência ao timeout para poder cancelá-lo se o usuário desfizer
  const deleteTimeoutRef = useRef<number | null>(null);
  
  const filteredFlashcards = searchTerm
    ? flashcards.filter(card => 
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        card.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : flashcards;
  
  // Função para restaurar um flashcard excluído
  const handleUndoDelete = useCallback(() => {
    if (deleteMessage.deletedCard && deleteTimeoutRef.current) {
      // Cancelar o timeout para limpar a mensagem
      window.clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
      
      // Adicionar o flashcard de volta à store
      // Esta chamada precisa passar pela interface do Zustand para adicionar um flashcard existente
      const flashcardStore = useFlashcardStore.getState();
      
      // Adicionar o flashcard de volta com seus dados originais
      flashcardStore.addFlashcard(
        deleteMessage.deletedCard.question,
        deleteMessage.deletedCard.answer
      );
      
      // Resetar a mensagem de exclusão
      setDeleteMessage({
        show: false,
        message: ''
      });
    }
  }, [deleteMessage]);
  
  // Função para excluir flashcard com animação e feedback
  const handleDeleteFlashcard = useCallback((id: string, question: string) => {
    // Guardar uma cópia do flashcard antes de remover
    const deletedCard = {...flashcards.find(card => card.id === id)!};
    
    // Remover o flashcard
    removeFlashcard(id);
    
    // Mostrar mensagem de feedback com opção para desfazer
    setDeleteMessage({
      show: true,
      message: `Flashcard excluído com sucesso.`,
      deletedCard: deletedCard as any
    });
    
    // Ocultar a mensagem após 5 segundos (tempo maior para permitir desfazer)
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
      
      {/* Mensagem de exclusão com sucesso e botão para desfazer */}
      {deleteMessage.show && (
        <div className="mb-6 bg-gray-800 text-white p-4 rounded-lg shadow-lg toast-undo fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between min-w-80">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{deleteMessage.message}</p>
          </div>
          <button 
            onClick={handleUndoDelete}
            className="ml-4 px-3 py-1 text-xs bg-white text-gray-800 rounded hover:bg-gray-200 transition-colors font-medium flex items-center"
          >
            <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Desfazer
          </button>
        </div>
      )}
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-700/50 bg-opacity-15 rounded-lg backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="text-gray-700 mb-6">Tem certeza que deseja excluir todos os flashcards? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllFlashcards();
                  setShowConfirmation(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir Todos
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  
  // Função para lidar com a exclusão com confirmação
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  // Função para confirmar a exclusão
  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    // Adicionar tempo para a animação ocorrer antes de realmente excluir
    setTimeout(() => {
      onDelete();
      setShowDeleteConfirm(false);
    }, 300);
  };
  
  // Função para cancelar a exclusão
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
        
        {/* Botão de exclusão com animação suave */}
        <button 
          className={`absolute top-3 right-3 p-2 bg-white text-red-500 rounded-full shadow-md z-10 hover:bg-red-500 hover:text-white transition-all transform ${isHovering ? 'opacity-100 scale-100 pulse-animation' : 'opacity-0 scale-75'}`}
          onClick={handleDeleteClick}
          title="Excluir flashcard"
          aria-label="Excluir flashcard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      {/* Modal de confirmação de exclusão com design melhorado */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-gray-700/50 bg-opacity-15 rounded-lg backdrop-blur-xs flex items-center justify-center z-50"
          onClick={cancelDelete}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-xs w-full modal-confirm"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Excluir Flashcard</h3>
            <p className="text-sm text-center text-gray-600 mb-6">
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir este flashcard?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
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