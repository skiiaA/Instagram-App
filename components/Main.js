import React, { Component, useEffect } from 'react'
import { View , Text} from 'react-native'


import FeedScreen from './main/Feed'

import ProfileScreen from './main/Profile'
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {

    // constructor (props){
    //     super(props)
    //     this.navigation = props.navigation
    // }


    componentDidMount(){
        console.log("componentDidMount initaitaed")
        this.props.fetchUser()

        console.log(this.props)
        const unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default behavior
        
            // e.preventDefault();
            console.log(e)
            // Do something manually
            // ...
        });
        console.log("unsubsrcibe initaitaed", unsubscribe)
        // return unsubscribe;
    }

    render() {



        return (
            <Tab.Navigator initialRouteName="Feed" labeled = {false}>
                <Tab.Screen name="Feed"   
                component={FeedScreen} 
                options = {{
                    tabBarIcon : ({ color, size} ) => (
                        <MaterialCommunityIcons name = "home" color = {color} size = {26} />
                    ),
                }}/>

                <Tab.Screen name="AddContainer"   
                component={EmptyScreen} 
                listerners = {({ navigation } ) => ({
                    tabPress : (event) => {
                        event.preventDefault()
                        navigation.navigate("AddS")
                        
                    }
                })}
                options = {{
                    tabBarIcon : ({ color, size} ) => (
                        <MaterialCommunityIcons name = "plus-box" color = {color} size = {26} />
                    ),
                }}/>

                <Tab.Screen name="Profile"   
                component={ProfileScreen} 
                options = {{
                    tabBarIcon : ({ color, size} ) => (
                        <MaterialCommunityIcons name = "account-circle" color = {color} size = {26} />
                    ),
                }}/>
                
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser : store.userState.currentUser 
})

//what does it do ?
const mapDispatchProps = ( dispatch) => bindActionCreators({ fetchUser}, dispatch)

export default connect( mapStateToProps, mapDispatchProps )(Main)
