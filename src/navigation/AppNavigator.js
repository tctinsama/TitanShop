import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import MyTabs from '../components/MyTabs';
import ProductDetail from '../screens/customer/ProductDetail';
import CartScreen from '../screens/customer/CartScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import OrderSuccess from '../screens/customer/OrderSuccess';
import SearchResult from '../screens/customer/SearchResult';
import CategoryScreen from '../screens/customer/CategoryScreen';
import ShopManagement from '../screens/client/ShopManagement';
import ShopDetail from '../screens/client/ShopDetail';
import AddProduct from '../screens/client/AddProduct';
import OrderHistory from '../screens/client/OrderHistory';
import NewsScreenDetail from '../screens/customer/NewsDetailScreen'; // Import màn hình mới
import ChatScreen from '../screens/customer/ChatScreen'; // Import màn hình mới
import PurchaseOrder from '../screens/customer/PurchaseOrder';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [userId, setUserId] = useState(null);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login">
        {props => <Login {...props} setUserId={setUserId} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false }} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CartScreen" component={CartScreen} options={{
        headerShown: true,
        title: 'Giỏ Hàng',
      }} />
      <Stack.Screen name="HomeTabs" component={MyTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      <Stack.Screen name="ShopManagement" component={ShopManagement} />
      <Stack.Screen name="ShopDetail" component={ShopDetail} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="PurchaseOrder" component={PurchaseOrder} />
      {/* Thêm màn hình NewsScreenDetail */}
      <Stack.Screen name="NewsScreenDetail" component={NewsScreenDetail} options={{ title: 'Chi Tiết Tin Tức' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat với trợ lí AI' }} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
