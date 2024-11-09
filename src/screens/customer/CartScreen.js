// src/screens/customer/CartScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../../context/UserContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';



const CartScreen = () => {
    const { userId } = useUser();
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);


    // Fetch cart items from API
    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/cart/${userId}`);
            if (!response.ok) throw new Error('Cannot load cart items');

            const data = await response.json();
            if (data?.cartItems) {
                setCartItems(data.cartItems);
            } else {
                Alert.alert('Error', 'Cart is empty');
            }
        } catch (error) {
            Alert.alert('Error', 'Cannot connect to server');
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchCartItems();
    }, [userId]);

    useFocusEffect(
        React.useCallback(() => {
            if (userId) fetchCartItems();
        }, [userId])
    );

    // Group cart items by shop
    const groupByShop = (cartItems) => {
        return cartItems.reduce((acc, item) => {
            const shopId = item.userid;
            if (!acc[shopId]) acc[shopId] = { shopName: item.shopName, items: [] };
            acc[shopId].items.push(item);
            return acc;
        }, {});
    };

    // Handle quantity update
    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
            Alert.alert('Notice', 'Quantity must be greater than 0');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/cart/update/${cartItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartquantity: newQuantity }),
            });
            if (!response.ok) throw new Error('Failed to update quantity');
            fetchCartItems();
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
            console.error('Error updating quantity:', error);
        }
    };

    // Handle removing an item
    const handleRemoveItem = async (cartItemId) => {
        try {
            const response = await fetch(`${API_URL}/api/cart/remove/${cartItemId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to remove item');
            Alert.alert('Success', 'Đơn hàng đã xóa');
            fetchCartItems();
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
            console.error('Error removing item:', error);
        }
    };

    // Calculate total price of the cart
    const getTotalPrice = () => {
        const total = cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
        return total; // Trả về số (số tiền gốc)
    };

    // Định dạng số tiền thành tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Render items for each shop
   const renderShopItems = ({ shopName, items }) => (
       <View style={styles.shopContainer}>
           {/* Tên shop và icon */}
           <View style={styles.shopNameContainer}>
               <Icon name="store" size={24} color="#4CAF50" style={styles.shopNameIcon} />
               <Text style={styles.shopName}>{shopName}</Text>
           </View>

           {/* Hiển thị các sản phẩm trong shop */}
           {items.map((item) => (
               <View key={item.cartitemid} style={styles.cartItem}>
                   {/* Hình ảnh sản phẩm */}
                   <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.productImage} />

                   {/* Chi tiết sản phẩm */}
                   <View style={styles.productDetails}>
                       <Text style={styles.productName}>{item.name}</Text>
                       <Text style={styles.productPrice}>${(item.price || 0).toFixed(2)}</Text>

                       {/* Thuộc tính của sản phẩm */}
                       <View style={styles.cartItemAttributes}>
                           <Text style={styles.cartItemAttributesText}>{item.color}, {item.size}</Text>
                       </View>

                       {/* Cập nhật số lượng */}
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

                       {/* Xóa sản phẩm khỏi giỏ */}
                       <TouchableOpacity
                           style={styles.removeIconButton}
                           onPress={() => handleRemoveItem(item.cartitemid)}
                       >
                           <Icon name="delete" size={24} color="#FF5252" />
                       </TouchableOpacity>
                   </View>
               </View>
           ))}
       </View>
   );

    const groupedCartItems = groupByShop(cartItems);


    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
            ) : cartItems.length === 0 ? (
                <Text style={styles.emptyCartText}>Your cart is currently empty</Text>
            ) : (
                <>
                    <FlatList
                        data={Object.values(groupedCartItems)}
                        renderItem={({ item }) => renderShopItems(item)}
                        keyExtractor={(item) => item.items[0]?.cartitemid?.toString() || Math.random().toString()}
                        contentContainerStyle={styles.cartList}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Tiền sản phẩm: {formatCurrency(getTotalPrice())}</Text>

                        {/* Nút thanh toán */}
                        <TouchableOpacity
                            style={styles.checkoutButton}

                            onPress={() => navigation.navigate('Checkout', { totalAmount: getTotalPrice(), cartItems })}>
                            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F0F0', padding: 16 },
    shopContainer: { marginBottom: 16 },
    shopName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
    loadingIndicator: { flex: 1, justifyContent: 'center' },
    cartList: { paddingBottom: 100 },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },

     shopNameContainer: {
         flexDirection: 'row',
         alignItems: 'center',
         backgroundColor: '#E8F5E9',  // Màu nền nhẹ nhàng cho tên shop
         padding: 8,
         borderRadius: 8,
         marginBottom: 0, // Tạo khoảng cách với các phần tử khác
     },
     shopNameIcon: {
         marginRight: 8,
     },
     shopName: {
         fontSize: 18,
         fontWeight: 'bold',
         color: '#333',
         marginBottom: 8,
     },
    productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
    productDetails: { flex: 1, justifyContent: 'space-between' },
    productName: { fontSize: 16, fontWeight: '600', color: '#333' },
    productPrice: { fontSize: 14, color: '#E91E63', fontWeight: '500' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    quantityButton: { backgroundColor: '#E0E0E0', padding: 4, borderRadius: 4 },
    quantityButtonText: { fontSize: 16, fontWeight: 'bold' },
    productQuantity: { fontSize: 16, marginHorizontal: 8, color: '#333' },
    removeIconButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    totalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    cartItemAttributes: {
        marginTop: 4,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    cartItemAttributesText: {
        fontSize: 12,
        color: '#333',
    },
    totalText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
    checkoutButton: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    checkoutButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    emptyCartText: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 20 },
});

export default CartScreen;
