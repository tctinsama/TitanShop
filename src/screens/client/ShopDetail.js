// src/screens/client/ShopDetail.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShopProductList from '../../components/ShopProductList';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';

const options = [
  { id: '1', title: 'Xem sản phẩm' },
  { id: '2', title: 'Quản lý đơn hàng' },
  { id: '3', title: 'Quản lý voucher' },
  { id: '4', title: 'Quản lý cửa hàng' },
  { id: '5', title: 'Thêm sản phẩm' },
];

const ShopDetail = () => {
  const { userId } = useUser(); // Lấy userId từ UserContext
  const [selectedOption, setSelectedOption] = useState('products');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigation = useNavigation(); // Khai báo useNavigation

  const handleOptionSelect = (option) => {
    if (option === 'Thêm sản phẩm') {
      navigation.navigate('AddProduct'); // Điều hướng đến trang AddProduct
    } else {
      setSelectedOption(option === 'Xem sản phẩm' ? 'products' : option.toLowerCase().replace(' ', ''));
    }
    setIsMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chi Tiết Cửa Hàng</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuVisible(!isMenuVisible)}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isMenuVisible && (
        <View style={styles.menuContainer}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect(item.title)}
              >
                <Text style={styles.optionText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {selectedOption === 'products' && userId && (
          <ShopProductList userId={userId} /> // Truyền userId vào ShopProductList
        )}
        {selectedOption === 'orders' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Quản lý Đơn Hàng (Tính năng sắp ra mắt)</Text>
          </View>
        )}
        {selectedOption === 'vouchers' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Quản lý Voucher (Tính năng sắp ra mắt)</Text>
          </View>
        )}
        {selectedOption === 'shopmanagement' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Quản lý Cửa Hàng (Tính năng sắp ra mắt)</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4a90e2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 8,
  },
  menuContainer: {
    position: 'absolute',
    top: 60, // Có thể điều chỉnh cho phù hợp
    right: 10, // Đặt menu bên phải nút
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
    width: 200, // Kích thước menu
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  placeholder: {
    marginTop: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
});

export default ShopDetail;
