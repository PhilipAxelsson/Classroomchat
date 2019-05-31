import React from 'react'
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  View,
  Text,
} from 'react-native'
import MapView from 'react-native-maps'
import {Marker} from 'react-native-maps'
import {Callout} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import Dialog, {DialogContent} from 'react-native-popup-dialog'
import Icon from 'react-native-vector-icons/FontAwesome'

const PLACES_URL = 'https://api.kth.se/api/places/v2/places'
const placesKey = process.env.KTH_KEY
const GOOGLE_MAPS_APIKEY =
  'AIzaSyDJXW7298OxzGsPqEOqOHOtgyPlIUQtN2Y&libraries=directions'

export default class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Map',
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      longitude: 0,
      latitude: 0,
      name: '',
      dataSource: [],
      userLong: '',
      userLat: '',
      visible: false,
      userCoordinates: [{latitude: 0, longitude: 0}],
    }
    this.mapView = null
    console.disableYellowBox = true
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLong: position.coords.longitude,
          userLat: position.coords.latitude,
          coordinates: [
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          ],
        })
      },
      err => alert(err)
    )
  }

  fetchPlacesData = () => {
    fetch(PLACES_URL, {
      method: 'GET',
      headers: {
        api_key: placesKey,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          loading: false,
          dataSource: responseJson,
        })
      })
      .catch(error => console.log(error))
  }

  componentWillMount = () => {
    this.getCurrentLocation()
    this.fetchPlacesData()
  }

  handleSearch(inputName) {
    let check = true
    for (i = 0; i < this.state.dataSource.length; i++) {
      if (this.state.dataSource[i].name == inputName) {
        this.setState({
          longitude: this.state.dataSource[i].longitude,
          latitude: this.state.dataSource[i].latitude,
          name: this.state.dataSource[i].name,
        })
        check = false
      }
    }
    if (check == true) {
      alert('room ' + inputName + ' does not exist')
    }
  }

  handleAlertMessage(long, lat) {
    let floor = ''
    let roomType = ''
    let name = ''
    let address = ''
    for (i = 0; i < this.state.dataSource.length; i++) {
      if (
        this.state.dataSource[i].longitude == long &&
        this.state.dataSource[i].latitude == lat
      ) {
        floor = this.state.dataSource[i].floor
        roomType = this.state.dataSource[i].roomType
        name = this.state.dataSource[i].name
        address = this.state.dataSource[i].longAddress
      }
    }

    return (
      'The room ' +
      name +
      ' is on the ' +
      floor +
      ' floor.\n\n Room Type: ' +
      roomType +
      '\n\n Address: ' +
      address
    )
  }

  onError = errorMessage => {
    alert(errorMessage)
  }

  render() {
    return (
      <React.Fragment>
        <Text style={styles.getStartedText}>Find room</Text>
        <MapView
          style={{flex: 1}}
          region={{
            //latitude: 59.3498092,
            //longitude: 18.0684758,
            latitude: Number(this.state.userLat),
            longitude: Number(this.state.userLong),
            latitudeDelta: 0.0922 / 5,
            longitudeDelta: 0.0421 / 5,
          }}
          showsUserLocation={true}
          zoomEnabled={true}
          onPress={Keyboard.dismiss}
        >
          <Marker
            coordinate={{
              latitude: Number(this.state.latitude),
              longitude: Number(this.state.longitude),
            }}
            onPress={() => {
              this.setState({visible: true})
            }}
          />
          <Callout>
            <KeyboardAvoidingView
              style={{flexDirection: 'row', marginTop: 40}}
            >
              <TextInput
                style={styles.inputs}
                placeholder={'Search for a room'}
                onSubmitEditing={() =>
                  this.handleSearch(this.state.name)
                }
                value={this.state.name}
                onChangeText={name => this.setState({name})}
              />
              <TouchableOpacity
                style={styles.smallBth}
                onPress={() => this.handleSearch(this.state.name)}
              >
                <Icon style={styles.search} name='search' />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Callout>

          <MapViewDirections
            origin={{
              latitude: Number(this.state.userLat),
              longitude: Number(this.state.userLong),
            }}
            destination={{
              latitude: Number(this.state.latitude),
              longitude: Number(this.state.longitude),
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            mode='walking'
            strokeWidth={4}
            strokeColor='#7cab99'
          />

          <View style={styles.popUp}>
            <Dialog
              visible={this.state.visible}
              onTouchOutside={() => {
                this.setState({visible: false})
              }}
            >
              <DialogContent>
                <Text style={styles.popUp}>
                  {this.handleAlertMessage(
                    this.state.longitude,
                    this.state.latitude
                  )}
                </Text>
              </DialogContent>
            </Dialog>
          </View>
        </MapView>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  popUp: {
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 22,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'grey',
    height: 40,
    width: 250,
    marginTop: 20,
  },
  calloutSearch: {
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 80,
    fontSize: 22,
  },
  calloutButton: {
    marginLeft: 10,
    marginRight: 10,
    borderColor: 'black',
    width: '90%',
    height: 40,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'red',
  },
  pinText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 2,
    marginTop: 2,
  },
  getStartedText: {
    //marginTop:10,
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#7cab99',
    padding: 30,
    fontWeight: 'bold',
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
    top: 5,
    margin: 5,
  },
  search: {
    fontSize: 20,
    color: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    marginLeft: 40,
  },
})

/*
export default class MapScreen extends React.Component {
  
  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(position => {
      alert(position.coords)
    }, err => alert(err));
  }
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config

    return <UserLocation getUserLocation={this.getUserLocationHandler}></UserLocation>;
  }
}
*/
