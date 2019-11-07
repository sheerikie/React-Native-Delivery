import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Image
} from 'react-native';
import TabBar from "react-native-nav-tabbar";
import { Button } from 'react-native-elements'
import { withFirebaseHOC } from '../config/Firebase'
import Location from './location'
import Search from './search'
import * as firebase from 'firebase'
import 'firebase/auth'


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
    var user = firebase.auth().currentUser;
    console.log(user);
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
                    <Image source={{uri:user.photoURL }}
                     style={{width: 100, height: 100}} />
                     {(user.photoURL==null) ?
                     <Image source={{uri:'https://img.icons8.com/android/144/000000/user.png',
                      cache: 'only-if-cached', }} style={{width: 100, height: 100}} />
                      : null}
                    <Text  style={{fontSize: 18}}>Welcome: {user.displayName}</Text>
                    <Text>Your Email is: {user.email}</Text>
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
                icon={require('../images/settings.png')}
                selectedIcon={require('../images/settings.png')}
                title="DC"
              >
                <View style={styles.textContent}>
                    <Text style={{fontSize: 18}}>Calculate From Current Location</Text>
                    <Search/>
                  
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