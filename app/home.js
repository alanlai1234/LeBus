import React, { useState, useRef, useEffect } from 'react';
import {View, Keyboard, StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS} from 'react-native-reanimated';
import { TextInput, TouchableRipple, List, Divider, Text, FAB, SegmentedButtons, Icon } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ActionSheet, {ScrollView as SheetScrollView} from "react-native-actions-sheet";
import tracking from './passiogo.js';
import data from './busInfo.json';

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

// data initialize
let stops = {};
let options = [];
for(const key in data.stops){
	stops[data.stops[key].name] = key;
	options.push(data.stops[key].name);
}
let routesInStop = {};
for(const stop in stops)
	routesInStop[stops[stop]] = [];
for(const key in data.routes){
	for(let i = 3;i < data.routes[key].length; ++i){
		if(data.routes[key][i][1] in routesInStop)
			routesInStop[data.routes[key][i][1]].push([key, data.routes[key][i][0]]);
	}
}
const track = new tracking();

const BusIncoming = (props) => {
	const actionSheetRef = useRef(null);
	const [buses, setBuses] = useState(() => []);
	const [sheetList, setSheetList] = useState(() => []);
	const [sheetBusPos, setSheetBusPos] = useState(0);
	useEffect(() => {
		const fetch = async() => {
			let tmp = [];
			if(props.searchStop in stops){
				for(const route of routesInStop[stops[props.searchStop]]){
					const ret = await track.getStop(stops[props.searchStop], route[0], route[1]);
					for(const key in ret)
						tmp.push([data.routes[route[0]][0], ret[key][0].eta, data.routes[route[0]][1], ret[key][0].busName]);
				}
			}
			setBuses(tmp);
		}
		fetch();
	}, [props.searchStop])
	const busProgress = async (busId) => {
		let [lat, lon, routeId] = await track.getBus(busId);
		let tmp = [];
		for(let i = 3;i < data.routes[routeId].length; ++i){
			const stopId = data.routes[routeId][i][1];
			tmp.push(data.stops[stopId].name)
			//const pow2 = (num) => num*num;
			//lat = parseFloat(lat).toFixed(14);
			//lon = parseFloat(lon).toFixed(14);
			////console.log(pow2(data.stops[stopId].latitude.toFixed(14)-lat) + pow2(data.stops[stopId].longitude.toFixed(14)-lon));
			//console.log(data.stops[stopId].name);
		}
		setSheetList(tmp);
		actionSheetRef.current?.show();
		return;
	}

	const BusItem = (props) => {
		return(
			<>
			<Divider />
			<TouchableRipple onPress={() => busProgress(props.id)} rippleColor="#636260">
				<List.Item
				title={props.line}
				description={props.id}
				left={props1 => <List.Icon {...props1} color={props.color} icon="bus" />}
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
				{buses.map((item) => {
					if(item[1] !== "no vehicles")
						return <BusItem key={item[0]} line={item[0]} color={item[2]} time={item[1]} id={item[3]}/>
				})}
			</ScrollView>
		</View>
		<ActionSheet
		ref={actionSheetRef}
		gestureEnabled={true}
		containerStyle={style.sheetContainer}
		snapPoints={[80, 100]}
		>
			<SheetScrollView>
				{sheetList.map((item) => {
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
			opacity.value = 0;
			Keyboard.dismiss()
			props.setDestMode(0);
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
				<TouchableRipple onPress={() => props.setSearchStop(searchText)} rippleColor="#636260"
				style={{flex: 1, justifyContent: 'center'}}>
					<MaterialCommunityIcons name="magnify" size={30} color="#a99fb5" style={{marginLeft: 15, marginRight: 15}}/>
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
	const [searchStop, setSearchStop] = useState("");
	return(
		<TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
			<View style={style.container}>
				<Dropdown destMode={inputOpen} setDestMode={setInputOpen} inputref={inputref} setSearchStop={setSearchStop}/>
				<BusIncoming searchStop={searchStop}/>
				<FAB
					icon="plus"
					style={style.fab}
					onPress={() => {setInputOpen(1); inputref.current.focus()}}
				/>
			</View>
		</TouchableWithoutFeedback>
	)
};
