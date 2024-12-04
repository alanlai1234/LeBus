import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Switch, Divider } from 'react-native-paper';

const Settings = ({}) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [theme, setTheme] = useState('Dark');

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <Divider style={styles.divider} />

            <View style={styles.settingItem}>
                <Text>Theme: {theme}</Text>
                <Button
                    mode="contained-tonal"
                    onPress={() => setTheme((prev) => (prev === 'Dark' ? 'Light' : 'Dark'))}
                >
                    Toggle Theme
                </Button>
            </View>

            <Divider style={styles.divider} />

            {/* Dynamic Notifications Switch */}
            <View style={styles.settingItem}>
                <Text>Enable Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={() => setNotificationsEnabled((prev) => !prev)}
                />
            </View>

            <Divider style={styles.divider} />

            {/* Dynamic Placeholder */}
            <View style={styles.settingItem}>
                <Text>
                    {notificationsEnabled
                        ? 'Notifications are ON. You’ll receive updates.'
                        : 'Notifications are OFF. You won’t receive updates.'}
                </Text>
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