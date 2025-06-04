import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Movie {
  id: string;
  title: string;
  genre: string;
  year: string;
  rating: string;
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated movie data - replace with actual API call
  const mockMovies: Movie[] = [
    { id: '1', title: 'Inception', genre: 'Sci-Fi', year: '2010', rating: '8.8' },
    { id: '2', title: 'The Dark Knight', genre: 'Action', year: '2008', rating: '9.0' },
    { id: '3', title: 'Interstellar', genre: 'Sci-Fi', year: '2014', rating: '8.6' },
    { id: '4', title: 'La La Land', genre: 'Musical', year: '2016', rating: '8.0' },
    { id: '5', title: 'Pulp Fiction', genre: 'Crime', year: '1994', rating: '8.9' },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = mockMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieItem}
      onPress={() => navigation.navigate('MovieDetail' as never, { movie: item } as never)}
    >
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieDetails}>{item.genre} • {item.year} • ⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Film Ara</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Film adı veya tür girin..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          disabled={isSearching}
        >
          <Text style={styles.searchButtonText}>
            {isSearching ? 'Aranıyor...' : 'Ara'}
          </Text>
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderMovieItem}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {searchResults.length === 0 && searchQuery.length > 0 && !isSearching && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>Sonuç bulunamadı</Text>
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
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  movieItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  movieDetails: {
    fontSize: 14,
    color: '#888',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#888',
  },
});