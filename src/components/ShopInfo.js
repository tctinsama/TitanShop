import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const ShopInfo = ({ userId }) => {
    const [shopProducts, setShopProducts] = useState([]);
    const [orderStats, setOrderStats] = useState(null);
    const navigation = useNavigation(); // Use navigation hook directly

    // Fetch shop products
    useEffect(() => {
        const fetchShopProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/shop/products?userId=${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setShopProducts(data);
                } else {
                    Alert.alert('Error', data.error || 'Failed to fetch shop products');
                }
            } catch (error) {
                Alert.alert('Error', 'Unable to connect to the server');
            }
        };

        const fetchOrderStats = async () => {
            try {
                const response = await fetch(`${API_URL}/api/shop/orders?userId=${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setOrderStats(data);
                } else {
                    Alert.alert('Error', data.error || 'Failed to fetch order stats');
                }
            } catch (error) {
                Alert.alert('Error', 'Unable to connect to the server');
            }
        };

        fetchShopProducts();
        fetchOrderStats();
    }, [userId]);

    return (
        <View style={styles.shopInfoContainer}>
            <TouchableOpacity
                style={styles.shopCard}
                onPress={() => navigation.navigate('ShopProducts', { userId })}
            >
                <Image
                    source={require('../../assets/images/carousel_1.png')}
                    style={styles.shopImage}
                    resizeMode="cover"
                />
                <View style={styles.shopDetails}>
                    <Text style={styles.shopName}>Your Shop</Text>
                    <Text style={styles.shopDescription}>
                        Products: {shopProducts.length || 0}
                    </Text>
                    {orderStats && (
                        <Text style={styles.shopDescription}>
                            Orders - Pending: {orderStats.pendingConfirmation || 0}, Shipping: {orderStats.shipping || 0}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    shopInfoContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    shopCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    shopImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    shopDetails: {
        flex: 1,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    shopDescription: {
        fontSize: 14,
        color: '#777',
    },
});

export default ShopInfo;
