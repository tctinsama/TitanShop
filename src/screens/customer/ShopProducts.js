import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import ShopProductItem from '../../components/ShopProductItem'; // Đảm bảo bạn import đúng ShopProductItem
import { API_URL } from '@env';

const ShopProducts = ({ route }) => {
    const { userId } = route.params; // Lấy userId từ params truyền vào
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShopProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/shop/products?userId=${userId}`);
                

                if (Array.isArray(response.data)) {
                    const filteredProducts = response.data.map(product => {
                        let imageUrl = 'https://example.com/default-image.png'; // Default image

                        // Kiểm tra nếu image là URL hợp lệ hoặc Base64
                        if (product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'))) {
                            imageUrl = product.image;
                        } else if (product.image && product.image.startsWith('data:image')) {
                            imageUrl = product.image;
                        }

                        return {
                            id: product.productid,
                            name: product.name || "No name available",
                            productdes: product.productdes || "No description available",
                            image: imageUrl, // Chỉ lấy URL hợp lệ hoặc Base64
                            price: product.price != null ? product.price : 0,
                        };
                    });
                    setProducts(filteredProducts);
                } else {
                    setError('Dữ liệu không hợp lệ.');
                }
            } catch (error) {
                setError(error.response ? error.response.data : error.message);
                console.error('Error fetching shop products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopProducts();
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Render các sản phẩm theo cặp (2 sản phẩm mỗi dòng)
    const rows = [];
    for (let i = 0; i < products.length; i += 2) {
        rows.push(
            <View key={i} style={styles.row}>
                <View style={styles.column}>
                    <ShopProductItem product={products[i]} />
                </View>
                {products[i + 1] && (
                    <View style={styles.column}>
                        <ShopProductItem product={products[i + 1]} />
                    </View>
                )}
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {rows}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    scrollContainer: {
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default ShopProducts;
