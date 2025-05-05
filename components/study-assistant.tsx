"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  BookOpen, 
  Loader2, 
  Microscope, 
  Atom, 
  Heart,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { baseUrl } from "@/lib/baseUrl";

type Message = {
  role: "user" | "assistant";
  content: string;
  subject?: string;
};

type Subjects = "Physics" | "Chemistry" | "Biology" | "";

export function AskAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your NEET preparation assistant. Ask me any question about Biology, Chemistry, or Physics to help with your studies.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subjects>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: input,
      subject: selectedSubject || undefined,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
      
      // Call the API
      const response = await fetch(`${baseUrl}/study-plan/ask-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query: input,
          subject: selectedSubject || undefined
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from assistant");
      }
      
      const data = await response.json();
      
      if (!data.success || !data.response) {
        throw new Error("Invalid response from server");
      }
      
      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't process your request. ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSubjectIcon = (subject: string | undefined) => {
    switch (subject) {
      case "Physics":
        return <Atom className="h-4 w-4 mr-1" />;
      case "Chemistry":
        return <Microscope className="h-4 w-4 mr-1" />;
      case "Biology":
        return <Heart className="h-4 w-4 mr-1" />;
      default:
        return <BookOpen className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border-gray-200">
      <CardHeader className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-700">
        <CardTitle className="text-white flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          NEET Study Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "assistant"
                    ? "bg-gray-100"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.role === "user" && message.subject && (
                  <div className="flex items-center text-xs mb-1 opacity-80">
                    {getSubjectIcon(message.subject)}
                    <span>{message.subject}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <div className="rounded-lg p-3 bg-red-50 text-red-700 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <div className="flex flex-col w-full space-y-2">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={selectedSubject === "Physics" ? "default" : "outline"}
              className="flex items-center"
              onClick={() => setSelectedSubject(selectedSubject === "Physics" ? "" : "Physics")}
            >
              <Atom className="h-4 w-4 mr-1" />
              Physics
            </Button>
            <Button
              size="sm"
              variant={selectedSubject === "Chemistry" ? "default" : "outline"}
              className="flex items-center"
              onClick={() => setSelectedSubject(selectedSubject === "Chemistry" ? "" : "Chemistry")}
            >
              <Microscope className="h-4 w-4 mr-1" />
              Chemistry
            </Button>
            <Button
              size="sm"
              variant={selectedSubject === "Biology" ? "default" : "outline"}
              className="flex items-center"
              onClick={() => setSelectedSubject(selectedSubject === "Biology" ? "" : "Biology")}
            >
              <Heart className="h-4 w-4 mr-1" />
              Biology
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any NEET-related question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}