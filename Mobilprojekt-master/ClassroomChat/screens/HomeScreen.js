import React from 'react'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {WebBrowser, Icon} from 'expo'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    header: null,
  }
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
    }
  }

  showInfo(step) {
    let message = ''
    if (step == 0) {
      message =
        'Welcome to KTH Classroom Chat!\n \nPress on the list below to get a quick guide of the app'
    }
    if (step == 1) {
      message =
        "You will get a list of the room that are nearby, if you can't see the room you want, move a bit closer and refresh the page. \n \nDon't know the way too your next lecture? Go to the map tab, search for the name of the room and get the directions."
    }
    if (step == 2) {
      message =
        'When you have found the right room, its time to find the right lecture. \nClick on the name of the lecture you are attending. \n \nIf there is no chat room for your lecture, create one by clicking on the plus-button'
    }
    if (step == 3) {
      message =
        "In the chat room you can ask questions and get help from your classmates. Click on one particular message to see all the answers. \nYou can also click on the heart symbol by each question to get it to the top of the feed.\n \nAnd don't forget that there are no stupid question!"
    }
    return message
  }

  render() {
    var returnVar = 'Classroom Chat'
    var returnVar2 =
      'Search for a room at KTH and get directions in the Map tab'
    var returnVar3 =
      'Use the Chat tab to get rooms that are close to you'
    var returnVar4 =
      'Select a room and chat with other students in the classroom '

    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <Image
            style={styles.image}
            source={require('./white.png')}
          />
          <Text style={styles.getStartedText}>{returnVar}</Text>
        </View>

        <View style={styles.card}>
          {this.state.step ? (
            <View style={{flexDirection: 'row'}}>
              <View style={styles.circle2}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 20,
                  }}
                >
                  {this.state.step}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.setState({step: 0})}
              >
                <View style={styles.circle3}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    X
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <Text style={{textAlign: 'center'}}>
            {this.showInfo(this.state.step)}
          </Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => this.setState({step: 1})}
          >
            <View style={styles.circle}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 25,
                }}
              >
                1
              </Text>
            </View>
            <Text>Select Room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => this.setState({step: 2})}
          >
            <View style={styles.circle}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 25,
                }}
              >
                2
              </Text>
            </View>
            <Text>Select Lecture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => this.setState({step: 3})}
          >
            <View style={styles.circle}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 25,
                }}
              >
                3
              </Text>
            </View>
            <Text>Chat with your class</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text
          onPress={this._handleLearnMorePress}
          style={styles.helpLinkText}
        >
          Learn more
        </Text>
      )

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you
          can use useful development tools. {learnMoreButton}
        </Text>
      )
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full
          speed.
        </Text>
      )
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/development-mode'
    )
  }

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    color: '#d3d4da',
  },
  getStartedText: {
    //marginTop:10,
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
    padding: 10,
    fontWeight: 'bold',
    position: 'relative',
    top: 20,
  },
  image: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    position: 'relative',
    top: 5,
    marginLeft: -20,
  },
  topHeader: {
    flexDirection: 'row',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
    padding: 30,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 22,
    color: '#d3d4da',
    textAlign: 'left',
    margin: 20,
  },
  card: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'transparent',
    padding: 20,
    margin: 20,
    height: 'auto',
    alignItems: 'center',
    backgroundColor: '#d3d4da',
    color: 'grey',
  },
  listItem: {
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    height: 60,
    marginLeft: 20,
    marginRight: 40,
    marginBottom: 5,
    padding: 10,
    marginTop: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 150 / 2,
    backgroundColor: '#fdbca6',
    justifyContent: 'center',
    color: 'white',
    marginRight: 15,
    position: 'relative',
    top: -8,
  },
  circle2: {
    width: 30,
    height: 30,
    borderRadius: 150 / 2,
    backgroundColor: '#fdbca6',
    justifyContent: 'center',
    color: 'white',
    marginRight: 0,
    marginLeft: 140,
    position: 'relative',
    top: -8,
  },
  circle3: {
    width: 20,
    height: 20,
    borderRadius: 150 / 2,
    backgroundColor: '#fdbca6',
    justifyContent: 'center',
    color: 'white',
    marginRight: 0,
    marginLeft: 125,
    position: 'relative',
    top: -14,
  },
  times: {
    color: '#ffffff',
  },

  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },

  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})
