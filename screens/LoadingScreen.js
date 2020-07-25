import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
                <StatusBar style="auto" />
                <Text style={styles.text}>Loading</Text>
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
    fontSize:24,
    margin:10,
    fontWeight:"500",
    color:'black'
  }
});
export default Loading;