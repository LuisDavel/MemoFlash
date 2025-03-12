import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  lastReviewed?: string;
  difficulty?: 'fácil' | 'médio' | 'difícil';
}

// Tipo para atualização de flashcard
type FlashcardUpdateData = Partial<Omit<Flashcard, 'id' | 'createdAt'>> & {
  lastReviewed?: Date | string;
};

interface FlashcardStore {
  flashcards: Flashcard[];
  addFlashcard: (question: string, answer: string) => void;
  removeFlashcard: (id: string) => void;
  updateFlashcard: (id: string, data: FlashcardUpdateData) => void;
  getFlashcardById: (id: string) => Flashcard | undefined;
  clearAllFlashcards: () => void;
}

// Função para verificar se o valor é um objeto Date
const isDateObject = (value: any): value is Date => {
  return value && typeof value === 'object' && 'toISOString' in value;
};

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      flashcards: [],
      
      addFlashcard: (question, answer) => {
        const newFlashcard: Flashcard = {
          id: Date.now().toString(),
          question,
          answer,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          flashcards: [...state.flashcards, newFlashcard],
        }));
      },
      
      removeFlashcard: (id) => {
        set((state) => ({
          flashcards: state.flashcards.filter((card) => card.id !== id),
        }));
      },
      
      updateFlashcard: (id, data) => {
        const updatedData: Partial<Flashcard> = { ...data };
        
        // Converte Date para string ISO se presente
        if (data.lastReviewed && isDateObject(data.lastReviewed)) {
          updatedData.lastReviewed = data.lastReviewed.toISOString();
        }
        
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id ? { ...card, ...updatedData } : card
          ),
        }));
      },
      
      getFlashcardById: (id) => {
        return get().flashcards.find((card) => card.id === id);
      },
      
      clearAllFlashcards: () => {
        set({ flashcards: [] });
      },
    }),
    {
      name: 'flashcards-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 