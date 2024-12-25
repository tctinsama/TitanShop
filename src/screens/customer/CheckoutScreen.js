import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext'; // Import context để lấy thông tin người dùng
import { API_URL } from '@env';

const CheckoutScreen = () => {
    const { userId, userAddress, phoneNumber, fullName } = useUser(); // Get user info from context
    const navigation = useNavigation();
    const route = useRoute();

    const [address, setAddress] = useState(userAddress || '');
    const [phone, setPhone] = useState(phoneNumber || '');
    const [name, setName] = useState(fullName || '');
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const shippingFee = 30000;

    const { cartItems = [], totalAmount } = route.params || {};

    // Kiểm tra giỏ hàng
    const productIds = cartItems.map(item => item.productid);

    useEffect(() => {
        if (productIds.length === 0 || cartItems.length === 0) {
            Alert.alert('Lỗi', 'Không có sản phẩm trong giỏ hàng.');
        }
    }, [cartItems]);

    // Áp dụng mã voucher
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
                setDiscount(result.discount);
                setTotalAfterDiscount(result.totalAfterDiscount);
                Alert.alert('Thông báo', result.message);
            } else {
                Alert.alert('Lỗi', result.message);
            }
        } catch (error) {
            Alert.alert('Lỗi', `Áp dụng voucher thất bại: ${error.message}`);
        }
    };

    // Thanh toán và làm trống giỏ hàng
    const handlePayment = async () => {
        if (productIds.length === 0) {
            Alert.alert('Lỗi', 'Không có sản phẩm hợp lệ.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/order/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    name,
                    address,
                    phoneNumber: phone,
                    totalPayment: totalAfterDiscount + shippingFee,
                    cartItems,
                }),
            });

            const result = await response.json();
            if (result.success) {
                await clearCart(); // Xóa giỏ hàng sau khi thanh toán thành công

                Alert.alert('Thông báo', 'Thanh toán thành công!', [
                    { text: 'OK', onPress: () => navigation.replace('OrderSuccess', { orderCode: result.orderCode }) },
                ]);
            } else {
                Alert.alert('Lỗi', result.message);
            }
        } catch (error) {
            Alert.alert('Lỗi', `Thanh toán thất bại: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm làm trống giỏ hàng
    const clearCart = async () => {
        try {
            const response = await fetch(`${API_URL}/api/cart/clear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const result = await response.json();
            if (result.success) {
                console.log('Giỏ hàng đã được làm trống');
            } else {
                Alert.alert('Lỗi', 'Không thể làm trống giỏ hàng');
            }
        } catch (error) {
            Alert.alert('Lỗi', `Lỗi khi làm trống giỏ hàng: ${error.message}`);
        }
    };

    // Định dạng tiền
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
            <Text style={styles.label}>Họ và tên:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
            />
            <Text style={styles.label}>Địa chỉ:</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Nhập địa chỉ của bạn"
            />
            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
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
                <Text style={styles.totalText}>
                    Tổng thanh toán:
                    <Text style={styles.amount}>
                        {formatCurrency(
                            (discount > 0 ? totalAfterDiscount : totalAmount) + shippingFee
                        )}
                    </Text>
                </Text>
            </View>

            <TouchableOpacity style={styles.buttoncheckout} onPress={handlePayment}>
                <Text style={styles.buttonText}>Thanh toán</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#ff6347',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttoncheckout: {
        backgroundColor: '#11d157',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
    },
    totalContainer: {
        marginVertical: 20,
    },
    totalText: {
        fontSize: 16,
        marginVertical: 5,
    },
    amount: {
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
