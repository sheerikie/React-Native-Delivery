import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons'; 

const startMainTab = () => {
  Promise.all([
    Icon.getImageSource("md-map", 30),
    Icon.getImageSource("ios-share-alt", 30)
  ]).then(sources => {
    Navigation.startTabBasedApp({
     
    tabs: [
      {
        screen: 'Location',
        label: 'Location',
        title: 'Location',
        icon: sources[0]
      },
      {
        screen: 'Search',
        label: 'Search',
        title: 'Search',
        icon: sources[1]
    }
]
});
});
}

export default startMainTab;
