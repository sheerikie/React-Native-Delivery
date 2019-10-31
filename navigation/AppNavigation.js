import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import Location from '../screens/location'

const AppNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    //Location: { screen: Location }
  },
  {
    initialRouteName: 'Home'
  }
)

export default AppNavigation
