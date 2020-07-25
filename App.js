import React from 'react';
import Firebasekeys from './config';
import * as firebase from 'firebase';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

import Register from './screens/RegisterScreen';
import Login from './screens/LoginScreen';
import Loading from './screens/LoadingScreen';
import Home from './screens/HomeScreen';

import Message from './screens/MessageScreen';
import Post from './screens/PostScreen';
import Notification from './screens/NotificationScreen';
import Profile from './screens/ProfileScreen';

var firebaseConfig = Firebasekeys;
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AppContainer=createStackNavigator(
  {
    SocialApp:createBottomTabNavigator(
      {
        Home:{
          screen:Home,
          navigationOptions:{
            tabBarIcon:({tintColor})=><Ionicons name="ios-home" size={24} color={tintColor} />
          }
        },
        Message:{
          screen:Message,
          navigationOptions:{
            tabBarIcon:({tintColor})=><Ionicons name="ios-chatboxes" size={24} color={tintColor} />
          }
        },
        Post:{
          screen:Post,
          navigationOptions:{
            tabBarIcon:({tintColor})=><Ionicons name="ios-add-circle" size={48} color="#E9446A" style={{shadowColor:"#E9446A",shadowRadius:10,shadowOpacity:0.3}}/>
          }
        },
        Notification:{
          screen:Notification,
          navigationOptions:{
            tabBarIcon:({tintColor})=><Ionicons name="ios-notifications" size={24} color={tintColor} />
          }
        },
        Profile:{
          screen:Profile,
          navigationOptions:{
            tabBarIcon:({tintColor})=><Ionicons name="ios-person" size={24} color={tintColor} />
          }
        }
      },
      {
        // defaultNavigationOptions:{
        //   tabBarOnPress:({navigation, defaultHandler})=>{
        //     if(navigation.state.key==="Post")
        //     { 
        //      navigation.navigate("postModal");
        //     }
        //     else
        //     {
        //     defaultHandler();
        //     }
        //   }
        // },
        tabBarOptions:{
          activeTintColor:"#000",
          inactiveTintColor:'gray',
          showLabel:false
        }
      }
        
      ),
      // postModal:{
      //   screen:Post
      // }
  },
  {
    // mode:"modal",
    headerMode:"none"
  }
)

// const AppTabNavigator=;
const AuthStack=createStackNavigator({
  Login:Login,
  Register : Register
})
export default createAppContainer(
  createSwitchNavigator(
    {
      Loading:Loading,
      App:AppContainer,
      Auth:AuthStack,
    },
    {
      initialRouteName:"Loading"
    }
  )
);
// export default function App() {
//   return (
//     <View 
//     //style={styles.container}
//     >
//       {AppContainer}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
