import React, { Component } from "react";
import {
  StyleSheet,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import * as Permissions from 'expo-permissions';
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE
} from "react-native-maps";
import haversine from "haversine";

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

class Location extends Component {
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
  //   getLocation Permission and call getCurrentLocation method
  async  componentDidMount() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION)
    
    if (status !== 'granted') {
      await Permissions.askAsync(Permissions.LOCATION)
    }

    
    const { coordinate } = this.state;
    console.log(coordinate);


  //   getting the current Location of a user...
  this.watchId = navigator.geolocation.watchPosition(position => {
    console.log('watchposition: ', position);
    const { latitude, longitude } = position.coords;
    const {  routeCoordinates, distanceTravelled } = this.state;
    const newCoordinate = { latitude, longitude };
    

      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(
            newCoordinate,
            500
          );
        }
        console.log('marker',this.marker);
      } else {
        coordinate.timing(newCoordinate).start();
      }

      this.setState({
        latitude,
        longitude,
        routeCoordinates: routeCoordinates.concat([newCoordinate]),
        distanceTravelled:distanceTravelled + this.calcDistance(newCoordinate),
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
  )};


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
export default Location