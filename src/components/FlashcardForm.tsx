import { useState } from 'react';
import { useFlashcardStore } from '@/lib/store';

export function FlashcardForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const addFlashcard = useFlashcardStore(state => state.addFlashcard);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim()) {
      setError('Por favor, preencha a pergunta e a resposta');
      setSuccess(false);
      return;
    }
    
    addFlashcard(question, answer);
    
    setQuestion('');
    setAnswer('');
    setError('');
    setSuccess(true);
    
    // Oculta a mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-100 mb-6">
        <h3 className="text-md font-medium text-blue-800 mb-2">💡 Dica para melhores flashcards:</h3>
        <p className="text-sm text-blue-700">
          Crie perguntas específicas e respostas claras. Flashcards mais eficazes possuem uma única ideia por cartão.
        </p>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Crie seu Flashcard</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Flashcard criado com sucesso!</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Pergunta
          </label>
          <div className="relative rounded-md shadow-sm">
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              rows={3}
              placeholder="O que você quer lembrar?"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
            Resposta
          </label>
          <div className="relative rounded-md shadow-sm">
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              rows={3}
              placeholder="A resposta para a sua pergunta"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="btn btn-primary inline-flex items-center px-8 py-3"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Criar Flashcard
          </button>
        </div>
      </form>
      
      
    </div>
  );
} 