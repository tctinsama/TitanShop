import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';

const CartScreen = () => {
    const { userId } = useUser();
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/cart/${userId}`);
            
            if (!response.ok) {
                throw new Error('Không thể tải giỏ hàng');
            }
            
            const data = await response.json();  // Sử dụng .json() thay vì .text()
            
            if (data && data.cartItems) {
                setCartItems(data.cartItems);
            } else {
                console.error('Lỗi từ server:', data);
                Alert.alert('Lỗi', 'Không có dữ liệu giỏ hàng');
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchCartItems();
            }
        }, [userId])
    );

    const handleUpdateQuantity = async (cartitemid, newQuantity) => {
        if (newQuantity <= 0) {
            Alert.alert('Thông báo', 'Số lượng phải lớn hơn 0');
            return;
        }
    
        console.log('Updating quantity for cart item:', cartitemid, 'to new quantity:', newQuantity);
    
        try {
            const response = await fetch(`${API_URL}/api/cart/update/${cartitemid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartquantity: newQuantity }),
            });
    
            const responseText = await response.text();
    
            console.log('Update API response text:', responseText); // Debugging line
    
            if (responseText.startsWith('<')) {
                console.error('HTML Response:', responseText);
                Alert.alert('Lỗi', 'API trả về dữ liệu không phải JSON (HTML)');
                return;
            }
    
            const data = JSON.parse(responseText);
    
            if (response.ok) {
                fetchCartItems();
            } else {
                console.error('Error response:', data);
                Alert.alert('Lỗi', data.message || 'Không thể cập nhật số lượng sản phẩm');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        }
    };
    

    const handleRemoveItem = async (cartitemid) => {
        try {
            const response = await fetch(`${API_URL}/api/cart/remove/${cartitemid}`, { method: 'DELETE' });

            if (response.ok) {
                Alert.alert('Thông báo', 'Xóa sản phẩm khỏi giỏ hàng thành công');
                fetchCartItems();  // Gọi lại API sau khi xóa
            } else {
                const data = await response.json();
                Alert.alert('Lỗi', data.message || 'Không thể xóa sản phẩm');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
            console.error('Error removing item:', error);
        }
    };

    const getTotalPrice = () => {
        const total = cartItems.reduce((total, item) => {
            const price = parseFloat(item.price);
            const quantity = item.quantity || 0;
            return total + (isNaN(price) ? 0 : price * quantity);
        }, 0);
        return total;
    };

    const renderCartItem = ({ item }) => {
        const imagePrefix = 'data:image/jpeg;base64,';
        const imageSource = { uri: `${imagePrefix}${item.image}` };

        return (
            <View style={styles.cartItem}>
                <Image source={imageSource} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>
                        ${isNaN(item.price) || item.price === undefined ? '0.00' : item.price.toFixed(2)}
                    </Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleUpdateQuantity(item.cartitemid, item.quantity - 1)}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.productQuantity}>{item.quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleUpdateQuantity(item.cartitemid, item.quantity + 1)}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveItem(item.cartitemid)}
                    >
                        <Text style={styles.removeButtonText}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Đang tải giỏ hàng...</Text>
            ) : cartItems.length === 0 ? (
                <Text>Giỏ hàng của bạn hiện tại chưa có sản phẩm nào</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.cartitemid.toString()}
                        contentContainerStyle={styles.cartList}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Tổng tiền: ${getTotalPrice() > 0 ? getTotalPrice().toFixed(2) : '0.00'}</Text>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => {
                                const totalAmount = getTotalPrice();
                                const productIds = cartItems.map(item => item.productid);
                                navigation.navigate('Checkout', { totalAmount, cartItems, productIds });
                            }}
                        >
                            <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
    cartList: { paddingBottom: 100 },
    cartItem: { flexDirection: 'row', backgroundColor: '#F9F9F9', borderRadius: 8, padding: 12, marginBottom: 16, alignItems: 'center' },
    productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
    productDetails: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    productPrice: { fontSize: 14, color: '#E91E63', marginBottom: 4 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: { backgroundColor: '#E0E0E0', padding: 4, borderRadius: 4 },
    quantityButtonText: { fontSize: 16, fontWeight: 'bold' },
    productQuantity: { fontSize: 16, marginHorizontal: 8 },
    removeButton: { backgroundColor: '#FF5252', padding: 8, borderRadius: 4 },
    removeButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    totalContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
    totalText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    checkoutButton: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    checkoutButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 },
});

export default CartScreen;
