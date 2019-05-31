import HandleChat from '../screens/Chats/Chat/HandleChat'
import HandleThread from '../screens/Chats/Thread/HandleThread'
import ChatScreen from '../screens/ChatScreen'
import HandleLectures from '../screens/Chats/Lectures/HandleLectures'
import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation'

const Screens = createStackNavigator({
  ChatScreen: {screen: ChatScreen},
  HandleChat: {screen: HandleChat},
  HandleLectures: {screen: HandleLectures},
  HandleThread: {screen: HandleThread},
  ChatScreen: {screen: ChatScreen},
})

ScreenNavigator = createAppContainer(Screens)

export default ScreenNavigator
