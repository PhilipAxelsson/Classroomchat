import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native'
import firebase, {functions} from 'firebase'
import 'firebase/firestore'
import MyBackButton from '../MyBackButton'
class ReadThread extends React.Component {
  static navigationOptions = {
    title: '',
    header: null,
  }
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      parentMessID: this.props.parentMess.id,
      loading: true,
    }
  }

  componentDidMount() {
    console.log(this.props.parentMess)
    firebase
      .firestore()
      .collection('Threads')
      .doc(this.state.parentMessID)
      .onSnapshot(
        function(doc) {
          if (doc.exists) {
            this.setState({
              messages: doc.data().Messages,
              loading: false,
            })
          } else {
            firebase
              .firestore()
              .collection('Threads')
              .doc(this.state.parentMessID)
              .set({
                Messages: [],
              })
          }
        }.bind(this)
      )
  }

  render() {
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
        }}
      >
        <ActivityIndicator size='large' color='#9b9b9b' />
      </View>
    )
    let ReadMessages

    ReadMessages = this.state.messages.sort(function(a, b) {
      //Sorts all messages by timestamp so the last one appears in the bottom
      return b.rank - a.rank
    })
    ReadMessages = ReadMessages.map((data, index) => (
      <View>
        <Text style={styles.innerTextName}>{data.name}</Text>
        <View
          key={'ReadMessages' + index}
          style={{flexDirection: 'row'}}
        >
          <View style={styles.messageBox}>
            <Text style={styles.innerText}>{data.message}</Text>
          </View>
        </View>
      </View>
    ))
    return (
      <React.Fragment>
        <View style={styles.topHeader}>
          <MyBackButton />
          <Text style={styles.getStartedText}>
            {this.props.parentMess.message}
          </Text>
        </View>
        {this.state.loading ? (
          <View>{loadingIndicator}</View>
        ) : (
          <KeyboardAvoidingView
            keyboardVerticalOffset={-90}
            style={{justifyContent: 'flex-end', flex: 1}}
            behavior='position'
            enabled
          >
            <View style={styles.container}>
              <ScrollView>{ReadMessages}</ScrollView>
            </View>
          </KeyboardAvoidingView>
        )}
      </React.Fragment>
    )
  }
}

export default ReadThread

const styles = StyleSheet.create({
  messageBox: {
    flex: -1,
    marginLeft: 15,
    marginRight: 5,
    backgroundColor: '#dbdbdb',
    borderRadius: 10,
    padding: 5,
  },
  goBackButton: {
    position: 'relative',
    left: -50,
    paddingTop: 30,
    paddingBottom: 30,
  },
  topHeader: {
    flexDirection: 'row',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  topHeader: {
    flexDirection: 'row',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },

  innerText: {
    fontSize: 20,
  },
  innerTextName: {
    fontSize: 15,
    color: '#8e8e8e',
    marginLeft: 15,
    marginTop: 10,
  },
  heart: {
    fontSize: 30,
    marginRight: 10,
  },
  getStartedText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    paddingTop: 33,
    paddingBottom: 30,
    maxWidth: 200,
    position: 'relative',
    left: -10,
    maxWidth: 220,
    marginLeft: 5,
  },
  comment: {
    fontSize: 30,
    marginRight: 10,
    color: '#fdbca6',
  },
})
