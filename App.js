import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { ProductProvider } from "./src/data/ProductsContext";
import { CartProvider } from "./src/data/CartContext";
import AppNavigator from "./src/navigation/AppNavigator"; 

const App = () => {
  return (
    <NavigationContainer>
      <ProductProvider>
        <CartProvider>
          <AppNavigator /> 
        </CartProvider>
      </ProductProvider>
    </NavigationContainer>
  );
};

export default App;
