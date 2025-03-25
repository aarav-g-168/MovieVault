"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MainSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Fetch trending movies from TMDb
  const fetchTrendingMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
      console.log(TMDB_API_KEY)
      const data = await response.json();
      setMovies(data.results.slice(0, 20)); // Get first 20 movies
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setMovies([]);
    }
    setLoading(false);
  };

  // Fetch trending movies on page load
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // Fetch search results from TMDb API when user types
  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchQuery.trim()) {
        fetchTrendingMovies(); // Reload trending movies if input is empty
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}`);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error searching movies:", error);
        setMovies([]);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 500); // Debounce API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <Input
          type="text"
          placeholder="Search Movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md border border-gray-300 bg-white rounded-md shadow-sm p-4"
        />
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {!loading && movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              imageUrl={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "/placeholder.jpg"}
              rating={movie.vote_average || null}
              genres={[]} // TMDb requires extra API calls for genre names
            />
          ))
        ) : (
          !loading && <p className="text-center col-span-full text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
