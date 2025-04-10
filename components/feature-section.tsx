"use client";

import { BookOpen, Target, BarChart3, Clock, Notebook, FileCheck, FileText, ArrowRight, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeatureSection() {
  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      iconBg: "bg-blue-50",
      iconGlow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
      glowColor: "bg-blue-500",
      title: "Adaptive Mock Tests",
      description: "Take practice exams that adjust to your skill level, focusing on your weak areas."
    },
    {
      icon: <Notebook className="h-8 w-8 text-green-500" />,
      iconBg: "bg-green-50",
      iconGlow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]",
      glowColor: "bg-green-500",
      title: "Personalized Study Plans",
      description: "Get customized study schedules and materials based on your performance and goals."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      iconBg: "bg-purple-50",
      iconGlow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
      glowColor: "bg-purple-500",
      title: "Performance Analytics",
      description: "Track your progress with detailed insights and performance metrics."
    },
    {
      icon: <Clock className="h-8 w-8 text-amber-500" />,
      iconBg: "bg-amber-50",
      iconGlow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
      glowColor: "bg-amber-500",
      title: "Time Management",
      description: "Learn to optimize your time during exams with our specialized timing techniques."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-red-500" />,
      iconBg: "bg-red-50",
      iconGlow: "shadow-[0_0_15px_rgba(239,68,68,0.5)]",
      glowColor: "bg-red-500",
      title: "Comprehensive Content",
      description: "Access comprehensive study materials covering all NEET subjects and topics."
    },
    {
      icon: <FileCheck className="h-8 w-8 text-cyan-500" />,
      iconBg: "bg-cyan-50",
      iconGlow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]",
      glowColor: "bg-cyan-500",
      title: "Question Bank",
      description: "Practice with thousands of previous year questions and expert-crafted problems."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-white relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything you need to <span className="text-blue-600">excel</span> in NEET
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Our comprehensive platform is designed specifically for NEET aspirants, providing all the tools you need to succeed.
            </p>
          </div>
        </motion.div>
        <motion.div 
          className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col space-y-2 rounded-lg border p-6 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-200"
              variants={cardVariants}
            >
              <div className="relative mb-4">
                <div className={`absolute -inset-0.5 ${feature.glowColor} opacity-30 rounded-lg blur-sm animate-pulse`}></div>
                <div className={`relative p-3 ${feature.iconBg} rounded-lg w-14 h-14 flex items-center justify-center ${feature.iconGlow}`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mock Tests Section */}
      <div className="py-16 border-t border-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-2">
              Mock Tests
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Practice with Realistic NEET Mock Tests
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Prepare for success with our comprehensive set of mock tests designed to simulate the actual NEET exam experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg border p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Full-Length Tests</h3>
                  <p className="text-sm text-gray-500 mb-4">Complete 3-hour tests with 180 questions mirroring the actual NEET exam pattern.</p>
                </div>
                <Button variant="link" className="p-0 justify-start text-blue-600 hover:text-blue-800" asChild>
                  <Link href="/mock-tests" className="flex items-center">
                    View Full-Length Tests <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg border p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Subject-Wise Tests</h3>
                  <p className="text-sm text-gray-500 mb-4">Focus on specific subjects with dedicated tests for Physics, Chemistry, and Biology.</p>
                </div>
                <Button variant="link" className="p-0 justify-start text-purple-600 hover:text-purple-800" asChild>
                  <Link href="/mock-tests" className="flex items-center">
                    Explore Subject Tests <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg border p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
                  <p className="text-sm text-gray-500 mb-4">Get detailed insights and analytics to identify strengths and areas for improvement.</p>
                </div>
                <Button variant="link" className="p-0 justify-start text-green-600 hover:text-green-800" asChild>
                  <Link href="/mock-tests" className="flex items-center">
                    View Test Analytics <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <Button className="bg-blue-600 hover:bg-blue-700" size="lg" asChild>
              <Link href="/mock-tests">
                Browse All Mock Tests
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 