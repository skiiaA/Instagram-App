import firebase from 'firebase'

import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA} from '../constants/index'

import { SnapshotViewIOSComponent } from 'react-native'
require('firebase/firestore')


export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then( (snapshot) => {
                if (snapshot.exists) {
                    // console.log(snapshot.data())
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                }
                else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
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

                console.log("In fetchUserPosts disp POSTS")
                
                console.log(posts)
                
                dispatch( { type: USER_POSTS_STATE_CHANGE, posts } )

            })
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                // multiple dispatches allowed
                
                dispatch( { type: USER_FOLLOWING_STATE_CHANGE, following } );
                
                for(let i = 0; i < following.length; i++){
                    dispatch(fetchUsersData(following[i], true));
                }
            })
    })
}


//doubt
export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState()
                        .usersState
                        .users
                        .some(el => el.uid === uid);
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        
                        let user = snapshot.data()
                        user.uid = snapshot.id

                        dispatch( { type: USERS_DATA_STATE_CHANGE, user } )
                    
                        // dispatch(fetchUsersFollowingPosts(user.uid));
                    }
                    else {
                        console.log('does not exist')
                    }
                })

                if(getPosts){
                    dispatch(fetchUsersFollowingPosts(uid));
                }
        }
    })
}

// how is value lost 
export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                
                try {
                    // const uid = snapshot.query.EP.path.segments[1];
                    const uid = snapshot.docs[0].ref.path.split('/')[1];

                    console.log( {snapshot, uid} )
                    
                    const user = getState()
                                    .usersState
                                    .users
                                    .find(el => el.uid === uid);


                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data, user }
                    })


                    // this part throws error
                    
                    // for(let i = 0; i< posts.length; i++){
                    //     dispatch(fetchUsersFollowingLikes(uid, posts [i].id))
                    // }
                    
                    console.log("In fetchUsersFollowingPosts disp POSTS")
                    
                    console.log(posts)

                    dispatch({ type:    USERS_POSTS_STATE_CHANGE, posts,    uid   } )
                
                    console.log("In fetchUsersFollowingPosts disp GETSTATE(")
                    
                    console.log(getState())
                    }
                catch{

                }

            })
    })
}

// this part throws error 

// export function fetchUsersFollowingLikes(uid, postId) {
//     return ((dispatch, getState) => {
//         firebase.firestore()
//             .collection("posts")
//             .doc(uid)
//             .collection("userPosts")
//             .doc(postId)
//             .collection("likes")
//             .doc(firebase.auth().currentUser.uid)
//             .onSnapshot((snapshot) => {

//                 const postId = snapshot.ZE.path.segments[3];

//                 let currentUserLike = false;
//                 if(snapshot.exists){
//                     currentUserLike = true;
//                 }

//                 dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
//             })
//     })
// }




