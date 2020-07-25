import React, {Component} from 'react';
import { StyleSheet, Text, View ,StatusBar, Image,TextInput} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Input} from 'react-native-elements';
import * as firebase from 'firebase';
class Login extends Component{

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage:null,
        }
    };
    handleLogin=()=>{
        const {username,password}=this.state;
        firebase.auth().signInWithEmailAndPassword(username,password).catch(error=> {this.setState({errorMessage:error.message})})
    }
    render(){
        return(
            <View styles={styles.container}>
                {/* <StatusBar barStyle="light-content"/> */}
                <Image source={require("../assets/loginscreen.jpg")} style={{marginTop:-420,right:0, position:"absolute"}}></Image>
                <Text style={styles.greeting}>{`Hello Again ,\n Welcome Back`}</Text>
                {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                <View style={styles.text}>
                <Input
                    // style={styles.formTextInput}
                    placeholder="Username"
                    autoCapitalize="none"
                    leftIcon={{ type: 'font-awesome', name: 'user-circle-o' }}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    containerStyle={styles.formTextInput}
                    />
                </View>
                <View style={styles.text}>
                <Input
                    // style={{ height: 40, color:'#000',borderColor: 'gray', borderWidth: 1 ,borderRadius:20,padding:30,marginBottom:30}}
                    placeholder="Password"
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    secureTextEntry={true}  
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    containerStyle={styles.formTextInput}
                    />
                </View>
                <View style={styles.formButton}>
                        <TouchableOpacity
                                    style={styles.login}
                                    onPress={() => {
                                        this.handleLogin();
                                    }}
                        >
                                    <Text style={styles.text}><AntDesign name="right" size={28} color="white" /></Text>
                            </TouchableOpacity>
                    
                </View>
                <View style={styles.formButton}>
                        <TouchableOpacity
                                    style={styles.register}
                                    onPress={() => this.props.navigation.navigate("Register")}
                        >
                                    <Text style={styles.text}><AntDesign name="up" size={28} color="white" /> </Text>
                            </TouchableOpacity>
                    
                </View>
             
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
    marginHorizontal: 60,
    marginTop:200,
    margin: 10,
  },
  formTextInput: {
     height: 55,
     backgroundColor:"#f0f0f0",
     borderRadius:30,
     marginTop:20,
     marginBottom:32,
     justifyContent:'space-between'
},
greeting:{
    alignItems: 'center',
    justifyContent: "center",
    textAlign:"center",
    fontWeight:"600",
    color:'black',
    fontStyle:"normal",
    fontSize:24,
    margin:22
},
error:{
    alignItems: 'center',
    justifyContent: "center",
    textAlign:"center",
    fontWeight:"600",
    color:'red',
    fontSize:15,
    margin:20
},
formButton: {
    margin: 10,
},
image: {
    justifyContent: "center",
    height:180,
    width:180

  },
text: {
    color: '#000',
    fontSize: 22,
    fontWeight: "bold",
  },
login: {
    alignItems: 'center',
    backgroundColor: '#FF69B4',
    padding: 10,
    color: "white",
    borderRadius:20,
    marginBottom:30,
},
register: {
    alignItems: 'center',
    backgroundColor: '#e64a19',
    padding: 10,
    color: "white",
    borderRadius:20,
    marginBottom:30,
},
card:{
    backgroundColor: '#000051',
},
cardimage:{
    backgroundColor: '#000051',
    padding:10,
    borderRadius:20,
    marginBottom:30
},
image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  }
});
export default Login;