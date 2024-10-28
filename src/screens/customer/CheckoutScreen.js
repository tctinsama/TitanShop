// src/screens/customer/CheckoutScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { API_URL } from '@env';



const CheckoutScreen = () => {
    const { userId } = useUser();
    const navigation = useNavigation();
    const route = useRoute();

    // Nhận productIds từ route params
    const { productIds = [], totalAmount, cartItems } = route.params || {};

//    console.log('Route Params:', route.params);
//    console.log('Received productIds:', productIds);

    const [userAddress, setUserAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const shippingFee = 30000;

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${API_URL}/api/user/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setUserAddress(data.address || '');
                setPhoneNumber(data.phonenumber?.toString() || '');
            } else {
                Alert.alert('Lỗi', data.message);
            }
        } catch (error) {
            Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        console.log('Cart Items:', cartItems);

        // Kiểm tra productIds
        if (productIds.length === 0) {
            Alert.alert('Lỗi', 'Không có product ID nào hợp lệ.');
            return; // Ngăn chặn thanh toán nếu không có product ID
        }

        cartItems.forEach(item => {
            console.log('Item:', item);
            if (!item.productid) {
                Alert.alert('Lỗi', `Product ID không hợp lệ cho sản phẩm: ${JSON.stringify(item)}`);
                return;
            }
        });

        try {
            const response = await fetch(`${API_URL}/api/order/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    address: userAddress,
                    phoneNumber,
                    totalPayment: totalAmount + shippingFee,
                    cartItems,
                }),
            });

            const result = await response.json();
            if (result.success) {
                Alert.alert('Thông báo', 'Thanh toán thành công!', [
                    { text: 'OK', onPress: () => navigation.replace('OrderSuccess', { orderCode: result.orderCode }) },
                ]);
            } else {
                Alert.alert('Lỗi', result.message);
            }
        } catch (error) {
            Alert.alert('Lỗi', `Thanh toán thất bại: ${error.message}`);
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <TextInput style={styles.input} value={userAddress} onChangeText={setUserAddress} />
            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="numeric" />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng tiền: {totalAmount} VND</Text>
                <Text style={styles.totalText}>Phí vận chuyển: {shippingFee} VND</Text>
                <Text style={styles.totalText}>
                    Tổng thanh toán: {totalAmount + shippingFee} VND
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handlePayment}>
                <Text style={styles.buttonText}>Xác nhận thanh toán</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 4 },
    totalContainer: { marginVertical: 16 },
    totalText: { fontSize: 18, marginBottom: 8 },
    button: { backgroundColor: '#28a745', padding: 12, borderRadius: 4 },
    buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default CheckoutScreen;
