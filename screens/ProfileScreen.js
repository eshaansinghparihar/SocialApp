import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import {Tile} from 'react-native-elements';
import * as firebase from "firebase";
import Fire from "../Fire";
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


export default class ProfileScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
      post:[],
      userid:null,
      
    };
    unsubscribe =null;
  }

  

  componentDidMount() {
    const userid=(this.props.uid || Fire.shared.uid);
    this.setState({userid:userid});

    this.setState({
      post: (db = [
        firebase
          .firestore()
          .collection("posts")
          .where('uid', '==', userid)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(doc => {
              let posts = querySnapshot.docs.filter(doc => {doc.uid===userid});
              db.push(doc.data());
            });
          })
      ])
    });

    const user = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot(doc => {
        this.setState({ user: doc.data() });
      });
      }
  componentWillUnmount() {
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
    this.setState({ refreshing: false }); //Stop Rendering Spinner
  }
renderPost = (post,index) => {
  if (post._40 === 0) 
{
  return(
    <View></View>
  );
}
else{
  return (
    <View>
          <Tile
      key={index}
      title={post.text}
      imageSrc={{ uri: post.image}}
      caption={post.displayName}
      fontWeight='bold'
      featured
      titleStyle={{color:'white',fontWeight:"bold"}}
      captionStyle={{color:'white',fontWeight:"bold"}}
        />
    </View>
  );
}
};


  render() {
    // (this.state.post.filter((item)=>{(this.props.uid || Fire.shared.uid)===item.uid}))
    // console.log(this.state.user.displayName)
    // var username=this.state.user.displayName;
    
    // const {userid}=this.state;
    // console.log(userid)
    // this.state.post.map((pos)=>{console.log(pos)})
    var postnumber=this.state.post.length-1;
    // console.log(postnumber);
    // const result= this.state.post.filter(pos=>{userid===pos.uid})
    // console.log(result.length);
    // array.map(item=>console.log(item));
    return (
      <View style={styles.container}>
          <View style={styles.header}>
                  <Text style={styles.headerTitle}>Profile</Text>
            </View>
        <View style={{ marginTop: 64, alignItems: "center" }}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                this.state.user.avatar
                  ? { uri: this.state.user.avatar }
                  : require("../assets/authscreen.jpg")
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{this.state.user.displayName}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>{postnumber}</Text>
            <Text style={styles.statTitle}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>0</Text>
            <Text style={styles.statTitle}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>0</Text>
            <Text style={styles.statTitle}>Following</Text>
          </View>
        </View>

        <Button
          onPress={() => {
            Fire.shared.signOut();
          }}
          title="Log out"
        />

        <FlatList
          style={styles.feed}
          data={this.state.post}
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
    flex: 1
  },
  profile: {
    marginTop: 64,
    alignItems: "center"
  },
  avatarContainer: {
    shadowColor: "#151734",
    shadowRadius: 30,
    shadowOpacity: 0.4
  },
  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68
  },
  name: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "600"
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 32
  },
  stat: {
    alignItems: "center",
    flex: 1
  },
  statAmount: {
    color: "#4F566D",
    fontSize: 18,
    fontWeight: "300"
  },
  statTitle: {
    color: "#C3C5CD",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4
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
  }
});