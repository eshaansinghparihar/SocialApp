import React, {Component} from 'react';
import { StyleSheet, Text, View,StatusBar, Image, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import Fire from "../Fire";
class Register extends Component{
    constructor(props) {
        super(props);

        this.state = {
            user: {
              displayName: "",
              email: "",
              password: "",
              avatar: undefined
            },
            errorMessage: null
          };
    };
    componentDidMount() {
        this.getPermissionAsync();
      }
    
    getPermissionAsync = async () => {
        if (Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        
    };
    handleRegister=()=>{
        // const {username,password,name}=this.state;
        // firebase.auth().createUserWithEmailAndPassword(username,password).then(userCredentials=>{
        //     return userCredentials.user.updateProfile({
        //         displayName:name
        //     });
        // }).catch(error=>{this.setState({errorMessage:error.message})})
        Fire.shared.createUser(this.state.user)
        this.props.navigation.navigate("Loading")
    }
    handlePickAvatar = async () => {
    
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3]
        });
        if (!result.cancelled) {
          this.setState({ user: { ...this.state.user, avatar: result.uri } });
        }
      };
    render(){
        return(
            <View styles={styles.container}>
                {/* <StatusBar barStyle="light-content"/> */}
                <Image source={require("../assets/registerscreen.jpg")} style={{marginTop:-420,right:-120, position:"absolute"}}></Image>
                <Text style={styles.greeting}>{`Hello There ,\n Register Yourself Here`}</Text>
                {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                <View style={styles.formButtonImage}>
                        <TouchableOpacity
                                    style={styles.avatarPlaceholder}
                                    onPress={this.handlePickAvatar}
                        >
                                    <Image source={{ uri: this.state.user.avatar }} style={styles.avatar}/>
                                    
                            </TouchableOpacity>
                    
                </View>
                <View style={styles.text}>
                <Input
                    // style={{ height: 40, color:'#000',borderColor: 'gray', borderWidth: 1,borderRadius:20,padding:30 ,marginBottom:30,marginTop:32}}
                    placeholder="Full Name"
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    onChangeText={(displayName) => this.setState({ user: { ...this.state.user, displayName } })}
                    value={this.state.displayName}
                    containerStyle={styles.formInput}
                    />
                </View>
                <View style={styles.text}>
                <Input
                    // style={{ height: 40, color:'#000',borderColor: 'gray', borderWidth: 1,borderRadius:20,padding:30 ,marginBottom:30,marginTop:32}}
                    placeholder="Username"
                    autoCapitalize="none"
                    leftIcon={{ type: 'font-awesome', name: 'user-circle-o' }}
                    onChangeText={(email) => this.setState({ user: { ...this.state.user, email } })}
                    value={this.state.username}
                    containerStyle={styles.formInput}
                    />
                </View>
                <View style={styles.text}>
                <Input
                    // style={{ height: 40, color:'#000',borderColor: 'gray', borderWidth: 1 ,borderRadius:20,padding:30,marginBottom:30}}
                    placeholder="Password"
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    secureTextEntry={true}  
                    onChangeText={(password) => this.setState({ user: { ...this.state.user, password } })}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    />
                </View>
                <View style={styles.formButton}>
                        <TouchableOpacity
                                    style={styles.register}
                                    onPress={() => this.handleRegister()}
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
      formInput: {
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
        color:'#0f0f0f',
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
    formButtonImage: {
        margin: 10,
        alignItems: 'center',
        justifyContent:'center',
        textAlign:'center',
    },
    formButton: {
        margin: 10
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

  avatarPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#D9AD26",
    borderRadius: 60,
    marginTop: 48,
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60
  },
    register: {
        alignItems: 'center',
        justifyContent:'center',
        textAlign:'center',
        backgroundColor: '#e64a19',
        padding: 10,
        color: "white",
        borderRadius:20,
        marginBottom:30,
    },
    avatar: {
        alignItems: 'center',
        justifyContent:'center',
        textAlign:'center',
        backgroundColor: '#E1E2E6',
        color: "white",
        height:100,
        width:100,
        borderRadius:50
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
export default Register;