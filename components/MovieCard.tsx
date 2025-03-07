"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { MagicCard } from "./magicui/magic-card";

// Function to generate a slug from movie name
const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

interface MovieCardProps {
  title: string;
  imageUrl: string;
  rating: number | null;
  genres: string[];
}

export default function MovieCard({ title, imageUrl, rating, genres }: MovieCardProps) {
  const slug = generateSlug(title); // Convert movie name to a URL-friendly slug

  return (
        <MagicCard gradientOpacity={0.2} gradientColor="#ff1808" className="overflow-hidden shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-0 overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.jpg"}
              alt={title || "Movie Image"}
              width={300}
              height={450}
              className="w-full h-auto rounded-t-lg object-cover"
              priority
            />
            <div className="p-3 sm:p-4 text-white">
              <h3 className="text-sm sm:text-lg font-semibold truncate">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-100">
                ⭐ {rating !== null ? rating.toFixed(1) : "N/A"}
              </p>
              <p className="text-xs sm:text-sm text-gray-100 truncate">{genres.join(", ")}</p>
              <Link href={`/movie/${encodeURIComponent(slug)}`} passHref>
              <Button variant="outline" className="mt-2 w-full text-xs sm:text-sm hover:scale-105 text-neutral-950 transition-transform duration-300 hover:bg-red-500 hover:text-white">
                View Details
              </Button>
              </Link>
            </div>
          </div>
        </MagicCard>
  );
}
