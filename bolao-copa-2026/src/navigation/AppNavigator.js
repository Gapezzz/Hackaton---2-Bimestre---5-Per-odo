import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import PerfilScreen from '../screens/PerfilScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0A1628' },
        headerTintColor: '#F0C040',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#0A1628', borderTopColor: '#1A2740' },
        tabBarActiveTintColor: '#F0C040',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen
        name="Início"
        component={PlaceholderScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Partidas"
        component={PlaceholderScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="futbol-o" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Palpites"
        component={PlaceholderScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="pencil" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Ranking"
        component={PlaceholderScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario } = useAuth();
  return (
    <NavigationContainer>
      {usuario ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}