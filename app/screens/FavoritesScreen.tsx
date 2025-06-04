import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Movie {
  id: string;
  title: string;
  genre: string;
  year: string;
  rating: string;
}

export default function FavoritesScreen() {
  const navigation = useNavigation();
  
  // Mock favorite movies data - replace with actual storage/state management
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([
    { id: '1', title: 'Inception', genre: 'Sci-Fi', year: '2010', rating: '8.8' },
    { id: '2', title: 'The Dark Knight', genre: 'Action', year: '2008', rating: '9.0' },
    { id: '4', title: 'La La Land', genre: 'Musical', year: '2016', rating: '8.0' },
  ]);

  const removeFavorite = (movieId: string) => {
    setFavoriteMovies(favoriteMovies.filter(movie => movie.id !== movieId));
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieItem}>
      <TouchableOpacity 
        style={styles.movieInfo}
        onPress={() => navigation.navigate('MovieDetail' as never, { movie: item } as never)}
      >
        <View style={styles.moviePoster}>
          <Text style={styles.posterEmoji}>🎬</Text>
        </View>
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle}>{item.title}</Text>
          <Text style={styles.movieMeta}>{item.genre} • {item.year}</Text>
          <Text style={styles.movieRating}>⭐ {item.rating}/10</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favori Filmlerim</Text>
        <Text style={styles.subtitle}>
          {favoriteMovies.length} film
        </Text>
      </View>

      {favoriteMovies.length > 0 ? (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.id}
          renderItem={renderMovieItem}
          style={styles.moviesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💔</Text>
          <Text style={styles.emptyTitle}>Henüz favori film yok</Text>
          <Text style={styles.emptyText}>
            Film detay sayfalarından beğendiğiniz filmleri favorilere ekleyebilirsiniz.
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Search' as never)}
          >
            <Text style={styles.exploreButtonText}>Film Keşfet</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  moviesList: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  movieInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moviePoster: {
    width: 60,
    height: 90,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  posterEmoji: {
    fontSize: 24,
  },
  movieDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  movieMeta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  movieRating: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e50914',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});