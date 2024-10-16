import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import ProductItem from './ProductItem';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/products');

        if (Array.isArray(response.data)) {
          const filteredProducts = response.data.map(product => ({
            id: product.productid,
            name: product.name || "No name available",
            productdes: product.productdes || "No description available",
            image: product.image ? `data:image/png;base64,${product.image}` : 'https://i.imgur.com/1tMFzp8.png',
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

  // Chia sản phẩm thành từng hàng với 2 sản phẩm mỗi hàng
  const rows = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push(
      <View key={i} style={styles.row}>
        <View style={styles.column}>
          <ProductItem product={products[i]} />
        </View>
        {products[i + 1] && (
          <View style={styles.column}>
            <ProductItem product={products[i + 1]} />
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {rows}
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Khoảng cách giữa các hàng
  },
  column: {
    flex: 1, // Căn đều các cột
    marginHorizontal: 5, // Khoảng cách giữa các cột
  },
});

export default ProductList;
