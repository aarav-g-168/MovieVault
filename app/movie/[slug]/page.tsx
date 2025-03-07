"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/Navbar";
import Image from "next/image";

const API_SEARCH_URL = "https://api.tvmaze.com/search/shows?q=";

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function fetchMovieBySlug(slug: string) {
  try {
    const response = await fetch(`${API_SEARCH_URL}${slug.replace(/-/g, " ")}`);
    if (!response.ok) return null;

    const searchResults = await response.json();
    if (!searchResults.length) return null;

    const matchedMovie = searchResults.find(
      (result: any) => generateSlug(result.show.name) === slug
    );

    return matchedMovie?.show || null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export default function MovieDetails() {
  const params = useParams();
  const slug = params.slug as string;
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    fetchMovieBySlug(slug).then(setMovie);
  }, [slug]);

  if (!movie) return <h1 className="text-center text-white text-2xl">Movie not found! 😢</h1>;

  return (
    <>
      <Nav />
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="max-w-4xl w-full p-6 bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Image
              src={movie.image?.original || "/placeholder.jpg"}
              alt={movie.name}
              width={500}
              height={750}
              className="rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold mb-4">{movie.name}</h1>
              <p className="text-gray-400 mb-2">
                ⭐ {movie.rating?.average ? movie.rating.average.toFixed(1) : "N/A"}
              </p>
              <p className="text-gray-400">{movie.genres?.join(", ") || "No genres"}</p>
              <p className="mt-4 text-lg">
                {movie.summary
                  ? movie.summary.replace(/<\/?[^>]+(>|$)/g, "")
                  : "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
