import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import firebase, {functions} from 'firebase'
import 'firebase/firestore'

class ReadLectures extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      rooms: [],
      room: this.props.room,
      loading: true,
    }
  }

  componentDidMount() {
    console.log(this.props.room + ' readLec')
    firebase
      .firestore()
      .collection('ChatRooms')
      .doc(this.state.room)
      .collection('Lecture')
      .limit(20)
      .onSnapshot(
        function(querySnapshot) {
          let rooms = []
          querySnapshot.forEach(function(doc) {
            rooms.push({lection: doc.id, date: doc.data().date})
            // doc.data() is never undefined for query doc snapshots
          })
          this.setState({
            rooms,
            loading: false,
          })
        }.bind(this)
      )
  }

  render() {
    const {navigate} = this.props.navigation.navigation
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
    let rooms
    if (this.state.rooms.length === 0) {
      rooms = (
        <View style={styles.noLecturesView}>
          <Text style={styles.noLectures}>
            No lectures have been added yet
          </Text>
        </View>
      )
    } else {
      rooms = this.state.rooms.map((data, index) => (
        <View style={styles.container} key={'rooms' + index}>
          <TouchableOpacity
            style={styles.messages}
            onPress={() =>
              navigate('Handle', {
                room: this.state.room,
                userName: this.props.userName,
                lecture: data.lection,
              })
            }
          >
            <Text style={styles.innerTextName}>{data.lection}</Text>
            <Text style={{color: 'grey'}}>{data.date}</Text>
          </TouchableOpacity>
        </View>
      ))
    }

    return (
      <React.Fragment>
        {this.state.loading ? (
          <View>{loadingIndicator}</View>
        ) : (
          <ScrollView>
            <View style={styles.roomContainer}>{rooms}</View>
          </ScrollView>
        )}
      </React.Fragment>
    )
  }
}

export default ReadLectures

const styles = StyleSheet.create({
  roomContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  messages: {
    backgroundColor: '#91BBA7',
    color: 'white',
    marginTop: 10,
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    maxWidth: 160,
    minWidth: 160,
    minHeight: 110,
    borderRadius: 8,
  },
  innerText: {
    fontSize: 20,
  },
  innerTextName: {
    fontSize: 20,
    color: 'white',
  },
  heart: {
    fontSize: 30,
    marginRight: 10,
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
  noLectures: {
    textAlign: 'center',
    fontSize: 20,
  },
  noLecturesView: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#dbdbdb',
    borderRadius: 15,
    padding: 10,
    margin: 30,
  },
})
