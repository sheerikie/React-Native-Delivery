import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import Location from '../screens/location'
import Search from '../screens/search'

const AppNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    Location: { screen: Location },
    Search: { screen: Search }
  },
  {
    initialRouteName: 'Home'
  }
)

export default AppNavigation
