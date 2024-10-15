//src/screens/customer/CartScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Để lưu và lấy userid
import axios from 'axios';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy thông tin giỏ hàng
const fetchCartItems = async () => {
  try {
    const userid = await AsyncStorage.getItem('userid');
    console.log('UserID:', userid);  // Kiểm tra xem UserID có bị null không

    if (!userid) {
      console.error('UserID không tồn tại hoặc null.');
      return;
    }

    const response = await axios.get(`http://10.0.2.2:3000/cart/${userid}`);

    console.log('Response từ API:', response.data);

    // Kiểm tra phản hồi có thành công không
    if (response?.data?.success) {
      const cartItems = response.data.cartItems;  // Lấy dữ liệu giỏ hàng từ trường cartItems
      console.log('Dữ liệu giỏ hàng:', cartItems);

      if (Array.isArray(cartItems)) {
        setCartItems(cartItems);  // Thiết lập giỏ hàng nếu là mảng
      } else {
        console.error('Dữ liệu giỏ hàng không phải là mảng:', cartItems);
        setCartItems([]);  // Đặt lại cartItems về mảng rỗng
      }
    } else {
      console.error('Dữ liệu giỏ hàng không thành công:', response.data.message);
      setCartItems([]);  // Đặt lại cartItems về mảng rỗng
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
    setCartItems([]);  // Đặt lại cartItems về mảng rỗng trong trường hợp lỗi
  } finally {
    setLoading(false);
  }
};





  useEffect(() => {
    fetchCartItems();
  }, []);

const renderItem = ({ item }) => {
  // Kiểm tra và chuyển đổi dữ liệu hình ảnh sang Base64
  const imageBase64 = item.image.data ? `data:image/png;base64,${item.image.data.toString('base64')}` : null;

  return (
    <View style={styles.itemContainer}>
      {imageBase64 && (
        <Image source={{ uri: imageBase64 }} style={styles.productImage} />
      )}
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text>Giá: {item.price} VND</Text>
        <Text>Số lượng: {item.cartquantity}</Text>
      </View>
    </View>
  );
};



  if (loading) {
    return <ActivityIndicator size="large" color="forestgreen" />;
  }

    if (!Array.isArray(cartItems)) {
      return <Text>Đã xảy ra lỗi khi tải giỏ hàng.</Text>;
    }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Giỏ hàng của bạn đang trống.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cartItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.productid.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  itemContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  productImage: { width: 80, height: 80, marginRight: 15 },
  productName: { fontSize: 18, fontWeight: 'bold' },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
;

export default CartScreen;
