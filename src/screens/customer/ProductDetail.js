import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';

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
    const [hoveredStar, setHoveredStar] = useState(0); 

    const [refreshComments, setRefreshComments] = useState(false);  // State to refresh comments

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

        if (rating === 0) {
            Alert.alert('Thông báo', 'Vui lòng chọn đánh giá');
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
                    username: fullname,
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

    //Rating
    const handleRating = (star) => {
        setRating(star);
      };
    
      const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <TouchableOpacity
              key={i}
              onPress={() => handleRating(i)} // Cập nhật rating khi chọn sao
              onPressIn={() => setHoveredStar(i)} // Hiển thị sao khi hover
              onPressOut={() => setHoveredStar(0)} // Ẩn sao khi không hover
            >
              <Ionicons
                name={i <= (hoveredStar || rating) ? 'star' : 'star-outline'}
                size={30}
                color={i <= (hoveredStar || rating) ? '#FFD700' : '#ccc'}
              />
            </TouchableOpacity>
          );
        }
        return stars;
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
                    <View style={styles.starsContainer}>
                        {renderStars()}
                    </View>
                    {rating === 0 && <Text style={styles.warningText}>Vui lòng chọn đánh giá</Text>}
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
                                    {comment.userid === userId ? fullname : comment.username}
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


            {/* Shop Info Section */}
            <View style={styles.shopInfoContainer}>
                <TouchableOpacity
                    style={styles.shopCard}
                    onPress={() => {
                        Alert.alert('Thông báo', 'Điều hướng đến trang shop');
                        // Điều hướng đến trang danh sách sản phẩm của shop (cần kết hợp Navigation)
                    }}
                >
                    <Image
                        source={require('../../../assets/images/carousel_1.png')} 
                        style={styles.shopImage}
                        resizeMode="cover"
                    />
                    <View style={styles.shopDetails}>
                        <Text style={styles.shopName}>Shop không xác định</Text>
                        <Text style={styles.shopDescription}>
                            Chưa có thông tin chi tiết về shop này. Nhấn vào để tìm hiểu thêm.
                        </Text>
                    </View>
                </TouchableOpacity>
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
    attributeTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
    optionContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    optionButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 8, marginBottom: 8 },
    optionButtonSelected: { backgroundColor: '#000', borderColor: '#000' },
    optionText: { color: '#333' },
    optionTextSelected: { color: '#fff' },
    addToCartButton: { backgroundColor: '#FF9900', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    addToCartButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    commentsContainer: { marginTop: 20 },
    commentsTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, color: '#333' },
    noCommentsText: { color: '#999', fontStyle: 'italic', marginBottom: 10 },
    commentBox: { marginBottom: 12 },
    commentUser: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
    commentText: { color: '#555' },
    commentInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
    commentButton: { backgroundColor: '#00CC33', padding: 10, borderRadius: 8, alignItems: 'center' },
    commentButtonText: { color: '#fff', fontWeight: '600' },
    shopInfoContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    shopCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    shopImage: {
        width: 80,
        height: 80,
        borderRadius: 40, // Hình tròn
        marginRight: 16,
    },
    shopDetails: {
        flex: 1,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    shopDescription: {
        fontSize: 14,
        color: '#777',
    },

    ratingContainer: {
        marginTop: 20,
        alignItems: 'center',
      },
      ratingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      starsContainer: {
        flexDirection: 'row',
      },
      warningText: {
        color: 'red',
        marginTop: 10,
      },
});

export default ProductDetail;
