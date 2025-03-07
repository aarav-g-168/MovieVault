import { notFound } from "next/navigation";
import Nav from "@/components/Navbar";

interface MovieDetailsProps {
  params: { slug: string };
}

const API_SEARCH_URL = "https://api.tvmaze.com/search/shows?q=";

// Function to generate a URL-friendly slug from the movie title
const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function fetchMovieBySlug(slug: string) {
  try {
    // Fetch movie data using TVMaze's search API
    const response = await fetch(`${API_SEARCH_URL}${slug.replace(/-/g, " ")}`);
    if (!response.ok) return null;

    const searchResults = await response.json();
    if (!searchResults.length) return null;

    // Find the exact movie by matching its slug
    const matchedMovie = searchResults.find(
      (result: any) => generateSlug(result.show.name) === slug
    );

    return matchedMovie?.show || null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export default async function MovieDetails({ params }: MovieDetailsProps) {
  const movie = await fetchMovieBySlug(params.slug);

  if (!movie) return notFound(); // Show 404 if movie is not found

  return (
    <>
    <Nav/>
    <div className="container mx-auto h-fit px-4 py-8 overflow-hidden text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Movie Image */}
        <img
          src={movie.image?.original || "/placeholder.jpg"}
          alt={movie.name}
          className="h-min rounded-lg shadow-md"
        />

        {/* Movie Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{movie.name}</h1>
          <p className="text-gray-500 mb-2">
            ⭐ {movie.rating?.average ? movie.rating.average.toFixed(1) : "N/A"}
          </p>
          <p className="text-gray-500">{movie.genres?.join(", ") || "No genres"}</p>
          <p className="mt-4 text-lg">
            {movie.summary ? movie.summary.replace(/<\/?[^>]+(>|$)/g, "") : "No description available."}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
