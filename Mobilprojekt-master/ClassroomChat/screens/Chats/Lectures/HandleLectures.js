import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import 'firebase/firestore'
import ReadLectures from './ReadLectures'
import AddLecture from './AddLecture'
import MyBackButton from '../MyBackButton'

class HandleLectures extends Component {
  static navigationOptions = {
    title: '',
    header: null,
  }
  state = {}
  render() {
    const {navigation} = this.props
    console.log(navigation.getParam('room') + ' handleLec')
    return (
      <React.Fragment>
        <View style={styles.topHeader}>
          <MyBackButton style={styles.backButton} />
          <Text style={styles.getStartedText}>Choose Lecture</Text>
        </View>
        <AddLecture
          user={this.state}
          room={navigation.getParam('room')}
          userName={navigation.getParam('userName')}
          navigation={this.props}
        />
        <ReadLectures
          user={this.state}
          room={navigation.getParam('room')}
          userName={navigation.getParam('userName')}
          navigation={this.props}
        />
      </React.Fragment>
    )
  }
}

export default HandleLectures

const styles = StyleSheet.create({
  getStartedText: {
    fontSize: 30,
    color: '#fff',
    backgroundColor: '#7cab99',
    fontWeight: 'bold',
    paddingTop: 35,
    position: 'relative',
    top: -8,
    left: -10,
  },

  topHeader: {
    flexDirection: 'row',
    color: '#fff',
    backgroundColor: '#7cab99',
  },

  topHeader: {
    flexDirection: 'row',
    color: '#fff',
    backgroundColor: '#7cab99',
  },
})
