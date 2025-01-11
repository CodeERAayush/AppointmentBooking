import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const stored = await AsyncStorage.getItem('appointments');
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setLoading(false);
    }
  };

  const isSlotBooked = (date, timeSlot) => {
    const dateStr = new Date(date).toDateString();
    return appointments.some(apt => 
      new Date(apt.date).toDateString() === dateStr && 
      apt.timeSlot === timeSlot
    );
  };

  const getAppointmentForSlot = (date, timeSlot) => {
    const dateStr = new Date(date).toDateString();
    return appointments.find(apt => 
      new Date(apt.date).toDateString() === dateStr && 
      apt.timeSlot === timeSlot
    );
  };

  const bookAppointment = async (date, timeSlot, userId, userName) => {
    try {
      if (isSlotBooked(date, timeSlot)) {
        return false;
      }

      const newAppointment = {
        id: Date.now().toString(),
        date,
        timeSlot,
        userId,
        userName,
        createdAt: new Date().toISOString(),
      };

      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return true;
    } catch (error) {
      console.error('Error booking appointment:', error);
      return false;
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return true;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return false;
    }
  };

  const getUserAppointments = (userId) => {
    return appointments.filter(apt => apt.userId === userId);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        bookAppointment,
        cancelAppointment,
        getUserAppointments,
        isSlotBooked,
        getAppointmentForSlot,
      }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentContext);
