import React from 'react'
import {Platform} from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation'
import HandleChat from '../screens/Chats/Chat/HandleChat'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'
import MapScreen from '../screens/MapScreen'
import HandleThread from '../screens/Chats/Thread/HandleThread'
import HandleLectures from '../screens/Chats/Lectures/HandleLectures'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarOptions: {
    activeTintColor: '#7cab99',
  },
  tabBarIcon: ({focused}) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
}

const ChatStack = createStackNavigator({
  Chats: ChatScreen,
  Lectures: HandleLectures,
  Handle: HandleChat,
  Thread: HandleThread,
})

ChatStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarOptions: {
    activeTintColor: '#7cab99',
  },
  tabBarIcon: ({focused}) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'
      }
    />
  ),
}

const MapStack = createStackNavigator({
  Maps: MapScreen,
})

MapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarOptions: {
    activeTintColor: '#7cab99',
  },
  tabBarIcon: ({focused}) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-map' : 'md-map'}
    />
  ),
}

export default createBottomTabNavigator({
  HomeStack,
  ChatStack,
  MapStack,
})
