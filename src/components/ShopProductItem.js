// src/components/ShopProductItem.js
import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ShopProductItem = ({ product }) => {
    const navigation = useNavigation();

    const hasImage = product.image && product.image.length > 0;
    const isUrl = hasImage && (product.image.startsWith('http://') || product.image.startsWith('https://'));
    const isBase64 = hasImage && product.image.startsWith('data:image');

    const imageUrl = hasImage 
        ? (isUrl ? product.image : (isBase64 ? product.image : 'https://example.com/default-image.png'))
        : 'https://example.com/default-image.png';

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('ProductDetail', { product })}
        >
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.productdes}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
        </TouchableOpacity>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        width: screenWidth * 0.4,
        backgroundColor: "#FFFFFF",
        borderRadius: 6,
        padding: 10,
        margin: 5,
        elevation: 3,
    },
    image: {
        borderRadius: 4,
        height: screenWidth * 0.3,
        marginBottom: 10,
    },
    productName: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    productDescription: {
        color: "#000000",
        fontSize: 12,
        marginBottom: 5,
        width: screenWidth * 0.38,
    },
    productPrice: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 3,
    },
});

export default ShopProductItem;
