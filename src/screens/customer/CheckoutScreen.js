// src/screens/customer/CheckoutScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const CheckoutScreen = () => {
    const { userId } = useUser();
    const navigation = useNavigation();
    const route = useRoute();
    const { totalAmount, cartItems } = route.params;
    const [userAddress, setUserAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const shippingFee = 30000;

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            console.log('Fetching user info for userId:', userId);
            const response = await fetch(`http://10.0.2.2:3000/api/user/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setUserAddress(data.address || '');
                setPhoneNumber(data.phonenumber?.toString() || '');
                console.log('User info fetched successfully:', data);
            } else {
                console.warn('Server returned an error:', data.message);
                Alert.alert('Lỗi', `Không thể lấy thông tin người dùng: ${data.message}`);
            }
        } catch (error) {
            console.error('Fetch user info error:', error);
            Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    const validateCartItems = (cartItems) => {
      for (const item of cartItems) {
        if (
          !item.productid ||
          !item.productName ||
          item.productPrice == null ||
          item.cartquantity == null
        ) {
          console.warn('Invalid product in cart:', item);
          return false; // Dừng nếu có lỗi
        }
      }
      return true;
    };
    const confirmPayment = async (cartItems) => {
      if (!validateCartItems(cartItems)) {
        alert('Sản phẩm trong giỏ hàng không hợp lệ.');
        return;
      }

      try {
        const response = await fetch('https://your-backend-api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartItems }),
        });

        const result = await response.json();
        if (result.success) {
          alert('Thanh toán thành công!');
        } else {
          alert('Thanh toán thất bại: ' + result.message);
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        alert('Có lỗi xảy ra khi thanh toán.');
      }
    };

    const handlePayment = async () => {
        try {
            console.log('Processing payment with cart items:', cartItems);

            const invalidItem = cartItems.find(item =>
                !item.productId || !item.size || !item.color || !item.brand || !item.quantity
            );

            if (invalidItem) {
                console.warn('Invalid product in cart:', invalidItem);
                Alert.alert('Lỗi', 'Có sản phẩm không hợp lệ trong giỏ hàng.');
                return;
            }

            const totalPayment = totalAmount + shippingFee;
            console.log('Total payment amount:', totalPayment);

            const response = await fetch('http://10.0.2.2:3000/api/order/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    address: userAddress,
                    phoneNumber,
                    totalPayment,
                    cartItems: cartItems.map(item => ({
                        productId: item.productId,
                        size: item.size || 'default',
                        color: item.color || 'default',
                        brand: item.brand || 'unknown',
                        quantity: item.quantity > 0 ? item.quantity : 1,
                    })),
                }),
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log('Order placed successfully:', responseData);
                Alert.alert('Thành công', 'Đặt hàng thành công!');
                navigation.navigate('OrderSuccess');
            } else {
                console.warn('Order failed with message:', responseData.message);
                Alert.alert('Lỗi', responseData.message);
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thanh Toán</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Địa chỉ giao hàng:</Text>
                <TextInput
                    style={styles.input}
                    value={userAddress}
                    onChangeText={setUserAddress}
                />
                <Text style={styles.label}>Số điện thoại:</Text>
                <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    keyboardType="numeric"
                    onChangeText={setPhoneNumber}
                />
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng tiền: {totalAmount} VND</Text>
                <Text style={styles.totalText}>Phí vận chuyển: {shippingFee} VND</Text>
                <Text style={styles.totalText}>
                    Tổng thanh toán: {totalAmount + shippingFee} VND
                </Text>
            </View>
            <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
                <Text style={styles.paymentButtonText}>Xác Nhận Thanh Toán</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    infoContainer: { marginBottom: 24 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 16 },
    totalContainer: { marginBottom: 24 },
    totalText: { fontSize: 18, marginBottom: 8 },
    paymentButton: { backgroundColor: '#E91E63', padding: 16, borderRadius: 8, alignItems: 'center' },
    paymentButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default CheckoutScreen;
