import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import ProductList from "../../components/ProductList";
import HorizontalProductList from "../../components/HorizontalProductList";
import CategoryList from "../../components/CategoryList";
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
    const images = [
        require("../../../assets/images/carousel_1.png"),
        require("../../../assets/images/carousel_2.png"),
        require("../../../assets/images/carousel_3.png"),
    ];
    const { userId } = useUser();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollViewRef = useRef(null);
    const screenWidth = Dimensions.get("window").width;
    const navigation = useNavigation();
  
    const fetchCartQuantity = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/cart/${userId}`);
            const data = await response.json();
            if (response.ok) {
                const totalQuantity = data.cartItems.reduce((sum, item) => sum + item.cartquantity, 0);
                setCartQuantity(totalQuantity);
            }
        } catch (error) {
            console.error('Failed to fetch cart quantity', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCartQuantity();
        }
    }, [userId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: currentIndex * screenWidth, animated: true });
        }
    }, [currentIndex, screenWidth]);

    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchCartQuantity();
            }
        }, [userId])
    );

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            const productName = searchTerm; // or const categoryName = searchTerm;
            navigation.navigate('SearchResult', { searchTerm: productName }); // Ensure searchTerm gets passed correctly
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => {/* Xử lý sự kiện cho nút menu ở đây */}}
                        >
                            <MaterialCommunityIcons name="menu" size={30} color="black" />
                        </TouchableOpacity>
                        <Image
                            style={styles.headerTitle}
                            source={require("../../../assets/images/logo-removebg-preview.png")}
                            resizeMode={"contain"}
                        />
                        <TouchableOpacity
                            style={styles.cartIconContainer}
                            onPress={() => navigation.navigate('CartScreen')}
                        >
                            <Image
                                source={require("../../../assets/images/cart.png")}
                                resizeMode={"contain"}
                                style={styles.cartIcon}
                            />
                            {cartQuantity > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cartQuantity}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchTextInput}
                            placeholder="Search any Product.."
                            placeholderTextColor="#C3C3C3"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            onSubmitEditing={handleSearchSubmit}
                        />
                        <TouchableOpacity onPress={handleSearchSubmit}>
                            <Image
                                source={require("../../../assets/images/search.png")}
                                resizeMode={"contain"}
                                style={styles.searchArrowIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.CategoryStl}>{"All Category"}</Text>
                        <CategoryList />
                    </View>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        ref={scrollViewRef}
                    >
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                source={image}
                                style={[styles.carouselImage, { width: screenWidth }]}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.paginationContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    currentIndex === index ? styles.paginationDotActive : null,
                                ]}
                            />
                        ))}
                    </View>
                    <View style={styles.productSection}>
                        <Text style={styles.Title}>{"Deal of the Day"}</Text>
                        <HorizontalProductList />
                    </View>
                    <View style={styles.productSection}>
                        <Text style={styles.Title}>{"Recommended products"}</Text>
                        <ProductList />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    innerContainer: {
        width: 375,
        alignSelf: "flex-start",
        marginRight: 5,
    },
    headerTitleContainer: {
        marginTop: 53,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    headerTitle: {
        width: 200,
        height: 50,
    },
    cartIconContainer: {
        position: 'relative',
    },
    cartIcon: {
        width: 30,
        height: 30,
    },
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: '#E91E63',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    CategoryStl: {
        color: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 9,
        paddingVertical: 10,
        paddingHorizontal: 19,
        marginBottom: 15,
        marginLeft: 15,
        shadowColor: "#00000008",
        elevation: 9,
        borderWidth: 2,
        borderColor: "#000",
    },
    searchTextInput: {
        color: "#000000",
        fontSize: 14,
        marginRight: 22,
        flex: 1,
    },
    searchArrowIcon: {
        width: 18,
        height: 18,
        marginLeft: 10,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    carouselImage: {
        height: 200,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C3C3C3',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#000',
    },
    productSection: {
        marginHorizontal: 16,
    },
    Title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    menuButton: {
        padding: 10,
    },
});

export default HomeScreen;
