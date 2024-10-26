import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CategoryItem = ({ category, navigation }) => {
    return (
        <TouchableOpacity 
            style={styles.categoryItem} 
            onPress={() => navigation.navigate('CategoryScreen', { categoryId: category.id })} // Điều hướng khi nhấn
        >
            <Image
                source={{ uri: category.image }} // Load hình ảnh từ URL
                resizeMode="cover"
                style={styles.categoryImage}
            />
            <Text style={styles.categoryLabel}>{category.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    categoryImage: {
        height: 70,
        width: 70,
        borderRadius: 35, // Hình ảnh tròn
        borderWidth: 2,
        borderColor: '#000000',
        marginBottom: 5,
    },
    categoryLabel: {
        color: "#000000",
        fontSize: 12,
        textAlign: 'center',
    },
});

export default CategoryItem;
