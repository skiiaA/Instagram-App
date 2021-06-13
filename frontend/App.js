import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';

import { View, Text} from 'react-native';  

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))


import firebase from 'firebase/app'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9ZYXQKwIfls_vXY2oHP6ORXttDJc7u-I",
  authDomain: "instagram-21e91.firebaseapp.com",
  projectId: "instagram-21e91",
  storageBucket: "instagram-21e91.appspot.com",
  messagingSenderId: "696352589495",
  appId: "1:696352589495:web:7f240a52e19004b8f32f32",
  measurementId: "G-CEHT24DLQ5"
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'




const Stack = createStackNavigator();
// what does stack mean and what does it do?



export class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loaded : false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn : false,
          loaded : true,
        })
      }else {
        this.setState({
          loggedIn : true,
          loaded: true,
        })
      }
    })
  }

  render() {

    const {loggedIn, loaded} = this.state
    if(!loaded){
      return (
        <View   style={{flex:1 , justifyContent : 'center' }}>
          <Text>      Loading    </Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
      
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Landing" >
            <Stack.Screen 
              name = "Landing" 
              component = {LandingScreen} 
              options = {{ headerShown : false}}   />
            <Stack.Screen 
              name = "Register" 
              component = {RegisterScreen} 
              options ={{ headerShown : false}} />
            <Stack.Screen 
              name = "Login" 
              component = {LoginScreen} />
    
          </Stack.Navigator> 
        </NavigationContainer>
      );
    }

    return (
      // to make redux work add it into provider
      <Provider store = {store} >

        <NavigationContainer>

{/*         
          <Stack.Navigator initialRouteName = "Main">
            <Stack.Screen 
            name ="Main" 
            component ={MainScreen} 
            options ={{ headerShown : false}} />   */}


          
          <Stack.Navigator initialRouteName = "Main">
            <Stack.Screen 
            name ="Main" 
            component ={MainScreen}  />  

          <Stack.Screen 
            name ="Add" 
            component ={AddScreen} 
            navigation={this.props.navigation}
            /> 

          <Stack.Screen 
            name ="Save" 
            component ={SaveScreen} 
            navigation={this.props.navigation}
            /> 

          <Stack.Screen 
            name="Comment" 
            component={CommentScreen} 
            navigation={this.props.navigation}/>

          </Stack.Navigator> 

        

        </NavigationContainer>

      </Provider>

    )
  }
}

export default App
