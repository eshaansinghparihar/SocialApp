import React from "react";
import {View,Text,StyleSheet,Image,FlatList,RefreshControl} from "react-native";
import { Input } from 'react-native-elements';
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import * as firebase from "firebase";
import Fire from "../Fire";
import { TouchableOpacity } from "react-native-gesture-handler";
require("firebase/firestore");
var db = [
    firebase
          .firestore()
          .collection("posts")
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              let posts = querySnapshot.docs.map(doc => doc.data());
              // console.log(posts);
              return posts;
            });
          })
          .catch(err=>alert(err))
    
];
 
// let getDocs = () => {
//   // [START get_multiple_all]
//   return [
//     firebase
//       .firestore()
//       .collection("posts")
//       .get()
//       .then(function(querySnapshot) {
//         querySnapshot.forEach(function(doc) {
//           let posts = querySnapshot.docs.map(doc => doc.data());
//           console.log(posts);
//           return posts;
//         });
//       })
//   ];

//   // [END get_multiple_all]
// };

export default class HomeScreen extends React.Component {
    static navigationOptions={
        header:null
    }
    constructor(props){
        super(props);
        this.state = {
            refreshing: false,
            dataSource: db,
            user:{},
            comment:''
          }
        
    }
    componentDidMount(){
      const userid=(this.props.uid || Fire.shared.uid);
      this.unsubscribe=firebase.firestore().collection("users").doc(userid).onSnapshot(doc => {
        this.setState({ user: doc.data() });
      });
      
    }
    componentWillUnmount(){
      this.unsubscribe();
    }
    handleLike(postId){
      // firebase.firestore().collection("posts").doc(postId).collection("like").add({
      //   user:this.state.user.displayName
      //   })
      firebase.firestore().collection("posts").doc(postId).update({
        like:firebase.firestore.FieldValue.arrayUnion(this.state.user.displayName)
        })
    }
    handleComment(postId){
      firebase.firestore().collection("posts").doc(postId).update({
        comment:firebase.firestore.FieldValue.arrayUnion({comment:this.state.comment,displayName:this.state.user.displayName}),
        })
      this.setState({comment:''})
    }
    _refreshControl() {
        return (
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this._refreshListView()}
          />
        );
      }
      _refreshListView() {
        //Start Rendering Spinner
        this.setState({ refreshing: true });
    
        //Updating the dataSource with new data
        this.setState({
          dataSource: (db = [
            firebase
              .firestore()
              .collection("posts")
              .get()
              .then(function(querySnapshot) {
                querySnapshot.forEach(doc => {
                  let posts = querySnapshot.docs.map(doc => doc.data());
                  db.push(doc.data());
                });
              })
          ])
        });
        this.setState({ refreshing: false }); 
        //Stop Rendering Spinner
      }
      renderComments(comment){
        return(        
        <Text style={styles.comment}>
          {(comment===undefined)?'':comment.displayName} commented {(comment===undefined)?'':comment.comment}
        </Text>
        );

      }
      renderPost = post => {
    var postId=post.postId
    var like=post.like;
    var comments=post.comment

    if (post._40 === 0) 
    {
      return(
        <View></View>
      );
    }
    else{
      return (
        <View style={styles.feedItem}>
          <Image source={post.avatar? { uri: post.avatar }: require("../assets/authscreen.jpg")} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <View>
                <Text style={styles.name}>{post.displayName}</Text>
                <Text style={styles.timestamp}>
                  {moment(post.timestamp).fromNow()}
                </Text>
              </View>

              <TouchableOpacity><Ionicons name="ios-more" size={24} color="#73788B" /></TouchableOpacity>
            </View>
            <Text style={styles.post}>{post.text}</Text>
            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={{ flexDirection: "row" }}>
            <Text style={styles.like}>
              {(like===undefined)?(0):like[0]} {(like===undefined ) ? '': `and ${like.length -1}  others `} like this.
              {/* {(like.length===undefined || like.length===0) ? '': `${like.length -1}  others `} */}

            </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={()=>this.handleLike(postId)}><Ionicons
                name="ios-heart-empty"
                size={24}
                color="#73788B"
                style={{ marginRight: 16 }}
              /></TouchableOpacity>
              <TouchableOpacity onPress={()=>this.handleComment(postId)}><Ionicons name="ios-chatboxes" size={24} color="#73788B" /></TouchableOpacity>
    
              <View style={{ flexDirection: "row" ,justifyContent:'center'}}>
                <Input
                    placeholder="Add your thoughts here !"
                    onChangeText={(comment) => this.setState({comment})}
                    value={this.state.comment}
                    containerStyle={styles.formInput}></Input>

            </View>
            </View>
            <FlatList
              style={styles.comment}
              data={comments}
              renderItem={({ item }) => this.renderComments(item)}
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              ></FlatList>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>
        <FlatList
          style={styles.feed}
          data={this.state.dataSource}
          // {this.state.dataSource}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item, index) => String(index)}
          showsVerticalScrollIndicator={false}
          refreshControl={this._refreshControl()}
        ></FlatList>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EBECF4"
    },
    formInput: {
      height: 20,
      backgroundColor:"#fff",
      marginTop:10,
      marginBottom:10,
      justifyContent:'center',
      marginHorizontal:-16
  },
    header: {
      paddingTop: 64,
      paddingBottom: 16,
      backgroundColor: "#FFF",
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#EBECF4",
      shadowColor: "#454D65",
      shadowOffset: { height: 5 },
      shadowRadius: 15,
      shadowOpacity: 0.2,
      zIndex: 10
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "500"
    },
    feed: {
      marginHorizontal: 16
    },
    feedItem: {
      backgroundColor: "#FFF",
      borderRadius: 5,
      padding: 18,
      flexDirection: "row",
      marginVertical: 8
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 16
    },
    name: {
      fontSize: 15,
      fontWeight: "500",
      color: "#454D65"
    },
    timestamp: {
      fontSize: 11,
      color: "#C4C6CE",
      marginTop: 4
    },
    like: {
      fontSize: 13,
      color: "#000",
      marginTop: 4
    },
    comment: {
      fontSize: 13,
      color: "#000",
      marginTop: 4,
      marginBottom:8,
      justifyContent:'flex-start',
      // alignItems:'center'
    },
    post: {
      marginTop: 16,
      fontSize: 14,
      color: "#838899"
    },
    postImage: {
      width: undefined,
      height: 150,
      borderRadius: 5,
      marginVertical: 16
    }
  });