import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';

const ProductItem = ({ product }) => {
    // console.log('Product image data:', product.image);

    // Kiểm tra nếu product.image tồn tại và không rỗng
    const hasImage = product.image && product.image.length > 0;

    // Kiểm tra xem hình ảnh đã có prefix chưa
    const isBase64 = product.image.startsWith('data:image/png;base64,');
    const imageUrl = hasImage && !isBase64 
        ? `data:image/png;base64,${product.image}` 
        : hasImage 
        ? product.image // Nếu đã có prefix, sử dụng trực tiếp
        : 'https://example.com/default-image.png'; // Hình ảnh mặc định nếu không có

    // console.log('Image URL:', imageUrl); // In ra URL hình ảnh để kiểm tra

    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: imageUrl }} 
                style={styles.image} 
                resizeMode="cover" 
            />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.productdes}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
        </View>
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

export default ProductItem;
