import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator,Image,StatusBar } from 'react-native';
import * as firebase from 'firebase';
import Fire from '../Fire';
class Loading extends Component{
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user=>{
            this.props.navigation.navigate(user ? "App" : "Auth" )
        })
    }
    render(){
        return(
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <Image source={require("../assets/loading.jpg")} style={{marginTop:-540,right:-240, position:"absolute" ,resizeMode:'cover'}}></Image>
                <Text style={styles.text}>Socio</Text>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
  },
  text:{
    fontSize:48,
    margin:10,
    fontWeight:"600",
    color:'white'
  }
});
export default Loading;