import FirebaseKeys from './config.js';
import firebase from 'firebase';

class Fire{
    constructor(props){
        if (!firebase.apps.length) {
            firebase.initializeApp(FirebaseKeys);
          }
    }
    get firestore(){
        return firebase.firestore();
    }
    get uid(){
        return (firebase.auth().currentUser|| {}).uid;
    }
    get timestamp(){
        return Date.now();
    }
    get displayName(){
        return (firebase.auth().currentUser|| {}).displayName;
    }
    addPost = async ({displayName, text, localUri, avatar}) => {
        // const id = uuid.v4();
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);
        return new Promise((res, rej) => {
            this.firestore
                .collection('posts')
                .add({
                    displayName:displayName,
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri,
                    avatar:avatar
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    alert(error);
                    rej(error);
                    
                });
        });
    };
    // addPost = async ({ text, localUri, uri, name }) => {
    //     // const id = uuid.v4();
    //     const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);
    //     const avatarUri = await this.uploadPhotoAsync(uri, `avatars/${this.uid}`);
    //     return new Promise((res, rej) => {
    //         this.firestore
    //             .collection('posts')
    //             .add({
    //                 // id: id,
    //                 name,
    //                 avatar: avatarUri,
    //                 text,
    //                 uid: this.uid,
    //                 timestamp: this.timestamp,
    //                 image: remoteUri
    //             })
    //             .then(ref => {
    //                 res(ref);
    //             })
    //             .catch(error => {
    //                 rej(error);
    //             });
    //     });
    // };

    uploadPhotoAsync = async (uri, filename) => {
        
        
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob()

            let upload = firebase
                .storage()
                .ref(filename)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        })
        .catch((error) => {
            console.error(error);
        });
    };
    createUser = async user => {
        let remoteUri = null;

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

            let db = this.firestore.collection('users').doc(this.uid);

            db.set({
                displayName: user.displayName,
                email: user.email,
                avatar: null
            });

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);
                db.set({ avatar: remoteUri }, { merge: true });
            }
        } catch (error) {
            alert("Error: ", error);
        }
    };

    signOut = () => {
        firebase.auth().signOut();
    };
//     addPost = async ({text, localUri})=>{
//         const remoteUri = await this.uploadPhotoAsync(localUri)

//         return new Promise((res,rej)=>{
//             this.firestore
//             .collection("posts")
//             .add(
//                 {
//                     text:text,
//                     uid:this.uid,
//                     timestamp:this.timestamp,
//                     image:remoteUri
//                 }
                
//             ).then(ref=>{res(ref)
//             }).catch(err=>rej(err)
//             );
            
//         });
// }

//     uploadPhotoAsync = async (uri)=>{
//         const path = `photos/${this.uid}/${Date.now()}.jpg`;
//         return new Promise((res,rej)=>{
//             const response = fetch(uri);
//             const file= response.blob()

//         let upload = firebase
//         .storage()
//         .ref(path)
//         .put(file);

//         upload.on(
//             "state_changed",
//             snapshot=>{},
//             err=>{
//                 rej(err);
//             },
//             async ()=>{
//                 const url =await upload.snapshot.ref.getDownloadURL();
//                 res(url);
//             }
//         )
//         }
//     )}
    }
    Fire.shared=new Fire;
    export default Fire;