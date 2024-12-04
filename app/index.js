import { PaperProvider, MD3DarkTheme, BottomNavigation, Text, TouchableRipple, MD3LightTheme} from 'react-native-paper';
import React, { useState } from 'react';
import Home from './home.js'
import Settings from './settings.js'

const Schedule = () => <Text>Albums</Text>;

const NavBar = () => {
	const [isDarkTheme, setIsDarkTheme] = useState(true);
	const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'home', title: 'Home', focusedIcon: 'home-variant', unfocusedIcon: 'home-variant-outline'},
		{ key: 'schedule', title: 'My Schedule', focusedIcon: 'account-clock', unfocusedIcon: 'account-clock-outline' },
		{ key: 'settings', title: 'Settings', focusedIcon: 'application-cog', unfocusedIcon: 'application-cog-outline'},
	]);

	const renderScene = ({ route }) => {
        switch (route.key) {
            case 'home':
                return <Home isDarkTheme={isDarkTheme} />;
            case 'schedule':
                return <Schedule />;
            case 'settings':
                return <Settings isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />;
            default:
                return null;
        }
    };

	return (
		<PaperProvider theme={theme}>
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				renderTouchable={({key, ...props}) => (<TouchableRipple key={key} {...props} />)}
			/>
		</PaperProvider>
	);
};

export default NavBar;
