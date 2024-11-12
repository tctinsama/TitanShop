//App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { UserProvider } from './src/context/UserContext';
import { Provider as PaperProvider } from 'react-native-paper';  



const App = () => {
  return (
    <UserProvider>
       <PaperProvider>
            <NavigationContainer>
                 <AppNavigator />
            </NavigationContainer>
        </PaperProvider>     
        
    </UserProvider>
);

};

export default App;
