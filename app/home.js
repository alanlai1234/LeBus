import React, { useState, useRef } from 'react';
import {View, Keyboard, StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS} from 'react-native-reanimated';
import { TextInput, TouchableRipple, List, Divider, Text, FAB, SegmentedButtons} from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ActionSheet, {ScrollView as SheetScrollView} from "react-native-actions-sheet";

const style = StyleSheet.create({
	container:{
		flex: 1,
		marginTop: 10
	},
	dropdownInput: {
		marginLeft: 15,
		flex: 1
	},
	dropdownList:{
		position: 'absolute',
		flexGrow: 0,
		backgroundColor: "#494961",
		borderRadius: 8,
		maxHeight: 310,
		marginTop: 60,
		marginLeft: 15,
		marginRight: 15,
		width: '92%',
		zIndex: 1
	},
	dropdownItem:{
		color: "white",
		height: 45,
		padding: 11,
	},
	sheetContainer:{
		height: "90%",
		backgroundColor: "#494961",
	},
	fab:{
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
})

const options = ["Quads", "Livi Student Center", "Livi Plaza", "Busch Student Center", "Allison Rd. Classroom", "Hill Center", "College Ave Student Center", "The Yard", "Student Activities Center"];

const busColor = {
	'EE': "#ff7b00",
	'B-He': "#c47c4d",
	'LX': "#bc62fc"
};


const BusIncoming = () => {
	const actionSheetRef = useRef(null);
	const BusItem = (props) => {
		return(
			<>
			<Divider />
			<TouchableRipple onPress={() => actionSheetRef.current?.show()} rippleColor="#636260">
				<List.Item
				title={props.line}
				description={props.id}
				left={props1 => <List.Icon {...props1} color={busColor[props.line]} icon="bus" />}
				right={props1 => <Text {...props1}>{props.time}</Text>}
				/>
			</TouchableRipple>
			</>
		)
	}
	return (
		<>
		<View style={style.container}>
			<ScrollView>
				<BusItem line='EE' id='4632' time='1 minute'/>
				<BusItem line='B-He' id='4632' time='2 minute'/>
				<BusItem line='LX' id='4632' time='3 minute'/>
			</ScrollView>
		</View>
		<ActionSheet
		ref={actionSheetRef}
		gestureEnabled={true}
		containerStyle={style.sheetContainer}
		snapPoints={[80, 100]}
		>
			<SheetScrollView>
				{options.map((item) => {
				return <Text key={item} style={style.dropdownItem}>{item}</Text>
				})}
			</SheetScrollView>
		</ActionSheet>
		</>
	);
}

const Dropdown = (props) => {
	const [searchText, setSearchText] = useState("");
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [open, setOpen] = useState(0);
	const opacity = useSharedValue(0);
	const filterOptions = (text) => {
		setSearchText(text);
		setFilteredOptions(options.filter((option) => option.toLowerCase().includes(text.toLowerCase())));
	};
	const onOptionPress = (option) => {
		setSearchText(option);
		Keyboard.dismiss();
	};
	const animatedStyles = useAnimatedStyle(() => ({
		opacity: withTiming(opacity.value, {duration: 150}, () => {
			if(opacity.value == 0) runOnJS(setOpen)(0);
		})
	}));
	const close = () => {
		if(props.destMode == 0) opacity.value = 0;
	}
	const destModeChoose = (value) => {
		if(value==0){
			props.setDestMode(0);
			opacity.value = 0;
			Keyboard.dismiss()
		}
	}

	return(
		<>
		<View style={{flexDirection: 'row'}}>
			<TextInput
				mode="outlined"
				label="Search Bus Stop"
				value={searchText}
				onChangeText={filterOptions}
				onFocus={() => {setOpen(1); opacity.value=1;}}
				onBlur={close}
				blurOnSubmit={true}
				style={style.dropdownInput}
				ref={props.inputref}
			/>
			<View style={{borderRadius: 25, overflow: 'hidden', marginTop: 5}}>
				<TouchableRipple onPress={() => console.log('Pressed')} rippleColor="#636260"
				style={{flex: 1, justifyContent: 'center'}}>
					<Entypo name="location-pin" size={30} color="#a99fb5" style={{marginLeft: 15, marginRight: 15}}/>
				</TouchableRipple>
			</View>
		</View>
		{!!open && (<Animated.ScrollView
			style={[style.dropdownList, animatedStyles]}
			keyboardShouldPersistTaps='handled'
			stickyHeaderIndices={[props.destMode-1]}
			alwaysBounceHorizontal={false}
			>
			{!!props.destMode && (<SegmentedButtons
				onValueChange={destModeChoose}
				buttons={[
				{
					value: 0,
					label: 'Cancel',
					style: {backgroundColor: '#1b1a47', borderBottomLeftRadius: 0}
				},{
					value: 1,
					label: 'Set Destination',
					style: {backgroundColor: '#1b1a47', borderBottomRightRadius: 0}
				},
				]}
				theme={{ roundness: 1.5 }}
			/>)}
			{filteredOptions.map((item) => {
			return(<TouchableRipple key={item} rippleColor="rgba(0, 0, 0, .32)" onPress={() => onOptionPress(item)} >
						<Text style={style.dropdownItem}>{item}</Text>
					</TouchableRipple>);
			})}
			</Animated.ScrollView>)
		}
		</>
	)
}

export default function Home() {
	const inputref = useRef(null);
	const [inputOpen, setInputOpen] = useState(0);
	return(
		<TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
			<View style={style.container}>
				<Dropdown destMode={inputOpen} setDestMode={setInputOpen} inputref={inputref}/>
				<BusIncoming/>
				<FAB
					icon="plus"
					style={style.fab}
					onPress={() => {setInputOpen(1); inputref.current.focus()}}
				/>
			</View>
		</TouchableWithoutFeedback>
	)
};
