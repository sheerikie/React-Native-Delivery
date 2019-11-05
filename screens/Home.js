import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import TabBar from "react-native-nav-tabbar";
import { Button } from 'react-native-elements'
import { withFirebaseHOC } from '../config/Firebase'
import Location from './location'


 class Home extends Component {
  handleSignout = async () => {
    try {
      await this.props.firebase.signOut()
      this.props.navigation.navigate('Auth')
    } catch (error) {
      console.log(error)
    }
  }
  render() {
    return (
      <View style={styles.container}>
          <TabBar>
              <TabBar.Item
                icon={require('../images/Home.png')}
                selectedIcon={require('../images/HomeActive.png')}
                title="Home"
              >
                <View style={styles.textContent}>
                    <Text style={{fontSize: 18}}>Home</Text>
                    <Button
                    title='Signout'
                    onPress={this.handleSignout}
                    titleStyle={{
                      color: '#F57C00'
                    }}
                    type='clear'
                  />
                </View>
              </TabBar.Item>
              <TabBar.Item>
                <View style={styles.textContent}>
                    <Text style={{fontSize: 18}}>Location Tracker</Text>
                    <Location/>
                </View> 
              </TabBar.Item>
              <TabBar.Item
                icon={require('../images/My.png')}
                selectedIcon={require('../images/MyActive.png')}
                title="Distance Calculator"
              >
                <View style={styles.textContent}>
                    <Text style={{fontSize: 18}}>Me</Text>
                </View>
                
              </TabBar.Item>
          </TabBar>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection:"row",
      justifyContent:"flex-end",
      alignItems: 'center',
      backgroundColor: "#efeff4",
  },
  textContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  }
});


export default withFirebaseHOC(Home)