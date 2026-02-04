import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { TorusKnot, Stars } from "@react-three/drei";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

/**
 * Premium Hero Section for "Nebula".
 * Tech: React + Tailwind + Framer Motion + R3F + Drei
 */

const heroCopy = {
  title: "Orchestrate Your Digital Reality.",
  body:
    "Nebula is the orchestration layer for future-ready SaaS. Unite data, AI, and workflows in a cosmic-grade command center.",
  stats: ["120+ Enterprises", "98% Retention", "4.9/5 Satisfaction"],
};

const navLinks = ["Platform", "Solutions", "Developers", "Pricing"];

const avatars = [
  { name: "Nova", color: "bg-cyan-400/80" },
  { name: "Orion", color: "bg-purple-400/80" },
  { name: "Lyra", color: "bg-blue-400/80" },
  { name: "Vega", color: "bg-pink-400/80" },
];

function useMagnetic(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.2 });

  const handleMove = (event) => {
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();
    const offsetX = (clientX - rect.left - rect.width / 2) * strength;
    const offsetY = (clientY - rect.top - rect.height / 2) * strength;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { x: springX, y: springY, handleMove, handleLeave };
}

function MagneticLink({ children }) {
  const magnet = useMagnetic(0.2);

  return (
    <motion.button
      type="button"
      className="relative transition-colors hover:text-white"
      style={{ x: magnet.x, y: magnet.y }}
      onMouseMove={magnet.handleMove}
      onMouseLeave={magnet.handleLeave}
    >
      {children}
    </motion.button>
  );
}

function ParticleTorus() {
  const meshRef = useRef(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.z += delta * 0.06;
    meshRef.current.position.x = mouse.x * 0.6;
    meshRef.current.position.y = mouse.y * 0.4;
  });

  return (
    <TorusKnot
      ref={meshRef}
      args={[1.2, 0.4, 256, 32]}
      rotation={[0.4, 0.2, 0]}
    >
      <meshStandardMaterial
        wireframe
        color="#66d9ff"
        roughness={0.2}
        metalness={0.9}
      />
    </TorusKnot>
  );
}

function CursorLight() {
  const lightRef = useRef(null);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (!lightRef.current) return;
    lightRef.current.position.x = mouse.x * viewport.width * 0.4;
    lightRef.current.position.y = mouse.y * viewport.height * 0.3;
  });

  return (
    <spotLight
      ref={lightRef}
      color="#8a7dff"
      intensity={3.2}
      distance={15}
      angle={0.4}
      penumbra={1}
      position={[0, 0, 5]}
    />
  );
}

export function BackgroundScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">
            Loading Nebula Field...
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          className="h-full w-full"
        >
          <ambientLight intensity={0.4} />
          <CursorLight />
          <ParticleTorus />
          <Stars radius={40} depth={60} count={1200} factor={3} fade />
        </Canvas>
      </Suspense>
    </div>
  );
}

export function Navbar() {
  const buttonMagnet = useMagnetic(0.25);

  return (
    <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/80 via-purple-400/70 to-blue-500/80 shadow-lg shadow-cyan-500/30">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Nebula</span>
      </div>
      <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
        {navLinks.map((link) => (
          <MagneticLink key={link}>{link}</MagneticLink>
        ))}
      </div>
      <motion.button
        type="button"
        className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20"
        style={{ x: buttonMagnet.x, y: buttonMagnet.y }}
        onMouseMove={buttonMagnet.handleMove}
        onMouseLeave={buttonMagnet.handleLeave}
      >
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,rgba(34,211,238,0.25),rgba(168,85,247,0.35),rgba(34,211,238,0.25))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="relative">Book Demo</span>
        <ArrowUpRight className="relative h-4 w-4" />
      </motion.button>
    </nav>
  );
}

const headlineVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function HeroContent() {
  const letters = useMemo(() => heroCopy.title.split(""), []);
  const contentRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <motion.div
      ref={contentRef}
      style={{ y, opacity }}
      className="relative z-10 flex flex-col gap-10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="hero-copy"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0 }}
          variants={headlineVariant}
          className="space-y-6"
        >
          <motion.h1
            className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl"
            aria-label={heroCopy.title}
            variants={headlineVariant}
          >
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400 bg-clip-text text-transparent">
              {letters.map((letter, index) => (
                <motion.span key={`${letter}-${index}`} variants={letterVariant}>
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl text-base text-white/70 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroCopy.body}
          </motion.p>

          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40"
            >
              <span className="absolute inset-[1px] rounded-full bg-gradient-to-r from-cyan-500/70 to-purple-500/70 opacity-70 blur-xl" />
              <span className="relative">Launch Nebula</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur-xl"
            >
              Explore Platform
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          {avatars.map((avatar, index) => (
            <motion.div
              key={avatar.name}
              className={`-ml-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 ${avatar.color} text-sm font-semibold text-white`}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, delay: index * 0.2, repeat: Infinity }}
            >
              {avatar.name.slice(0, 1)}
            </motion.div>
          ))}
          <span className="ml-4 text-sm text-white/70">Trusted by visionary teams</span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-white/60">
          {heroCopy.stats.map((stat) => (
            <div key={stat} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {stat}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function PremiumHeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05060f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(40,83,255,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(124,58,237,0.2),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b0c15_0%,#000000_100%)]" />
      <div className="absolute inset-0 opacity-[0.15] mix-blend-screen [background-image:radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:3px_3px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-soft-light [background-image:linear-gradient(120deg,rgba(255,255,255,0.08),transparent_40%),radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:120px_120px,4px_4px]" />

      <BackgroundScene />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-10 sm:px-10 lg:px-16">
        <Navbar />

        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <HeroContent />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[360px] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:h-[420px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),transparent_60%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.25),transparent_60%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                  Nebula Control Core
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Multidimensional Insights with Zero Gravity UX
                </h2>
                <p className="text-sm text-white/60">
                  Sync your fleet with adaptive AI automations, predictive telemetry, and secure
                  orchestration.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
                {["Realtime Deploys", "Auto Scaling", "Quantum Alerts", "Zero Trust"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
