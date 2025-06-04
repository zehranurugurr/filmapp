import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Image, ActivityIndicator, Alert } from 'react-native';

const MOCK_MOVIES = [
  { 
    id: 1, 
    title: 'The Dark Knight', 
    genre: 'Action', 
    year: 2008, 
    rating: 9.0,
    description: 'Batman faces the Joker in this epic superhero masterpiece',
    director: 'Christopher Nolan',
    poster: null
  },
  { 
    id: 2, 
    title: 'Inception', 
    genre: 'Sci-Fi', 
    year: 2010, 
    rating: 8.8,
    description: 'A mind-bending thriller about dreams within dreams',
    director: 'Christopher Nolan',
    poster: null
  },
  { 
    id: 3, 
    title: 'Pulp Fiction', 
    genre: 'Drama', 
    year: 1994, 
    rating: 8.9,
    description: 'Interconnected stories of crime and redemption',
    director: 'Quentin Tarantino',
    poster: null
  },
  { 
    id: 4, 
    title: 'The Godfather', 
    genre: 'Drama', 
    year: 1972, 
    rating: 9.2,
    description: 'The epic saga of a powerful crime family',
    director: 'Francis Ford Coppola',
    poster: null
  },
  { 
    id: 5, 
    title: 'Interstellar', 
    genre: 'Sci-Fi', 
    year: 2014, 
    rating: 8.6,
    description: 'A journey through space and time to save humanity',
    director: 'Christopher Nolan',
    poster: null
  },
  { 
    id: 6, 
    title: 'The Avengers', 
    genre: 'Action', 
    year: 2012, 
    rating: 8.0,
    description: 'Superheroes unite to save the world',
    director: 'Joss Whedon',
    poster: null
  },
  { 
    id: 7, 
    title: 'Forrest Gump', 
    genre: 'Drama', 
    year: 1994, 
    rating: 8.8,
    description: 'The extraordinary life of an ordinary man',
    director: 'Robert Zemeckis',
    poster: null
  },
  { 
    id: 8, 
    title: 'The Matrix', 
    genre: 'Sci-Fi', 
    year: 1999, 
    rating: 8.7,
    description: 'Reality is not what it seems in this cyberpunk classic',
    director: 'The Wachowskis',
    poster: null
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [searchResults, setSearchResults] = useState([]);
  const [movies, setMovies] = useState(MOCK_MOVIES);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [isLoadingPosters, setIsLoadingPosters] = useState(false);

  // Generate movie poster using Image Generation API
  const generateMoviePoster = async (movie) => {
    try {
      const posterDescription = `Movie poster for ${movie.title}, ${movie.genre} film from ${movie.year}, directed by ${movie.director}. ${movie.description}. Cinematic, professional movie poster style, dark atmospheric lighting`;
      
      const response = await fetch(`https://api.a0.dev/assets/image?text=${encodeURIComponent(posterDescription)}&aspect=2:3`);
      
      if (response.ok) {
        return response.url;
      }
    } catch (error) {
      console.log('Error generating poster:', error);
    }
    return null;
  };

  // Load posters for all movies
  const loadAllPosters = async () => {
    if (isLoadingPosters) return;
    
    setIsLoadingPosters(true);
    const updatedMovies = await Promise.all(
      movies.map(async (movie) => {
        if (!movie.poster) {
          const posterUrl = await generateMoviePoster(movie);
          return { ...movie, poster: posterUrl };
        }
        return movie;
      })
    );
    
    setMovies(updatedMovies);
    setIsLoadingPosters(false);
  };

  // Get AI movie recommendations based on user query
  const getAIRecommendations = async (query) => {
    if (!query.trim()) return;
    
    setIsLoadingRecommendations(true);
    try {
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a movie recommendation expert. Based on user requests, recommend movies with the following JSON format:
              [
                {
                  "title": "Movie Title",
                  "genre": "Genre",
                  "year": year,
                  "rating": rating,
                  "description": "Brief compelling description",
                  "director": "Director Name",
                  "reason": "Why this matches the user's request"
                }
              ]
              
              Recommend 3-5 movies that best match the user's request. Mix popular and lesser-known gems. Be specific and accurate with movie details.`
            },
            {
              role: 'user',
              content: `I want movie recommendations for: ${query}`
            }
          ]
        })
      });

      const data = await response.json();
      
      try {
        // Extract JSON from the response
        const jsonMatch = data.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0]);
          
          // Generate posters for AI recommendations
          const recommendationsWithPosters = await Promise.all(
            recommendations.map(async (movie, index) => ({
              ...movie,
              id: `ai-${Date.now()}-${index}`,
              poster: await generateMoviePoster(movie)
            }))
          );
          
          setAiRecommendations(recommendationsWithPosters);
          setSearchResults(recommendationsWithPosters);
        } else {
          // Fallback if JSON parsing fails
          setSearchResults([]);
          Alert.alert('Info', 'Try a different search term for better recommendations');
        }
      } catch (parseError) {
        console.log('Parse error:', parseError);
        setSearchResults([]);
        Alert.alert('Info', 'Try a different search term for better recommendations');
      }
      
    } catch (error) {
      console.log('Error getting AI recommendations:', error);
      Alert.alert('Error', 'Unable to get recommendations. Please try again.');
    }
    
    setIsLoadingRecommendations(false);
  };

  const handleSearch = () => {
    console.log('Search triggered with query:', searchQuery);
    
    if (searchQuery.trim() === '') {
      setSearchResults(movies);
      setAiRecommendations([]);
      setCurrentView('search');
      return;
    }

    // First show existing movies that match
    const existingResults = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    console.log('Found existing results:', existingResults.length);
    setSearchResults(existingResults);
    setCurrentView('search');
    
    // Then try to get AI recommendations (but don't block the search)
    if (searchQuery.trim().length > 0) {
      getAIRecommendations(searchQuery).catch(error => {
        console.log('AI recommendations failed, but search still works:', error);
      });
    }
  };

  // Load posters when app starts
  React.useEffect(() => {
    loadAllPosters();
  }, []);

  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  const renderMovieItem = ({ item }) => (
    <View style={styles.movieItem}>
      <View style={styles.moviePosterContainer}>
        {item.poster ? (
          <Image source={{ uri: item.poster }} style={styles.moviePoster} />
        ) : (
          <View style={styles.moviePosterPlaceholder}>
            <Text style={styles.posterPlaceholderText}>🎬</Text>
          </View>
        )}
      </View>
      
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieDetails}>{item.year} • {item.genre} • ⭐ {item.rating}</Text>
        <Text style={styles.movieDescription} numberOfLines={2}>{item.description}</Text>
        {item.reason && (
          <Text style={styles.aiReasonText}>💡 {item.reason}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.favoriteButton, isFavorite(item.id) && styles.favoriteButtonActive]}
        onPress={() => toggleFavorite(item)}
      >
        <Text style={styles.favoriteButtonText}>
          {isFavorite(item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHomeView = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.welcomeText}>Discover Amazing Movies with AI</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tell me what you want to watch... (e.g., 'romantic comedy', 'sci-fi like Blade Runner')"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          multiline={false}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aiHelpSection}>
        <Text style={styles.aiHelpTitle}>✨ Try AI-Powered Search</Text>
        <Text style={styles.aiHelpText}>Ask for movies by mood, theme, or similar films:</Text>
        <View style={styles.aiExamplesContainer}>
          {[
            "funny movies from the 90s",
            "thrillers like Inception", 
            "feel-good romantic films",
            "mind-bending sci-fi"
          ].map((example) => (
            <TouchableOpacity 
              key={example} 
              style={styles.aiExampleButton}
              onPress={() => {
                setSearchQuery(example);
                handleSearch();
              }}
            >
              <Text style={styles.aiExampleText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.genreSection}>
        <Text style={styles.sectionTitle}>Quick Genre Search</Text>
        <View style={styles.genreGrid}>
          {['Action', 'Drama', 'Sci-Fi', 'Comedy'].map((genre) => (
            <TouchableOpacity 
              key={genre} 
              style={styles.genreButton}
              onPress={() => {
                setSearchQuery(genre);
                handleSearch();
              }}
            >
              <Text style={styles.genreButtonText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Featured Movies</Text>
      {isLoadingPosters && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#e50914" />
          <Text style={styles.loadingText}>Loading movie posters...</Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredMovies}>
        {movies.slice(0, 4).map((movie) => (
          <TouchableOpacity key={movie.id} style={styles.featuredMovieCard}>
            <View style={styles.featuredPosterContainer}>
              {movie.poster ? (
                <Image source={{ uri: movie.poster }} style={styles.featuredPoster} />
              ) : (
                <View style={styles.featuredPosterPlaceholder}>
                  <Text style={styles.posterPlaceholderText}>🎬</Text>
                </View>
              )}
            </View>
            <Text style={styles.featuredMovieTitle}>{movie.title}</Text>
            <Text style={styles.featuredMovieInfo}>{movie.year} • ⭐ {movie.rating}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );

  const renderSearchView = () => (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tell me what you want to watch..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>
      
      {isLoadingRecommendations && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e50914" />
          <Text style={styles.loadingText}>Getting AI recommendations...</Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>
        {searchResults.length} Results {searchQuery ? `for "${searchQuery}"` : ''}
      </Text>
      
      {aiRecommendations.length > 0 && (
        <Text style={styles.aiResultsLabel}>🤖 AI Recommendations</Text>
      )}
      
      <FlatList
        data={searchResults}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.moviesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderFavoritesView = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>My Favorites ({favorites.length})</Text>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No favorites yet</Text>
          <Text style={styles.emptyStateSubtext}>Add movies to your favorites to see them here</Text>
          <TouchableOpacity 
            style={styles.discoverButton}
            onPress={() => setCurrentView('home')}
          >
            <Text style={styles.discoverButtonText}>Discover Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.moviesList}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>MOVIEFLIX</Text>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'home' && styles.activeNavButton]}
          onPress={() => setCurrentView('home')}
        >
          <Text style={[styles.navButtonText, currentView === 'home' && styles.activeNavButtonText]}>
            🏠 Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'search' && styles.activeNavButton]}
          onPress={() => setCurrentView('search')}
        >
          <Text style={[styles.navButtonText, currentView === 'search' && styles.activeNavButtonText]}>
            🔍 Search
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'favorites' && styles.activeNavButton]}
          onPress={() => setCurrentView('favorites')}
        >
          <Text style={[styles.navButtonText, currentView === 'favorites' && styles.activeNavButtonText]}>
            ❤️ Favorites ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      {currentView === 'home' && renderHomeView()}
      {currentView === 'search' && renderSearchView()}
      {currentView === 'favorites' && renderFavoritesView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    backgroundColor: '#141414',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e50914',
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#1f1f1f',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#e50914',
  },
  navButtonText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeNavButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  aiHelpSection: {
    marginBottom: 25,
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 15,
  },
  aiHelpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e50914',
    marginBottom: 10,
  },
  aiHelpText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
  },
  aiExamplesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  aiExampleButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  aiExampleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  genreSection: {
    marginBottom: 30,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  genreButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  featuredMovies: {
    marginBottom: 20,
  },
  featuredMovieCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: 160,
  },
  featuredMovieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featuredMovieInfo: {
    color: '#ccc',
    fontSize: 12,
  },
  moviesList: {
    flex: 1,
  },
  movieItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moviePosterContainer: {
    width: 100,
    height: 150,
    marginRight: 15,
  },
  moviePoster: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  moviePosterPlaceholder: {
    width: 100,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterPlaceholderText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  movieDetails: {
    color: '#ccc',
    fontSize: 12,
  },
  movieDescription: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  aiReasonText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
  favoriteButton: {
    padding: 10,
    marginLeft: 10,
  },
  favoriteButtonActive: {
    backgroundColor: '#e50914',
    borderRadius: 20,
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  discoverButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  discoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  aiResultsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e50914',
    marginBottom: 15,
  },
  featuredPosterContainer: {
    width: '100%',
    height: 120,
    marginBottom: 10,
  },
  featuredPoster: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  featuredPosterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#555',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});