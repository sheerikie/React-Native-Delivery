import React, { Component } from 'react';
import { View,  Text, StyleSheet, Dimensions, TouchableOpacity,Platform } from 'react-native';
import MapView, {
    Marker,
    AnimatedRegion,
    Polyline,
    PROVIDER_GOOGLE
  } from "react-native-maps";
  import * as Location from 'expo-location';
  import * as Permissions from 'expo-permissions';
  import haversine from "haversine"

  
// const LATITUDE = 29.95539;
// const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 1.2998;
const LONGITUDE = 36.7807;

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

 class location  extends Component{
        constructor(props) {
        super(props);
    
        this.state = {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          routeCoordinates: [],
          distanceTravelled: 0,
          prevLatLng: {},
          coordinate: new AnimatedRegion({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: 0,
            longitudeDelta: 0
          })
        };
      }
      async componentDidMount() {
        const { status } = await Permissions.getAsync(Permissions.LOCATION)
    
        if (status !== 'granted') {
          await Permissions.askAsync(Permissions.LOCATION)
        }
    
        
        const { coordinate } = this.state;
        this.watchID = navigator.geolocation.watchPosition(
          (position) => {
            const { routeCoordinates, distanceTravelled } = this.state;
            const { latitude, longitude } = position.coords;
    
            const newCoordinate = {
              latitude,
              longitude
            };
    
            if (Platform.OS === "android") {
              if (this.marker) {
                this.marker._component.animateMarkerToCoordinate(
                  newCoordinate,
                  500
                );
              }
            } else {
              coordinate.timing(newCoordinate).start();
            }
    
            this.setState({
              latitude,
              longitude,
              routeCoordinates: routeCoordinates.concat([newCoordinate]),
              distanceTravelled:
                distanceTravelled + this.calcDistance(newCoordinate),
              prevLatLng: newCoordinate
            });
          },
          error => console.log(error),
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
            distanceFilter: 10
          }
        );
      }
    
      componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
      }
    
      getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
    
      calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
      };
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
      <View style={styles.container} >
        <MapView
         testID={'map'}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
        </MapView>
        <View>
        <TouchableOpacity style={[styles.bubble, styles.button]}>
            <Text style={styles.bottomBarContent}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    
    )

  }
  
}
const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      alignItems: "center"
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
    },
    bubble: {
      flex: 0.2,
      backgroundColor: "rgba(255,255,255,0.7)",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20
    },
    latlng: {
      width: 200,
      alignItems: "stretch"
    },
    button: {
      width: 200,
      paddingHorizontal: 12,
      alignItems: "center",
      marginHorizontal: 10
    },
    buttonContainer: {
      flexDirection: "row",
      marginVertical: 20,
      backgroundColor: "transparent"
    }
  });
export default location