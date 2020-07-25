import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView ,StatusBar,Image,TextInput, LayoutAnimation } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
// import * as firebase from 'firebase';
import Fire from '../Fire';
const firebase = require('firebase');
require('firebase/firestore');
class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
            displayName:'',
            text:'',
            image:null,
            avatar:'',
            user:{}
        }
    };
    componentDidMount() {
        this.getPermissionAsync();
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

      getPermissionAsync = async () => {
        if (Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        
      };
      handlePost=()=>{
        Fire.shared
        .addPost({
          displayName:this.state.user.displayName,
          text:this.state.text.trim(), 
          localUri:this.state.image,
          avatar:this.state.user.avatar,
          })
        .then(ref=>{
          if(ref!==null){
            alert('Upload Successful');
          }
          this.setState({
            text:'',
            image:null,
            localUri:'',
            avatar:'',
            user:{}
          });
          this.props.navigation.goBack();
        })
        .catch(err=>{
          alert(err);
        });
      }
      pickImage = async () => {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.cancelled) {
            this.setState({ image: result.uri });
          }
        } 
        catch (Err){
            alert(Err);
        } 
      };
    render(){
        LayoutAnimation.easeInEaseOut();
        return(
            
            // <SafeAreaView >
                <ScrollView style={styles.container}>
                  <View style={styles.header}>
                  <Text style={styles.headerTitle}>Post</Text>
                  </View>
                <View style={styles.input}>
                    <Image source={require('../assets/authscreen.jpg')} style={styles.avatar} />
                    <TextInput autoFocus={true} multiline={true} numberOfLines={4} style={{flex:1,padding:35}} placeholder={"Wanna share something?"} 
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}></TextInput>
                    <TouchableOpacity
                    style={styles.photo}
                    onPress={() => this.pickImage()}
                        >
                                    <Text style={styles.text}><Ionicons name="md-camera" size={28} color="black" /> </Text>
                    </TouchableOpacity> 

                </View>
                   <View style={{flex:1, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                   {this.state.image && <Image source={{ uri: this.state.image }} style={styles.imagePreview}/>}
                   </View>
                   <TouchableOpacity
                    style={styles.post}
                    onPress={() => this.handlePost()}
                        >
                                    <Text style={styles.text}><AntDesign name="upload" size={28} color="black" /> </Text>
                    </TouchableOpacity> 
                </ScrollView>
            // </SafeAreaView>
            
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: "bold",
  },
  post: {
    justifyContent:'center',
    alignItems:'center'
  },
input:{
    margin:32,
    flexDirection:"row",
},
avatar:{
    height:48,
    width:48,
    borderRadius:24,
    marginRight:16
},
imagePreview:{
    height:240,
    width:320,
    justifyContent:'center',
    flexDirection:"column"
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
export default Post;