import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon, { Icons } from '../../assets/Icons';
import Typography from '../../components/Typography';
import FastImage from 'react-native-fast-image'
// import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('userData');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {
          userData?.photo?<FastImage
          source={{uri:userData?.photo}}
          style={{height:50,width:50, borderRadius:999}}
          />:
        <Icon type={Icons?.MaterialIcons} name="account-circle" size={50} color="#4285F4" />
        }
        <View style={styles.userText}>
          <Typography style={styles.welcome}>{userData?.name || 'User'}</Typography>
          <Typography style={styles.email}>{userData?.email}</Typography>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.appointmentButton,{backgroundColor:'blue'}]}
        onPress={() => navigation.navigate('MyAppointments')}>
        <Icon name="event" size={24} color="#fff" style={styles.buttonIcon} />
        <Typography style={styles.buttonText}>My Appointments</Typography>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.appointmentButton}
        onPress={() => navigation.navigate('Appointments')}>
        <Icon name="event" size={24} color="#fff" style={styles.buttonIcon} />
        <Typography style={styles.buttonText}>Book Appointment</Typography>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Icon name="logout" size={24} color="#fff" style={styles.buttonIcon} />
        <Typography style={styles.buttonText}>Logout</Typography>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  userText: {
    marginLeft: 15,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  appointmentButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeScreen;