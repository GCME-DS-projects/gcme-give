"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface HeroSectionProps {
  openDonationModal: (
    type: "project" | "missionary",
    title: string,
    description?: string,
    slug?: string,
  ) => void;
}

interface SearchResult {
  id: number;
  type: "project" | "missionary";
  title: string;
  description: string;
  image?: string;
  slug?: string;
}

interface Missionary {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  slug: string;
}

const projects = [
  {
    id: 1,
    slug: "yotor-church-management-system",
    title: "Yotor - Modern Church Management",
    description: "A Secure and Reliable Solution to Manage Your Church",
    image: "/images/projects/yotor.png?height=200&width=300",
  },
  {
    id: 2,
    slug: "my-fellow",
    title: "MY FELLOW",
    description:
      "An online platform designed to help you connect with Christian fellowship on campus.",
    image: "/images/projects/my-fellow.png?height=200&width=300",
  },
  {
    id: 3,
    slug: "melhk-poadcast",
    title: "MELHIK - PODCAST",
    description:
      "A program that helps Christian youth grow holistically, spiritually, emotionally, physically, and socially.",
    image: "/images/projects/melhk.png?height=200&width=300",
  },
  {
    id: 4,
    slug: "gemenaye",
    title: "GEMENAYE",
    description:
      "A platform for sharing testimonies of healing and grace, connecting hurting individuals with support.",
    image: "/images/projects/gemenaye.png?height=200&width=300",
  },
  {
    id: 5,
    slug: "habesha-students",
    title: "HABESHA STUDENTS",
    description:
      "A place where students can find true answers to life's questions and God's truth.",
    image: "/images/projects/habesha-students.png?height=200&width=300",
  },
  {
    id: 6,
    slug: "hulentenawi",
    title: "HULENTENAWI",
    description:
      "A mobile app that allows users to improve themselves and connect with others on the same journey.",
    image: "/images/projects/hulentenawi.png?height=200&width=300",
  },
  {
    id: 7,
    slug: "jesus-film",
    title: "JESUS FILM",
    description:
      "Sharing the Story of Jesus through film, reaching millions with the greatest story ever lived.",
    image: "/images/projects/jesus-film.png?height=200&width=300",
  },
];

const missionaries: Missionary[] = [
  {
    id: 1,
    name: "Senay Kumelachew",
    role: "Digital Missions & Church Tech",
    image: "/images/missionaries/senay.png?height=400&width=400",
    bio: "Passionate about leveraging technology to strengthen churches and spread the gospel across Ethiopia.",
    slug: "senay-kumelachew",
  },
  {
    id: 2,
    name: "Samson Usmael",
    role: "Digital Evangelism & Discipleship",
    image: "/images/missionaries/samson.png?height=400&width=400",
    bio: "Dedicated to reaching the digital generation with the message of Christ through innovative online platforms.",
    slug: "samson-usmael",
  },
  {
    id: 3,
    name: "Cherinet Alemu",
    role: "Digital Missions & Mentorship",
    image: "/images/missionaries/cherinet.png?height=400&width=400",
    bio: "Committed to mentoring young leaders and equipping them for effective digital ministry.",
    slug: "cherinet-alemu",
  },
  {
    id: 4,
    name: "Saron Yohannes",
    role: "Product Leadership & Digital Evangelism",
    image: "/images/missionaries/saron.png?height=400&width=400",
    bio: "Leading innovative digital products that help spread the gospel and disciple believers.",
    slug: "saron-yohannes",
  },
  {
    id: 5,
    name: "Rediet Kefetew",
    role: "Content Creation & Mentorship",
    image: "/images/missionaries/rediet.png?height=400&width=400",
    bio: "Creating impactful content that resonates with young people and helps them grow in their faith.",
    slug: "rediet-kefetew",
  },
  {
    id: 6,
    name: "Denamo Markos",
    role: "Software Development & ML",
    image: "/images/missionaries/denamo.png?height=400&width=400",
    bio: "Developing cutting-edge software solutions to support ministry and outreach efforts.",
    slug: "denamo-markos",
  },
  {
    id: 7,
    name: "Beka Shiferaw",
    role: "Graphic Design & Digital Strategy",
    image: "/images/missionaries/beka.png?height=400&width=400",
    bio: "Creating compelling visual content and strategies to enhance digital ministry impact.",
    slug: "beka-shiferaw",
  },
  {
    id: 8,
    name: "Biniam Kassahun",
    role: "Innovation & Technology",
    image: "/images/missionaries/biniam.png?height=400&width=400",
    bio: "Pioneering innovative technological solutions to advance the kingdom of God in Ethiopia.",
    slug: "biniam-kassahun",
  },
];

export default function HeroSection({ openDonationModal }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const latestScrollY = useRef(0);
  const isTicking = useRef(false);


  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    projects.forEach((project) => {
      if (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      ) {
        results.push({
          id: project.id,
          type: "project",
          title: project.title,
          description: project.description,
          image: project.image,
          slug: project.slug,
        });
      }
    });

    missionaries.forEach((missionary) => {
      if (
        missionary.name.toLowerCase().includes(query) ||
        missionary.role.toLowerCase().includes(query)
      ) {
        results.push({
          id: missionary.id,
          type: "missionary",
          title: missionary.name,
          description: missionary.role,
          image: missionary.image,
          slug: missionary.slug,
        });
      }
    });

    setSearchResults(results);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      latestScrollY.current = window.scrollY;

      if (!isTicking.current) {
        window.requestAnimationFrame(() => {
          if (parallaxRef.current) {
            parallaxRef.current.style.transform = `translate3d(0, ${-latestScrollY.current * 0.3}px, 0)`;
          }
          isTicking.current = false;
        });
        isTicking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleResultClick = (result: SearchResult) => {
    openDonationModal(result.type, result.title, result.description);
  };

  return (
    <section className="relative h-screen w-full text-center flex items-end justify-center pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0 parallax-image overflow-hidden" ref={parallaxRef}>
        <Image
          src="/images/hero.png?height=800&width=1200"
          alt="Ethiopian missionaries helping children in rural communities"
          fill
          className="object-cover"
          priority
        />

        {/* Bottom-up gradient overlay for the text area */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/90 via-white/70 to-transparent z-10" />
      </div>

      {/* Content container */}
      <div
        className={`relative z-20 w-[90%] max-w-2xl p-4 text-black flex flex-col justify-end ${
          isSearching && searchResults.length > 0 ? "min-h-[35rem]" : ""
        }`}
      >
        <div className="relative mb-8">
          <Input
            type="search"
            placeholder="Search for missionaries or projects..."
            className="w-full h-14 pl-12 pr-4 text-lg bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-full shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-500" />

          {/* Search Results Dropdown */}
          {isSearching && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto z-30">
              {searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center p-4 hover:bg-neutral-50 border-b last:border-b-0 text-left"
                >
                  {result.image && (
                    <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                      <Image
                        src={result.image}
                        alt={result.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">
                      {result.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {result.description}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600">
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black drop-shadow-lg tracking-wide leading-relaxed mt-4">
          <span>Every</span>{" "}
          <span className="font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
            DONATION
          </span>{" "}
          <span>EMPOWERS A MISSIONARY TO</span>{" "}
          <span className="font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
            SPREAD HOPE
          </span>{" "}
          <span>AND</span>{" "}
          <span className="font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
            TRANSFORMATION
          </span>
        </h2>
      </div>
    </section>
  );
}
