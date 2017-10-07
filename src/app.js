import React, { Component } from 'react';
import {
 Platform,
 AppRegistry
} from 'react-native';
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import { Navigation } from 'react-native-navigation';
import registerScreens from './components/screens/screens.js';
import * as reducers from "./reducers/index";
import * as appActions from "./actions/index";
import thunk from "redux-thunk";
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
registerScreens(store, Provider);

export default class  App extends Component {

  constructor(props) {
    super(props);
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(appActions.appInitialized());
  }
 
  onStoreUpdate() {
      let {root} = store.getState().root;
     
      // handle a root change
      // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
      if (this.currentRoot != root) {
        this.currentRoot = root;
        this.startApp(root);
      }
    }
    
  startApp(root) {
    switch (root) {
        case 'login':
          Navigation.startSingleScreenApp({
                    screen: {
                    screen: 'ReactNativeReduxExample.Login', // unique ID registered with Navigation.registerScreen
                    title: 'Welcome', // title of the screen as appears in the nav bar (optional)
                    navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                    navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
                    },
                });
                return;
              
        case 'after-login':
            Navigation.startTabBasedApp({
                tabs: [
                {
                    label: 'Home',
                    screen: 'ReactNativeReduxExample.HomeTab',
                    icon: require('./img/checkmark.png'),
                    selectedIcon: require('./img/checkmark.png'),
                    title: 'Hey',
                    overrideBackPress: false,
                    navigatorStyle: {}
                },

                {
                    label: 'Search',
                    screen: 'ReactNativeReduxExample.SearchTab',
                    icon: require('./img/checkmark.png'),
                    selectedIcon: require('./img/checkmark.png'),
                    title: 'Hey',
                    navigatorStyle: {}

                    
                }
               
                ],
            });
            return;

          default: 
            console.log("Not Root Found");
        }
    }
}
