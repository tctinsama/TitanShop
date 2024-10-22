import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import MyTabs from '../components/MyTabs';
import ProductDetail from '../components/ProductDetail';
import CartScreen from '../screens/customer/CartScreen';

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
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: true }} />
      <Stack.Screen
            name="HomeTabs"
            component={MyTabs}
            options={{ headerShown: false }}  // Ẩn header nếu muốn
          />
    </Stack.Navigator>
  );
};

export default AppNavigator;
