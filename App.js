import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import NetworkScreen from './src/screens/NetworkScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import TerminalScreen from './src/screens/TerminalScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Device') {
              iconName = focused ? 'phone-portrait' : 'phone-portrait-outline';
            } else if (route.name === 'Network') {
              iconName = focused ? 'globe' : 'globe-outline';
            } else if (route.name === 'Security') {
              iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
            } else if (route.name === 'Terminal') {
              iconName = focused ? 'terminal' : 'terminal-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: route.name !== 'Terminal', // Hide header for terminal
        })}
      >
        <Tab.Screen name="Device" component={HomeScreen} />
        <Tab.Screen name="Network" component={NetworkScreen} />
        <Tab.Screen name="Security" component={SecurityScreen} />
        <Tab.Screen 
          name="Terminal" 
          component={TerminalScreen}
          options={{
            tabBarStyle: { display: 'flex' }
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
