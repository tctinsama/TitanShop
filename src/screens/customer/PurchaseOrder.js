//src/screens/customer/PurchaseOrder.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import { useUser } from '../../context/UserContext'; // Import UserContext
import Icon from 'react-native-vector-icons/MaterialIcons';

import { API_URL } from '@env';

const PurchaseOrder = ({ route }) => {
  const { userId } = useUser();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statuses = [
     { label: 'Chờ Xác Nhận', value: 1 },
     { label: 'Chờ Lấy Hàng', value: 2 },
     { label: 'Đang Giao Hàng', value: 3 },
     { label: 'Giao Thành Công', value: 4 },
     { label: 'Đã Hủy', value: 5 },
     { label: 'Trả Hàng', value: 6 },
  ];

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          let url = `${API_URL}/api/users/orders?userId=${userId}`;
          if (selectedStatus !== null) {
            url += `&orderStatusId=${selectedStatus}`; // Thêm tham số lọc
          }
          const response = await fetch(url);
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

      if (userId) {
        fetchOrders();
      }
    }, [userId, selectedStatus]);


   const getImageUrl = (image) => {

     if (!image || typeof image !== 'string') {
       return 'https://cdn.baohatinh.vn/images/39684358df72d8450cb598151e035aa1a46802966dd6797e1b4b2218d7c576faa14d2895bbf52b223fa5e2040f9668c3/106d2143531t9099l9.jpg';
     }

     // Nếu URL là Base64 hoặc hợp lệ
     if (image.startsWith('data:image') || image.startsWith('http')) {
       return image;
     }

     // Nếu URL không hợp lệ, trả về ảnh mặc định
     return 'https://cdn.baohatinh.vn/images/39684358df72d8450cb598151e035aa1a46802966dd6797e1b4b2218d7c576faa14d2895bbf52b223fa5e2040f9668c3/106d2143531t9099l9.jpg';
   };

const filteredOrders = selectedStatus
  ? orders.filter((order) => order.orderstatusid === selectedStatus)
  : orders;





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
            data={filteredOrders}
            keyExtractor={(item, index) => item.ordercode + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <View style={styles.row}>
                  <Image
                    source={{ uri: getImageUrl(item.image) }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.column}>
                    <View style={styles.row}>
                      <Icon name="store" size={16} color="#333" style={styles.icon} />
                      <Text style={styles.username}>{item.username}</Text>
                      <Text style={styles.orderStatus}>{item.orderstatus}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.details}>{item.color}, {item.size}</Text>
                      <Text style={styles.quantity}>x{item.quantity}</Text>
                    </View>
                    <Text style={styles.orderDate}>Ngày: {item.orderdate}</Text>
                  </View>
                </View>
                <Text style={styles.orderTotal}>Tổng tiền: {item.total} VND</Text>
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
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
      },
      column: {
        flex: 1,
        marginLeft: 10,
      },
      icon: {
        marginRight: 5,
      },
      username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
      orderStatus: {
        marginLeft: 'auto',
        fontSize: 14,
        color: '#007BFF',
      },
      details: {
        fontSize: 14,
        color: '#555',
        flex: 1,
      },
      quantity: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
      },
      orderDate: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
      },
      orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2ecc71',
        textAlign: 'right',
        marginTop: 10,
      },
      productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
      },

});

export default PurchaseOrder;
