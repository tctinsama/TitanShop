// src/screens/client/VoucherManagement.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env'; // Thêm API_URL nếu cần thiết

const VoucherManagement = ({ userId }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        // API lấy vouchers của người dùng
        const response = await axios.get(`${API_URL}/api/shop/vouchers/${userId}`);
        setVouchers(response.data);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchVouchers();
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Đang tải danh sách voucher...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={vouchers}
      keyExtractor={(item) => item.vouchercode.toString()}
      renderItem={({ item }) => (
        <View style={styles.voucherItem}>
          <Text style={styles.voucherCode}>Mã: {item.vouchercode}</Text>
          <Text style={styles.voucherStatus}>
            Trạng thái: {item.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  voucherStatus: {
    fontSize: 14,
    color: '#555',
  },
});

export default VoucherManagement;
