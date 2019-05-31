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
import Icon from 'react-native-vector-icons/FontAwesome'

class SendToThread extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.userName,
      parentMessID: this.props.parentMess.id,
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

  handleMessage() {
    console.log(this.state)
    if (this.state.message !== '') {
      const userMessage = {
        name: this.state.name,
        message: this.state.message,
        date: firebase.firestore.Timestamp.now(),
        rank: 0,
        likedBy: ['1'],
      }
      firebase
        .firestore()
        .collection('Threads')
        .doc(this.state.parentMessID)
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
    console.log('doClear...')
    let textInput = this.refs['textInput']
    console.log(textInput)
    textInput.clear()
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

export default SendToThread

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

/*
const styles = StyleSheet.create({
    inputView: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      textAlign:"center"
    },
    inputBar: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 20, 
      width: "100%",
      color:"white",
      backgroundColor: '#7a42f4',
      paddingLeft:15,
      paddingRight:15,
      height: 170
    },
})
*/
