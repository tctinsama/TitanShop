//src/screens/customer/HomeScreen.js
import * as React from 'react';
import { SafeAreaView, View, ScrollView, Text, Image, ImageBackground, StyleSheet } from "react-native";
import ProductList from "../../components/ProductList";
import { NavigationContainer } from '@react-navigation/native';


const HomeScreen = (props) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.headerContainer}>
					<View style={styles.headerRow}>
					<Image
						style={styles.headerTitle}
						source={require("../../../assets/images/logo.jpg")} // Sử dụng require để truy cập file cục bộ
						resizeMode={"contain"}
					/>
				</View>

                        <View style={styles.searchContainer}>
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                resizeMode={"stretch"}
                                style={styles.searchIcon}
                            />
                            <Text style={styles.searchText}>{"Search any Product.."}</Text>
                            <View style={styles.flexStretch} />
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                resizeMode={"stretch"}
                                style={styles.searchArrowIcon}
                            />
                        </View>
                        <View style={styles.featuredContainer}>
                            <Text style={styles.featuredTitle}>{"All Featured"}</Text>
                            <View style={styles.sortButton}>
                                <Text style={styles.sortText}>{"Sort"}</Text>
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.sortIcon}
                                />
                            </View>
                            <View style={styles.filterButton}>
                                <Text style={styles.filterText}>{"Filter"}</Text>
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.filterIcon}
                                />
                            </View>
                        </View>
                        <View style={styles.categoryContainer}>
                            <View style={styles.categoryImagesRow}>
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.categoryImage}
                                />
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.categoryImage}
                                />
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.categoryImage}
                                />
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.categoryImage}
                                />
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.categoryImage}
                                />
                            </View>
                            {['Beauty', 'Fashion', 'Kids', 'Mens', 'Womens'].map((item, index) => (
                                <Text 
                                    key={index} 
                                    style={[styles.categoryLabel, { left: 17 + index * 70 }]}>
                                    {item}
                                </Text>
                            ))}
                        </View>
                        <ImageBackground 
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                            resizeMode={'stretch'}
                            imageStyle={{ borderRadius: 12 }}
                            style={styles.imageBackground}
                        >
                            <Text style={styles.discountText}>{"50-40% OFF"}</Text>
                            <Text style={styles.nowInText}>{"Now in (product)"}</Text>
                            <Text style={styles.allColorsText}>{"All colours"}</Text>
                            <View style={styles.shopNowButton}>
                                <Text style={styles.shopNowText}>{"Shop Now"}</Text>
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.shopNowIcon}
                                />
                            </View>
                        </ImageBackground>
                        <View style={styles.paginationContainer}>
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                resizeMode={"stretch"}
                                style={styles.paginationIcon}
                            />
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                resizeMode={"stretch"}
                                style={styles.paginationIcon}
                            />
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                resizeMode={"stretch"}
                                style={styles.paginationIcon}
                            />
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                resizeMode={"stretch"}
                                style={styles.paginationIcon}
                            />
                        </View>
                        <View style={styles.dealOfTheDay}>
                            <View style={styles.dealTextContainer}>
                                <Text style={styles.dealTitle}>{"Deal of the Day"}</Text>
                                <View style={styles.remainingTime}>
                                    <Image
                                        source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                        resizeMode={"stretch"}
                                        style={styles.dealIcon}
                                    />
                                    <Text style={styles.remainingText}>{"22h 55m 20s remaining "}</Text>
                                </View>
                            </View>
                            <View style={styles.viewAllButton}>
                                <Text style={styles.viewAllText}>{"View all"}</Text>
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} 
                                    resizeMode={"stretch"}
                                    style={styles.viewAllIcon}
                                />
                            </View>
                        </View>
                        <View style={styles.productSection}>
                            <Text style={styles.productTitle}>Sản Phẩm</Text>
                            <View style={styles.productListContainer}>
                                <ProductList />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
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
    headerContainer: {
        backgroundColor: "#F9F9F9",
        paddingTop: 11,
        paddingBottom: 26,
    },
    
    headerIconContainer: {
        width: 24,
        backgroundColor: "#9AD372",
        paddingHorizontal: 3,
        marginRight: 70,
    },
    headerIcon: {
        height: 12,
        marginTop: 6,
    },
    headerRightContainer: {
        width: 17,
        marginRight: 28,
    },
    headerRightIcon: {
        height: 15,
    },
    headerRightIconBottom: {
        position: "absolute",
        bottom: 0,
        right: -16,
        width: 16,
        height: 14,
    },
	headerRow: {
        flexDirection: "row",
        justifyContent: "center", // Căn giữa nội dung theo chiều ngang
        alignItems: "center", // Căn giữa nội dung theo chiều dọc
        marginBottom: 23,
        marginHorizontal: 11,
    },
    headerTitle: {
        width: 120, // Chiều rộng của logo, có thể điều chỉnh
        height: 35, // Chiều cao của logo, có thể điều chỉnh
    },

    headerProfileImage: {
        borderRadius: 100,
        width: 40,
        height: 39,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 19,
        marginBottom: 17,
        marginHorizontal: 16,
        shadowColor: "#00000008",
        shadowOpacity: 0.0,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 9,
        elevation: 9,
    },
    searchIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    searchText: {
        color: "#C3C3C3",
        fontSize: 14,
        marginRight: 22,
    },
    flexStretch: {
        flex: 1,
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
    featuredTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#9AD372",
        borderRadius: 4,
        padding: 4,
        width: 60,
        height: 30,
    },
    sortText: {
        color: "#FFFFFF",
    },
    sortIcon: {
        height: 10,
        marginLeft: 4,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D9D9D9",
        borderRadius: 4,
        padding: 4,
        width: 60,
        height: 30,
    },
    filterText: {
        color: "#9AD372",
    },
    filterIcon: {
        height: 10,
        marginLeft: 4,
    },
    categoryContainer: {
        alignItems: "flex-start",
        marginBottom: 30,
    },
    categoryImagesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    categoryImage: {
        height: 70,
        width: 70,
        borderRadius: 12,
        marginRight: 9,
    },
    categoryLabel: {
        color: "#9AD372",
        fontSize: 12,
        position: "absolute",
    },
    imageBackground: {
        height: 200,
        width: 350,
        marginBottom: 28,
        marginHorizontal: 16,
        padding: 14,
        justifyContent: "center",
    },
    discountText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    nowInText: {
        color: "#FFFFFF",
        fontSize: 12,
        marginTop: 6,
    },
    allColorsText: {
        color: "#FFFFFF",
        fontSize: 12,
        marginTop: 6,
    },
    shopNowButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
    },
    shopNowText: {
        backgroundColor: "#D9D9D9",
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 20,
        color: "#9AD372",
    },
    shopNowIcon: {
        marginLeft: 10,
        width: 10,
        height: 10,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
    },
    paginationIcon: {
        height: 12,
        width: 12,
        marginRight: 10,
    },
    dealOfTheDay: {
        marginBottom: 30,
        marginHorizontal: 16,
        justifyContent: "space-between",
        flexDirection: "row",
    },
    dealTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    dealTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 8,
    },
    remainingTime: {
        flexDirection: "row",
        alignItems: "center",
    },
    dealIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    remainingText: {
        color: "#C3C3C3",
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#9AD372",
        marginRight: 4,
    },
    viewAllIcon: {
        width: 15,
        height: 15,
    },
    productSection: {
        marginHorizontal: 16,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    productListContainer: {
        marginBottom: 40,
    },
});

export default HomeScreen;
