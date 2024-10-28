//src/navigation/AppNavigator.js
import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import MyTabs from '../components/MyTabs';
import ProductDetail from '../components/ProductDetail';
import CartScreen from '../screens/customer/CartScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import OrderSuccess from '../screens/customer/OrderSuccess';
import SearchResult from '../screens/customer/SearchResult';
import CategoryScreen from '../screens/customer/CategoryScreen';




const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [userId, setUserId] = useState(null);

//src/navigation/AppNavigator.js
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login">
        {props => <Login {...props} setUserId={setUserId} />} 
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false }}/>
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ 
        headerShown: true,
        title: 'Giỏ Hàng',
      }}  />
      <Stack.Screen
            name="HomeTabs"
            component={MyTabs}
            options={{ headerShown: false }}  // Ẩn header nếu muốn
          />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
