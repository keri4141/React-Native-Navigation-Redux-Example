import React, { Component } from 'react';
import {
  AppRegistry,
  TouchableOpacity,
  Text,
  Button,
  View
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import * as  appActions from '../../actions/index';

export class Login extends Component {

  render() {
    return (
        <View>
            <Button large onPress={ () => this.onLoginPress()} title="Continue">
                <Text> Continue</Text>
            </Button>
        </View>
        
    );
  }

  /*
  onLoginPress:
    Changes the root value of the app to be 'after-login', changing it to tab view
  */
  onLoginPress() {

    this.props.dispatch(appActions.login());
   
  }
}


export default connect()(Login);