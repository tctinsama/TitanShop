//src/screens/customer/CheckoutScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { API_URL } from '@env';

const CheckoutScreen = () => {
    const { userId } = useUser();
    const navigation = useNavigation();
    const route = useRoute();

    const { productIds = [], totalAmount, cartItems } = route.params || {};

    const [userAddress, setUserAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(totalAmount);  // Tổng tiền sau khi giảm giá
    const [isLoading, setIsLoading] = useState(true);
    const shippingFee = 30000;

    useEffect(() => {
//        // Log dữ liệu khi màn hình CheckoutScreen mở ra
//        console.log("Total Amount:", totalAmount);
//        console.log("Cart Items:", cartItems);
        console.log("Product IDs:", productIds);

        // Gọi hàm fetchUserInfo để lấy thông tin người dùng
        fetchUserInfo(productIds);
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

    const applyVoucher = async () => {
        if (!voucherCode) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã voucher');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/voucher/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vouchercode: voucherCode, totalAmount, userId }),
            });

            const result = await response.json();
            if (result.success) {
                setDiscount(result.discount);  // Cập nhật giá trị giảm
                setTotalAfterDiscount(result.totalAfterDiscount);  // Cập nhật tổng tiền sau giảm
                Alert.alert('Thông báo', result.message);
            } else {
                Alert.alert('Lỗi', result.message);
            }
        } catch (error) {
            Alert.alert('Lỗi', `Áp dụng voucher thất bại: ${error.message}`);
        }
    };

    const handlePayment = async () => {
     console.log('productIds:', productIds);
        if (productIds.length === 0) {
            Alert.alert('Lỗi', 'Không có sản phẩm hợp lệ.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/order/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    address: userAddress,
                    phoneNumber,
                    totalPayment: totalAfterDiscount + shippingFee,
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
     // Định dạng tiền VNĐ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };
    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Thông tin giao hàng</Text>
            <Text style={styles.label}>Địa chỉ:</Text>
            <TextInput
                style={styles.input}
                value={userAddress}
                onChangeText={setUserAddress}
                placeholder="Nhập địa chỉ của bạn"
            />
            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
                placeholder="Nhập số điện thoại"
            />
            <Text style={styles.label}>Mã voucher:</Text>
            <TextInput
                style={styles.input}
                value={voucherCode}
                onChangeText={setVoucherCode}
                placeholder="Nhập mã voucher"
            />
            <TouchableOpacity style={styles.button} onPress={applyVoucher}>
                <Text style={styles.buttonText}>Áp dụng voucher</Text>
            </TouchableOpacity>

            <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Tổng tiền: <Text style={styles.amount}>{formatCurrency(totalAmount)}</Text></Text>
                <Text style={styles.totalText}>Giảm giá: <Text style={styles.amount}>-{formatCurrency(discount)}</Text></Text>
                <Text style={styles.totalText}>Phí vận chuyển: <Text style={styles.amount}>{formatCurrency(shippingFee)}</Text></Text>
                <Text style={styles.totalText}>Tổng thanh toán: <Text style={styles.amount}>{formatCurrency(totalAfterDiscount + shippingFee)}</Text></Text>
            </View>

            <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
                <Text style={styles.paymentButtonText}>Xác nhận thanh toán</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    totalContainer: {
        marginVertical: 20,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    totalText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 8,
    },
    amount: {
        fontWeight: 'bold',
        color: '#28a745',
    },
    paymentButton: {
        backgroundColor: '#28a745',
        paddingVertical: 14,
        borderRadius: 8,
        marginBottom: 10,
    },
    paymentButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        paddingVertical: 14,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonText: { color: '#f44336', textAlign: 'center', fontSize: 16 },
});

export default CheckoutScreen;
