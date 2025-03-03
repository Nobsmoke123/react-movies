import { Client, Databases, ID, Query } from "appwrite";
import Movie from "./types/movie.interface";
import TrendingMovies from "./types/trendingMovie.interface";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (
  searchTerm: string,
  movie: Movie
): Promise<void> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingMovies = async (): Promise<Array<TrendingMovies>> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    const trendingMovies = result.documents.map((document) => ({
      $id: document.$id,
      searchTerm: document.searchTerm,
      count: document.count,
      poster: document.poster,
      movie_id: document.movie_id,
      $updatedAt: document.$updatedAt,
      $createdAt: document.$createdAt,
      $collectionId: document.$collectionId,
      $databaseId: document.$databaseId,
      $permissions: [],
    }));

    return trendingMovies;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
