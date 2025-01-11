import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppointmentProvider } from './src/context/AppointmentContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import MyAppointmentsScreen from './src/screens/MyAppointments';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AppointmentProvider>
      <StatusBar
      backgroundColor={'white'}
      barStyle={'dark-content'}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Appointments" component={AppointmentScreen} />
          <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppointmentProvider>
  );
};

export default App;

