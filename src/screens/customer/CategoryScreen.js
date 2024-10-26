import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import SearchResultProductList from "../../components/SearchResultProductList";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CategoryScreen = () => {
    const { userId } = useUser();
    const route = useRoute();
    const [cartQuantity, setCartQuantity] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();
    const categoryId = route.params?.categoryId; // Nhận categoryId từ params

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

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/products/category/${categoryId}`);
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCartQuantity();
        }
    }, [userId]);

    useEffect(() => {
        if (categoryId) {
            fetchProducts();
        }
    }, [categoryId]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => {/* Handle menu button press here */}}>
                            <MaterialCommunityIcons name="menu" size={30} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('HomeTabs')}>
                            <Image style={styles.headerTitle} source={require("../../../assets/images/logo-removebg-preview.png")} resizeMode={"contain"} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('CartScreen')}>
                            <Image source={require("../../../assets/images/cart.png")} resizeMode={"contain"} style={styles.cartIcon} />
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
                        />
                        <Image source={require("../../../assets/images/search.png")} resizeMode={"contain"} style={styles.searchArrowIcon} />
                    </View>
                    <View style={styles.productSection}>
                        <Text style={styles.title}>{"Products in this category"}</Text>
                        <SearchResultProductList products={products} />
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
    productSection: {
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    menuButton: {
        padding: 10,
    },
});

export default CategoryScreen;
