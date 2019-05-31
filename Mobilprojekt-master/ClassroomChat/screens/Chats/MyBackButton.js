import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {withNavigation} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome'

class MyBackButton extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Icon
          style={styles.back}
          name='arrow-circle-left'
          title='back'
          onPress={() => {
            this.props.navigation.goBack()
          }}
        />
      </React.Fragment>
    )
  }
}

// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop
export default withNavigation(MyBackButton)

const styles = StyleSheet.create({
  back: {
    fontSize: 40,
    //marginRight:10,
    color: '#fdbca6',
    padding: 30,
  },
})
