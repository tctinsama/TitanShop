import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text } from 'react-native';
import axios from 'axios';
import CategoryItem from './CategoryItem';
import { useNavigation } from '@react-navigation/native'; // Nhập useNavigation
import { API_URL } from '@env';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation(); // Sử dụng useNavigation để lấy navigation

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`);

                // Kiểm tra dữ liệu
                if (Array.isArray(response.data)) {
                    // Chỉ lấy những thuộc tính cần thiết
                    const filteredCategories = response.data.map(category => ({
                        id: category.categoryproductid,
                        name: category.categoryname || "No name available",
                        image: category.categoryImage ? `data:image/png;base64,${category.categoryImage}` : 'https://i.imgur.com/1tMFzp8.png', // Hình ảnh mặc định
                    }));
                    setCategories(filteredCategories);
                } else {
                    setError('Dữ liệu không hợp lệ.');
                }
            } catch (error) {
                setError(error.response ? error.response.data : error.message);
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
            {categories.map(category => (
                <CategoryItem 
                    key={category.id} // Đảm bảo rằng mỗi CategoryItem có key duy nhất
                    category={category} // Truyền toàn bộ danh mục
                    navigation={navigation} // Truyền navigation cho CategoryItem
                /> 
            ))}
        </ScrollView>
    );
};

export default CategoryList;
