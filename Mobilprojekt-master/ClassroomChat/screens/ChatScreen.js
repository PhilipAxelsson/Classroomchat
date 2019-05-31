import React from 'react'
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Button,
  AsyncStorage,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native'
import HandleChat from './Chats/Chat/HandleChat'
import geolib from 'geolib'
import AppNavigator from '../navigation/AppNavigator'
import HandleLectures from './Chats/Lectures/HandleLectures'
import MyBackButton from './Chats/MyBackButton'
import Icon from 'react-native-vector-icons/FontAwesome'

const PLACES_URL = 'https://api.kth.se/api/places/v2/places'
const placesKey = process.env.KTH_KEY

export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Choose Room',
    header: null,
  }
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dataSource: [],
      userLatitude: '',
      userLongitude: '',
      showList: false,
      userName: '',
      refreshing: false,
    }
    console.disableYellowBox = true
  }

  componentDidMount() {
    this._isMounted = true
    this.getStoredUserName()
    this.fetchRooms()
    this.fetchPosition()
    this.setState({
      refreshing: false,
    })
  }

  _onRefresh = () => {
    this.setState({refreshing: true})
    this.componentDidMount()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchPosition() {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (this._isMounted) {
          this.setState({
            userLongitude: position.coords.longitude,
            userLatitude: position.coords.latitude,
          })
        }
      },
      err => alert(err)
    )
    console.log('position')
  }

  fetchRooms() {
    fetch(PLACES_URL, {
      method: 'GET',
      headers: {
        api_key: placesKey,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            dataSource: responseJson,
          })
        }
      })
      .catch(error => console.log(error))
    console.log('rooms')
  }

  selectedRooms() {
    let selectedRooms = []
    for (let i = 0; i < this.state.dataSource.length; i++) {
      if (
        this.state.dataSource[i].latitude > 0 &&
        this.state.dataSource[i].longitude > 0
      ) {
        if (
          geolib.isPointInCircle(
            {
              latitude: Number(this.state.dataSource[i].latitude),
              longitude: Number(this.state.dataSource[i].longitude),
            },
            {
              latitude: Number(this.state.userLatitude),
              longitude: Number(this.state.userLongitude),
            },
            100
          ) == true
        ) {
          selectedRooms.push(this.state.dataSource[i])
        }
      }
    }
    return selectedRooms
  }

  handleRoom(name) {
    this.setState({
      showLecture: true,
      room: name,
    })
  }

  handleUsername() {
    if (this.state.userName == '') {
      alert('Pick an alias or press continue without alias')
    } else {
      this.setState({showList: true})
      const userName = this.state.userName
      const saveUserId = async userName => {
        try {
          await AsyncStorage.setItem(
            'userName',
            JSON.stringify(userName)
          )
        } catch (error) {
          console.log(error.message)
        }
      }
      saveUserId(userName)
    }
  }

  getStoredUserName() {
    const getUserName = async () => {
      let userName = ''
      try {
        userName = (await AsyncStorage.getItem('userName')) || '""'
      } catch (error) {
        // Error retrieving data
        console.log(error.message)
      }
      return userName
    }
    getUserName().then(data => {
      data = data.slice(0, -1)
      data = data.substr(1)
      this.setState({userName: data})
    })
  }

  render() {
    const {navigate} = this.props.navigation
    let loadingIndicator = null
    loadingIndicator = (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
          backgroundColor: '#fff',
          margin: 20,
          color: '#9b9b9b',
        }}
      >
        <ActivityIndicator size='large' color='#fbdca5' />
      </View>
    )
    let returnList = this.selectedRooms().map((room, index) => (
      <TouchableOpacity
        key={room.name + index}
        onPress={() =>
          navigate('Lectures', {
            room: room.name,
            userName: this.state.userName,
          })
        }
        title='Choose Room'
      >
        <View
          key={room._id}
          style={{
            backgroundColor: '#7cab99',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            marginTop: 20,
            height: 50,
            marginLeft: 30,
            marginRight: 30,
          }}
        >
          <Text style={{color: 'white'}}>{room.name}</Text>
        </View>
      </TouchableOpacity>
    ))
    return (
      <React.Fragment>
        {this.state.showList ? (
          <React.Fragment>
            <View style={styles.topHeader}>
              <Icon
                style={styles.back}
                name='arrow-circle-left'
                title='back'
                onPress={() => {
                  this.setState({showList: false})
                }}
              />
              <Text style={styles.getStartedText}>
                Hello {this.state.userName}
              </Text>
            </View>

            <Text style={styles.text}>
              Choose the room for your next lecture
            </Text>
            <ScrollView
              style={styles.container}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              {returnList}
            </ScrollView>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Text style={styles.getStartedText}>
              Choose your alias
            </Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{alignItems: 'center'}}>
                <TextInput
                  style={styles.inputs}
                  placeholder='My alias is...'
                  underlineColorAndroid='transparent'
                  onSubmitEditing={() => this.handleUsername()}
                  onChangeText={userName => this.setState({userName})}
                  value={this.state.userName}
                />
                <TouchableOpacity
                  style={styles.btnSend}
                  onPress={() => this.handleUsername()}
                >
                  <Text
                    style={{color: '#ffffff', fontWeight: 'bold'}}
                  >
                    Next
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.continue}
                  onPress={() =>
                    this.setState({
                      userName: 'anonymous',
                      showList: true,
                    })
                  }
                >
                  <Text style={styles.contText}>
                    ...or continue without alias
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </React.Fragment>
        )}
        {this.state.loading ? <View>{loadingIndicator}</View> : null}
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingVertical: 4,
    margin: 5,
    backgroundColor: '#f9f9f9',
  },
  getStartedText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
    paddingTop: 30,
    paddingBottom: 30,

    fontWeight: 'bold',
    position: 'relative',
  },
  inputs: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 22,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'grey',
    height: 40,
    width: 250,
    marginLeft: '15%',
    marginRight: '15%',
    marginTop: 100,
  },
  btnSend: {
    backgroundColor: '#fdbca6',
    color: '#ffffff',
    width: 70,
    height: 70,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 5,
    justifyContent: 'center',
    marginTop: 30,
  },
  btnSendSmall: {
    backgroundColor: '#fdbca6',
    color: '#ffffff',
    width: 30,
    height: 30,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 5,
    justifyContent: 'center',
    marginTop: 30,
  },
  text: {
    fontSize: 20,
    marginTop: 20,
    color: 'grey',
    textAlign: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
  },
  back: {
    fontSize: 40,
    marginRight: 0,
    color: '#fdbca6',
    padding: 30,
  },
  contText: {
    color: 'grey',
    fontSize: 20,
    marginTop: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
  },
  continue: {
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
  },
})
