import ListingIcon from '@Assets/agentpanel/Vector-1.svg';
import HomeToday from '@Assets/agentpanel/Vector.svg';
import CalenderIcon from '@Assets/agentpanel/calender.svg';
import MessageIcon from '@Assets/agentpanel/message.svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Menu as MenuIcon } from 'lucide-react-native';

import Calender from './AgentPanelScreens/Calender';
import Home from './AgentPanelScreens/Home';
import Listings from './AgentPanelScreens/Listings';
import Menu from './AgentPanelScreens/Menu';
import Messages from './AgentPanelScreens/Messages';

const Tab = createBottomTabNavigator();
export default function AgentPanel() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#a787ec',
      }}>
      <Tab.Screen
        name="Today"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeToday width={28} height={28} color={color} stroke={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Calender"
        component={Calender}
        options={{
          tabBarIcon: ({ color }) => (
            <CalenderIcon width={28} height={28} color={color} stroke={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Listings"
        component={Listings}
        options={{
          tabBarIcon: ({ color }) => (
            <ListingIcon width={28} height={28} color={color} stroke={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ color }) => (
            <MenuIcon width={28} height={28} color={color} stroke={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
