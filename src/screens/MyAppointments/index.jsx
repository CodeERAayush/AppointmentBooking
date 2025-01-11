import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAppointments } from '../../context/AppointmentContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Typography from '../../components/Typography';

const MyAppointmentsScreen = () => {
  const { getUserAppointments, cancelAppointment } = useAppointments();
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUserAppointments();
  }, [userId]);

  const loadUserAppointments = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      setUserId(userData.id);
      const userAppointments = getUserAppointments(userData.id);
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Error loading user appointments:', error);
    }
  };

  const handleCancel = (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const success = await cancelAppointment(appointmentId);
            if (success) {
              loadUserAppointments();
            } else {
              Alert.alert('Error', 'Failed to cancel appointment. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <Typography style={styles.dateText}>
        Date: {new Date(item.date).toLocaleDateString()}
      </Typography>
      <Typography style={styles.timeText}>Time: {item.timeSlot}</Typography>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleCancel(item.id)}>
        <Typography style={styles.cancelButtonText}>Cancel Appointment</Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {appointments.length === 0 ? (
        <Typography style={styles.noAppointments}>No appointments scheduled</Typography>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  slotList: {
    marginBottom: 20,
  },
  slot: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedSlot: {
    backgroundColor: '#4CAF50',
  },
  slotText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedSlotText: {
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  appointmentCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noAppointments: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default MyAppointmentsScreen;