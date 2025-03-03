interface TrendingMovies {
  $id: string;
  searchTerm: string;
  count: number;
  poster: string;
  movie_id: number;
  $updatedAt: string;
  $createdAt: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: never[];
}

export default TrendingMovies;
