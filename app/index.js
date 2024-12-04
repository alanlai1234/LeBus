import { PaperProvider, MD3DarkTheme, BottomNavigation, Text, TouchableRipple} from 'react-native-paper';
import React, { useState } from 'react';
import Home from './home.js'
import Settings from './settings.js'

const Schedule = () => <Text>Albums</Text>;

const NavBar = () => {
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'home', title: 'Home', focusedIcon: 'home-variant', unfocusedIcon: 'home-variant-outline'},
		{ key: 'schedule', title: 'My Schedule', focusedIcon: 'account-clock', unfocusedIcon: 'account-clock-outline' },
		{ key: 'settings', title: 'Settings', focusedIcon: 'application-cog', unfocusedIcon: 'application-cog-outline'},
	]);

	const renderScene = BottomNavigation.SceneMap({
		home: Home,
		schedule: Schedule,
		settings: Settings
	});

	return (
		<BottomNavigation
			navigationState={{ index, routes }}
			onIndexChange={setIndex}
			renderScene={renderScene}
			renderTouchable={({key, ...props}) => (<TouchableRipple key={key} {...props} />)}
		/>
	);
};

export default () => {
	return (
	<PaperProvider theme={MD3DarkTheme}>
		<NavBar/>
	</PaperProvider>
	);
}
