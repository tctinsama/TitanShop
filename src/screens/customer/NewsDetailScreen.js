import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const NewsScreenDetail = ({ route }) => {
  const { newsLink } = route.params; // Nhận đường dẫn tin tức từ tham số route
  const [newsDetail, setNewsDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API lấy chi tiết tin tức
  const fetchNewsDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/fashion-news/detail?newsLink=${encodeURIComponent(newsLink)}`);
      setNewsDetail(response.data.article); // Giả sử API trả về chi tiết bài viết trong trường 'article'
    } catch (error) {
      console.error('Error fetching news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
  }, [newsLink]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </SafeAreaView>
    );
  }

  if (!newsDetail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorMessage}>Không tìm thấy tin tức này</Text>
        {/* In ra link bài viết */}
        <Text style={styles.newsLink}>Link tới bài viết: {newsLink}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {/* Hiển thị hình ảnh bài viết nếu có */}
        {newsDetail.imageUrl && (
          <Image source={{ uri: newsDetail.imageUrl }} style={styles.newsImage} />
        )}
        {/* Tiêu đề bài viết */}
        <Text style={styles.newsTitle}>{newsDetail.title}</Text>
        {/* Tác giả bài viết */}
        <Text style={styles.newsAuthor}>Tác giả: {newsDetail.author || 'Chưa có thông tin tác giả'}</Text>
        {/* Ngày xuất bản bài viết */}
        <Text style={styles.newsDate}>{newsDetail.date || 'Ngày không xác định'}</Text>
        {/* Nội dung bài viết */}
        <Text style={styles.newsContent}>{newsDetail.fullContent || 'Nội dung chi tiết không có sẵn'}</Text>
        <Text style={styles.newsContent}>{newsDetail.fullContent || 'Nội dung chi tiết không có sẵn'}</Text>
        <Text style={styles.newsContent}>{newsDetail.fullContent || 'Nội dung chi tiết không có sẵn'}</Text>
        <Text style={styles.newsContent}>{newsDetail.fullContent || 'Nội dung chi tiết không có sẵn'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    padding: 15,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FF0000',
  },
  newsLink: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007BFF',
    marginTop: 10,
  },
  newsImage: {
    width: '100%',
    height: 250,
    borderRadius: 5,
    marginBottom: 15,
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newsAuthor: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  newsDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  newsContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default NewsScreenDetail;
