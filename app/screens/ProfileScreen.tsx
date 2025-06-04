import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  // Mock user data - replace with actual user state management
  const userData = {
    name: 'Kullanıcı Adı',
    email: 'kullanici@email.com',
    memberSince: '2024',
    favoriteGenres: ['Aksiyon', 'Sci-Fi', 'Drama'],
    watchedMovies: 42,
    favoriteMovies: 8,
    watchlistCount: 15,
  };

  const profileOptions = [
    {
      title: 'Hesap Ayarları',
      icon: '⚙️',
      onPress: () => console.log('Hesap Ayarları'),
    },
    {
      title: 'Bildirimler',
      icon: '🔔',
      onPress: () => console.log('Bildirimler'),
    },
    {
      title: 'Gizlilik',
      icon: '🔒',
      onPress: () => console.log('Gizlilik'),
    },
    {
      title: 'Yardım & Destek',
      icon: '❓',
      onPress: () => console.log('Yardım & Destek'),
    },
    {
      title: 'Hakkında',
      icon: 'ℹ️',
      onPress: () => console.log('Hakkında'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.memberSince}>Üye olma tarihi: {userData.memberSince}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.watchedMovies}</Text>
              <Text style={styles.statLabel}>İzlenen Film</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.favoriteMovies}</Text>
              <Text style={styles.statLabel}>Favori Film</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.watchlistCount}</Text>
              <Text style={styles.statLabel}>İzleme Listesi</Text>
            </View>
          </View>
        </View>

        {/* Favorite Genres */}
        <View style={styles.genresSection}>
          <Text style={styles.sectionTitle}>Favori Türler</Text>
          <View style={styles.genresContainer}>
            {userData.favoriteGenres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Favorites' as never)}
          >
            <Text style={styles.actionIcon}>♡</Text>
            <Text style={styles.actionText}>Favori Filmlerim</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Search' as never)}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionText}>Film Ara</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          {profileOptions.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.settingItem}
              onPress={option.onPress}
            >
              <Text style={styles.settingIcon}>{option.icon}</Text>
              <Text style={styles.settingText}>{option.title}</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e50914',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  genresSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
  },
  actionsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  actionArrow: {
    fontSize: 20,
    color: '#888',
  },
  settingsSection: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 15,
    width: 25,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  settingArrow: {
    fontSize: 18,
    color: '#888',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});