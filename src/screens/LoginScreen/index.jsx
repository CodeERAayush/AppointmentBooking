import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon, { Icons } from '../../assets/Icons';
import Typography from '../../components/Typography';

const LoginScreen = ({navigation}) => {
  const _checkUser = async () => {
    const user = await AsyncStorage.getItem("userData");
    if(user !== null) {
      navigation.replace("Home");
    }
  };

  React.useEffect(() => {
    _checkUser();
  }, []);

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: "804895377920-u0iirqr0pnhc7d9d8qb1lr8vu40mkpqk.apps.googleusercontent.com",
      offlineAccess: true
    });
  }, []);

  const GoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn().then(async result => {
        console.log(result?.data?.user)
        if (result?.data?.user) {
        console.log("app: ",result?.data?.user)
        await AsyncStorage.setItem('userData', JSON.stringify(result?.data?.user));
        navigation.replace('Home');
        }
      });
    } catch (error) {
      Alert.alert("result?.user?.name: ",JSON.stringify(error?.message))
        console.log(error)
    }
  };
  return (
    <View style={styles.container}>
      <Icon type={Icons?.MaterialIcons} name="medical-services" size={100} color="#4285F4" />
      <TouchableOpacity
        onPress={GoogleSignUp}
        style={styles.button}>
        <Icon type={Icons?.AntDesign} name="google" size={24} color="#fff" style={styles.googleIcon} />
        <Typography style={styles.buttonText}>Sign in with Google</Typography>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    minWidth: 220,
    justifyContent: 'center'
  },
  googleIcon: {
    marginRight: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default LoginScreen;