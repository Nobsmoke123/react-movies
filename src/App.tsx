import { useState, useEffect } from "react";
import "./App.css";

import Search from "./components/Search.tsx";
import Spinner from "./components/Spinner.tsx";
import MovieCard from "./components/MovieCard.tsx";
import Movie from "./types/movie.interface.ts";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.ts";
import TrendingMovies from "./types/trendingMovie.interface.ts";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_ACCESS_TOKEN;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList]: [Array<Movie>, (arr: Array<Movie>) => void] =
    useState<Array<Movie>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies]: [
    Array<TrendingMovies>,
    (arr: Array<TrendingMovies>) => void
  ] = useState<Array<TrendingMovies>>([]);

  // Debounces the searchTerm to prevent making too many requests by waiting for the user stop typing for 500 milliseconds.
  // Optimize search solution that improved the performance by debouncing the input field.
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === false) {
        setErrorMessage(data.Error || "Failed to fetch movies.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log("Error fetching movies: ", error);
      setErrorMessage("Error fetching movies please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log("Error fetching trending movies: ", error);
    }
  };

  // Use effect block
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster} alt={movie.searchTerm} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
