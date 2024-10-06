import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
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
        
        // Kiểm tra dữ liệu
        if (Array.isArray(response.data)) {
          // Chỉ lấy những thuộc tính cần thiết
          const filteredProducts = response.data.map(product => ({
            id: product.productid,
            name: product.name || "No name available",
            productdes: product.productdes || "No description available",
            image: product.image ? `data:image/png;base64,${product.image}` : 'https://i.imgur.com/1tMFzp8.png', // Hình ảnh mặc định
            price: product.price != null ? product.price : 0, // Giá mặc định
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductItem 
          product={item} // Truyền toàn bộ sản phẩm
        /> 
      )}
      keyExtractor={item => item.id.toString()}
      horizontal
    />
  );
};

export default ProductList;
