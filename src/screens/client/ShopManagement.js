//src/screens/client/ShopManagement.js
import React, { useEffect, useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon library
import { useUser } from '../../context/UserContext';
import { API_URL } from '@env';

const ShopManagement = () => {
  const [orderStats, setOrderStats] = useState({
    pendingConfirmation: 0,
    pendingPickup: 0,
    shipping: 0,
    delivered: 0,
  });
  const navigation = useNavigation();
  const { userId } = useUser();
  const [fullname, setFullname] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const name = await AsyncStorage.getItem('fullname');
      setFullname(name || 'Không rõ');
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/shop/orders?userId=${userId}`);
        const data = await response.json();
        setOrderStats({
          pendingConfirmation: data.pendingConfirmation,
          pendingPickup: data.pendingPickup,
          shipping: data.shipping,
          delivered: data.delivered,
        });
      } catch (error) {
        console.error('Error fetching order stats:', error);
      }
    };

    fetchOrderStats();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quản Lý Shop</Text>
      <View style={styles.banner}>
        <Text style={styles.shopName}>{fullname || 'Không rõ'}</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('ShopDetail')}>
          <Icon name="store" size={20} color="#fff" />
          <Text style={styles.shopButtonText}>Xem Shop</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.orderSection}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Icon name="history" size={20} color="#007BFF" />
          <Text style={styles.historyText}>Xem Lịch Sử</Text>
        </TouchableOpacity>

        <View style={styles.orderRow}>
          <OrderCard title="Chờ Xác Nhận" count={orderStats.pendingConfirmation} icon="assignment" color="#FFA726" />
          <OrderCard title="Chờ Lấy Hàng" count={orderStats.pendingPickup} icon="directions-bike" color="#FF7043" />
          <OrderCard title="Đang Giao Hàng" count={orderStats.shipping} icon="local-shipping" color="#29B6F6" />
          <OrderCard title="Giao Thành Công" count={orderStats.delivered} icon="check-circle" color="#66BB6A" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const OrderCard = ({ title, count, icon, color }) => (
  <View style={[styles.orderCard, { backgroundColor: color }]}>
    <Icon name={icon} size={30} color="#fff" />
    <Text style={styles.orderTitle}>{title}</Text>
    <Text style={styles.orderNumber}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 10,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  orderSection: {
    marginTop: 40,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  orderCard: {
    padding: 15,
    width: '22%',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 3,
  },
});

export default ShopManagement;
