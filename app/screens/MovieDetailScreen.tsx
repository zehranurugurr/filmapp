import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Movie {
  id: string;
  title: string;
  genre: string;
  year: string;
  rating: string;
  description?: string;
  director?: string;
  cast?: string[];
  duration?: string;
}

export default function MovieDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { movie } = route.params as { movie: Movie };

  // Extended movie data with additional details
  const movieDetails = {
    ...movie,
    description: movie.description || "Bu filme ait detaylı açıklama henüz eklenmemiş. Film hakkında daha fazla bilgi için diğer kaynaklara göz atabilirsiniz.",
    director: movie.director || "Christopher Nolan",
    cast: movie.cast || ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    duration: movie.duration || "148 dakika"
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
        </View>

        {/* Movie Poster Placeholder */}
        <View style={styles.posterContainer}>
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterText}>🎬</Text>
            <Text style={styles.posterTitle}>{movieDetails.title}</Text>
          </View>
        </View>

        {/* Movie Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{movieDetails.title}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>
              {movieDetails.year} • {movieDetails.genre} • {movieDetails.duration}
            </Text>
            <Text style={styles.rating}>⭐ {movieDetails.rating}/10</Text>
          </View>

          <Text style={styles.description}>{movieDetails.description}</Text>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Yönetmen</Text>
            <Text style={styles.sectionContent}>{movieDetails.director}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Oyuncular</Text>
            <Text style={styles.sectionContent}>{movieDetails.cast.join(', ')}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.watchButton}>
              <Text style={styles.watchButtonText}>▶ İzle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.favoriteButton}>
              <Text style={styles.favoriteButtonText}>♡ Favorilere Ekle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.watchlistButton}>
              <Text style={styles.watchlistButtonText}>+ İzleme Listesi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  posterContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  posterPlaceholder: {
    width: 200,
    height: 300,
    backgroundColor: '#333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterText: {
    fontSize: 48,
    marginBottom: 10,
  },
  posterTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaText: {
    color: '#888',
    fontSize: 16,
  },
  rating: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 22,
  },
  actionButtons: {
    marginTop: 20,
  },
  watchButton: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  watchlistButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  watchlistButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});