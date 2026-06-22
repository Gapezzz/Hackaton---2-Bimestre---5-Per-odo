import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import PerfilScreen from '../screens/PerfilScreen';
import HomeScreen from '../screens/HomeScreen';
import PartidasScreen from '../screens/PartidasScreen';
import DetalhesPartidaScreen from '../screens/DetalhesPartidaScreen';
import RegistrarPalpiteScreen from '../screens/RegistrarPalpiteScreen';
import MeusPalpitesScreen from '../screens/MeusPalpitesScreen';
import RankingScreen from '../screens/RankingScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminPartidasScreen from '../screens/AdminPartidasScreen';
import AdminSelecoesScreen from '../screens/AdminSelecoesScreen';
import AdminUsuariosScreen from '../screens/AdminUsuariosScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stackOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: '800' },
  contentStyle: { backgroundColor: colors.background },
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
}

function PartidasStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="ListaPartidas" component={PartidasScreen} options={{ title: 'Partidas' }} />
      <Stack.Screen name="DetalhesPartida" component={DetalhesPartidaScreen} options={{ title: 'Detalhes da partida' }} />
      <Stack.Screen name="RegistrarPalpite" component={RegistrarPalpiteScreen} options={{ title: 'Registrar palpite' }} />
    </Stack.Navigator>
  );
}

function PalpitesStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="ListaPalpites" component={MeusPalpitesScreen} options={{ title: 'Meus palpites' }} />
      <Stack.Screen name="DetalhesPartida" component={DetalhesPartidaScreen} options={{ title: 'Detalhes da partida' }} />
      <Stack.Screen name="RegistrarPalpite" component={RegistrarPalpiteScreen} options={{ title: 'Editar palpite' }} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800' },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 7,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={23} color={color} />,
        }}
      />
      <Tab.Screen
        name="PartidasTab"
        component={PartidasStack}
        options={{
          title: 'Partidas',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="futbol-o" size={21} color={color} />,
        }}
      />
      <Tab.Screen
        name="PalpitesTab"
        component={PalpitesStack}
        options={{
          title: 'Palpites',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="pencil" size={21} color={color} />,
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={21} color={color} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800' },
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 64, paddingBottom: 7 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen name="Painel" component={AdminDashboardScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="dashboard" size={21} color={color} /> }} />
      <Tab.Screen name="Partidas" component={AdminPartidasScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="futbol-o" size={21} color={color} /> }} />
      <Tab.Screen name="Seleções" component={AdminSelecoesScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="flag" size={20} color={color} /> }} />
      <Tab.Screen name="Usuários" component={AdminUsuariosScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="users" size={20} color={color} /> }} />
      <Tab.Screen name="Perfil" component={PerfilScreen}
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="user" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario } = useAuth();
  return (
    <NavigationContainer>
      {usuario ? (usuario.perfil === 'ADMIN' ? <AdminTabs /> : <AppTabs />) : <AuthStack />}
    </NavigationContainer>
  );
}
