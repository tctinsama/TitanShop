import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL } from '@env'; // Import biến từ .env

const NewsScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    // Hàm gọi API lấy tin tức
    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/fashion-news`); // Sử dụng biến API_URL
            setNews(response.data.news);
        } catch (error) {
            console.error('Error fetching news:', error);
            Alert.alert('Lỗi', 'Có lỗi khi tải tin tức');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            navigation.navigate('SearchResult', { searchTerm });
        } else {
            Alert.alert('Thông báo', 'Vui lòng nhập từ khóa tìm kiếm.');
        }
    };

    const renderNewsItem = ({ item }) => {
        const imageUrl = item.imageUrl ? item.imageUrl : null;
        
        return (
          <View style={styles.newsItem}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.newsImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDescription}>{item.excerpt}</Text>
            <TouchableOpacity 
              style={styles.readMoreButton} 
              onPress={() => navigation.navigate('NewsScreenDetail', { newsLink: item.link })}
            >
              <Text style={styles.readMoreText}>Đọc thêm</Text>
            </TouchableOpacity>
          </View>
        );
      };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.innerContainer}>
                {/* Header của HomeScreen */}
                <View style={styles.headerTitleContainer}>
                    <Image
                        style={styles.headerLogo}
                        source={require("../../../assets/images/logo-removebg-preview.png")}
                        resizeMode={"contain"}
                    />
                    <Text style={styles.headerTitle}>Fashion News</Text>
                </View>

                {/* Thanh tìm kiếm */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchTextInput}
                        placeholder="Tìm kiếm tin tức..."
                        placeholderTextColor="#C3C3C3"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={handleSearchSubmit}
                    />
                    <TouchableOpacity onPress={handleSearchSubmit}>
                        <MaterialCommunityIcons name="magnify" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Danh sách tin tức */}
                {loading ? (
                    <Text style={styles.loadingText}>Đang tải tin tức...</Text>
                ) : news.length === 0 ? (
                    <Text style={styles.noNewsText}>Không có tin tức nào</Text>
                ) : (
                    <FlatList
                        data={news}
                        keyExtractor={item => item.link}
                        renderItem={renderNewsItem}
                        contentContainerStyle={styles.newsListContainer}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    innerContainer: {
        padding: 20,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLogo: {
        width: 120,
        height: 60,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 20,
        shadowColor: "#00000008",
        elevation: 5,
    },
    searchTextInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    newsListContainer: {
        paddingBottom: 20,
    },
    newsItem: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        elevation: 5,
    },
    newsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    newsDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    readMoreButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginTop: 10,
    },
    readMoreText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    newsImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    noImageContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
    },
    noImageText: {
        color: '#666',
        fontSize: 16,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#007BFF',
    },
    noNewsText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
    },
});

export default NewsScreen;
