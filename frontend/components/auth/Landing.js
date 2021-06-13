import React from 'react'
//rcf
import {Button, Text, View} from 'react-native'
// div is html tag and used in react - react natice uses view

export default function Landing({navigation}) {
    return (
        <View style={{flex:1, justifyContent : 'center'}}>
            <Button 
                title = 'Register'
                onPress = { () => navigation.navigate("Register") } />
            <Button 
                title = 'Login'
                onPress = { () => navigation.navigate("Login") } />
            
        </View>
    )
}

