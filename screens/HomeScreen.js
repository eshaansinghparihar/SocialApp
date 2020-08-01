import React from "react";
import {View,Text,StyleSheet,Image,FlatList,RefreshControl} from "react-native";
import { Input } from 'react-native-elements';
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import FeedItem from './FeedItem';
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
      this._refreshListView();
      const userid=(this.props.uid || Fire.shared.uid);
      this.unsubscribe=firebase.firestore().collection("users").doc(userid).onSnapshot(doc => {
        this.setState({ user: doc.data() });
      });
      
    }
    componentWillUnmount(){
      this.unsubscribe();
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


  render() {
    var {dataSource}=this.state
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>
        <FlatList
          style={styles.feed}
          data={dataSource}
          renderItem={({ item }) => <FeedItem post={item} user={this.state.user}/>}
          // {this.state.dataSource}
          // renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item, index) => String(index)}
          showsVerticalScrollIndicator={false}
          refreshControl={this._refreshControl()}
          extraData={this.state.dataSource}
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
      paddingTop: 16,
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