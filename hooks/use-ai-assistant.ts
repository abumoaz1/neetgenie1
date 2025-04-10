import { useCallback } from 'react';
import { useAIAssistant } from '@/store/ai-assistant';
import { Message } from '@/types';

export function useAIAssistantHook() {
  const { addMessage, setLoading, setError } = useAIAssistant();

  const sendMessage = useCallback(async (content: string) => {
    try {
      // Add user message
      addMessage({ role: 'user', content });
      setLoading(true);

      // TODO: Replace with actual API call
      const response = await new Promise<Message>((resolve) => {
        setTimeout(() => {
          resolve({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "I'm here to help you with your NEET preparation. I can explain concepts, solve problems, and provide study tips. What specific topic would you like to discuss?",
            timestamp: new Date()
          });
        }, 1000);
      });

      addMessage({ role: 'assistant', content: response.content });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      addMessage({
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  }, [addMessage, setLoading, setError]);

  return {
    sendMessage
  };
} 