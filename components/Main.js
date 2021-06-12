import React, { Component, useEffect } from 'react'
import { View , Text} from 'react-native'
import firebase from 'firebase'


import FeedScreen from './main/Feed'
import AddScreen from './main/Add'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'


import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';

import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions/index'
// import { fetchUser, fetchUserPosts } from '../redux/actions/index'

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


    // componentDidMount(){
    //     console.log("componentDidMount initaitaed")
    //     this.props.fetchUser()

    //     console.log(this.props)
    //     const unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
    //         // Prevent default behavior
        
    //         e.preventDefault();
    //         console.log(e)
    //         alert('Deafult Prevented')
    //         // Do something manually
    //         // ...
    //     });
    //     console.log("unsubsrcibe initaitaed", unsubscribe)
    //     // return unsubscribe;
    // }

    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }

    render() {
        return (
            < Tab.Navigator 
                initialRouteName = "Feed" 
                labeled = { false } >
                
                <Tab.Screen 
                    name = "Feed"   
                    component = { FeedScreen } 
                    options = { {
                        tabBarIcon : ({ color, size} ) => (
                            <MaterialCommunityIcons      name = "home" 
                                color = {color} 
                                size = {26} />
                        ),
                    }} />

                < Tab.Screen 
                    name = "Search" 
                    component = { SearchScreen } 
                    navigation = { this.props.navigation }
                    options = { {
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons 
                                name = "magnify" 
                                color = { color } 
                                size = { 26 } />
                        ),
                    }} />
                
                <Tab.Screen 
                    name = "AddContainer"   
                    component = { EmptyScreen } 
                    // navigation = {this.props.navigation}
                    listeners = {({ navigation }) => ({
                        tabPress : (event) => {
                            event.preventDefault()
                            // alert('Deafult Prevented')
                            navigation.navigate("Add")
                        
                        }
                    })}
                    options = {{
                        tabBarIcon : ({ color, size} ) => (
                            <MaterialCommunityIcons name = "plus-box" 
                            color = {color} 
                            size = {26} />
                        ),
                    }}/>

                <Tab.Screen 
                    name = "Profile"   
                    component = { ProfileScreen } 
                    listeners = {({ navigation } ) => ({
                        tabPress : (event) => {
                            event.preventDefault()
                            // alert('Deafult Prevented')
                            navigation.navigate("Profile", {uid : firebase.auth().currentUser.uid})
                        
                        }
                    })}
                    options = {{
                        tabBarIcon : ({ color, size} ) => (
                            <MaterialCommunityIcons 
                                name = "account-circle"   
                                color = {color} 
                                size = {26} />
                            ),
                }}/>
                
            </Tab.Navigator>
        )
    }
}

// const mapStateToProps = (store) => ({
//     currentUser : store.userState.currentUser 
// })

// //what does it do ?
// const mapDispatchProps = ( dispatch) => bindActionCreators({ fetchUser, fetchUserPosts}, dispatch)

// export default connect( mapStateToProps, mapDispatchProps )(Main)



const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators( { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } , dispatch);

export default connect( mapStateToProps,  mapDispatchProps )(Main);