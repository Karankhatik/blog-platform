"use client";
import React from "react";
import { Spotlight } from "@/components/ui/Spotlight";
import { Button } from "@/components/ui/button";
import { FaCircle, FaDownload } from "react-icons/fa6";
import { GrContactInfo } from "react-icons/gr";
import { HoverBorderGradient } from "@/components/ui/border-hover";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowBigRight, Newspaper } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen flex  justify-center bg-background/[0.96] py-16 md:py-48">
      <Spotlight
        className="z-10 -top-20 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 1.5 }}
        className="flex flex-col items-center gap-4 sm:mt-[-70px]"
      >
       
        <div className="text-3xl text-white sm:text-5xl md:text-7xl font-bold">
        Welcome to TechBlog
        </div>
        
        <p className="text-gray-400 text-center text-xl sm:text-xl">
        Your daily dose of tech news, insights, and innovations. <br/>
        Stay ahead of the curve with our expert analysis and in-depth articles.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 1 }}
          className="flex flex-col sm:flex-row sm:gap-5 gap-2 items-center"
        >
          <Button asChild>
            <Link
              href="/articles"  
            >
             
              Read Latest Posts
            </Link>
          </Button>          
        </motion.div>
      </motion.div>
    </section>
  );
}