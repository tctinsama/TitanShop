//src/screens/customer/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { API_URL } from '@env';
import { Picker } from '@react-native-picker/picker';

const ProductDetail = ({ route }) => {
    const { product } = route.params;
    const { userId } = useUser();

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        // Fetch sizes and colors
        const fetchAttributes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/${product.id}/attributes`);
                const data = await response.json();

                if (data.success) {
                    const uniqueSizes = [...new Set(data.attributes.map(attr => attr.size))];
                    const uniqueColors = [...new Set(data.attributes.map(attr => attr.color))];
                    setSizes(uniqueSizes);
                    setColors(uniqueColors);

                    setSelectedSize(uniqueSizes[0]);
                    setSelectedColor(uniqueColors[0]);
                } else {
                    Alert.alert('Lỗi', data.message || 'Không thể tải thuộc tính sản phẩm');
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể kết nối đến server');
            }
        };

        fetchAttributes();
    }, [product.id]);

    const handleAddToCart = async () => {
        if (!userId) {
            Alert.alert('Thông báo', 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        if (!selectedSize || !selectedColor) {
            Alert.alert('Thông báo', 'Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userId,
                    productid: product.id,
                    quantity: 1, // sửa từ cartquantity
                    size: selectedSize,
                    color: selectedColor,
                    price: product.price, // thêm trường price
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Thông báo', 'Thêm sản phẩm vào giỏ hàng thành công');
            } else {
                
                Alert.alert('Lỗi', data.message || 'Đã xảy ra lỗi khi thêm vào giỏ hàng');
            }
        } catch (error) {
            console.log('Lỗi fetch thuộc tính:', error);
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image 
                source={{ uri: product.image }} 
                style={styles.image} 
                resizeMode="cover"
            />
            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <Text style={styles.productDescription}>{product.productdes}</Text>

                {/* Size Picker */}
                <View style={styles.pickerContainer}>
                    <Text style={styles.infoTitle}>Size:</Text>
                    <Picker
                        selectedValue={selectedSize}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedSize(itemValue)}
                    >
                        {sizes.map((size, index) => (
                            <Picker.Item key={index} label={size} value={size} />
                        ))}
                    </Picker>
                </View>

                {/* Color Picker */}
                <View style={styles.pickerContainer}>
                    <Text style={styles.infoTitle}>Color:</Text>
                    <Picker
                        selectedValue={selectedColor}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedColor(itemValue)}
                    >
                        {colors.map((color, index) => (
                            <Picker.Item key={index} label={color} value={color} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#FFFFFF', padding: 16 },
    image: { width: '100%', height: 300, borderRadius: 8, marginBottom: 16 },
    detailsContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    productName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#333' },
    productPrice: { fontSize: 20, fontWeight: '600', color: '#E91E63', marginBottom: 16 },
    productDescription: { fontSize: 16, color: '#666', lineHeight: 22, marginBottom: 16 },
    pickerContainer: { marginBottom: 8 },
    infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    picker: { height: 50, width: '100%' },
    addToCartButton: { backgroundColor: '#E91E63', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    addToCartButtonText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
});

export default ProductDetail;
