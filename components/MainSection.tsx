"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import MovieCard from "./MovieCard";

interface Movie {
  show: {
    id: number;
    name: string;
    image: { medium: string; original: string } | null;
    rating: { average: number | null } | null;
    genres: string[];
  };
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to fetch top trending movies
  const fetchTopMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.tvmaze.com/shows");
      const data = await response.json();
      setMovies(data.slice(0, 20).map((show: any) => ({ show }))); // Get first 20 movies
    } catch (error) {
      console.error("Error fetching top movies:", error);
      setMovies([]);
    }
    setLoading(false);
  };

  // Fetch top movies on page load
  useEffect(() => {
    fetchTopMovies();
  }, []);

  // Fetch search results from API when user types
  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchQuery.trim()) {
        fetchTopMovies(); // Reload top movies if input is empty
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchQuery}`);
        const data = await response.json();
        setMovies(data);
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
          placeholder="Search TV Shows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md border border-gray-300 bg-white rounded-md shadow-sm p-2"
        />
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {!loading && movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.show.id}
              title={movie.show.name}
              imageUrl={movie.show.image?.medium || "/placeholder.jpg"}
              rating={movie.show.rating?.average || null}
              genres={movie.show.genres}
            />
          ))
        ) : (
          !loading && <p className="text-center col-span-full text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
