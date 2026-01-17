/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Compass,
  Layers,
  Package,
  Rocket,
  Shield,
  Sparkles,
  Zap,
  Lock,
  Puzzle,
  GitFork,
  Users,
  Key,
  CheckCircle2,
  Play,
  Bitcoin,
  Coins,
  Server,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// -----------------------------
// Helpers
// -----------------------------
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// -----------------------------
// HAND-DRAWN SVG DOODLES
// -----------------------------
const HandDrawnArrow = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={cn("w-24 h-24", className)}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M10 50 Q 30 45, 50 50 T 90 50"
      stroke="#E8813B"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path
      d="M 75 40 L 90 50 L 75 60"
      stroke="#E8813B"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 1.2, repeat: Infinity, repeatDelay: 2 }}
    />
  </svg>
);

const HandDrawnCircle = ({ className = "", children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("relative", className)}>
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 w-full h-full -rotate-12"
      fill="none"
    >
      <motion.circle
        cx="100"
        cy="100"
        r="90"
        stroke="#E8813B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 8"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </svg>
    <div className="relative z-10">{children}</div>
  </div>
);

const DoodleUnderline = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 20"
    className={cn("w-full h-3 absolute -bottom-2 left-0", className)}
    fill="none"
  >
    <motion.path
      d="M 5 10 Q 50 5, 100 10 T 195 10"
      stroke="#E8813B"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    />
  </svg>
);

const DoodleStar = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={cn("w-12 h-12", className)}
    fill="none"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ delay, type: "spring" }}
  >
    <motion.path
      d="M50 10 L60 40 L90 45 L65 65 L72 95 L50 80 L28 95 L35 65 L10 45 L40 40 Z"
      stroke="#E8813B"
      strokeWidth="3"
      fill="#E8813B"
      fillOpacity="0.2"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

const DoodleSquiggle = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    className={cn("w-32 h-32 absolute", className)}
    fill="none"
  >
    <motion.path
      d="M 20 100 Q 60 20, 100 100 T 180 100"
      stroke="#E8813B"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="5 10"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 2, delay: 0.5 }}
    />
  </svg>
);

const DoodleSparkle = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={cn("absolute", className)}
    initial={{ scale: 0 }}
    animate={{ scale: [0, 1, 0] }}
    transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 3 }}
  >
    <Sparkles className="w-6 h-6 text-primary" />
  </motion.div>
);

// -----------------------------
// BITCOIN COIN DOODLE
// -----------------------------
const BitcoinCoin = ({ delay = 0, x = "50%", y = "50%" }: { delay?: number; x?: string; y?: string }) => (
  <motion.div
    className="absolute"
    style={{ left: x, top: y }}
    initial={{ scale: 0, rotate: -180 }}
    animate={{
      scale: [0, 1.2, 1],
      rotate: [0, 360],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: 3,
    }}
  >
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#E8813B"
          strokeWidth="4"
          strokeDasharray="3 6"
        />
        <Bitcoin className="absolute inset-0 m-auto w-8 h-8 text-primary" />
      </svg>
    </div>
  </motion.div>
);

