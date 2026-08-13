import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import LocationPermissionScreen from '../screens/LocationPermissionScreen'

// Screens
import WelcomeScreen from '../screens/WelcomeScreen'
import AboutScreen from '../screens/AboutScreen'
import LanguageSelectScreen from '../screens/LanguageSelectScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import HomeScreen from '../screens/HomeScreen'
import IrrigationScreen from '../screens/IrrigationScreen'
import DiseaseScreen from '../screens/DiseaseScreen'
import CropsAdvisoryScreen from '../screens/CropsAdvisoryScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'
import FAQScreen from '../screens/FAQScreen'
import IrrigationHistoryScreen from '../screens/IrrigationHistoryScreen'
import LocationTrackingScreen from '../screens/LocationTrackingScreen'
import NotificationPermissionScreen from '../screens/NotificationPermissionScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const FarmerTabs = () => {
  const { lang } = useLanguage()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline'
          else if (route.name === 'Irrigation') iconName = focused ? 'water' : 'water-outline'
          else if (route.name === 'Disease') iconName = focused ? 'leaf' : 'leaf-outline'
          else if (route.name === 'Crops') iconName = focused ? 'basket' : 'basket-outline'
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline'
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('home', lang) }} />
      <Tab.Screen name="Irrigation" component={IrrigationScreen} options={{ tabBarLabel: t('irrigation', lang) }} />
      <Tab.Screen name="Disease" component={DiseaseScreen} options={{ tabBarLabel: t('disease', lang) }} />
      <Tab.Screen name="Crops" component={CropsAdvisoryScreen} options={{ tabBarLabel: t('crops', lang) }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile', lang) }} />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { token, loading, locationPrompted, notificationPrompted } = useAuth()
  if (loading) return null

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
        {token ? (
          !locationPrompted ? (
            <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
          ) : !notificationPrompted ? (
            <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
          ) : (
            <>
              <Stack.Screen name="Main" component={FarmerTabs} />
              {/* Settings and Location Tracking are pushed on top of the tabs, not part of the tab bar itself */}
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="LocationTracking" component={LocationTrackingScreen} />
              <Stack.Screen name="FAQ" component={FAQScreen} />            
              <Stack.Screen name="IrrigationHistory" component={IrrigationHistoryScreen} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator