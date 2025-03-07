"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetails() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [streamingProviders, setStreamingProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const searchResponse = await fetch(
          `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${slug.replace(/-/g, " ")}`
        );
        if (!searchResponse.ok) throw new Error("Failed to fetch movie");

        const searchData = await searchResponse.json();
        if (!searchData.results.length) {
          setMovie(null);
          setLoading(false);
          return;
        }

        const movieId = searchData.results[0].id;

        const detailsResponse = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`
        );
        if (!detailsResponse.ok) throw new Error("Failed to fetch details");

        const movieData = await detailsResponse.json();
        setMovie(movieData);
        setLoading(false);
        setCast(movieData.credits.cast.slice(0, 5));

        const trailer = movieData.videos.results.find(
          (video: any) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);

        setSimilarMovies(movieData.similar.results.slice(0, 5));

        // Fetch Streaming Providers
        const providerResponse = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
        );
        if (!providerResponse.ok) throw new Error("Failed to fetch streaming providers");

        const providerData = await providerResponse.json();
        const country = "US"; // Change this based on the user's location
        const providers = providerData.results[country]?.flatrate || [];

        console.log("Streaming Providers Data:", providerData);

        setStreamingProviders(providers);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setMovie(null);
        setLoading(false);
      }
    }

    fetchMovie();
  }, [slug]);


  if (loading) return <h1 className="text-center text-white text-2xl mt-10">Loading... ⏳</h1>;
  if (!movie) return <h1 className="text-center text-white text-2xl mt-10">Movie not found! 😢</h1>;

  return (
    <>
      <Nav />
      <div className="relative bg-gray-900 text-white min-h-screen py-10 px-6 md:px-16">
        {/* Backdrop Image */}
        {movie.backdrop_path && (
          <div className="absolute inset-0 w-full h-full opacity-5 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
          />
        )}

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-20 items-start">
          {/* Image Section (1/3 width) */}
          <div className="md:col-span-1 flex justify-end">
            <div className="md:col-span-1 flex flex-col items-center gap-6">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={400}
                height={600}
                className="rounded-lg shadow-lg"
              />

              {/* Streaming Availability Section */}
              <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-center mb-3">Available On</h2>
                {streamingProviders && streamingProviders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
                    {streamingProviders.map((provider: any) => (
                      <div key={provider.provider_id} className="flex flex-col items-center bg-gray-700 p-3 rounded-lg w-40 shadow-md">
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                        <p className="text-sm font-semibold mt-2 text-center">{provider.provider_name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">Not available for streaming.</p>
                )}
              </div>

            </div>


          </div>

          {/* Movie Details (2/3 width) */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-400 text-lg mb-2">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} | 🕒 {movie.runtime} min | 📅 {movie.release_date}
            </p>
            <p className="text-gray-400 mb-4">
              {movie.genres?.map((g: any) => g.name).join(", ") || "No genres"}
            </p>
            <p className="text-lg leading-relaxed">{movie.overview || "No description available."}</p>

            <div className="flex gap-4 mt-6">
              {trailerKey && (
                <button
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank")}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition transform hover:scale-105"
                >
                  🎬 Watch Trailer
                </button>
              )}

              {movie.homepage && (
                <button
                  onClick={() => window.open(movie.homepage, "_blank")}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition transform hover:scale-105"
                >
                  🌍 Official Site
                </button>
              )}

              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition transform hover:scale-105"
              >
                ← Go Back
              </button>
            </div>

            {/* Production Companies */}
            <div className="mt-6 flex flex-wrap gap-4">
              {movie.production_companies.map((company: any) => (
                <div key={company.id} className="flex items-center bg-gray-800 p-2 rounded-lg shadow-md">
                  {company.logo_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  )}
                  <span className="ml-2">{company.name}</span>
                </div>
              ))}
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mt-10">
                <h2 className="text-3xl font-bold mb-4">Main Cast</h2>
                <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                  {cast.map((actor) => (
                    <div key={actor.id} className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-md w-40">
                      <Image
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "/placeholder.jpg"
                        }
                        alt={actor.name}
                        width={120}
                        height={120}
                        className="rounded-full border-2 border-gray-600 shadow-md object-cover w-[100px] h-[100px]"
                      />
                      <p className="text-sm font-semibold mt-2 text-center">{actor.name}</p>
                      <p className="text-xs text-gray-400 text-center">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <div className="mt-10">
                <h2 className="text-3xl font-bold mb-4">Similar Movies</h2>
                <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                  {similarMovies.map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.title.toLowerCase().replace(/\s+/g, "-")}`} passHref>
                      <div className="w-40 cursor-pointer transform hover:scale-105 transition duration-300">
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          width={150}
                          height={225}
                          className="rounded-lg shadow-md"
                        />
                        <p className="text-sm text-center mt-2">{movie.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
