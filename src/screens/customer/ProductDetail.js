import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { API_URL } from '@env';
import { AirbnbRating } from 'react-native-ratings';

const ProductDetail = ({ route }) => {
    const { product } = route.params;
    const { userId, fullname } = useUser();  // Get user details from context

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);

    const [refreshComments, setRefreshComments] = useState(false);  // State to refresh comments

    // Fetch product attributes and comments
    useEffect(() => {
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

        const fetchComments = async () => {
            try {
                const response = await fetch(`${API_URL}/api/comments/${product.id}`);
                const data = await response.json();
                if (data.success) {
                    setComments(data.comments);
                } else {
                    Alert.alert('Thông báo', 'Không có bình luận cho sản phẩm này');
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể kết nối đến server');
            }
        };

        fetchAttributes();
        fetchComments();
    }, [product.id, refreshComments]);  // Reload comments when refreshComments changes

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid: userId,
                    productid: product.id,
                    quantity: 1,
                    size: selectedSize,
                    color: selectedColor,
                    price: product.price,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Thông báo', 'Thêm sản phẩm vào giỏ hàng thành công');
            } else {
                Alert.alert('Lỗi', data.message || 'Đã xảy ra lỗi khi thêm vào giỏ hàng');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập bình luận');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/comments/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productid: product.id,
                    userid: userId,
                    content: newComment,
                    stars: rating,
                    username: fullname,  // Include username instead of fullname
                }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                setNewComment('');  // Reset comment input
                setRating(0);  // Reset rating
                setRefreshComments(prev => !prev);  // Refresh comments
                Alert.alert('Thông báo', 'Bình luận của bạn đã được gửi');
            } else {
                Alert.alert('Lỗi', data.message || 'Không thể gửi bình luận');
            }
        } catch (error) {
            console.error('Lỗi khi gửi bình luận:', error);
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <Text style={styles.productDescription}>{product.productdes}</Text>

                {/* Size Selection */}
                <View style={styles.attributeContainer}>
                    <Text style={styles.attributeTitle}>Size:</Text>
                    <View style={styles.optionContainer}>
                        {sizes.map((size, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.optionButton, selectedSize === size && styles.optionButtonSelected]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text style={[styles.optionText, selectedSize === size && styles.optionTextSelected]}>
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Color Selection */}
                <View style={styles.attributeContainer}>
                    <Text style={styles.attributeTitle}>Color:</Text>
                    <View style={styles.optionContainer}>
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.optionButton, selectedColor === color && styles.optionButtonSelected]}
                                onPress={() => setSelectedColor(color)}
                            >
                                <Text style={[styles.optionText, selectedColor === color && styles.optionTextSelected]}>
                                    {color}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>

                {/* Rating Section */}
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingTitle}>Đánh giá:</Text>
                    <AirbnbRating
                    count={rating || 5}  // Default to 5 if rating is undefined or null
                    defaultRating={rating || 0}  // Default to 0 if rating is undefined or null
                    size={30}  // Size is always 30
                    onFinishRating={setRating}
                    showRating={false}  // Hide the rating text
                    />
                </View>

                {/* Comments Section */}
                <View style={styles.commentsContainer}>
                    <Text style={styles.commentsTitle}>Bình luận:</Text>
                    {comments.length === 0 ? (
                        <Text style={styles.noCommentsText}>Không có bình luận cho sản phẩm này</Text>
                    ) : (
                        comments.map((comment, index) => (
                            <View key={index} style={styles.commentBox}>
                                <Text style={styles.commentUser}>
                                    {comment.userid === userId ? fullname : comment.username} {/* Use username */}
                                </Text> 
                                <Text style={styles.commentText}>{comment.content}</Text>
                            </View>
                        ))
                    )}

                    <TextInput
                        style={styles.commentInput}
                        placeholder="Nhập bình luận..."
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TouchableOpacity style={styles.commentButton} onPress={handleSubmitComment}>
                        <Text style={styles.commentButtonText}>Gửi bình luận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#f8f8f8', padding: 16 },
    image: { width: '100%', height: 300, borderRadius: 8, marginBottom: 16 },
    detailsContainer: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 8 },
    productName: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, color: '#333' },
    productPrice: { fontSize: 22, fontWeight: '600', color: '#000000', marginBottom: 8 },
    productDescription: { fontSize: 16, marginBottom: 16, color: '#555' },
    attributeContainer: { marginBottom: 16 },
    attributeTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    optionContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    optionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    optionButtonSelected: {
        backgroundColor: '#000000',
        borderColor: '#000000',
    },
    optionText: { fontSize: 16, color: '#333' },
    optionTextSelected: {
        color: '#fff',
    },
    addToCartButton: {
        backgroundColor: '#FF9900',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 16,
    },
    addToCartButtonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    ratingContainer: { marginTop: 16, marginBottom: 24 },
    ratingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    commentsContainer: { marginTop: 24 },
    commentsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    noCommentsText: { fontSize: 16, color: '#aaa' },
    commentBox: { marginBottom: 16 },
    commentUser: { fontSize: 14, fontWeight: '600', color: '#333' },
    commentText: { fontSize: 16, color: '#555' },
    commentInput: { padding: 10, borderWidth: 1, borderRadius: 8, borderColor: '#ddd', marginTop: 16 },
    commentButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
    },
    commentButtonText: { fontSize: 16, color: '#fff', textAlign: 'center' },
});

export default ProductDetail;
