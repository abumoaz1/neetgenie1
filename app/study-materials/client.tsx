"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Video, 
  Users, 
  Clock,
  ChevronRight,
  BookMarked,
  GraduationCap,
  Brain,
  Microscope,
  FlaskConical,
  Calculator,
  Atom,
  Leaf,
  Heart,
  Activity,
  TestTube,
  Flower2,
  TreeDeciduous,
  Sprout,
  Droplets,
  PawPrint,
  Rabbit,
  Bug,
  Feather,
  Orbit,
  CircleDot,
  Telescope,
  Scale,
  Zap,
  Eye,
  LucideEye,
  Lightbulb,
  Pill,
  Syringe,
  Droplet,
  FlaskRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

// Define icon sets for different subjects
const chemistryIcons = [FlaskConical, TestTube, Atom, Dna, Droplet, FlaskRound];
const biologyIcons = [Leaf, Dna, Heart, Microscope, Brain];
const botanyIcons = [Leaf, Flower2, TreeDeciduous, Sprout, Droplets];
const zoologyIcons = [PawPrint, Rabbit, Bug, Microscope, Feather];
const physicsIcons = [Atom, Orbit, CircleDot, Telescope, Scale];
const pharmaIcons = [Pill, Dna, Droplet, FlaskConical, Syringe];
const neuroIcons = [Brain, Zap, Activity, Eye, LucideEye];
const generalIcons = [GraduationCap, BookOpen, Lightbulb, FileText, BookMarked];

// Function to pick a random icon from an array
const pickRandomIcon = (icons) => icons[Math.floor(Math.random() * icons.length)];

// Mock study materials data
const studyMaterials = {
  subjects: [
    {
      name: "Physics",
      icon: pickRandomIcon(physicsIcons),
      color: "text-blue-500",
      topics: [
        {
          name: "Mechanics",
          description: "Study of motion, forces, and energy",
          resources: [
            { type: "Notes", count: 12 },
            { type: "Videos", count: 8 },
            { type: "Practice", count: 15 }
          ]
        },
        {
          name: "Electromagnetism",
          description: "Electric and magnetic fields, circuits",
          resources: [
            { type: "Notes", count: 10 },
            { type: "Videos", count: 6 },
            { type: "Practice", count: 12 }
          ]
        }
      ]
    },
    {
      name: "Chemistry",
      icon: pickRandomIcon(chemistryIcons),
      color: "text-green-500",
      topics: [
        {
          name: "Physical Chemistry",
          description: "Atomic structure, thermodynamics",
          resources: [
            { type: "Notes", count: 15 },
            { type: "Videos", count: 10 },
            { type: "Practice", count: 18 }
          ]
        },
        {
          name: "Organic Chemistry",
          description: "Carbon compounds and reactions",
          resources: [
            { type: "Notes", count: 20 },
            { type: "Videos", count: 12 },
            { type: "Practice", count: 25 }
          ]
        }
      ]
    },
    {
      name: "Biology",
      icon: pickRandomIcon(biologyIcons),
      color: "text-purple-500",
      topics: [
        {
          name: "Cell Biology",
          description: "Cell structure and functions",
          resources: [
            { type: "Notes", count: 8 },
            { type: "Videos", count: 5 },
            { type: "Practice", count: 10 }
          ]
        },
        {
          name: "Genetics",
          description: "Heredity and variation",
          resources: [
            { type: "Notes", count: 12 },
            { type: "Videos", count: 7 },
            { type: "Practice", count: 15 }
          ]
        }
      ]
    },
    {
      name: "Botany",
      icon: pickRandomIcon(botanyIcons),
      color: "text-teal-500",
      topics: [
        {
          name: "Plant Morphology",
          description: "Structure and organization of plants",
          resources: [
            { type: "Notes", count: 10 },
            { type: "Videos", count: 6 },
            { type: "Practice", count: 8 }
          ]
        }
      ]
    },
    {
      name: "Zoology",
      icon: pickRandomIcon(zoologyIcons),
      color: "text-pink-500",
      topics: [
        {
          name: "Animal Physiology",
          description: "Functions and processes in animals",
          resources: [
            { type: "Notes", count: 14 },
            { type: "Videos", count: 8 },
            { type: "Practice", count: 12 }
          ]
        }
      ]
    },
    {
      name: "Pharmacology",
      icon: pickRandomIcon(pharmaIcons),
      color: "text-cyan-500",
      topics: [
        {
          name: "Drug Actions",
          description: "How medicines interact with body systems",
          resources: [
            { type: "Notes", count: 9 },
            { type: "Videos", count: 5 },
            { type: "Practice", count: 7 }
          ]
        }
      ]
    }
  ]
};

export default function ClientStudyMaterialsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Study Materials</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Comprehensive study resources for NEET preparation
            </p>
          </div>

          {/* Subjects Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studyMaterials.subjects.map((subject) => (
              <Card key={subject.name} className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${subject.color.replace('text-', '')}/10`}>
                      <subject.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${subject.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">{subject.name}</CardTitle>
                      <CardDescription className="text-sm">Study resources and practice materials</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subject.topics.map((topic) => (
                    <div key={topic.name} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors">
                          {topic.name}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                        {topic.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {topic.resources.map((resource) => (
                          <Badge 
                            key={resource.type} 
                            variant="secondary"
                            className="text-xs sm:text-sm bg-muted/50 hover:bg-muted/80 transition-colors"
                          >
                            {resource.type} ({resource.count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Access Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Quick Access</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <BookMarked className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Saved Notes</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Access your bookmarked content</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Video className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Video Lectures</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Watch recorded sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Study Groups</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Join discussion forums</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Study Schedule</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Plan your preparation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}