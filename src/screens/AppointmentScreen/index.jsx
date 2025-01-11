import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAppointments } from '../../context/AppointmentContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Typography from '../../components/Typography';

const AppointmentScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { bookAppointment, isSlotBooked } = useAppointments();

  const timeSlots = [
    { id: '1', time: '09:00 AM' },
    { id: '2', time: '10:00 AM' },
    { id: '3', time: '11:00 AM' },
    { id: '4', time: '02:00 PM' },
    { id: '5', time: '03:00 PM' },
  ];

  const handleDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  const handleBooking = async () => {

    if(!selectedDate||!selectedSlot) return

    if(isSlotBooked(selectedDate,selectedSlot?.time)){
      navigation.navigate("MyAppointments")
      return
    }

    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      const success = await bookAppointment(
        selectedDate.toISOString(),
        selectedSlot.time,
        userData.id,
        userData.name
      );

      if (success) {
        Alert.alert(
          'Success',
          'Appointment booked successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('MyAppointments') }]
        );
      } else {
        Alert.alert('Error', 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };

  const renderSlot = ({ item }) => (
    <TouchableOpacity
      style={[styles.slot, selectedSlot?.id === item.id && styles.selectedSlot]}
      onPress={() => setSelectedSlot(item)}>
      <Typography style={[styles.slotText, selectedSlot?.id === item.id && styles.selectedSlotText]}>
        {item.time}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Typography style={styles.dateDisplay}>
        Selected Date: {selectedDate.toLocaleDateString()}
      </Typography>

      <TouchableOpacity
        style={styles.changeDateButton}
        onPress={() => setShowDatePicker(true)}>
        <Typography style={styles.changeDateButtonText}>Change Date</Typography>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      <Typography style={styles.title}>Available Time Slots</Typography>
      <FlatList
        data={timeSlots}
        renderItem={renderSlot}
        keyExtractor={item => item.id}
        style={styles.slotList}
      />

      {selectedDate&&selectedSlot?<TouchableOpacity
        style={[styles.bookButton, !selectedSlot && styles.disabledButton]}
        disabled={!selectedSlot}
        onPress={handleBooking}>
        <Typography style={styles.buttonText}>{isSlotBooked(selectedDate,selectedSlot?.time)?"View Appointments":"Book Appointment"}</Typography>
      </TouchableOpacity>:null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  dateDisplay: {
    fontSize: 18,
    marginBottom: 10,
  },
  changeDateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  changeDateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
});

export default AppointmentScreen;
