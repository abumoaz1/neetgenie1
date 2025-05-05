"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Sidebar from "@/components/sidebar";
import ProtectedRoute from "@/components/protected-route";
import { AskAssistant } from "@/components/study-assistant";

export default function AssistantPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar className="h-[calc(100vh-64px)] sticky top-16" />
          <main className="flex-1 bg-slate-50">
            <div className="container px-4 py-6 sm:px-6 lg:px-8 sm:py-8 max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">AI Study Assistant</h1>
                <p className="mt-2 text-lg text-slate-600">
                  Get personalized guidance and answers for your NEET preparation
                </p>
              </div>

              <Tabs defaultValue="assistant" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="assistant">Study Assistant</TabsTrigger>
                  <TabsTrigger value="usage">Usage Guide</TabsTrigger>
                </TabsList>

                <TabsContent value="assistant" className="mt-6 space-y-6">
                  <AskAssistant />
                </TabsContent>

                <TabsContent value="usage" className="mt-6 space-y-6">
                  <div className="bg-white shadow-sm rounded-lg p-6 border border-slate-100">
                    <h2 className="text-xl font-semibold mb-4">How to Use the NEET Study Assistant</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg">Ask Subject-Specific Questions</h3>
                        <p className="text-slate-600 mt-1">
                          Select a subject (Physics, Chemistry, or Biology) before asking your question for more targeted answers.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg">Types of Questions You Can Ask</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                          <li>Conceptual explanations (e.g., "Explain mitosis and meiosis")</li>
                          <li>Problem-solving help (e.g., "How do I solve projectile motion problems?")</li>
                          <li>Formula explanations (e.g., "What is Boyle's law and when is it applied?")</li>
                          <li>Study advice (e.g., "How should I prepare for NEET in the last month?")</li>
                          <li>Exam strategy (e.g., "How to manage time during the NEET exam?")</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg">Tips for Better Responses</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                          <li>Be specific in your questions</li>
                          <li>Provide context if needed</li>
                          <li>Ask one question at a time for best results</li>
                          <li>If you need clarification, follow up with more detailed questions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    </ProtectedRoute>
  );
}