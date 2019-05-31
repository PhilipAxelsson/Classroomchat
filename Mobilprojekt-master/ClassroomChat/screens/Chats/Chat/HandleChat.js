import React, {Component} from 'react'
import {
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore'
import ReadChat from './ReadChat'
import SendChat from './SendChat'
import Fire from '../../../Firebase/Fire' //initisierar firebase
class HandleChat extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor() {
    super()
    this.state = {
      user: false,
      uid: '',
    }
    this.handleUsers = this.handleUsers.bind(this)
  }

  componentDidMount() {
    this.handleUsers()
  }
  handleUsers() {
    firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code
        let errorMessage = error.message
        console.log(errorMessage)
        // ...
      })

    firebase.auth().onAuthStateChanged(
      function(user) {
        console.log(user.uid)
        if (user.isAnonymous) {
          // User is signed in.
          this.setState({
            user: user.isAnonymous,
            uid: user.uid,
          })
        } else {
          console.log('Utloggad')
          // User is signed out.
          // ...
        }
      }.bind(this)
    )
  }

  render() {
    const {navigation} = this.props
    return (
      <React.Fragment>
        {this.state.user ? (
          <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
            <View style={{flex: 1}}>
              <ScrollView>
                <ReadChat
                  user={this.state}
                  room={navigation.getParam('room')}
                  lecture={navigation.getParam('lecture')}
                  userName={navigation.getParam('userName')}
                  navigation={this.props}
                />
              </ScrollView>
              <SendChat
                room={navigation.getParam('room')}
                lecture={navigation.getParam('lecture')}
                userName={navigation.getParam('userName')}
              />
            </View>
          </KeyboardAvoidingView>
        ) : (
          <Text>Loading</Text>
        )}
      </React.Fragment>
    )
  }
}

export default HandleChat
