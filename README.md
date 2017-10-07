
##### Installation to run

```
$ npm install
```

##### Then to run for iOS

```
$ react-native run-ios

```

##### For Android

```
$ react-native run-android
```


# Explanation of React-Native-Navigation Wix with Redux


React Native version: 0.47.1

##### Folder Structure:

```

/src
  --/actions
     actiontypes.js
     index.js
  --/components
     --/screens
        homeTab.js
        login.js
        screens.js
        searchTab.js
  --/img
     checkmark.png
  --/reducers
     index.js
     rootReducer.js
 app.js
 
```

##### app.js
The app component will behave as our overall application, and within app the navigators will exist in there
```
app
    SingleScreenApp
        Login
    TabScreenApp
        home
        search
```
The function **startApp()** will change the app's current navigator based on our variable *root* the values that *root* can have are *login* (SingleScreenApp) for when the user is logging in for the first time and *after-login* (TabScreenApp) for when the user has logged in. 

In order for the app to know whether or not these live changes happened we must use Redux's Store. Store has three important methods, **getState()**, it gets the current state of the redux store, the second Store method is called **dispatch()**, it lets you dispatch actions to let you change the state of your application using reducers. With the help of the third redux store method, called **subscribe()**, it lets you register a callback that redux will call anytime an action has been dispatched

By subscribing our store to the method *onStoreUpdate()*, whenever an action is dispatched, **onStoreUpdate()** will be ran to check if the root has been altered. If it has, it will run **startApp()** with the new root value: *login*, or *after-login*.
```
export default class  App extends Component {
    constructor(props) {
        super(props);
        store.subscribe(this.onStoreUpdate.bind(this));
        store.dispatch(appActions.appInitialized());
      }
 
      onStoreUpdate() {
          let {root} = store.getState().app;
          // handle a root change
              if (this.currentRoot != root) {
                this.currentRoot = root;
                this.startApp(root);
              }
            }
    
    startApp(root) {
        switch (root) {
          Navigation.startSingleScreenApp({
            case 'login':
                  screen: {
                    screen: 'ReactNativeReduxExample.Login', 
                    title: 'Welcome', 
                    navigatorStyle: {}, 
                    navigatorButtons: {} 
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
                    overrideBackPress: false, //this can be set to true for android
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
            default: //no root found
          }
    }
```

# Passing Store to components

To have your components access to the states that you are keeping track of through redux, you pass the store and provider when registering your navigation components.

##### src/components/screens.js
```

import { Navigation } from 'react-native-navigation';
import Login from './login';
import HomeTab from './homeTab';
import SearchTab from './searchTab';

export default (store, Provider) =>  {
Navigation.registerComponent('ReactNativeReduxExample.Login', () => Login, store, Provider);
Navigation.registerComponent('ReactNativeReduxExample.HomeTab', () => HomeTab, store, Provider);
Navigation.registerComponent('ReactNativeReduxExample.SearchTab', () => SearchTab, store, Provider);
}

```

# How the root state is managed via reducers

In Redux, actions are simply objects that describe the type of changes being done in the app, and reducers are functions that perform those changes directly to the state.

The **combineReducers()** creates a mapping of which reducer will handle which state field in our Store. As an example:

the key, *todoslist* is a field in our state object, and the value next to that key represents the reducer that will handle that field in our state object. The same idea is applied to the *visibilityFilter* key in this example. By convention, you should name the the reducer the same as the state that it is handling.
```
const todoApp= combineReducers({
    todoslist: todoslist,
    visibilityFilter: visibilityFilter
});
```

Since the key and value are the same, we can use ES6 shorthand notation to get the same results.
```
const todoApp= combineReducers({
    todoslist,
    visibilityFilter
});
```

Keeping this idea in mind, we head back to our own code.  In our application we have the root reducer handling the root state. In redux, state must not be mutable.

The file *../actions/actiontypes* will just hold constants to indicate what type of action is being done.

##### rootReducer.js
```
import * as types from '../actions/actiontypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  root: undefined // 'login' / 'after-login'
});

//root reducer
export default function root(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return state.merge({
        root: action.root
      });
    default:
      return state;
  }
}
```

We then bundle our reducers into *Reducers/index.js*:
```
import root from './appReducer';
export {
    root
}
```

So that we can use this object that is being exported to be placed into our combineReducers method

```
import * as reducers from "./reducers/index";
const reducer = combineReducers(reducers);
```

We now know know which reducer handles which state field in our application. 

# Dispatching our first action and connecting components
We define an action creator, which is just a function that returns an action object. An action object should always have the *type* key field, to indicate what action is being done.

We then created **appInitialized()** method to set the root value as login for when the user first opens the application, **appInitialized()** calls the **changeAppRoot()**, which will return a a new action and dispatch that action to our reducers. The same logic is applied to **login()**

Thanks to the *redux thunk* we can make asynchronous requests based on our actions, vanilla redux is not capable of doing this. We would want this capability because for example, if a user clicked a button to do some API request, that event should grab data from a server, and then when that request is resolved, we create our action.

*for a clearer explanation of redux thunk refer to References section below*
```
return async function(dispatch, getState) {
    // since all business logic should be inside redux actions
    // this is a good place to put your app initialization code
    //run action creator to return action
```

##### src/actions/index
```
import * as types from './actiontypes';

//action creator
export function changeAppRoot(root) {
  return {
    type: types.ROOT_CHANGED, 
    root: root
  };
}

export function appInitialized() {
  return async function(dispatch, getState) {
    // since all business logic should be inside redux actions
    // this is a good place to put your app initialization code
    dispatch(changeAppRoot('login'));
  };
}

export function login() {
  return async function(dispatch, getState) {
    // login logic would go here, and when it's done, we switch app roots
    dispatch(changeAppRoot('after-login'));
  };
}
```
##### src/components/screens/login.js
Now that we have our actions defined, we created a method called onLoginPress, which will dispatch the action **login()**. 

We then must make this component be literally connected to redux's store so that we can call dispatch. We do this by running: **export default connect()(Login)**

```
import {connect} from 'react-redux';
import * as  appActions from '../../actions/index';
....
......
<Button large onPress={this.onLoginPress.bind(this)} title="Continue">
...
....

 onLoginPress() {
    this.props.dispatch(appActions.login());
  }
...
....

export default connect()(Login);
```

Redux is now set up with your wix navigator and a component which handles the navigation state.

# References:

**React-Native-Navigation Wix**
https://wix.github.io/react-native-navigation/#/

**Redux**
https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree

**Redux thunk**
https://www.youtube.com/watch?v=1QI-UE3-0PU

## Known Issues
On Android, when a user presses the hardware's backbutton, the application is minimized but when it is re-opened, it behaves as if it is launching for the first time, bringing you back to the single screen view. This behavior does not occur when the user presses the hardware's home button or 'the right button on the android'.

## Possible Solution
To fix this, you could save a Javascript Web Token (JWT) using AsyncStorage once the user is done "signing up" and if the user closes the app and re-opens it, the application should check if there is a JWT that exists on the user's phone. The JWT data will persist thanks to AsyncStorage.

