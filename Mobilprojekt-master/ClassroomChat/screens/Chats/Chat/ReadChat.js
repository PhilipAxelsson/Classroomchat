import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase, {functions} from 'firebase'
import 'firebase/firestore'
import MyBackButton from '../MyBackButton'

class ReadChat extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      room: this.props.room,
      lecture: this.props.lecture,
      loading: true,
      fadeAnim: new Animated.Value(0),
    }
  }

  componentDidMount() {
    console.log(this.state.lecture)
    firebase
      .firestore()
      .collection('ChatRooms')
      .doc(this.state.room)
      .collection('Lecture')
      .doc(this.state.lecture)
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
              .collection('ChatRooms')
              .doc(this.state.room)
              .collection('Lecture')
              .doc(this.state.lecture)
              .set({
                Messages: [],
                Subscribers: [],
              })
          }
        }.bind(this)
      )
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      easing: Easing.elastic(2),
      duration: 1000,
    }).start()
  }

  handleVote(number) {
    const room = this.state.room
    const user = this.props.user.uid
    let allMessages = this.state.messages
    let found = allMessages[number].likedBy.includes(user)
    if (found) {
      allMessages[number].rank -= 1
      allMessages[number].likedBy = allMessages[
        number
      ].likedBy.filter(like => like !== user)
    } else {
      allMessages[number].rank += 1
      allMessages[number].likedBy.push(user)
    }
    firebase
      .firestore()
      .collection('ChatRooms')
      .doc(room)
      .collection('Lecture')
      .doc(this.state.lecture)
      .update({
        Messages: allMessages,
      })
      .catch(function(error) {
        console.error(error + ' error')
      })
  }

  handleSubscribe() {
    console.log('Subscribed')
    const addSubscriber = this.props.user.uid
    firebase
      .firestore()
      .collection('ChatRooms')
      .doc(this.state.room)
      .collection('Lecture')
      .doc(this.state.lecture)
      .update({
        Subscribers: firebase.firestore.FieldValue.arrayUnion(
          addSubscriber
        ),
      })
      .catch(function(error) {
        console.error(error + ' error')
      })
  }

  checkMessageLenght() {
    let amount = 0
    this.state.messages.map(() => {
      amount += 1
    })
    return amount
  }
  render() {
    const {navigate} = this.props.navigation.navigation
    let {fadeAnim} = this.state
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
    if (this.state.messages.length === 0) {
      ReadMessages = (
        <View style={styles.noMessagesView}>
          <Text style={styles.noMessages}>
            Be the first to write something here!
          </Text>
        </View>
      )
    } else {
      ReadMessages = this.state.messages.sort(function(a, b) {
        //Sorts all messages by timestamp so the last one appears in the bottom
        return b.rank - a.rank
      })
      ReadMessages = ReadMessages.map((data, index) => (
        <Animated.View
          key={'ReadMessages' + index}
          style={{opacity: fadeAnim}}
        >
          <TouchableOpacity
            onPress={() =>
              navigate('Thread', {
                parentMess: data,
                userName: this.props.userName,
              })
            }
            style={styles.messages}
          >
            <View>
              <Text style={styles.innerTextName}>{data.name}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.innerText}> {data.rank} </Text>
              <Icon
                style={styles.heart}
                name={
                  data.likedBy.includes(this.props.user.uid)
                    ? 'heart'
                    : 'heart-o'
                }
                type='font-awesome'
                color='#fdbca6'
                onPress={() => this.handleVote(index)}
                title='Upvote'
              />
            </View>
          </TouchableOpacity>
          <View style={styles.messageBox}>
            <Text style={styles.innerText}>{data.message}</Text>
          </View>
        </Animated.View>
      ))
    }
    return (
      <React.Fragment>
        <View style={styles.topHeader}>
          <MyBackButton />
          <Text style={styles.getStartedText}>
            {this.state.lecture + ' in ' + this.state.room}
          </Text>
        </View>
        {this.state.loading ? (
          <View>{loadingIndicator}</View>
        ) : (
          <KeyboardAvoidingView
            keyboardVerticalOffset={-90}
            style={{justifyContent: 'flex-end', flex: 1}}
            behavior='padding'
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

export default ReadChat

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: '#DFF7EB',
    color: 'white',
    marginRight: 10,
    marginLeft: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 5,
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  container: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    height: '100%',
    overflow: 'scroll',
    color: 'black',
    justifyContent: 'flex-end',
  },
  messages: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#91BBA7',
    color: 'white',
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 5,
  },
  innerText: {
    fontSize: 20,
    marginTop:8,
  },
  innerTextName: {
    fontSize: 20,
    color: 'white',
    marginTop: 9,
  },
  heart: {
    fontSize: 25,
    marginRight: 10,
    padding:7,
  },
  getStartedText: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: '#7cab99',
    fontWeight: 'bold',
    paddingTop: 35,
    position:'relative',
    left: -10,
    top: -5,
    paddingBottom: 30,
    maxWidth: 270,
  },

  topHeader: {
    flexDirection: 'row',
    color: '#fff',
    backgroundColor: '#7cab99',
  },
  comment: {
    fontSize: 30,
    marginRight: 10,
    color: '#fdbca6',
  },
  back: {
    fontSize: 40,
    marginRight: 10,
    color: '#fdbca6',
  },
  noMessages: {
    textAlign: 'center',
    fontSize: 20,
  },
  noMessagesView: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#dbdbdb',
    borderRadius: 15,
    padding: 10,
    margin: 30,
  },
})
