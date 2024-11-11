// src/screen/customer/PurchaseOrder.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PurchaseOrder = ({ route }) => {
  const [orders, setOrders] = useState([
    // Thêm một số đơn hàng mẫu để hiển thị tạm
    { ordercode: 'DH001', orderdate: '2024-11-10', total: '200,000', address: 'Hà Nội', phonenumber: '0123456789' },
    { ordercode: 'DH002', orderdate: '2024-11-11', total: '500,000', address: 'TP HCM', phonenumber: '0987654321' },
  ]);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const statuses = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang xử lý', value: 'processing' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Sách Đơn Hàng</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusBar}
        contentContainerStyle={styles.statusBarContent}
      >
        {statuses.map((status, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.statusButton,
              selectedStatus === status.value && styles.selectedStatusButton,
            ]}
            onPress={() => setSelectedStatus(status.value)}
          >
            <Text
              style={[
                styles.statusText,
                selectedStatus === status.value && styles.selectedStatusText,
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.orderList}>
        {orders.length === 0 ? (
          <Text style={styles.noOrdersText}>Không có đơn hàng nào.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item, index) => item.ordercode + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text style={styles.orderCode}>Đơn hàng: {item.ordercode}</Text>
                <Text style={styles.orderDate}>Ngày: {item.orderdate}</Text>
                <Text style={styles.orderTotal}>Tổng tiền: {item.total} VND</Text>
                <Text style={styles.orderAddress}>Địa chỉ: {item.address}</Text>
                <Text style={styles.orderPhone}>Số điện thoại: {item.phonenumber}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusBar: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  statusBarContent: {
    alignItems: 'center',
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 15,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedStatusButton: {
    backgroundColor: '#007BFF',
  },
  statusText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  selectedStatusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orderList: {
    flex: 100,
    marginTop: 10,
  },
  orderItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#555',
  },
  orderTotal: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '600',
  },
  orderAddress: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  orderPhone: {
    fontSize: 14,
    color: '#555',
  },
  noOrdersText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default PurchaseOrder;
