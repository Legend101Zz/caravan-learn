"use client";

import React, { useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
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
// Visual: Bitcoin particles
// -----------------------------
const BitcoinParticles = () => {
  const dots = useMemo(() => {
    const n = 45;
    return Array.from({ length: n }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.35 + Math.random() * 1.25,
      d: 3 + Math.random() * 6,
      o: 0.12 + Math.random() * 0.55,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40 blur-[0.2px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.s}rem`,
            height: `${p.s}rem`,
            opacity: p.o,
          }}
          animate={{ y: ["0%", "-16%", "0%"], x: ["0%", "10%", "0%"] }}
          transition={{
            duration: p.d,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// -----------------------------
// Visual: Caravan cart hero (sticky)
// -----------------------------
const CaravanCartHero = () => {
  return (
    <div className="relative w-full h-[430px] flex items-center justify-center">
      {/* background blob */}
      <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute inset-0 [mask-image:radial-gradient(closest-side,black,transparent)] opacity-85">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      {/* Rolling platform */}
      <div className="absolute bottom-10 left-0 right-0">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <motion.div
          className="mt-2 h-10 w-full opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(232,129,59,0.2) 2px, transparent 2px), linear-gradient(to bottom, rgba(232,129,59,0.2) 2px, transparent 2px)",
            backgroundSize: "60px 40px",
            transform: "perspective(800px) rotateX(60deg)",
          }}
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Cart */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: [0, -4, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20"
      >
        <motion.div
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Image
            src="/caravan.webp"
            alt="Caravan"
            width={440}
            height={240}
            className="drop-shadow-[0_30px_60px_rgba(232,129,59,0.25)]"
            priority
          />

          {/* BTC badge */}
          <motion.div
            className="absolute -top-4 -right-6 rounded-full px-4 py-2 bg-bg-card/70 border border-primary/30 backdrop-blur-md shadow-2xl"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="text-primary" size={16} />
              <span className="text-text-primary">Interactive Bitcoin Labs</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// -----------------------------
// Visual: UTXO -> TX -> MEMPOOL -> MINER -> BLOCK
// -----------------------------
const BitcoinFlowViz = () => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-bg-tertiary/30 p-8">
      {/* backdrop */}
      <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[110px]" />
      <div className="absolute inset-0 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(232,129,59,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(232,129,59,0.09)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      {/* Title */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Layers size={18} />
            <span className="uppercase tracking-widest font-bold text-xs">
              Bitcoin visualization
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold">
            UTXO → Transaction → Block
          </h3>
          <p className="text-text-secondary mt-2 max-w-2xl">
            A simplified Bitcoin flow: UTXOs combine into a transaction, enter the
            mempool, and get mined into a block.
          </p>
        </div>

        <div className="text-xs text-text-muted font-mono">
          educational • simplified • interactive vibes
        </div>
      </div>

      {/* lanes */}
      <div className="relative z-10 mt-10 grid lg:grid-cols-4 gap-6 items-center">
        <Lane title="UTXOs" subtitle="unspent outputs" icon="🟠" />
        <Lane title="Transaction" subtitle="inputs → outputs" icon="✍️" />
        <Lane title="Mempool" subtitle="waiting area" icon="🫧" />
        <Lane title="Miner / Block" subtitle="confirmation" icon="⛏️" />
      </div>

      {/* canvas */}
      <div className="relative z-10 mt-8 h-[230px] rounded-[2rem] border border-white/10 bg-bg-card/20 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />

        {/* stage labels */}
        <StageBox label="UTXO set" x="6%" />
        <StageBox label="TX build" x="33%" />
        <StageBox label="Mempool" x="60%" />
        <StageBox label="Mined block" x="86%" />

        {/* flow lines */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center px-10">
          <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
          <div className="w-6" />
          <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
          <div className="w-6" />
          <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
        </div>

        {/* UTXO bubbles */}
        <UTXOBubble delay={0} y="34%" />
        <UTXOBubble delay={0.4} y="52%" />
        <UTXOBubble delay={0.8} y="70%" />

        {/* TX packet */}
        <TxPacket />

        {/* Miner block */}
        <MinedBlockPulse />
      </div>
    </div>
  );
};

function Lane({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="relative rounded-[1.5rem] border border-white/10 bg-bg-card/20 p-4 backdrop-blur-md overflow-hidden">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary/10 blur-[40px]" />
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/15 grid place-items-center text-lg">
          {icon}
        </div>
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-sm text-text-muted">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function StageBox({ label, x }: { label: string; x: string }) {
  return (
    <div
      className="absolute top-6 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-semibold border border-white/10 bg-bg-tertiary/30 backdrop-blur"
      style={{ left: x }}
    >
      {label}
    </div>
  );
}

function UTXOBubble({ delay, y }: { delay: number; y: string }) {
  return (
    <motion.div
      className="absolute left-[8%] -translate-x-1/2 rounded-full bg-primary/25 border border-primary/35 shadow-[0_0_18px_rgba(232,129,59,0.35)]"
      style={{ top: y, width: 18, height: 18 }}
      animate={{
        scale: [1, 1.35, 1],
        opacity: [0.45, 0.95, 0.45],
      }}
      transition={{
        delay,
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function TxPacket() {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2"
      initial={{ x: "8%" }}
      animate={{ x: ["8%", "86%"] }}
      transition={{
        duration: 4.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="relative w-[150px] rounded-2xl border border-primary/25 bg-bg-primary/60 backdrop-blur-md px-4 py-3 shadow-[0_0_35px_rgba(232,129,59,0.2)]">
        <div className="text-xs text-text-muted font-mono">tx</div>
        <div className="text-sm font-bold text-text-primary">spend UTXOs</div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="h-1.5 rounded-full bg-primary/40" />
          <div className="h-1.5 rounded-full bg-primary/25" />
          <div className="h-1.5 rounded-full bg-primary/25" />
          <div className="h-1.5 rounded-full bg-primary/40" />
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-bg-tertiary overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: ["10%", "100%"] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* sparks */}
        <motion.div
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_15px_rgba(232,129,59,0.6)]"
          animate={{
            opacity: [0.15, 1, 0.15],
            scale: [0.8, 1.55, 0.8],
          }}
          transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

function MinedBlockPulse() {
  return (
    <div className="absolute right-[8%] top-1/2 -translate-y-1/2">
      <motion.div
        className="relative h-16 w-16 rounded-2xl border border-primary/25 bg-bg-tertiary/40 backdrop-blur-md shadow-[0_0_35px_rgba(232,129,59,0.18)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-full w-full grid place-items-center">
          <div className="h-8 w-8 rounded-xl bg-primary/20 border border-primary/30" />
        </div>

        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/15 blur-2xl"
          animate={{ opacity: [0.08, 0.55, 0.08] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-bg-primary/70 px-3 py-1 text-xs text-text-secondary font-mono"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          +1 conf
        </motion.div>
      </motion.div>
    </div>
  );
}

// -----------------------------
// Doodle Conversation
// -----------------------------
const DoodleConversation = () => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-bg-card/20 backdrop-blur-md p-8">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-[80px]" />

      <div className="flex items-center gap-2 text-primary mb-3">
        <Sparkles size={18} />
        <span className="uppercase tracking-widest font-bold text-xs">
          Quick Story
        </span>
      </div>

      <h3 className="text-2xl md:text-3xl font-bold mb-6">
        A sketchy conversation (Learn Me A Bitcoin vibes)
      </h3>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Person A */}
        <div className="flex gap-4 items-start">
          <DoodleAvatar variant="a" />
          <div className="doodle-border bg-bg-tertiary/40 p-4">
            <div className="text-sm text-text-muted mb-1">Person 1</div>
            <div className="text-text-primary font-medium">
              What is a multisig wallet in Bitcoin?
            </div>
          </div>
        </div>

        {/* Person B */}
        <div className="flex gap-4 items-start md:justify-end">
          <div className="doodle-border border-primary/25 bg-primary/10 p-4">
            <div className="text-sm text-text-muted mb-1">Person 2</div>
            <div className="text-text-primary font-medium leading-relaxed">
              It’s a wallet that needs{" "}
              <span className="text-primary font-bold">multiple keys</span> to
              spend.
              <br />
              Like <span className="font-bold">2-of-3</span>.
              <br />
              <span className="text-text-secondary">
                I heard Caravan makes multisig safer + easier.
              </span>
            </div>
          </div>
          <DoodleAvatar variant="b" />
        </div>
      </div>

      <div className="mt-6 text-text-secondary text-sm leading-relaxed">
        This site teaches multisig from zero → production level, using the same
        open-source Caravan packages used in real custody workflows.
      </div>
    </div>
  );
};

function DoodleAvatar({ variant }: { variant: "a" | "b" }) {
  const isA = variant === "a";
  return (
    <div className="h-12 w-12 rounded-2xl border border-white/10 bg-bg-tertiary/40 grid place-items-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 12c3 0 5-2.2 5-5s-2-5-5-5-5 2.2-5 5 2 5 5 5Z"
          stroke={isA ? "#E8813B" : "#F5F5F5"}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M4.5 22c1.6-4.2 4.8-6 7.5-6s5.9 1.8 7.5 6"
          stroke={isA ? "#F5F5F5" : "#E8813B"}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M9 9h.01M15 9h.01"
          stroke="#F5F5F5"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// -----------------------------
// Package Cards
// -----------------------------
function PackageCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden border-white/10 bg-bg-card/20 backdrop-blur-md hover:border-primary/30 transition">
      <div className="absolute -top-14 -right-14 h-44 w-44 rounded-full bg-primary/10 blur-[50px]" />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/15 grid place-items-center">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription className="text-text-secondary">
          {desc}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// -----------------------------
// Page
// -----------------------------
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useScroll({ target: containerRef, offset: ["start start", "end start"] });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden selection:bg-primary/30"
    >
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-primary/20 bg-primary/10 grid place-items-center">
              <Package className="text-primary" size={18} />
            </div>
            <div className="leading-tight">
              <div className="font-bold">Caravan Interactive</div>
              <div className="text-xs text-text-muted">
                Learn Bitcoin Multisig • Playground • Docs
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/learn/start" className="hover:text-text-primary transition">
              Learn
            </Link>
            <Link href="/playground" className="hover:text-text-primary transition">
              Playground
            </Link>
            <a
              href="https://www.caravanmultisig.com/#/"
              target="_blank"
              className="hover:text-text-primary transition"
            >
              Caravan
            </a>
            <a
              href="https://github.com/caravan-bitcoin"
              target="_blank"
              className="hover:text-text-primary transition"
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="rounded-full bg-primary hover:bg-primary-dark">
              <Link href="/learn/start">
                Start <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <BitcoinParticles />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,129,59,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-bg-card/40 border border-primary/15 backdrop-blur-md"
              >
                <span className="text-xs text-text-secondary">Inspired by</span>
                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                  <Compass size={14} /> Learn Me A Bitcoin
                </span>
                <span className="text-xs text-text-secondary">
                  • built with Caravan
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
              >
                Learn Bitcoin.
                <br />
                Build Multisig.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-200 to-primary">
                  Become sovereign.
                </span>
              </motion.h1>

              <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl">
                A comprehensive interactive learning platform that teaches
                Bitcoin fundamentals (with a strong focus on multisig custody)
                while showcasing Caravan’s open-source packages through hands-on
                labs.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "relative rounded-full px-10 py-7 text-lg font-black tracking-tight",
                    "bg-gradient-to-r from-primary via-orange-300 to-primary text-black",
                    "shadow-[0_0_55px_rgba(232,129,59,0.35)] hover:shadow-[0_0_85px_rgba(232,129,59,0.55)]",
                    "transition-all hover:scale-[1.03] active:scale-[0.98]",
                    "overflow-hidden"
                  )}
                >
                  <Link href="/learn/start">
                    {/* shine */}
                    <span className="absolute inset-0">
                      <motion.span
                        className="absolute -left-[45%] top-0 h-full w-[40%] bg-white/30 blur-md"
                        animate={{ x: ["0%", "290%"] }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          repeatDelay: 2.2,
                          ease: "easeInOut",
                        }}
                        style={{ transform: "skewX(-20deg)" }}
                      />
                    </span>

                    <span className="relative z-10 flex items-center gap-2">
                      Start Learning
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight size={20} />
                      </motion.span>
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-full border border-white/10 hover:border-primary/25 hover:bg-bg-card/30"
                >
                  <Link href="/playground">
                    Open Playground <Code2 className="ml-2 opacity-80" size={18} />
                  </Link>
                </Button>
              </div>

              {/* Feature pills */}
              <div className="mt-10 grid grid-cols-2 gap-3">
                {[
                  {
                    icon: <Zap className="text-primary" size={18} />,
                    title: "Interactive Labs",
                    desc: "Learn by building real flows",
                  },
                  {
                    icon: <Shield className="text-primary" size={18} />,
                    title: "Security First",
                    desc: "Best practices baked in",
                  },
                  {
                    icon: <Lock className="text-primary" size={18} />,
                    title: "Multisig Deep Dives",
                    desc: "Policies, scripts, PSBTs",
                  },
                  {
                    icon: <GitFork className="text-primary" size={18} />,
                    title: "Open Source",
                    desc: "Caravan ecosystem packages",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-white/10 bg-bg-card/20 p-4 backdrop-blur-md hover:border-primary/20 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/15 grid place-items-center">
                        {f.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{f.title}</div>
                        <div className="text-sm text-text-muted">{f.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: STICKY Caravan */}
            <div className="relative lg:h-[calc(100vh-90px)]">
              <div className="lg:sticky lg:top-24">
                <CaravanCartHero />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BITCOIN FLOW */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <BitcoinFlowViz />
        </div>
      </section>

      {/* DOODLE */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <DoodleConversation />
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <Layers size={18} />
                <span className="uppercase tracking-widest font-bold text-xs">
                  Caravan Packages
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Learn by using real tooling.
              </h2>
              <p className="mt-2 text-text-secondary max-w-2xl">
                Every concept is paired with hands-on labs powered by the exact
                packages Caravan uses in real custody workflows.
              </p>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PackageCard
              title="@caravan/bitcoin"
              desc="Bitcoin primitives: scripts, addresses, serialization."
              icon={<Puzzle size={18} className="text-primary" />}
            />
            <PackageCard
              title="@caravan/psbt"
              desc="Decode, construct and validate PSBTs — learn signing properly."
              icon={<BookOpen size={18} className="text-primary" />}
            />
            <PackageCard
              title="@caravan/multisig"
              desc="Multisig policy → descriptor/script → wallet logic."
              icon={<Shield size={18} className="text-primary" />}
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="rounded-full bg-primary hover:bg-primary-dark">
              <Link href="/learn/start">
                Begin the Journey <Rocket className="ml-2" size={18} />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-full border border-white/10 hover:border-primary/25"
            >
              <Link href="/playground">
                Try Labs <Sparkles className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 bg-bg-secondary/30 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Package size={22} className="text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold leading-none">
                Caravan Interactive
              </div>
              <span className="text-xs text-text-muted">
                Built by the Caravan Team • Open-source Bitcoin custody
                infrastructure
              </span>
            </div>
          </div>

          <p className="text-text-secondary text-sm">
            Inspired by Learn Me A Bitcoin • Powered by Caravan packages
          </p>
        </div>
      </footer>
    </div>
  );
}
