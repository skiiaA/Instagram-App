import React, { useState, useEffect } from 'react'

// rfc
import { StyleSheet, View, Text, FlatList, Button, Image } from 'react-native'

// import {Image} from 'react'
import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'


function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)

    // const { currentUser, posts} = props;
    // console.log({currentUser, posts});


    useEffect( () => {

        const { currentUser, posts} = props;
        // console.log({currentUser, posts});
        // console.log(`props.route.params.uid : ${props.route.params.uid}`)
        // console.log(`props : ${props}`)
        // console.log(props)
        // console.log(`props.route : ${props.route}`)
        // console.log(`props.route.params : ${props.route.params}`)
        // console.log(props.route.params.uid)
        // console.log(`this.props.match : ${props.match}`)
        // console.log(`this.props.match.params : ${props.match.params}`)
        // console.log(`this.props.match.params.id : ${props.match.params.id}`)
    
        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser)
            setUserPosts(posts)
        } 
        else{
            // fetch user 
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then( (snapshot) => {
                    if (snapshot.exists) {
                        // console.log(snapshot.data())
                        setUser(snapshot.data())
                    }
                    else {
                        console.log('does not exist')
                    }
                })
    
            // fetch user posts
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    // console.log(snapshot.docs) 
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    // console.log(posts)
                    setUserPosts(posts)
                })
            
            if (props.following.indexOf(props.route.params.uid) > -1) {
                setFollowing(true);
            } 
            else {
                setFollowing(false);
            }
            
        }
    }, [props.route.params.uid, props.following ] )
    // }, [] )

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if( user === null ){
        return <View/>
    }
    return (
        <View style = {styles.container} >
            <View style={styles.containerInfo  } >

                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {
                    props.route.params.uid !== firebase.auth().currentUser.uid ? (
                        <View>
                            {following ? (
                                <Button
                                    title="Following"
                                    onPress={() => onUnfollow()} />
                            ) :
                                (
                                    <Button
                                        title="Follow"
                                        onPress={() => onFollow()} />
                                )}
                        </View>
                    ) :
                        <Button
                            title="Logout"
                            onPress={() => onLogout()} />
                }
                

                <View style = {styles.containerGallery}>
                    <FlatList
                        numColumns={3}
                        horizontal={false}
                        data={userPosts}
                        renderItem = {({ item}) => 

                            <View
                                style={styles.containerImage}>

                                <Image
                                    style={styles.image}
                                    source={{uri : item.downloadURL }}
                                />
                                {/* <Text>`{item.downloadURL}`</Text> */}
                            
                            </View>
                            
                        }
                        />
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})



// what does it do
const mapStateToProps = (store) => ({
    currentUser:    store.userState.currentUser,
    posts:          store.userState.posts,
    following:      store.userState.following
})
export default connect(mapStateToProps, null)(Profile);