import React, { useContext } from "react";
import { StyleSheet, View, FlatList, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SearchBox from "../../components/SearchBox";
import ProductCard from "../../components/ProductCard";
import Heading from "../../components/Heading";
import { ProductsContext } from "../../data/ProductsContext";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { products } = useContext(ProductsContext);

  if (!products || products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.emptyContainer}>
          <Heading title="No products available." />
        </View>
      </SafeAreaView>
    );
  }

  const electronicsProducts = products.filter(
    (product) => product.category === "Electronics"
  );
  const clothingProducts = products.filter(
    (product) => product.category === "Clothing"
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.subMain}>
            <Image
              style={styles.image}
              source={require("../../../assets/logo.png")}
            />
            <SearchBox onpress={() => navigation.navigate("SearchToDetails")} />

            {/* New Products */}
            <Heading title="New Products" />
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={products}
              renderItem={({ item }) => (
                <ProductCard
                  onTap={() =>
                    navigation.navigate("ProductDetailScreen", {
                      productId: item.id,
                    })
                  }
                  title={item.title}
                  image={item.image}
                  brand={item.brand}
                  price={item.price}
                />
              )}
            />

            {/* Clothing */}
            <Heading title="Clothing" />
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={clothingProducts}
              renderItem={({ item }) => (
                <ProductCard
                  onTap={() =>
                    navigation.navigate("ProductDetailScreen", {
                      productId: item.id,
                    })
                  }
                  title={item.title}
                  image={item.image}
                  brand={item.brand}
                  price={item.price}
                />
              )}
            />

            {/* Electronics */}
            <Heading title="Electronics" />
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={electronicsProducts}
              renderItem={({ item }) => (
                <ProductCard
                  onTap={() =>
                    navigation.navigate("ProductDetailScreen", {
                      productId: item.id,
                    })
                  }
                  title={item.title}
                  image={item.image}
                  brand={item.brand}
                  price={item.price}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    paddingTop: 10,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  subMain: {
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
  },
});