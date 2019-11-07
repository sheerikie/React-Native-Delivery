import React, { Component } from "react";
import { Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Alert, View,Text ,TouchableOpacity,StyleSheet} from 'react-native';
import haversine from 'haversine'
import pick from 'lodash/pick'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';



class Search extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {data: '',
                  details:'',
                  locationResult: null,
                  routeCoordinates: [],
                  distanceTravelled: 0,
                  prevLatLng: {}
  };
 
  }
  searchResults =(data,details)=>{
    this.setState({data:data, details:details, lat:details.geometry.location.lat,lng:details.geometry.location.lng})

  }
  componentDidMount() {
    this._isMounted = true;
    this._getLocationAsync();
 
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
    this.setState({
    locationResult: 'Permission to access location was denied',
    });
    }
    
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ latitude: JSON.stringify(location.coords.latitude),
      longitude: JSON.stringify(location.coords.longitude) });

    };

    

  render() {
    const start = {
      latitude: this.state.latitude,
      longitude:this.state.longitude
    }
    
    const end = {
      latitude:this.state.lat,
      longitude:this.state.lng
    }
    

    var distanceTravelled =distanceTravelled+ (haversine(start, end));
    console.log('distance',distanceTravelled);
    console.log(haversine(start, end))
    console.log(haversine(start, end, {unit: 'mile'}))
    console.log(haversine(start, end, {unit: 'meter'}), "meter")
    console.log(haversine(start, end, {threshold: 1}))
    console.log(haversine(start, end, {threshold: 1, unit: 'mile'}))
    console.log(haversine(start, end, {threshold: 1, unit: 'meter'}))
    
    return (
      <View style={{ paddingTop: 3, flex: 1 }}>
     
      <Text>My Current Latitude:{this.state.latitude}</Text> 
      <Text>My Current Longitude:{this.state.longitude}</Text> 
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="false" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description|| row.formatted_address || row.name} // custom description render
          onPress={this.searchResults}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyB4Mt05YyJetcQBMu0MJ8tz98_iISHWrNw ',
            language: 'en', // language of the results
            types: '(cities)', // default: 'geocode'
          }}
          styles={{
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: 'blue',
            },
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[]}
          debounce={200}
        />
      <Text>You type:{this.state.details.formatted_address}</Text>
      <Text>latitude:{this.state.lat}</Text>
      <Text>longitude:{this.state.lng}</Text>
      <View>
      <TouchableOpacity style={[styles.bubble, styles.button]}>
      <Text style={styles.bottomBarContent}>
        {parseFloat(haversine(start, end, {unit: 'meter'}), "meter").toFixed(2)} meters
      </Text>
    </TouchableOpacity>
  </View>
      </View>
    
    );}
  
};
const styles = StyleSheet.create({

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
  
export default Search
