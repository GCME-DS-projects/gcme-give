"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles, Target, Handshake, Lightbulb,  Loader2,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";
import { useGetStrategies } from "@/hooks/queries/use-strategies-query";
import { Strategy } from "@/lib/types";

// const iconMap = {
//   Users, Globe, Church, BookOpen, Video, Heart, Clipboard, Map, Film,
//   Sparkles, Target, Handshake, Lightbulb, ArrowRight,
// };

export default function StrategyDetailPage() {
  const params = useParams();
  const { slug } = params;

  // Fetch all strategies; the data will be cached by React Query
  const { data: strategies = [], isLoading: loading } = useGetStrategies();

  // Find the specific strategy by slug from the cached list
  const strategy = useMemo(() => {
    if (!slug || strategies.length === 0) return null;
    return strategies.find((s: Strategy) => s.slug === slug);
  }, [slug, strategies]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!strategy) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center pt-24 pb-16">
          <div className="text-center text-neutral-700">
            <h1 className="text-4xl font-bold mb-4">Strategy Not Found</h1>
            <p className="text-lg">
              The strategy you are looking for does not exist.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // const Icon = iconMap[strategy.icon as keyof typeof iconMap];

  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-neutral-50 to-white">
        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-end justify-center pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {strategy.imagePath ? (
              <Image
                src={strategy.imagePath}
                alt={strategy.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-10" />
          </div>

          <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto w-[90%]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {strategy.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-200 mb-8"
            >
              {strategy.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200 shadow-lg"
              >
                Support This Strategy
                <Sparkles className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6 text-primary-700">
              <Target className="w-10 h-10 mr-4" />
              <h2 className="text-3xl font-bold">Strategy Overview</h2>
            </div>
            <p className="text-neutral-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {strategy.fullDescription}
            </p>
            <h3 className="text-2xl font-semibold text-neutral-800 mb-4">
              Key Activities:
            </h3>
            <ul className="space-y-3">
              {(strategy.activities || []).map((point: string) => (
                <li key={point} className="flex items-start text-neutral-700">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6 text-accent-700">
                <Lightbulb className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">
                  Our Vision
                </h3>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                {strategy.visionText}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6 text-secondary-700">
                <Handshake className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">
                  Get Involved
                </h3>
              </div>
              <p className="text-neutral-700 leading-relaxed mb-6">
                {strategy.involvedText}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Final Call to Action */}
        {strategy.impactQuote && (
          <section className="bg-primary-600 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                    Join Us in This Mission
                  </h2>
                  <div className="bg-primary-500/20 rounded-2xl p-8 mb-12">
                    <blockquote className="text-xl md:text-2xl font-medium text-white italic">
                      &quot;{strategy.impactQuote}&quot;
                    </blockquote>
                  </div>
                  <div className="flex justify-center">
                    <Link
                      href="/donate"
                      className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200 shadow-lg"
                    >
                      Support This Strategy
                      <Sparkles className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}