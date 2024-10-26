//src/screens/customer/CartScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../../context/UserContext'; // Import useUser để sử dụng UserContext
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = () => {
    const { userId } = useUser(); // Lấy userId từ UserContext
    const navigation = useNavigation(); // Khởi tạo navigation để sử dụng
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://10.0.2.2:3000/cart/${userId}`);
            const data = await response.json();

            if (response.ok) {
                setCartItems(data.cartItems);
            } else {
                Alert.alert('Lỗi', data.message || 'Không thể tải giỏ hàng');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
            console.error('Error updating quantity:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartid, newQuantity) => {
        if (newQuantity <= 0) {
            Alert.alert('Thông báo', 'Số lượng phải lớn hơn 0');
            return;
        }
    
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/cart/update/${cartid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartquantity: newQuantity }),
            });
    
            if (response.ok) {
                fetchCartItems(); // Tải lại giỏ hàng sau khi cập nhật
            } else {
                const data = await response.json();
                Alert.alert('Lỗi', data.message || 'Không thể cập nhật số lượng sản phẩm');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
            console.error('Error updating quantity:', error);
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image 
                source={{ uri: `data:image/jpeg;base64,${item.productImage}` }} 
                style={styles.productImage} 
                resizeMode="cover" 
            />
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.productPrice}>${item.productPrice}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={styles.quantityButton} 
                        onPress={() => handleUpdateQuantity(item.cartid, item.cartquantity - 1)}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.productQuantity}>{item.cartquantity}</Text>
                    <TouchableOpacity 
                        style={styles.quantityButton} 
                        onPress={() => handleUpdateQuantity(item.cartid, item.cartquantity + 1)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.cartid)}>
                <Text style={styles.removeButtonText}>Xóa</Text>
            </TouchableOpacity>
        </View>
    );

    const handleRemoveItem = async (cartid) => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/cart/remove/${cartid}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Alert.alert('Thông báo', 'Xóa sản phẩm khỏi giỏ hàng thành công');
                fetchCartItems();
            } else {
                const data = await response.json();
                Alert.alert('Lỗi', data.message || 'Không thể xóa sản phẩm');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
            console.error('Error updating quantity:', error);
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.productPrice * item.cartquantity, 0);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Đang tải giỏ hàng...</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.cartid.toString()}
                        contentContainerStyle={styles.cartList}
                    />


                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Tổng tiền: ${getTotalPrice().toFixed(2)}</Text>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => navigation.navigate('Checkout', { totalAmount: getTotalPrice() })}
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
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    cartList: {
        paddingBottom: 100,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: '#E91E63',
        marginBottom: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#E0E0E0',
        padding: 4,
        borderRadius: 4,
    },
    quantityButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productQuantity: {
        fontSize: 16,
        marginHorizontal: 8,
    },
    removeButton: {
        backgroundColor: '#FF5252',
        padding: 8,
        borderRadius: 4,
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    totalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    checkoutButton: {
        backgroundColor: '#E91E63',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default CartScreen;