// -----------------------------
// HERO SECTION
// -----------------------------
const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const cartX = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={containerRef} className="relative min-h-screen py-20 overflow-hidden bg-bg-primary">
      {/* Doodle background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#E8813B,#E8813B_2px,transparent_2px,transparent_30px)]" />
        <div className="absolute left-20 top-0 bottom-0 w-[2px] bg-primary/20" />
      </div>

      {/* Floating doodles */}
      <BitcoinCoin delay={0} x="10%" y="20%" />
      <BitcoinCoin delay={1.5} x="85%" y="30%" />
      <BitcoinCoin delay={3} x="15%" y="70%" />
      <DoodleStar className="absolute top-20 right-20" delay={0.5} />
      <DoodleStar className="absolute bottom-40 left-20" delay={1} />
      <DoodleSquiggle className="top-10 left-1/3 opacity-20" />
      <DoodleSquiggle className="bottom-20 right-1/4 opacity-20 rotate-45" />
      <DoodleSparkle className="top-40 left-1/4" delay={0} />
      <DoodleSparkle className="top-60 right-1/3" delay={1.5} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* Sketch badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6"
          >
            <div className="relative px-6 py-3 bg-primary/10 text-primary rounded-lg border-3 border-primary transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(232,129,59,0.5)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span className="font-handwritten text-sm font-bold">Inspired by Learn Me A Bitcoin</span>
              </div>
              <DoodleStar className="absolute -top-4 -right-4 w-8 h-8" delay={0.3} />
            </div>
          </motion.div>

          {/* Main Title with hand-drawn underline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-handwritten font-black mb-4 relative inline-block text-text-primary">
              <span className="relative">
                Learn Bitcoin
                <DoodleUnderline />
              </span>
            </h1>
            <h2 className="text-5xl md:text-7xl font-handwritten font-black text-primary relative inline-block">
              <span className="relative">
                Build Multisig
                <DoodleUnderline className="stroke-primary" />
              </span>
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl text-text-secondary mb-12 font-handwritten italic"
          >
            "The most fun way to learn multisig custody"
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="sketch-button bg-primary hover:bg-primary-dark text-black font-handwritten font-black text-lg px-8 py-6 rounded-xl border-4 border-primary shadow-[6px_6px_0px_0px_rgba(232,129,59,1)] hover:shadow-[8px_8px_0px_0px_rgba(232,129,59,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <Link href="/learn/start" className="flex items-center gap-2">
                Start Learning <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="sketch-button bg-bg-card text-text-primary font-handwritten font-bold text-lg px-8 py-6 rounded-xl border-4 border-text-primary shadow-[6px_6px_0px_0px_rgba(245,245,245,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(245,245,245,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <Link href="/playground" className="flex items-center gap-2">
                Try Playground <Play className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Caravan Cart Animation */}
        <motion.div
          style={{ x: cartX }}
          className="relative mt-20"
        >
          <HandDrawnCircle className="w-full max-w-2xl mx-auto">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <Image
                src="/caravan.webp"
                alt="Caravan carrying Bitcoin"
                width={600}
                height={400}
                className="w-full h-auto drop-shadow-2xl"
              />

              {/* Speech bubble */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -top-16 -right-16 bg-bg-card text-text-primary p-4 rounded-2xl border-4 border-primary shadow-lg max-w-xs"
              >
                <div className="font-handwritten font-bold mb-1">Caravan says:</div>
                <div className="text-sm font-handwritten">
                  "I'll help you carry your Bitcoin safely with multisig!"
                </div>
                <Shield className="inline-block w-5 h-5 text-primary ml-1" />
                {/* Triangle pointer */}
                <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-primary" />
                <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-bg-card" />
              </motion.div>
            </motion.div>
          </HandDrawnCircle>
        </motion.div>
      </div>
    </section>
  );
};

