import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Switch, Divider } from 'react-native-paper';
import { sendPushNotification, registerForPushNotificationsAsync } from './notifications';
import * as Notifications from 'expo-notifications';

const Settings = ({ isDarkTheme, setIsDarkTheme }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState(null);  // Set initial state to null
  const theme = isDarkTheme ? 'Dark' : 'Light';

  useEffect(() => {
    if (notificationsEnabled) {
      requestNotificationPermissions();
    } else {
      // Optionally handle when notifications are disabled
      setExpoPushToken(null);  // Clear the token if notifications are turned off
    }
  }, [notificationsEnabled]);

  const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      // Request for Expo Push Token
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
      }
    } else {
      alert('Permission not granted for push notifications!');
    }
  };

  const handleSendNotification = async () => {
    if (expoPushToken) {
      await sendPushNotification(expoPushToken);
    } else {
      alert('Push token not available. Ensure notifications are enabled.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Divider style={styles.divider} />

      <View style={styles.settingItem}>
        <Text>Theme: {theme}</Text>
        <Button
          mode="contained"
          textColor={!isDarkTheme ? '#ffffff' : '#000000'}
          onPress={() => setIsDarkTheme((prev) => !prev)}
          contentStyle={{
            backgroundColor: !isDarkTheme ? '#1A1920' : '#DCDBF2',
          }}
        >
          Toggle Theme
        </Button>
      </View>

      <Divider style={styles.divider} />

      {/* Enable Notifications Switch */}
      <View style={styles.settingItem}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled((prev) => !prev)}
        />
      </View>

      <Divider style={styles.divider} />

      {/* Notification status message */}
      <View style={styles.settingItem}>
        <Text>
          {notificationsEnabled
            ? 'Notifications are ON. You’ll receive updates.'
            : 'Notifications are OFF. You won’t receive updates.'}
        </Text>
      </View>

      <Divider style={styles.divider} />

      {/* Send Notification Button */}
      <View style={styles.settingItem}>
        <Button
          mode="contained"
          onPress={handleSendNotification}
          contentStyle={{ backgroundColor: '#4CAF50' }}
          textColor="#ffffff"
        >
          Send Notification
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  settingItem: {
    marginBottom: 20,
    justifyContent: 'space-between',
  },
});

export default Settings;
