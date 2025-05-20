"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { ThemedButton } from "@/components/ui/themed-button";
import SimpleAudioPlayer from "@/components/SimpleAudioPlayer";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { currentTheme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get theme colors from the current theme
  const getThemeColor = (index, fallback) => {
    if (!currentTheme || !currentTheme.palettes) return fallback;

    const activePalette =
      currentTheme.palettes.find((p) => p.isActive) || currentTheme.palettes[0];
    if (
      !activePalette ||
      !activePalette.colors ||
      activePalette.colors.length <= index
    ) {
      return fallback;
    }

    return activePalette.colors[index];
  };

  // Theme colors with fallbacks
  const primaryColor = getThemeColor(0, "#4169E1"); // Primary (indigo)
  const secondaryColor = getThemeColor(1, "#87CEEB"); // Secondary (light blue)
  const accentColor = getThemeColor(2, "#1E90FF"); // Accent (dodger blue)
  const mutedColor = getThemeColor(3, "#6495ED"); // Muted (cornflower blue)

  const features = [
    {
      title: "AI-Powered Affirmations",
      description:
        "Our advanced algorithms create personalized affirmations tailored to your specific goals and desires.",
      icon: (
        <svg
          className="w-6 h-6"
          style={{ color: accentColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Premium Sound Library",
      description:
        "Choose from our curated collection of ambient sounds, binaural beats, and music tracks.",
      icon: (
        <svg
          className="w-6 h-6"
          style={{ color: accentColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
    },
    {
      title: "Neural Embedding Technology",
      description:
        "Our proprietary technology embeds affirmations at the perfect subliminal level for maximum effectiveness.",
      icon: (
        <svg
          className="w-6 h-6"
          style={{ color: accentColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Unlimited Downloads",
      description:
        "Download your custom tracks to listen offline anytime, anywhere, on any device.",
      icon: (
        <svg
          className="w-6 h-6"
          style={{ color: accentColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      quote: "I’m a huge fan of subliminal affirmations and have listened to tons of generic ones on YouTube, but of course these weren’t personalized to me. Sublmnl is the first place I found where I could actually customize my own track, instantly. The AI helped me create the perfect affirmations for my goals, and the track was ready in seconds. Amazing!!",
      author: "Sarah J",
      role: "Sales Manager",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote: "I’ve listened to my custom affirmation track every day for two weeks and I noticed my mindset has completely transformed. I find myself thinking more positively without trying. It’s like these affirmations planted seeds of confidence that just keep growing. Plus, the music is very very catchy. It makes the whole experience feel effortless.",
      author: "Michael T.",
      role: "Software Engineer",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote: "I’ve always struggled with traditional manifestation methods because deep down, it was hard to fully believe what I was saying. But with Sublmnl, it’s completely different, I don’t have to force anything or repeat affirmations out loud. I just play the music and let it work in the background. It’s the easiest and most natural way I’ve ever manifested positive changes. ",
      author: "Simi B",
      role: "Consultant",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ];

  // Dynamic gradient styles
  const heroGradient = `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}20, ${primaryColor}20)`;
  const primaryGradient = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`;
  const buttonGradient = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`;
  const textGradient = `linear-gradient(to right, ${primaryColor}CC, ${secondaryColor}CC, ${accentColor}CC)`;

  // Category card gradients
  const careerGradient = `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`;
  const relationshipsGradient = `linear-gradient(to bottom right, ${secondaryColor}, ${accentColor})`;
  const healthGradient = `linear-gradient(to bottom right, ${accentColor}, ${primaryColor})`;
  const wealthGradient = `linear-gradient(to bottom right, ${mutedColor}, ${accentColor})`;

  // CTA section gradient
  const ctaGradient = `linear-gradient(to bottom right, ${primaryColor}E6, ${secondaryColor}E6, ${primaryColor}E6)`;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ background: heroGradient }}
          ></div>
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ backgroundColor: `${secondaryColor}30` }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow"
            style={{
              backgroundColor: `${primaryColor}20`,
              animationDelay: "2s",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div
              className={`lg:w-1/2 lg:pr-10 mb-10 lg:mb-0 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div
                className="inline-block px-3 py-1 mb-6 text-xs font-semibold rounded-full"
                style={{ backgroundColor: `${primaryColor}50` }}
              >
                Reprogram Your Mind
              </div>
              <h1
                className="comfortaa-bold text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent animate-pulse"
                style={{ backgroundImage: primaryGradient }}
              >
                Music that makes your dreams come true. Literally.
              </h1>
              <p className="text-xl md:text-xl mb-8 text-gray-300">
                Manifest your dream life without lifting a finger... Okay, maybe
                just to put your headphones in.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-out">
                <ThemedButton href="#how-it-works" variant="primary">
                  How it Works
                </ThemedButton>

                {/* <Link
                  href="/pricing"
                  className="btn-secondary text-center"
                  style={{ borderColor: primaryColor }}
                >
                  View Pricing
                </Link> */}
              </div>
            </div>
            <div
              className={`lg:w-1/2 transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="relative">
                <div
                  className="absolute -inset-1 rounded-3xl blur opacity-30 animate-pulse-slow"
                  style={{ background: primaryGradient }}
                ></div>
                <div className="relative bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-700">
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full filter blur-xl"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  ></div>
                  <div
                    className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full filter blur-xl"
                    style={{ backgroundColor: `${secondaryColor}20` }}
                  ></div>
                  <div className=" h-[480px] flex items-start justify-start">
                    <Image
                      src={"/images/banner.png"}
                      alt="Logo"
                      width={120}
                      height={20}
                      className="h-full rounded-2xl shadow-lg bg-cover"
                      style={{
                        height: "auto",
                        width: "100%",
                        maxWidth: "745px",
                        maxHeight: "480px",
                        objectFit: "cover",
                        objectPosition: "97% 18%",
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <SimpleAudioPlayer
                      trackTitle="Success Affirmations"
                      audioUrl="/audio/the-way-home.mp3"
                      themeColor={accentColor}
                      themeSecColor={secondaryColor}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="glass-card p-6 text-center bg-primary/10 card-hover">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                40+
              </div>
              <div className="text-gray-400">Songs to Choose From</div>
            </div>
            <div className="glass-card p-6 text-center bg-primary/10 card-hover">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                100%
              </div>
              <div className="text-gray-400">Personalized</div>
            </div>
            <div className="glass-card p-6 text-center bg-primary/10 card-hover">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
               ∞
              </div>
              <div className="text-gray-400">Tracks You Can Create</div>
            </div>
            <div className="glass-card p-6 text-center bg-primary/10 card-hover">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-0 relative" >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
            }}
          ></div>
            <div className="absolute inset-0 z-0">
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ background: heroGradient }}
                ></div>
            </div>
        
        <div className="max-w-7xl mx-auto p-6 container ">
          <div className="flex flex-col md:flex-row bg-gray-900 rounded-lg overflow-hidden">
            {/* Left side - Text content */}
            <div className="p-8 md:w-1/2 bg-gray-900">
              <h2 className="text-3xl md:text-4xl font-bold  mb-4 bg-clip-text text-transparent "
                style={{ backgroundImage: primaryGradient }}>
                Manifestation works.
              </h2>

              <p className="text-gray-400 mb-6">
                But let&apos;s be real - it&apos;s hard to believe what
                you&apos;re saying when it feels like a lie. For example, if
                your morning affirmation routine goes something like this:
              </p>

              <div
                className="relative py-3"
              >
                
                <blockquote className="text-center text-white text-xl card-hover font-medium p-4 bg-primary/10 mb-6 rounded py-6">
                  "I&apos;m so grateful to be married to my 6 ft tall, handsome,
                  thoughtful husband living in our dream penthouse in NYC."
                </blockquote>
              </div>

              <p className="text-gray-400 mb-6">
                Meanwhile you’re single, living in your parents’ house in Mississauga. Tough sell.
                And here’s the kicker: Manifestation only works when you believe it.
              </p>
              
            </div>

            {/* Right side - Geometric pattern */}
            <div className="relative md:w-1/2 ">
              {/* Diagonal lines */}
              <Image
                      src={"/images/girlwithtyping.png"}
                      alt="Manifestation works"
                      width={48}
                      height={48}
                      className="w-[90%] h-[90%] object-contain object-right"
                    />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 pt-0 relative overflow-hidden">
        {/* <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
          }}
        ></div> */}
        <div className="absolute inset-0 z-0">
            <div
              className="absolute top-0 right-0 w-full h-full"
              style={{ background: heroGradient }}
            ></div>
        </div>
        <div className="max-w-7xl mx-auto p-6 container ">
          <div className="flex flex-col md:flex-row">
            {/* Left side - X pattern with banner overlay */}
            <div className="relative md:w-1/2 min-h-[450px]">
                <Image
                      src={"/images/brain.jpeg"}
                      alt="Manifestation works"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover object-right"
                    />
            </div>

            {/* Right side - Text content */}
            <div className="p-8 pt-0 md:w-1/2 bg-gray-900 text-gray-300 min-h-[500px]">
              <div className="space-y-6 py-5">

                 <blockquote className="text-center text-white text-xl card-hover font-medium p-4 bg-primary/10 mb-6 rounded py-6">
                 
                    Subliminal affirmations are powerful statements hidden behind music, so your
                    conscious mind can’t hear them, and therefore can’t reject them.
                 
                </blockquote>

                {/* <p className="text-gray-400 mb-6">
                  Since your conscious mind doesn't hear them, it can't reject
                  them as false, allowing them to slip straight into your
                  subconscious.
                </p> */}

                <p className="text-gray-400 mb-6">They go straight to your subconscious. And that’s where the magic happens.</p>

                 <blockquote className="text-center text-white card-hover text-xl font-medium p-4 bg-primary/10 mb-6 rounded py-6">
                 
                    With Sublmnl, you can create a custom subliminal affirmation track, personalized
                    just for you.
                  
                </blockquote>

                <p className="text-gray-400 mb-6">
                  So, scroll down, type in your desires, pick your favorite tune, and let the music do the
                  heavy lifting.
                </p>

                <ThemedButton href="/create" variant="primary">
                  Create Your First Track
                </ThemedButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
          }}
        ></div>

        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ background: heroGradient }}
          ></div>
          
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: `${primaryColor}50`,
                color: accentColor,
              }}
            >
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white1 mb-4 bg-clip-text text-transparent "
                style={{ backgroundImage: primaryGradient }}>
              Powerful Features for Mind Transformation
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our cutting-edge platform makes it easy to create effective
              subliminal audio tailored to your specific goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 staggered-fade-in">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 card-hover border border-gray-700/50"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${primaryColor}50` }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative overflow-hidden" id="how-it-works">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-40 right-10 w-72 h-72 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ backgroundColor: `${accentColor}20` }}
          ></div>
          <div
            className="absolute bottom-40 left-10 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow"
            style={{
              backgroundColor: `${secondaryColor}20`,
              animationDelay: "3s",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10" >
          <div className="text-center mb-16">
            <div
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: `${primaryColor}50`,
                color: accentColor,
              }}
            >
              Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white1 mb-4 bg-clip-text text-transparent" 
                style={{ backgroundImage: primaryGradient }}>
              How Sublmnl Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Create your personalized subliminal audio in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 staggered-fade-in">
            <div className="glass-card p-8 text-center relative">
              <div
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold "
                style={{ backgroundColor: primaryColor }}
              >
                1
              </div>
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}50` }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: primaryColor }}
                  fill="none"
                  stroke={accentColor}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Define Your Goals
              </h3>
              <p className="text-gray-400">
                Select from our library of affirmation categories or create your
                own custom affirmations tailored to your specific goals.
              </p>
            </div>
            <div className="glass-card p-8 text-center relative">
              <div
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold "
                style={{ backgroundColor: primaryColor }}
              >
                2
              </div>
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}50` }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: primaryColor }}
                  fill="none"
                  stroke={accentColor}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Select Your Sounds
              </h3>
              <p className="text-gray-400">
                Select from a variety of background sounds including ambient
                music and beats.
              </p>
            </div>
            <div className="glass-card p-8 text-center relative">
              <div
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                3
              </div>
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}50` }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: primaryColor }}
                  fill="none"
                  stroke={accentColor}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Download & Listen
              </h3>
              <p className="text-gray-400">
                Download your custom subliminal audio track and listen for at
                least 20 minutes daily for optimal results.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <ThemedButton href="/create" variant="primary">
              Create Your First Track
            </ThemedButton>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
          }}
        ></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: `${primaryColor}50`,
                color: accentColor,
              }}
            >
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white1 mb-4 bg-clip-text text-transparent" 
                style={{ backgroundImage: primaryGradient }}>
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Thousands of people have transformed their lives with Sublmnl
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 staggered-fade-in items-stretch">
  {testimonials.map((testimonial, index) => (
    <div
      key={index}
      className="glass-card min-h-[420px] p-8 card-hover border border-gray-700/50 flex flex-col h-full"
    >
      {/* Top section: icon + quote */}
      <div className="flex-grow">
        <svg
          className="w-10 h-10 mb-6"
          style={{ color: primaryColor }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-300 italic">
          {testimonial.quote}
        </p>
      </div>

      {/* Bottom section: author name + role */}
      <div className="mt-6">
        <p className="font-semibold text-white">
          {testimonial.author}
        </p>
        <p className="text-gray-400">{testimonial.role}</p>
      </div>
    </div>
  ))}
</div>

        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-20 right-20 w-72 h-72 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ backgroundColor: `${accentColor}20` }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow"
            style={{
              backgroundColor: `${primaryColor}20`,
              animationDelay: "2.5s",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: `${primaryColor}50`,
                color: accentColor,
              }}
            >
              Categories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white1 mb-4 bg-clip-text text-transparent" 
                style={{ backgroundImage: primaryGradient }}>
              Explore Our Audio Categories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Create your own subliminal audio track for every aspect of your life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 staggered-fade-in">
            <div className="glass-card overflow-hidden rounded-2xl group card-hover flex flex-col justify-between h-full">
              <div
                className="h-40 relative overflow-hidden"
                style={{ background: primaryColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zm-5-2v2H9V4h6zM8 8h12v3H4V8h4zm-4 11V13h16v6H4z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Career & Success
                </h3>
                <p className="text-gray-400 mb-4 flex-grow">
                  Boost your confidence, productivity, and leadership skills.
                </p>
                <Link
                  href="/create?cid=career"
                  className="inline-flex items-center"
                  style={{ color: accentColor }}
                >
                  Get Started
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-2xl group card-hover flex flex-col justify-between h-full">
              <div
                className="h-40 relative overflow-hidden"
                style={{ background: accentColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Love & Relationships
                </h3>
                <p className="text-gray-400 mb-4 flex-grow">
                  Attract healthy relationships and improve existing ones.
                </p>
                <Link
                  href="/create?cid=relationships"
                  className="inline-flex items-center"
                  style={{ color: accentColor }}
                >
                  Get Started
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-2xl group card-hover flex flex-col justify-between h-full">
              <div
                className="h-40 relative overflow-hidden"
                style={{ background: mutedColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.649 5.286 14 8.548V2.025h-4v6.523L4.351 5.286l-2 3.465 5.648 3.261-5.648 3.261 2 3.465L10 15.477V22h4v-6.523l5.649 3.261 2-3.465-5.648-3.261 5.648-3.261z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Health & Fitness
                </h3>
                <p className="text-gray-400 mb-4 flex-grow">
                  Enhance your physical wellbeing and achieve your fitness goals.
                </p>
                <Link
                  href="/create?cid=health"
                  className="inline-flex items-center"
                  style={{ color: accentColor }}
                >
                  Get Started
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-2xl group card-hover flex flex-col justify-between h-full">
              <div
                className="h-40 relative overflow-hidden"
                style={{ background: primaryColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c3.976 0 8-1.374 8-4V6c0-2.626-4.024-4-8-4S4 3.374 4 6v12c0 2.626 4.024 4 8 4zm0-2c-3.722 0-6-1.295-6-2v-1.268C7.541 17.57 9.777 18 12 18s4.459-.43 6-1.268V18c0 .705-2.278 2-6 2zm0-16c3.722 0 6 1.295 6 2s-2.278 2-6 2-6-1.295-6-2 2.278-2 6-2zM6 8.732C7.541 9.57 9.777 10 12 10s4.459-.43 6-1.268V10c0 .705-2.278 2-6 2s-6-1.295-6-2V8.732zm0 4C7.541 13.57 9.777 14 12 14s4.459-.43 6-1.268V14c0 .705-2.278 2-6 2s-6-1.295-6-2v-1.268z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Wealth & Abundance
                </h3>
                <p className="text-gray-400 mb-4 flex-grow">
                  Attract financial prosperity and develop an abundance mindset.
                </p>
                <Link
                  href="/create?cid=wealth"
                  className="inline-flex items-center"
                  style={{ color: accentColor }}
                >
                  Get Started
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)`,
            }}
          ></div>
          <div className="absolute inset-0 z-0">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ background: heroGradient }}
            ></div>
            <div
              className="absolute top-20 left-10 w-72 h-72 rounded-full filter blur-3xl animate-pulse-slow"
              style={{ backgroundColor: `${secondaryColor}30` }}
            ></div>
            <div
              className="absolute bottom-10 right-10 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow"
              style={{
                backgroundColor: `${primaryColor}20`,
                animationDelay: "2s",
              }}
            ></div>
          </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white1 bg-clip-text text-transparent"
                style={{ backgroundImage: primaryGradient }}>
            Ready to Transform Your Mind?
          </h2>
          <p className="text-md mb-8 max-w-3xl mx-auto">
            Join thousands of users who are already experiencing the benefits of
            subliminal audio technology.
          </p>
          {/* <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <ThemedButton href="/create" variant="primary">
              Get Started Now
            </ThemedButton>

            <Link
              href="/pricing"
              className="btn-secondary bg-transparent border-white text-white hover:bg-white/10"
            >
              View Pricing Plans
            </Link>
          </div> */}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-left hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4 hover:bg-indigo-800/60 transition-colors"
                  style={{ backgroundColor: `${primaryColor}50` }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: primaryColor }}
                    fill="none"
                    stroke={accentColor}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Secure & Private
                </h3>
              </div>
              <p className="text-gray-400">
                Your personal information and custom affirmations are encrypted
                and securely stored.
              </p>
            </div>

            <div className="glass-card p-6 text-left hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-800/60 transition-colors"
                  style={{ backgroundColor: `${primaryColor}50` }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: primaryColor }}
                    fill="none"
                    stroke={accentColor}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  AI-Powered Analytics
                </h3>
              </div>
              <p className="text-gray-400">
                Track your progress and get personalized insights about your
                mindset transformation journey.
              </p>
            </div>

            <div className="glass-card p-6 text-left hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4 hover:bg-indigo-800/60 transition-colors"
                  style={{ backgroundColor: `${primaryColor}50` }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: primaryColor }}
                    fill="none"
                    stroke={accentColor}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  24/7 Support
                </h3>
              </div>
              <p className="text-gray-400">
                Our dedicated support team is available around the clock to
                assist you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