// -----------------------------
// COMIC STRIP EXPLAINER
// -----------------------------
const ComicStripExplainer = () => {
  return (
    <section className="py-20 bg-bg-secondary relative">
      {/* Doodle decorations */}
      <BookOpen className="absolute top-10 left-10 w-16 h-16 text-primary/20" />
      <Lock className="absolute bottom-10 right-10 w-16 h-16 text-primary/20" />
      <DoodleSquiggle className="top-1/4 right-10 opacity-10" />
      <DoodleSquiggle className="bottom-1/3 left-10 opacity-10 -rotate-45" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-handwritten font-black mb-4 relative inline-block text-text-primary">
            What's Multisig?
            <DoodleUnderline />
          </h2>
          <p className="text-xl text-text-secondary font-handwritten">Let's learn with a story!</p>
        </div>

        {/* Comic panels */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Panel 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            viewport={{ once: true }}
            className="bg-bg-card p-6 rounded-2xl border-4 border-text-primary/20 shadow-[8px_8px_0px_0px_rgba(245,245,245,0.1)] transform rotate-1 hover:rotate-0 transition-transform"
          >
            <div className="text-center mb-4">
              <Key className="w-16 h-16 mx-auto mb-4 text-primary" />
              <div className="bg-primary/20 inline-block px-4 py-2 rounded-lg border-2 border-primary font-handwritten font-bold text-primary">
                Panel 1
              </div>
            </div>
            <h3 className="font-handwritten font-black text-2xl mb-3 text-text-primary">Single Key</h3>
            <p className="text-text-secondary leading-relaxed font-handwritten">
              "I have ONE key to my Bitcoin. If I lose it... it's gone forever!"
            </p>
            <div className="mt-4 text-4xl text-center">😟</div>
          </motion.div>

          {/* Panel 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-bg-card p-6 rounded-2xl border-4 border-text-primary/20 shadow-[8px_8px_0px_0px_rgba(245,245,245,0.1)] transform -rotate-1 hover:rotate-0 transition-transform"
          >
            <div className="text-center mb-4">
              <div className="flex justify-center gap-2 mb-4">
                <Key className="w-12 h-12 text-primary" />
                <Key className="w-12 h-12 text-primary" />
                <Key className="w-12 h-12 text-primary" />
              </div>
              <div className="bg-primary/20 inline-block px-4 py-2 rounded-lg border-2 border-primary font-handwritten font-bold text-primary">
                Panel 2
              </div>
            </div>
            <h3 className="font-handwritten font-black text-2xl mb-3 text-text-primary">Multisig!</h3>
            <p className="text-text-secondary leading-relaxed font-handwritten">
              "Now I need 2 out of 3 keys! Even if I lose one, my Bitcoin is safe!"
            </p>
            <div className="mt-4 text-4xl text-center">🤔</div>
          </motion.div>

          {/* Panel 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-primary/20 border-primary text-text-primary p-6 rounded-2xl border-4 shadow-[8px_8px_0px_0px_rgba(232,129,59,0.5)] transform rotate-1 hover:rotate-0 transition-transform"
          >
            <div className="text-center mb-4">
              <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
              <div className="bg-primary inline-block px-4 py-2 rounded-lg border-2 border-primary-dark font-handwritten font-bold text-black">
                Panel 3
              </div>
            </div>
            <h3 className="font-handwritten font-black text-2xl mb-3">Caravan Helps!</h3>
            <p className="leading-relaxed font-handwritten font-medium">
              "Caravan makes multisig EASY with open-source tools and this interactive guide!"
            </p>
            <div className="mt-4 text-4xl text-center">😎</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------
// INTERACTIVE BITCOIN FLOW
// -----------------------------
const InteractiveBitcoinFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "UTXO",
      icon: Coins,
      description: "Unspent coins sitting in your wallet",
      details: "Think of these like unspent cash in your pocket!",
    },
    {
      title: "Transaction",
      icon: ArrowRight,
      description: "You create a transaction to spend coins",
      details: "Like writing a check, but for Bitcoin!",
    },
    {
      title: "Mempool",
      icon: Database,
      description: "Transaction waits to be confirmed",
      details: "It's in the waiting room!",
    },
    {
      title: "Block",
      icon: Server,
      description: "Miner includes it in a block",
      details: "Your transaction is now permanent!",
    },
  ];

  return (
    <section className="py-20 bg-bg-primary relative overflow-hidden">
      {/* Sketchy background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#E8813B,#E8813B_10px,transparent_10px,transparent_20px)]" />
      </div>

      <DoodleSparkle className="top-10 left-20" delay={0} />
      <DoodleSparkle className="top-20 right-40" delay={1} />
      <DoodleSparkle className="bottom-20 left-1/3" delay={2} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-handwritten font-black mb-4 relative inline-block text-text-primary">
            How Bitcoin Works
            <DoodleUnderline />
          </h2>
          <p className="text-xl text-text-secondary font-handwritten">Click each step to learn more!</p>
        </div>

        {/* Flow visualization */}
        <div className="relative">
          {/* Steps */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <React.Fragment key={index}>
                  <motion.button
                    onClick={() => setActiveStep(index)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative p-6 rounded-2xl border-4 shadow-[6px_6px_0px_0px_rgba(232,129,59,0.3)] transition-all cursor-pointer",
                      activeStep === index
                        ? "bg-primary border-primary-dark scale-110"
                        : "bg-bg-card border-text-primary/20 hover:bg-bg-tertiary"
                    )}
                  >
                    <IconComponent className={cn("w-12 h-12 mb-2 mx-auto", activeStep === index ? "text-black" : "text-primary")} />
                    <div className={cn("font-handwritten font-black text-lg", activeStep === index ? "text-black" : "text-text-primary")}>
                      {step.title}
                    </div>
                    {activeStep === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-black"
                      >
                        <CheckCircle2 className="w-5 h-5 text-black" />
                      </motion.div>
                    )}
                  </motion.button>

                  {index < steps.length - 1 && (
                    <HandDrawnArrow className="hidden md:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active step details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border-primary p-8 rounded-2xl border-4 shadow-[8px_8px_0px_0px_rgba(232,129,59,0.5)] max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-4">
              {React.createElement(steps[activeStep].icon, { className: "w-16 h-16 text-primary flex-shrink-0" })}
              <div className="flex-1">
                <h3 className="font-handwritten font-black text-3xl mb-2 text-text-primary">{steps[activeStep].title}</h3>
                <p className="text-xl mb-3 text-text-secondary font-handwritten">{steps[activeStep].description}</p>
                <p className="text-lg text-text-muted italic font-handwritten">
                  <Sparkles className="inline w-4 h-4 mr-1" />
                  {steps[activeStep].details}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------
// CARAVAN PACKAGES SECTION
// -----------------------------
const CaravanPackages = () => {
  const packages = [
    {
      name: "@caravan/bitcoin",
      icon: Puzzle,
      description: "Bitcoin building blocks",
      features: ["Scripts", "Addresses", "Transactions"],
      color: "bg-blue-500/10",
      borderColor: "border-blue-500",
    },
    {
      name: "@caravan/psbt",
      icon: BookOpen,
      description: "Sign transactions properly",
      features: ["Build PSBTs", "Sign", "Combine"],
      color: "bg-purple-500/10",
      borderColor: "border-purple-500",
    },
    {
      name: "@caravan/multisig",
      icon: Shield,
      description: "Multisig made easy",
      features: ["Policies", "Wallets", "Security"],
      color: "bg-green-500/10",
      borderColor: "border-green-500",
    },
  ];

  return (
    <section className="py-20 bg-bg-secondary text-text-primary relative overflow-hidden">
      {/* Doodle decorations */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#E8813B_20px,#E8813B_22px)] opacity-20" />
      <DoodleSquiggle className="top-20 left-10 opacity-10" />
      <DoodleSquiggle className="bottom-20 right-10 opacity-10 rotate-180" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-handwritten font-black mb-4 relative inline-block">
            <span className="text-text-primary">Built with </span>
            <span className="text-primary">Caravan Packages</span>
          </h2>
          <p className="text-xl text-text-secondary font-handwritten">
            Learn by using the same tools powering real Bitcoin custody!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const IconComponent = pkg.icon;
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotate: 2 }}
                className={cn(
                  "p-6 rounded-2xl border-4 shadow-[8px_8px_0px_0px_rgba(232,129,59,0.3)] transform",
                  pkg.color,
                  pkg.borderColor,
                  index === 1 ? "rotate-1" : index === 2 ? "-rotate-1" : ""
                )}
              >
                <IconComponent className="w-16 h-16 mb-4 text-primary" />
                <h3 className="font-handwritten font-black text-2xl mb-2 text-text-primary">{pkg.name}</h3>
                <p className="text-lg text-text-secondary mb-4 font-handwritten">{pkg.description}</p>

                <div className="space-y-2">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-text-secondary font-handwritten">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className="w-full mt-6 bg-bg-primary hover:bg-bg-card text-text-primary font-handwritten font-bold py-3 rounded-xl border-2 border-primary"
                >
                  <Link href="/playground">Try it out <ArrowRight className="inline w-4 h-4 ml-1" /></Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// -----------------------------
// LEARNING PATH SECTION
// -----------------------------
const LearningPath = () => {
  const paths = [
    {
      title: "Chapter 1: Bitcoin Basics",
      icon: BookOpen,
      description: "UTXOs, transactions, and how Bitcoin works",
      lessons: 8,
      difficulty: "Beginner",
    },
    {
      title: "Chapter 2: Keys & Addresses",
      icon: Key,
      description: "Private keys, public keys, and Bitcoin addresses",
      lessons: 6,
      difficulty: "Beginner",
    },
    {
      title: "Chapter 3: Multisig Magic",
      icon: Sparkles,
      description: "Understanding multisig and why it's important",
      lessons: 10,
      difficulty: "Intermediate",
    },
    {
      title: "Chapter 4: PSBTs Deep Dive",
      icon: Layers,
      description: "Partially Signed Bitcoin Transactions explained",
      lessons: 7,
      difficulty: "Advanced",
    },
  ];

  return (
    <section className="py-20 bg-bg-primary relative">
      <DoodleSparkle className="top-10 right-20" delay={0} />
      <DoodleSparkle className="bottom-10 left-20" delay={1.5} />

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-handwritten font-black mb-4 relative inline-block text-text-primary">
            Your Learning Journey
            <DoodleUnderline />
          </h2>
          <p className="text-xl text-text-secondary font-handwritten">
            From zero to multisig hero!
          </p>
        </div>

        <div className="space-y-6">
          {paths.map((path, index) => {
            const IconComponent = path.icon;
            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 10 }}
                className="bg-bg-card p-6 rounded-2xl border-4 border-text-primary/20 shadow-[8px_8px_0px_0px_rgba(245,245,245,0.1)] cursor-pointer transform hover:shadow-[12px_12px_0px_0px_rgba(245,245,245,0.2)] transition-all"
              >
                <div className="flex items-center gap-6">
                  <IconComponent className="w-16 h-16 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-handwritten font-black text-2xl text-text-primary">{path.title}</h3>
                      <span className="px-3 py-1 bg-primary/20 rounded-full border-2 border-primary text-sm font-handwritten font-bold text-primary">
                        {path.difficulty}
                      </span>
                    </div>
                    <p className="text-lg text-text-secondary mb-3 font-handwritten">{path.description}</p>
                    <div className="flex items-center gap-4 text-sm text-text-muted font-handwritten">
                      <span><BookOpen className="inline w-4 h-4 mr-1" />{path.lessons} lessons</span>
                      <span>•</span>
                      <span><Zap className="inline w-4 h-4 mr-1" />Interactive labs included</span>
                    </div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-primary flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="sketch-button bg-primary hover:bg-primary-dark text-black font-handwritten font-black text-xl px-12 py-8 rounded-xl border-4 border-primary-dark shadow-[8px_8px_0px_0px_rgba(232,129,59,1)] hover:shadow-[12px_12px_0px_0px_rgba(232,129,59,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            <Link href="/learn/start" className="flex items-center gap-3">
              <Rocket className="w-6 h-6" />
              Start Your Journey!
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// -----------------------------
// FOOTER
// -----------------------------
const Footer = () => (
  <footer className="bg-bg-secondary text-text-primary py-12 border-t-8 border-primary">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-12 h-12 text-primary" />
            <div>
              <h3 className="font-handwritten font-black text-2xl">Caravan Interactive</h3>
              <p className="text-text-muted font-handwritten">Learn Bitcoin. Build Multisig.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 font-handwritten">
          <Link href="/learn/start" className="hover:text-primary transition">
            Learn
          </Link>
          <Link href="/playground" className="hover:text-primary transition">
            Playground
          </Link>

          <a href="https://www.caravanmultisig.com/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            Caravan App
          </a>

          <a href="https://github.com/caravan-bitcoin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="mt-8 text-center text-text-muted text-sm font-handwritten">
        <p>Built with <span className="text-primary">love</span> by the Caravan Team • Inspired by Learn Me A Bitcoin</p>
        <p className="mt-2">Open-source Bitcoin custody infrastructure</p>
      </div>
    </div >
  </footer >
);

// -----------------------------
// MAIN PAGE
// -----------------------------
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Simple Nav */}
      <header className="sticky top-0 z-50 bg-bg-primary border-b-4 border-primary shadow-md backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Package className="w-10 h-10 text-primary" />
            <div>
              <div className="font-handwritten font-black text-xl text-text-primary">Caravan Interactive</div>
              <div className="text-sm text-text-muted font-handwritten">Bitcoin Multisig School</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 font-handwritten">
            <Link href="/learn/start" className="font-bold hover:text-primary transition text-text-secondary">
              Learn
            </Link>
            <Link href="/playground" className="font-bold hover:text-primary transition text-text-secondary">
              Playground
            </Link>

            <a href="https://www.caravanmultisig.com/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-primary transition text-text-secondary"
            >
              Caravan App
            </a>
          </nav>

          <Button
            asChild
            className="bg-primary hover:bg-primary-dark text-black font-handwritten font-bold border-2 border-primary-dark shadow-[4px_4px_0px_0px_rgba(232,129,59,0.5)]"
          >
            <Link href="/learn/start">Start Learning</Link>
          </Button>
        </div>
      </header >

      {/* Sections */}
      < HeroSection />
      <ComicStripExplainer />
      <InteractiveBitcoinFlow />
      <CaravanPackages />
      <LearningPath />
      <Footer />
    </div >
  );
}