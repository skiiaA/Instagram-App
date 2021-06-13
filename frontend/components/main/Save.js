
import React, { useState } from 'react'

import { View, TextInput, Image, Button } from 'react-native'

import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Save(props) {

    // console.log(props);

    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        
        const uri = props.route.params.image;
        
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        // console.log(childPath)

        const response = await fetch(uri);
        const blob = await response.blob();

        // adds to storage
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        // how are these reated to task ?
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                
                savePostData(snapshot); // crates post in firestore database

                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        // how does it work ? what is general order
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {


    /** The action 'POP_TO_TOP' was not handled by any navigator.

    Is there any screen to go back to?

    This is a development-only warning and won't be shown in production.  */

        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
            }))
    }
    return (
        <View style={{ flex: 1 }}>
            
            <Image 
                source = {{ uri: props.route.params.image }} />
            
            <TextInput
                placeholder = "Write a Caption ..."
                onChangeText= { (caption) => setCaption(caption)}
            />

            <Button 
                title="Save" 
                onPress={() => uploadImage()} />
        
        </View>
    )
}