//src/screens/client/ShopManagement.js
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../context/UserContext';

const ShopManagement = () => {
  const [orderStats, setOrderStats] = useState({
    pendingConfirmation: 5,
    pendingPickup: 8,
    shipping: 3,
    delivered: 15,
  });

  const navigation = useNavigation();
  const { userId } = useUser(); // Lấy userId từ context
  const [fullname, setFullname] = useState(''); // State để lưu tên shop

  // Lấy fullname từ AsyncStorage
  useEffect(() => {
    const fetchUserInfo = async () => {
      const name = await AsyncStorage.getItem('fullname');
      setFullname(name || 'Không rõ'); // Nếu không có tên thì hiển thị "Không rõ"
    };
    fetchUserInfo();
  }, []);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateToShop = () => {
    navigation.navigate('ShopDetail'); // Điều hướng tới ShopDetail khi ấn vào "Xem Shop"
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút Drawer ở góc trên trái */}
      {/*
      <TouchableOpacity style={styles.drawerButton} onPress={openDrawer}>
        <Ionicons name="menu-outline" size={30} color="#000" />
      </TouchableOpacity>
      */}

      {/* Tiêu đề */}
      <Text style={styles.title}>Quản Lý Shop</Text>
        <View style={styles.banner}>
            <Text style={styles.shopName}>{fullname ? String(fullname) : 'Không rõ'}</Text>
            <TouchableOpacity style={styles.shopButton} onPress={navigateToShop}>
              <Text style={styles.shopButtonText}>Xem Shop</Text>
            </TouchableOpacity>
          </View>
      {/* Nút Xem Lịch Sử */}
      <View style={styles.orderSection}>
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyText}>Xem Lịch Sử</Text>
        </TouchableOpacity>

        {/* Thông tin đơn hàng - hiển thị trên 1 hàng */}
        <View style={styles.orderRow}>
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Chờ Xác Nhận</Text>
            <Text style={styles.orderNumber}>{orderStats.pendingConfirmation}</Text>
          </View>

          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Chờ Lấy Hàng</Text>
            <Text style={styles.orderNumber}>{orderStats.pendingPickup}</Text>
          </View>

          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Đang Giao Hàng</Text>
            <Text style={styles.orderNumber}>{orderStats.shipping}</Text>
          </View>

          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Giao Thành Công</Text>
            <Text style={styles.orderNumber}>{orderStats.delivered}</Text>
          </View>
        </View>
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 10,
  },
  drawerButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  historyButton: {
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'right',
  },
  orderSection: {
    marginTop: 50,
    paddingHorizontal: 10,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 10,
    width: '22%',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#d4edda',
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  shopButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ShopManagement;
