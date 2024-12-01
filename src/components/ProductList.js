import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import ProductItem from './ProductItem';
import { API_URL } from '@env';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        
        if (Array.isArray(response.data)) {
          const filteredProducts = response.data.map(product => ({
            id: product.productid,
            name: product.name || "No name available",
            productdes: product.productdes || "No description available",
            image: product.image ? `${product.image}` : 'https://i.imgur.com/1tMFzp8.png',
            price: product.price != null ? product.price : 0,
          }));
          setProducts(filteredProducts);
        } else {
          setError('Dữ liệu không hợp lệ.');
        }
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.productGrid}>
        {products.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <ProductItem product={product} style={styles.productItemStyle} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    flexBasis: '48%',
    marginBottom: 15,
  },
  productItemStyle: {
    width: '100%', // This ensures the product item takes full width of the container in vertical layout
  },
});

export default ProductList;
