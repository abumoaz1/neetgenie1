"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIAssistant } from "@/store/ai-assistant";
import { useAIAssistantHook } from "@/hooks/use-ai-assistant";
import ReactMarkdown from 'react-markdown';

export interface AIAssistantProps {
  sidebarMode?: boolean;
  fullPage?: boolean;
  subject?: string;
}

export function AIAssistant({ sidebarMode = false, fullPage = false, subject }: AIAssistantProps) {
  const { messages, isLoading } = useAIAssistant();
  const { sendMessage } = useAIAssistantHook();
  const [input, setInput] = React.useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Track if we should scroll down
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollToBottom();
    } else if (scrollRef.current) {
      // Check if we need to show the scroll button
      const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  }, [messages, autoScroll]);

  // Detect manual scroll
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = scrollElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // If user scrolled to bottom, enable auto-scroll again
      if (isNearBottom) {
        setAutoScroll(true);
        setShowScrollButton(false);
      } else {
        setAutoScroll(false);
        setShowScrollButton(true);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setShowScrollButton(false);
      setAutoScroll(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    // Enable auto-scroll when user sends a message
    setAutoScroll(true);
    await sendMessage(userMessage, subject);
  };

  return (
    <Card className={cn(
      sidebarMode 
        ? "w-full border-0 shadow-none h-full" 
        : fullPage
          ? "w-full shadow-lg border-slate-200"
          : "w-full max-w-2xl mx-auto"
    )}>
      <CardContent className={cn(
        "p-0 h-full",
        fullPage && "p-0"
      )}>
        <div className={cn(
          "flex flex-col",
          sidebarMode ? "h-full" : fullPage ? "h-[600px]" : "h-[500px]"
        )}>
          {/* Chat Header */}
          <div className={cn(
            "p-3 border-b flex items-center gap-2",
            fullPage && "p-4"
          )}>
            <Bot className={cn(
              "h-5 w-5 text-primary",
              fullPage && "h-6 w-6"
            )} />
            <h3 className={cn(
              "font-medium",
              fullPage && "text-lg"
            )}>NEETgenie AI Assistant</h3>
          </div>

          {/* Chat Messages */}
          <div className="relative flex-1">
            <ScrollArea className={cn(
              "flex-1 p-3 h-full",
              fullPage && "p-5"
            )} ref={scrollRef}>
              <div className={cn(
                "space-y-3",
                fullPage && "space-y-4"
              )}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      fullPage && "gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className={cn(
                        "h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0",
                        fullPage && "h-9 w-9"
                      )}>
                        <Bot className={cn(
                          "h-3 w-3 text-primary",
                          fullPage && "h-4 w-4"
                        )} />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-2",
                        fullPage && "p-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <div className={cn(
                          "markdown-content",
                          sidebarMode ? "text-xs" : fullPage ? "text-base" : "text-sm"
                        )}>
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className={cn(
                          sidebarMode ? "text-xs" : fullPage ? "text-base" : "text-sm"
                        )}>{message.content}</p>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className={cn(
                        "h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0",
                        fullPage && "h-9 w-9"
                      )}>
                        <User className={cn(
                          "h-3 w-3 text-primary",
                          fullPage && "h-4 w-4"
                        )} />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2">
                    <div className={cn(
                      "h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0",
                      fullPage && "h-9 w-9"
                    )}>
                      <Bot className={cn(
                        "h-3 w-3 text-primary",
                        fullPage && "h-4 w-4"
                      )} />
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Scroll to bottom button */}
            {showScrollButton && (
              <Button
                onClick={scrollToBottom}
                className="absolute right-4 bottom-2 rounded-full p-2 size-9"
                size="icon"
                variant="secondary"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className={cn(
            "p-3 border-t",
            fullPage && "p-4"
          )}>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={sidebarMode 
                  ? "Ask me anything..." 
                  : "Ask me anything about NEET preparation..."
                }
                className={cn(
                  "flex-1",
                  sidebarMode ? "text-xs" : fullPage ? "text-base py-6" : "text-sm"
                )}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size={sidebarMode ? "sm" : fullPage ? "lg" : "default"} 
                disabled={isLoading}
                className={fullPage ? "px-6" : ""}
              >
                <Send className={cn(
                  sidebarMode ? "h-3 w-3" : fullPage ? "h-5 w-5" : "h-4 w-4"
                )} />
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}