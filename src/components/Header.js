// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ navigation }) => {
  const goToCart = () => {
    navigation.navigate('CartScreen');
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Product Detail</Text>
      <TouchableOpacity onPress={goToCart}>
        <Icon name="shopping-cart" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;