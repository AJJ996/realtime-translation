import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from './components/ui/SignInScreen';
import SignUpScreen from './components/ui/SignUpScreen';
import VerifyScreen from './components/ui/VerifyScreen';
import TranslateScreen from './components/ui/TranslateScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="TranslateScreen" component={TranslateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
