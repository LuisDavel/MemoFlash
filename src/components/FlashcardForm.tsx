import { useState } from 'react';
import { useFlashcardStore } from '@/lib/store';

export function FlashcardForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addFlashcard = useFlashcardStore(state => state.addFlashcard);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim()) {
      setError('Por favor, preencha a pergunta e a resposta');
      setSuccess(false);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulação de processamento para mostrar o estado de carregamento
    setTimeout(() => {
      addFlashcard(question, answer);
      
      setQuestion('');
      setAnswer('');
      setError('');
      setSuccess(true);
      setIsSubmitting(false);
      
      // Oculta a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 600);
  };
  
  return (
    <div className="max-w-2xl mx-auto py-2">
      <div className="mb-8 bg-blue-50 border border-blue-100 p-4 rounded-lg">
        <p className="text-blue-700 text-sm">
          <span className="font-medium">💡 Dica: </span> 
          Crie perguntas específicas e respostas claras. Um flashcard eficaz tem uma única ideia.
        </p>
      </div>
      
      <h2 className="text-xl font-bold mb-6 text-gray-700">Criar novo flashcard</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm flex items-center justify-between">
          <span>Flashcard criado com sucesso!</span>
          <span className="text-xs bg-green-100 py-1 px-2 rounded-full text-green-700">Novo</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="question" className="block text-sm font-medium text-gray-600">
            Pergunta
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-xs focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all resize-none"
            rows={3}
            placeholder="O que você quer lembrar?"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-600">
            Resposta
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-xs focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all resize-none"
            rows={3}
            placeholder="A resposta para a sua pergunta"
          />
        </div>
        
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-md font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </>
            ) : (
              <>
               
                <span>Criar</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 