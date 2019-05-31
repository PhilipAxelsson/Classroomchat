import React, {Component} from 'react'
import {ScrollView, View, KeyboardAvoidingView} from 'react-native'
import 'firebase/firestore'
import ReadThread from './ReadThread'
import SendToThread from './SendToThread'
class HandleChat extends Component {
  static navigationOptions = {
    title: '',
    header: null,
  }
  constructor() {
    super()
  }

  render() {
    const {navigation} = this.props
    console.log(this.props)
    return (
      <React.Fragment>
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
          <View style={{flex: 1}}>
            <ScrollView>
              <ReadThread
                parentMess={navigation.getParam('parentMess')}
              />
            </ScrollView>
            <SendToThread
              parentMess={navigation.getParam('parentMess')}
              userName={navigation.getParam('userName')}
            />
          </View>
        </KeyboardAvoidingView>
      </React.Fragment>
    )
  }
}

export default HandleChat
