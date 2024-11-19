import React, { useState } from 'react';
import {Text, View, Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated';
import { TextInput, TouchableRipple, List } from 'react-native-paper';

const style = StyleSheet.create({
	container:{
		flex: 1,
		marginTop: 15
	},
	dropdownInput: {
		marginLeft: 15,
		marginRight: 15
	},
	dropdownList:{
		flexGrow: 0,
		backgroundColor: "#494961",
		borderRadius: 8,
		maxHeight: 200,
		marginTop: 5,
		marginLeft: 15,
		marginRight: 15,
	},
	dropdownItem:{
		color: "white",
		paddingLeft: 10,
		height: 45,
		padding: 11
	},
})

const options = ["Quads", "Livi Student Center", "Livi Plaza", "Busch Student Center", "Allison Rd. Classroom", "Hill Center", "College Ave Student Center", "The Yard", "Student Activities Center"];

const ChooseStop = () => {
	const [searchText, setSearchText] = useState("");
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [open, setOpen] = useState(1);
	const opacity = useSharedValue(0);
	const filterOptions = (text) => {
		setSearchText(text);
		setFilteredOptions(options.filter((option) => option.includes(text)));
		opacity.value = 1;
	};
	const onOptionPress = (option) => {
		opacity.value = 0;
		setSearchText(option);
		Keyboard.dismiss();
	};
	const animatedStyles = useAnimatedStyle(() => ({
		opacity: withTiming(opacity.value, {duration: 150})
	}));

	return (
		<TouchableWithoutFeedback onPress={() => {opacity.value=0; Keyboard.dismiss(); setOpen(0);}}>
			<View style={style.container}>
				<TextInput
					mode="outlined"
					label="Search Bus Stop"
					value={searchText}
					onChangeText={filterOptions}
					onFocus={() => {setOpen(1); opacity.value=1;}}
					blueOnSubmit={true}
					style={style.dropdownInput}
				/>
				{!!open && (<Animated.FlatList
					style={[style.dropdownList, animatedStyles]}
					data={filteredOptions}
					renderItem={({ item }) => (
							<TouchableRipple rippleColor="rgba(0, 0, 0, .32)" onPress={() => onOptionPress(item)}>
								<Text style={style.dropdownItem}>{item}</Text>
							</TouchableRipple>
					)}
					keyExtractor={(item) => item}
					/>
				)}
				<BusIncoming/>
			</View>
		</TouchableWithoutFeedback>
	);
};

const BusIncoming = () => {
	return (
		<View style={{flex: 1}}>
			<List.Item
			title="First Item"
			description="Item description"
			left={props => <List.Icon {...props} icon="folder" />}
			/>
		</View>
	);
}

export default function Home() {
	return (
		<>
		<ChooseStop/>
		</>
	);
}
