"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-background relative">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div 
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Ace Your NEET Exam with{" "}
                <span className="text-blue-600">Personalized</span> Preparation
              </h1>
              <p className="text-muted-foreground md:text-xl mt-4">
                NEETGenie uses smart technology to create a customized study plan 
                tailored to your strengths and weaknesses, helping you prepare more 
                efficiently and effectively.
              </p>
            </div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 h-12 px-6 text-base shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:translate-y-[-2px]">
                  Get Started
                </Button>
                <Button variant="outline" className="h-12 px-6 text-base hover:bg-blue-50 transition-all duration-300" asChild>
                  <Link href="/mock-tests">
                    Try Mock Tests
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="pt-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Join 10,000+ students already preparing with NEETGenie
            </motion.div>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative rounded-xl overflow-hidden border shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Students studying"
                className="w-full h-[350px] md:h-[400px] rounded-xl shadow-lg object-cover"
              />
              <motion.div 
                className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-lg flex items-center gap-2 border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-green-100 rounded-full p-1">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Personalized for you</p>
                  <p className="text-xs text-muted-foreground">Study smarter, not harder</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 