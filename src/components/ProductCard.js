//src/components/ProductCard.js
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
} from "react-native";
import React from "react";
import { StarIcon } from "react-native-heroicons/solid";

const ProductCard = ({ image, price, title, brand, onTap }) => {
  return (
    <Pressable onPress={onTap}>
      <View style={styles.main}>
        <View style={styles.card}>
          <ImageBackground
            style={styles.image}
            borderRadius={15}
            source={image}
          >
            <View style={styles.rating}>
              <StarIcon color="#FFD700" size={15} />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </ImageBackground>
          <View style={{ flexDirection: "row", marginLeft: 5 }}>
            <View>
              <Text style={styles.brandText}>{brand}</Text>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          </View>
          <Text style={styles.priceText}>${price}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    height: 340,
    width: 250,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  image: {
    width: 235,
    height: 240,
    resizeMode: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 7,
    marginBottom: 5,
  },
  rating: {
    backgroundColor: "#E8E8E8A1",
    flexDirection: "row",
    borderRadius: 20,
    width: 50,
    justifyContent: "space-around",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 20,
  },
  priceText: {
    fontSize: 25,
    marginLeft: 5,
  },
});

//// src/components/ProductCard.js
//import React from "react";
//import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
//
//const ProductCard = ({ onTap, title, image, price }) => {
//  return (
//    <TouchableOpacity onPress={onTap} style={styles.card}>
//      <Image source={image} style={styles.image} />
//      <Text style={styles.title}>{title}</Text>
//      <Text style={styles.price}>${price}</Text>
//    </TouchableOpacity>
//  );
//};
//
//const styles = StyleSheet.create({
//  card: {
//    margin: 10,
//    width: 150,
//    alignItems: "center",
//  },
//  image: {
//    width: "100%",
//    height: 100,
//    resizeMode: "contain",
//  },
//  title: {
//    fontSize: 16,
//    fontWeight: "bold",
//    textAlign: "center",
//  },
//  price: {
//    fontSize: 14,
//    color: "#888",
//  },
//});

//export default ProductCard;

