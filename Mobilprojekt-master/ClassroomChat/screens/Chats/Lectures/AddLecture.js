import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore'
import Icon from 'react-native-vector-icons/FontAwesome'

class SendChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lectureName: '',
      room: this.props.room,
      addRoom: false,
    }
  }

  componentDidMount() {
    today = new Date()
    let day = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()
    if (day < 10) day = '0' + day
    if (month < 10) month = '0' + month
    date = day + '/' + month + '/' + year
    this.setState({
      date,
    })
  }

  checkInput(lectureName) {
    if (this.state.lectureName !== '') {
      this.handleAddRoom(lectureName)
    } else {
      alert('Your Chat Room needs a name')
    }
  }

  handleAddRoom(lectureName) {
    if (lectureName.nativeEvent.text !== '') {
      firebase
        .firestore()
        .collection('ChatRooms')
        .doc(this.state.room)
        .collection('Lecture')
        .doc(this.state.lectureName)
        .set({
          date: this.state.date,
          Messages: [],
        })
        .catch(function(error) {
          console.error(error)
        })
    }
  }

  showTextInput() {
    this.setState({
      addRoom: !this.state.addRoom,
    })
  }

  showSymbol() {
    if (this.state.addRoom == false) {
      return 'plus'
    } else {
      return 'minus'
    }
  }

  render() {
    const {navigate} = this.props.navigation.navigation
    return (
      <React.Fragment>
        <KeyboardAvoidingView style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.btnSend}
            onPress={() => this.showTextInput()}
          >
            <Icon style={styles.plus} name={this.showSymbol()} />
          </TouchableOpacity>

          {this.state.addRoom ? (
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.inputs}
                placeholder='Add a new lecture...'
                underlineColorAndroid='transparent'
                onSubmitEditing={lectureName =>
                  this.handleAddRoom(lectureName)
                }
                onChangeText={lectureName =>
                  this.setState({lectureName})
                }
              />
              <TouchableOpacity
                style={styles.smallBth}
                onPress={lectureName => this.checkInput(lectureName)}
              >
                <Text style={{fontSize: 10, color: '#ffffff'}}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </React.Fragment>
    )
  }
}

export default SendChat

const styles = StyleSheet.create({
  btnSend: {
    backgroundColor: '#fdbca6',
    color: '#ffffff',
    width: 60,
    height: 60,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  smallBth: {
    backgroundColor: '#fdbca6',
    color: '#ffffff',
    width: 35,
    height: 35,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 6,
    margin: 5,
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
    marginTop: 10,
  },
  plus: {
    fontSize: 20,
    color: '#ffffff',
  },
  getStartedText: {
    //marginTop:10,
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
    padding: 10,
    fontWeight: 'bold',
  },
})
