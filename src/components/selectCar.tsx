import * as React from "react";
import {IonContent, IonLabel, IonItem, IonSelect, IonSelectOption} from "@ionic/react";
import Select from 'react-select';
import {Plugins} from "@capacitor/core";
import api from '../api.json';
import en from '../en.json';
import th from '../th.json';
import axios from 'axios';

const {Storage} = Plugins;
let selectPlaceHold : any;

class selectCar extends React.Component {

	state = {
		carSelect: null,
		selectPlaceHold: "เลือกรถ",
		selectCarVal: [],
		selectCarLabel: []

	}

	getStorage = async (keyStore:any) => {
		try{ 
		  let value = localStorage.getItem(keyStore)
		  return value ;
		}catch{
		  return ''
		} 
	};
	setStorage = async (keyStore:any , valueStore:any) => {
		try{ 
		  localStorage.setItem(keyStore , valueStore)
		  console.log('set done')
		}catch{
		  return ''
		} 
	};

	async componentDidMount() {
		let userID = await this.getStorage( 'userId');
		let lang = await this.getStorage( 'language');
		let token = await this.getStorage( 'token');
		//	console.log(userID)
		axios.get(`${api.https}/home/${userID}`, {
			headers: {
				"language": lang,
				"token": token,
				"authorization": api.authorization
			}
		}).then(res => {
			console.log("TCL: selectCar -> res", res)

			for (let index = 0; index < res.data.length; index++) {
				const carDevice = res.data[index].device_id
				const name = res.data[index].name

				this.setState({ 
					selectCarVal: [...this.state.selectCarVal, carDevice], 
					selectCarLabel: [...this.state.selectCarLabel, name]
				})
			}

			console.log('selectCarVal', this.state.selectCarVal)
			console.log('selectCarVal', this.state.selectCarLabel)

		})

		if (lang === 'th') {
			selectPlaceHold = th.home.carList
		} else if (lang === 'en') {
			selectPlaceHold = en.home.carList
		}
	}

	handleChange = (carSelect : any) => {
		this.setState({
			carSelect
		}, () => console.log(`Option selected:`, this.state.carSelect));
	};

	render() {
		if (selectPlaceHold === undefined || selectPlaceHold === null) {
			selectPlaceHold = this.state.selectPlaceHold
		}

		const {selectCarVal, selectCarLabel} = this.state;

		const carNum = [
			{
				val: selectCarVal,
				label: selectCarLabel
			}
		];

		return (
			<IonContent>
				<IonLabel>4132</IonLabel>

				<Select
					value={this.state.carSelect}
					onChange={this.handleChange}
					options={carNum}
					placeholder={selectPlaceHold}/>

				<IonItem>
					<IonLabel>Action Sheet</IonLabel>
					<IonSelect interface="action-sheet" placeholder="Select One">
						<IonSelectOption value="red">Red</IonSelectOption>
						<IonSelectOption value="purple">Purple</IonSelectOption>
						<IonSelectOption value="yellow">Yellow</IonSelectOption>
						<IonSelectOption value="orange">Orange</IonSelectOption>
						<IonSelectOption value="green">Green</IonSelectOption>
					</IonSelect>
				</IonItem>

			</IonContent>
		);
	}
}

export default selectCar;