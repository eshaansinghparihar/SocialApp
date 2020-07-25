import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator,StatusBar, LayoutAnimation } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
class Notification extends Component{
    static navigationOptions={
        header:null,
    }
    constructor(props){
        super(props);
        this.state = {
            email: '',
            displayName: '',
        }
        this.signOutUser=this.signOutUser.bind(this);
    };
    componentDidMount(){
        const {email,displayName}=firebase.auth().currentUser
        this.setState({email:email,displayName:displayName})
    }
    signOutUser=()=>{
        firebase.auth().signOut();
    }
    render(){
        LayoutAnimation.easeInEaseOut();
        return(
            <View style={styles.container}>
                <Text>NotificationScreen</Text>
                <Text>{this.state.email}</Text>
                <Text>{this.state.displayName}</Text>
                <TouchableOpacity
                    style={styles.signOut}
                    onPress={() => this.signOutUser()}
                        >
                                    <Text style={styles.text}><AntDesign name="left" size={28} color="white" /> </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: "bold",
  },
  signOut: {
    alignItems: 'center',
    backgroundColor: '#e64a19',
    padding: 10,
    color: "white",
    borderRadius:20,
    marginBottom:30,
},
});
export default Notification;