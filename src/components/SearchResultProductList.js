import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProductItem from './ProductItem';

const SearchResultProductList = ({ products }) => {

    if (!products || products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found for your search.</Text>
            </View>
        );
    }

    // Chuyển đổi dữ liệu sản phẩm để tạo thuộc tính cho hình ảnh với logic kiểm tra URL hoặc Base64
    const formattedProducts = products.map(product => {
        const hasImage = product.image && product.image.length > 0;
        const isUrl = hasImage && (product.image.startsWith('http://') || product.image.startsWith('https://'));
        const isBase64 = hasImage && product.image.startsWith('data:image');
    
        const imageUrl = hasImage 
            ? (isUrl ? product.image : (isBase64 ? product.image : `data:image/png;base64,${product.image}`))
            : 'https://i.imgur.com/1tMFzp8.png'; // Hình ảnh mặc định nếu không có
    
        return {
            id: product.productid,
            name: product.name || "No name available",
            productdes: product.productdes || "No description available",
            image: imageUrl,
            price: product.price != null ? product.price : 0,
        };
    });
    

    const rows = [];
    for (let i = 0; i < formattedProducts.length; i += 2) {
        rows.push(
            <View key={i} style={styles.row}>
                <View style={styles.column}>
                    <ProductItem product={formattedProducts[i]} />
                </View>
                {formattedProducts[i + 1] && (
                    <View style={styles.column}>
                        <ProductItem product={formattedProducts[i + 1]} />
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
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

export default SearchResultProductList;
