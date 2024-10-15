import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ProductDetail = ({ route }) => {
    const { product } = route.params;

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

                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Size:</Text>
                    <Text style={styles.infoValue}>{product.size || 'M'}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Color:</Text>
                    <Text style={styles.infoValue}>{product.color || 'Black'}</Text>
                </View>

                <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    productPrice: {
        fontSize: 20,
        fontWeight: '600',
        color: '#E91E63',
        marginBottom: 16,
    },
    productDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
        marginBottom: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    infoValue: {
        fontSize: 16,
        color: '#666',
    },
    addToCartButton: {
        backgroundColor: '#E91E63',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    addToCartButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default ProductDetail;