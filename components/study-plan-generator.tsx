"use client";

import React, { useState } from "react";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useAnalytics } from "@/hooks/use-analytics";
import { Loader2, Calendar, Clock, BookOpen, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Array of NEET topics for dropdown
const neetTopics = [
  // Physics
  "Mechanics", "Thermodynamics", "Electricity and Magnetism", "Optics", "Modern Physics",
  "Wave Motion", "Electronic Devices", "Units and Measurements", "Gravitation", "Kinematics",
  "Fluid Mechanics", "Current Electricity", "Electromagnetic Induction", "Nuclear Physics",
  
  // Chemistry
  "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Coordination Compounds", 
  "Chemical Kinetics", "Atomic Structure", "Chemical Bonding", "Electrochemistry", "Chemical Thermodynamics",
  "Equilibrium", "Solutions", "Surface Chemistry", "Solid State", "Redox Reactions", 
  
  // Biology
  "Cell Biology", "Human Physiology", "Plant Physiology", "Genetics", "Ecology and Environment",
  "Molecular Biology", "Evolution", "Reproduction", "Microorganisms", "Biotechnology", 
  "Animal Kingdom", "Plant Kingdom", "Morphology of Plants", "Human Health and Diseases"
];

interface FormData {
  exam_name: string;
  days_left: number;
  study_hours_per_day: number;
  weak_topics: string[];
  strong_topics: string[];
}

export function StudyPlanGenerator() {
  const { generateStudyPlan, isLoading, error } = useStudyPlan();
  
  // Get today's date and calculate max date for exam date selection
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 365); // Allow up to a year ahead
  
  const [formData, setFormData] = useState<FormData>({
    exam_name: "NEET",
    days_left: 60,
    study_hours_per_day: 6,
    weak_topics: [],
    strong_topics: []
  });
  
  const [examDate, setExamDate] = useState<string>(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 60); // Default to 60 days from now
    return defaultDate.toISOString().split('T')[0];
  });
  
  const [activeTab, setActiveTab] = useState("form");
  const [weakTopicInput, setWeakTopicInput] = useState("");
  const [strongTopicInput, setStrongTopicInput] = useState("");

  // Calculate days between dates when exam date changes
  React.useEffect(() => {
    if (examDate) {
      const selectedDate = new Date(examDate);
      const currentDate = new Date();
      const timeDifference = selectedDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      
      if (daysDifference >= 0) {
        setFormData(prev => ({
          ...prev,
          days_left: daysDifference
        }));
      }
    }
  }, [examDate]);

  const handleAddWeakTopic = () => {
    if (weakTopicInput && !formData.weak_topics.includes(weakTopicInput)) {
      setFormData(prev => ({
        ...prev,
        weak_topics: [...prev.weak_topics, weakTopicInput]
      }));
      setWeakTopicInput("");
    }
  };

  const handleAddStrongTopic = () => {
    if (strongTopicInput && !formData.strong_topics.includes(strongTopicInput)) {
      setFormData(prev => ({
        ...prev,
        strong_topics: [...prev.strong_topics, strongTopicInput]
      }));
      setStrongTopicInput("");
    }
  };

  const handleRemoveWeakTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      weak_topics: prev.weak_topics.filter(t => t !== topic)
    }));
  };

  const handleRemoveStrongTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      strong_topics: prev.strong_topics.filter(t => t !== topic)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'days_left' || name === 'study_hours_per_day' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateStudyPlan(formData);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden max-h-[90vh]">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Personalized NEET Study Plan Generator
        </h2>
        <p className="text-blue-100 mt-1">
          Create a customized study schedule tailored to your needs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 sm:px-6 pt-4">
          <TabsList className="w-full grid grid-cols-1">
            <TabsTrigger value="form" disabled={isLoading}>
              Create Plan
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="form" className="p-4 sm:p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
              <XCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Exam Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="exam-date" className="font-medium">
                  Exam Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="exam-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.days_left} days remaining until your exam
                </p>
              </div>

              {/* Study Hours Per Day */}
              <div className="space-y-2">
                <Label htmlFor="study_hours_per_day" className="font-medium">
                  Study Hours Per Day
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="study_hours_per_day"
                    name="study_hours_per_day"
                    type="number"
                    min={1}
                    max={16}
                    value={formData.study_hours_per_day}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Realistic hours you can commit to studying daily
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Weak Topics (Need more focus)</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={weakTopicInput}
                  onChange={(e) => setWeakTopicInput(e.target.value)}
                  className="flex-1 min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a topic...</option>
                  {neetTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                <Button 
                  type="button" 
                  onClick={handleAddWeakTopic}
                  variant="outline"
                  className="sm:w-auto w-full mt-2 sm:mt-0"
                >
                  Add
                </Button>
              </div>
              
              {formData.weak_topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.weak_topics.map((topic) => (
                    <div 
                      key={topic} 
                      className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                    >
                      {topic}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveWeakTopic(topic)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Strong Topics (Need less focus)</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={strongTopicInput}
                  onChange={(e) => setStrongTopicInput(e.target.value)}
                  className="flex-1 min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a topic...</option>
                  {neetTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                <Button 
                  type="button" 
                  onClick={handleAddStrongTopic}
                  variant="outline"
                  className="sm:w-auto w-full mt-2 sm:mt-0"
                >
                  Add
                </Button>
              </div>
              
              {formData.strong_topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.strong_topics.map((topic) => (
                    <div 
                      key={topic} 
                      className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                    >
                      {topic}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveStrongTopic(topic)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating your plan...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-5 w-5" />
                    Generate Study Plan
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}