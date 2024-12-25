import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductItem = ({ product, style }) => {
    const navigation = useNavigation();

    const hasImage = product.image && product.image.length > 0;
    const isUrl = hasImage && (product.image.startsWith('http://') || product.image.startsWith('https://'));
    const isBase64 = hasImage && product.image.startsWith('data:image');

    const imageUrl = hasImage 
        ? (isUrl ? product.image : (isBase64 ? product.image : 'https://example.com/default-image.png'))
        : 'https://example.com/default-image.png';

    return (
        <TouchableOpacity
            style={[styles.container, style]} // Apply additional style from parent component
            onPress={() => navigation.navigate('ProductDetail', { product })}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.productPrice}>đ{product.price.toLocaleString('vi-VN')}</Text>
        </TouchableOpacity>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    imageWrapper: {
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 8,
    },
    image: {
        height: screenWidth * 0.4,
        width: "100%",
    },
    productName: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 5,
        textAlign: "left",
    },
    productPrice: {
        color: "#FF5722",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "left",
    },
});

export default ProductItem;