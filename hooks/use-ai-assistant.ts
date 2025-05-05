import { useCallback } from 'react';
import { useAIAssistant } from '@/store/ai-assistant';
import { Message } from '@/types';
import { endpoints, apiRequest } from '@/lib/baseUrl';

export function useAIAssistantHook() {
  const { addMessage, setLoading, setError } = useAIAssistant();

  const sendMessage = useCallback(async (content: string, subject?: string) => {
    try {
      // Add user message
      addMessage({ role: 'user', content });
      setLoading(true);

      // Call the AI Assistant API
      const requestData = {
        query: content,
        ...(subject && { subject })
      };

      const response = await apiRequest.post(endpoints.askAssistant, requestData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to get response from AI assistant');
      }

      // Add the AI response to the messages
      addMessage({ 
        role: 'assistant', 
        content: response.response 
      });
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