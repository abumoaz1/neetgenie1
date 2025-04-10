"use client";

import { QuoteIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "AIIMS Delhi, Rank 56",
      content: "NEETGenie's structured approach helped me organize my preparation effectively. The practice tests were incredibly similar to the actual NEET exam, which boosted my confidence.",
      avatar: "/avatars/student1.jpg"
    },
    {
      name: "Arjun Patel",
      role: "JIPMER, Rank 142",
      content: "The subject experts on NEETGenie cleared all my doubts promptly. Their personalized feedback on my weak areas was crucial for my improvement in the last few months.",
      avatar: "/avatars/student2.jpg"
    },
    {
      name: "Nisha Reddy",
      role: "NEET 2023, 650/720",
      content: "I started my preparation late, but NEETGenie's crash courses and targeted practice sessions helped me cover the entire syllabus efficiently and score well.",
      avatar: "/avatars/student3.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="w-full py-16 md:py-24 bg-gray-50 relative">
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
              Success Stories from NEET Toppers
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Hear from students who achieved their dreams with NEETGenie's personalized preparation approach.
            </p>
          </div>
        </motion.div>
        <motion.div 
          className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col justify-between space-y-4 rounded-lg border p-8 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              variants={cardVariants}
            >
              <div className="space-y-4">
                <QuoteIcon className="h-10 w-10 text-blue-100" />
                <p className="text-base leading-relaxed text-gray-600">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  {/* Placeholder avatar - replace with actual images */}
                  <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 