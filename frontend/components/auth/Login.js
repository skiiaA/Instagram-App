import React, { Component } from 'react'
//rce
import { View, Button, TextInput } from 'react-native'

import firebase from 'firebase' 

export class Login extends Component {
    //constructor to initialize the components

    constructor(props){
        super(props)
        this.state  = {
            email : '',
            password : ''
        }

        this.onSignUp = this.onSignUp.bind(this)
        // bind the variables to sign up function 
    }

    onSignUp(){
        const { email, password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder = "email" // text disp when nothing entered
                    onChangeText = {(email) => this.setState({email})} 
                />
                <TextInput
                    placeholder = "password" // text disp when nothing entered
                    secureTextEntry = {true} // protected pass
                    onChangeText = {(password) => this.setState({password})} 
                />

                <Button
                    onPress = { () => this.onSignUp() }
                    title = "Sign In"
                />

            </View>
        )
    }
}

export default Login
