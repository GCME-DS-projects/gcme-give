"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Users, Globe, Church, BookOpen, Heart, Clipboard, Map, Film,
} from "lucide-react";
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";
import { useGetStrategies } from "@/hooks/queries/use-strategies-query";
import { Strategy } from "@/lib/types";

const iconMap = {
  Users, Globe, Church, BookOpen, Heart, Clipboard, Map, Film,
};

export default function StrategiesPage() {
  // Use the React Query hook to fetch data
  const { data: rawStrategies = [], isLoading: loading } = useGetStrategies();

  // Memoize the filtered list to prevent re-calculating on every render
  const strategies = useMemo(
    () => rawStrategies.filter((s: Strategy) => !s.isDeleted),
    [rawStrategies]
  );

  return (
    <>
      <Header currentPage="strategies" />
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-end justify-center pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/strategies/hero.png"
            alt="Mission strategies"
            fill
            className="object-cover"
            priority
          />
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
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Our Mission Strategies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-200 mb-8"
          >
            Discover how we&apos;re reaching communities and transforming lives
            through innovative mission approaches
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#strategies"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              Explore Strategies
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Strategies Grid */}
      <section id="strategies" className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            strategies.map((strategy, index) => {
              const Icon = iconMap[strategy.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Link
                    href={`/strategies/${strategy.slug}`}
                    className="block p-6"
                  >
                    <div className="mb-4">
                      {Icon && <Icon className="w-8 h-8 text-primary-600" />}
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      {strategy.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 line-clamp-3">
                      {strategy.description}
                    </p>
                    <ul className="space-y-2">
                      {(strategy.activities || [])
                        .slice(0, 3) // Show first 3 activities
                        .map((point: string) => (
                          <li
                            key={point}
                            className="flex items-center text-neutral-700"
                          >
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                            {point}
                          </li>
                        ))}
                    </ul>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Join Us in Our Mission
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Your contribution makes a significant impact on this vital mission
            strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
            >
              Support Our Work
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}