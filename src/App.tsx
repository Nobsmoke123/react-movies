import { useState, useEffect } from "react";
import "./App.css";

import Search from "./components/Search.tsx";
import Spinner from "./components/Spinner.tsx";
import MovieCard from "./components/MovieCard.tsx";
import Movie from "./types/movie.interface.ts";

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

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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
    } catch (error) {
      console.log("Error fetching movies: ", error);
      setErrorMessage("Error fetching movies please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
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

          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>
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
