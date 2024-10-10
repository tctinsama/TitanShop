import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Text, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import ProductList from "../../components/ProductList";
import HorizontalProductList from "../../components/HorizontalProductList";
import CategoryList from "../../components/CategoryList";

const HomeScreen = () => {
    const images = [
        require("../../../assets/images/carousel_1.png"),
        require("../../../assets/images/carousel_2.png"),
        require("../../../assets/images/carousel_3.png"),
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const screenWidth = Dimensions.get("window").width;

    // Tự động trượt carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Thời gian trượt mỗi 3 giây

        return () => clearInterval(interval); // Clear interval khi component unmount
    }, []);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: currentIndex * screenWidth, animated: true });
        }
    }, [currentIndex, screenWidth]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    
                    {/* Header logo */}
                    <View style={styles.headerTitleContainer}>
                        <Image
                            style={styles.headerTitle}
                            source={require("../../../assets/images/logo-removebg-preview.png")} 
                            resizeMode={"contain"}
                        />
                    </View>

                    {/* Search bar */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchTextInput}
                            placeholder="Search any Product.."
                            placeholderTextColor="#C3C3C3"
                        />
                        <Image
                            source={require("../../../assets/images/search.png")} 
                            resizeMode={"contain"}
                            style={styles.searchArrowIcon}
                        />
                    </View>

                    {/* Category list */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.CategoryStl}>{"All Category"}</Text>
                        <CategoryList />
                    </View>

                    {/* Carousel images with auto-scroll */}
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

                    {/* Pagination dots */}
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

                    {/* Deal list */}
                    <View style={styles.productSection}>
                        <Text style={styles.Title}>{"Deal of the Day"}</Text>
                        <HorizontalProductList />
                    </View>

                    {/* All product list */}
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
        width: "100%",  // Full width to center the content
        height: 50,
        marginBottom: 0,
        justifyContent: 'center',  // Center content horizontally
        alignItems: "center",  // Center content vertically
    },
    headerTitle: {
        width: 200,
        height: 50,
    },
    
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 9,
        paddingVertical: 10,
        paddingHorizontal: 19,
        marginBottom: 15,
        marginLeft:15,
        shadowColor: "#00000008",
        elevation: 9,
        borderWidth: 2,  // Thicker border
        borderColor: "#000",  // Border color
    },
    searchTextInput: {
        color: "#000000",
        fontSize: 14,
        marginRight: 22,
        flex: 1,  // Stretch input to fill space
    },
    searchArrowIcon: {
        width: 18,
        height: 18,
        marginLeft: 10,
    },
    
    featuredContainer: {
        marginBottom: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 16,
    },
    CategoryStl: {
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: "bold",
    },
    categoryContainer: {
        marginBottom: 20,
    },
    carouselImage: {
        height: 200, // Adjust the height as needed
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
        backgroundColor: '#000', // Active dot color
    },
    dealOfTheDay: {
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 16,
        justifyContent: "space-between",
        flexDirection: "row",
    },
    Title: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 8,
    },
    productSection: {
        marginHorizontal: 16,
    },
    productListContainer: {
        marginBottom: 20,
    },
});

export default HomeScreen;
