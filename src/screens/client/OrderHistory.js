//src/screens/client/OrderHistory.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { useUser } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const orderStatuses = [
  { label: 'Chờ Xác Nhận', value: 1 },
  { label: 'Chờ Lấy Hàng', value: 2 },
  { label: 'Đang Giao Hàng', value: 3 },
  { label: 'Giao Thành Công', value: 4 },
  { label: 'Đã Hủy', value: 5 },
  { label: 'Trả Hàng', value: 6 },
];

const OrderHistory = () => {
  const { userId } = useUser();
  const [selectedStatus, setSelectedStatus] = useState(orderStatuses[0].value);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userId || !selectedStatus) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shop/orders/status`, {
          params: { userId, orderStatusId: selectedStatus },
        });


        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [selectedStatus, userId]);

 // Hàm cập nhật trạng thái đơn hàng từ Chờ Lấy Hàng (2) lên Đang Giao Hàng (3)
  const handlePickupOrder = async (orderCode) => {
    try {
      const response = await axios.put(`${API_URL}/api/shop/orders/confirm`, {
        orderCode,
        newStatus: 3,
      });

      if (response.status === 200) {
        Alert.alert("Thông báo", "Đơn hàng đã chuyển sang trạng thái 'Đang Giao Hàng'!");

        setOrders(orders.map(order =>
          order.ordercode === orderCode ? { ...order, orderstatusid: 3 } : order
        ));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn hàng.");
    }
  };


  // Hàm cập nhật trạng thái đơn hàng
const handleConfirmOrder = async (orderCode) => {
  try {
    // Gửi PUT request để cập nhật trạng thái đơn hàng
    const response = await axios.put(`${API_URL}/api/shop/orders/confirm`, {
      orderCode,
      newStatus: 2,
    });

    if (response.status === 200) {
      Alert.alert("Thông báo", "Đơn hàng đã được xác nhận!");

      // Cập nhật lại danh sách đơn hàng trong state để giao diện cập nhật
      setOrders(orders.map(order =>
        order.ordercode === orderCode ? { ...order, orderstatusid: 2 } : order
      ));
    }
  } catch (error) {
    console.error("Error confirming order:", error);
    Alert.alert("Lỗi", "Không thể xác nhận đơn hàng.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch Sử Đơn Hàng</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusBar}
        contentContainerStyle={styles.statusBarContent}
      >
        {orderStatuses.map((status) => (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.statusButton,
              selectedStatus === status.value && styles.selectedStatusButton
            ]}
            onPress={() => setSelectedStatus(status.value)}
          >
            <Text
              style={[
                styles.statusText,
                selectedStatus === status.value && styles.selectedStatusText
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
            keyExtractor={(item, index) => item.ordercode.toString() + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text style={styles.orderCode}>Đơn hàng: {item.ordercode}</Text>
                <Text style={styles.orderDate}>Ngày: {item.orderdate}</Text>
                <Text style={styles.orderTotal}>Tổng tiền: {item.total} VND</Text>
                <Text style={styles.orderAddress}>Địa chỉ: {item.address}</Text>
                <Text style={styles.orderPhone}>Số điện thoại: {item.phonenumber}</Text>

                   {item.orderstatusid === 2 && (
                     <TouchableOpacity
                       style={styles.confirmButton}
                       onPress={() => handlePickupOrder(item.ordercode)}
                     >
                       <Icon name="check" size={15} color="#fff" style={styles.iconStyle} />
                     </TouchableOpacity>
                   )}

                {item.orderstatusid === 1 && (
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleConfirmOrder(item.ordercode)}
                  >
                    <Icon name="check" size={15} color="#fff" style={styles.iconStyle} />
                  </TouchableOpacity>
                )}
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
    height: 10,
    flexDirection: 'row',
    marginBottom: 0,
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
    flex: 25,
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
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

  confirmButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    borderRadius: 10,
  },
});

export default OrderHistory;
