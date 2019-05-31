import React from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import {ImagePicker, Permissions} from 'expo'

class SendChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.userName,
      room: this.props.room,
      lecture: this.props.lecture,
      message: '',
    }
  }

  emptyMessage(message) {
    if (this.state.message !== '') {
      this.handleMessage(message)
    } else {
      alert("You can't send an empty message")
    }
  }

  handleMessage(message) {
    if (message.nativeEvent.text !== '') {
      const userMessage = {
        name: this.state.name,
        message: this.state.message,
        date: firebase.firestore.Timestamp.now(),
        rank: 0,
        likedBy: ['1'],
        id: Math.random().toString(36),
      }
      firebase
        .firestore()
        .collection('ChatRooms')
        .doc(this.state.room)
        .collection('Lecture')
        .doc(this.state.lecture)
        .update({
          Messages: firebase.firestore.FieldValue.arrayUnion(
            userMessage
          ),
        })
        .catch(function(error) {
          console.error(error)
        })
    }
    this.doClear()
  }

  doClear() {
    let textInput = this.refs['textInput']
    textInput.clear()
  }

  //Future function
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA)
    await Permissions.askAsync(Permissions.CAMERA_ROLL)
  }

  //Future function
  pickImage = async () => {
    await this.askPermissionsAsync()
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    })
    let image = result.uri.split('ImagePicker/')[1]
    console.log(image)
    console.log(result.uri)
    fetch(result.uri)
      .then(res => res.blob())
      .then(blob => {
        if (!result.cancelled) {
          console.log(blob)
          this.setState({
            image,
            blob,
          })
        }
      })
  }

  render() {
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-170}
        behavior='position'
        enabled
      >
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              ref='textInput'
              style={styles.inputs}
              placeholder='Write a message...'
              underlineColorAndroid='transparent'
              onSubmitEditing={message => this.handleMessage(message)}
              onChangeText={message => this.setState({message})}
              value={this.state.message}
            />
          </View>
          <TouchableOpacity
            style={styles.btnSend}
            onPress={message => this.emptyMessage(message)}
          >
            <Icon style={styles.comment} name='comment' />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

export default SendChat

const styles = StyleSheet.create({
  btnSend: {
    backgroundColor: '#fdbca6',
    color: '#ffffff',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 5,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    marginLeft: 5,
    position: 'relative',
    top: 5,
    paddingLeft: 5,
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#d3d4da',
    padding: 5,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  comment: {
    fontSize: 20,
    color: '#ffffff',
  },
})
