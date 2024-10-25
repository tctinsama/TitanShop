// src/screens/customer/CheckoutScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from '../../context/UserContext'; // Dùng UserContext để lấy thông tin người dùng
import { useNavigation, useRoute } from '@react-navigation/native';

const CheckoutScreen = () => {
    const { userId } = useUser();
    const navigation = useNavigation();
    const route = useRoute();
    const { totalAmount } = route.params; // Nhận tổng tiền từ giỏ hàng
    const [userAddress, setUserAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const shippingFee = 30000; // Phí vận chuyển mặc định

 useEffect(() => {
     fetchUserInfo(); // Lấy thông tin user khi màn hình được mở
 }, []);

const fetchUserInfo = async () => {
    try {
        const response = await fetch(`http://10.0.2.2:3000/api/user/${userId}`);
        const data = await response.json();
        if (response.ok) {
            console.log('User data:', data); // Kiểm tra dữ liệu API trả về

            // Lấy địa chỉ từ data.user nếu có
            setUserAddress(data.address || ''); // Chỉnh sửa để lấy địa chỉ từ kết quả trả về
            setPhoneNumber(data.phonenumber?.toString() || ''); // Chỉnh sửa để lấy số điện thoại từ kết quả trả về

            console.log('Address:', data.address); // Hiện thị địa chỉ
            console.log('Phone Number:', data.phonenumber); // Hiện thị số điện thoại
        } else {
            Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng: ' + data.message);
        }
    } catch (error) {
        console.error('Error during fetch:', error); // Log chi tiết lỗi
        Alert.alert('Lỗi', 'Không thể kết nối đến server: ' + error.message);
    } finally {
        setIsLoading(false);
    }
};





    const handlePayment = async () => {
        try {
            const totalPayment = totalAmount + shippingFee; // Tính tổng thanh toán

            const response = await fetch(`http://10.0.2.2:3000/api/order/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    address: userAddress,
                    phoneNumber,
                    totalPayment,
                }),
            });

            if (response.ok) {
                Alert.alert('Thành công', 'Đặt hàng thành công!');
                navigation.navigate('OrderSuccess'); // Điều hướng đến trang thành công
            } else {
                Alert.alert('Lỗi', 'Thanh toán không thành công');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        }
    };

    if (isLoading) {
        return <Text>Đang tải thông tin...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thanh Toán</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Địa chỉ giao hàng:</Text>
                <TextInput
                    style={styles.input}
                    value={userAddress}
                    onChangeText={(text) => {
                        console.log('Address Input Changed:', text);
                        setUserAddress(text);
                    }}
                />
<Text style={styles.label}>Số điện thoại:</Text>
                <TextInput

                    style={styles.input}
                    value={phoneNumber}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        console.log('Phone Input Changed:', text);
                        setPhoneNumber(text);
                    }}
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
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    totalContainer: {
        marginBottom: 24,
    },
    totalText: {
        fontSize: 18,
        marginBottom: 8,
    },
    paymentButton: {
        backgroundColor: '#E91E63',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    paymentButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
