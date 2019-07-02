import _ from 'lodash'
import { NavigationActions } from 'react-navigation'

let _navigator: any

function setTopLevelNavigator (navigatorRef: any) {
  _navigator = navigatorRef
}

function navigate (routeName: string, params?: object) {
  if (_navigator) {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
    )
  }
}

function goBack () {
  if (_navigator) {
    _navigator.dispatch(
      NavigationActions.back()
    )
  }
}

function getActiveRouteName (navigationState: any) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

function getCurrentRouteName () {
  return getActiveRouteName(_navigator.state.nav)
}

export {
  getCurrentRouteName,
  navigate,
  goBack,
  setTopLevelNavigator
}