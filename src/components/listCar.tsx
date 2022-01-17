import  React , { Component } from "react";
import Select from 'react-select';
import { Plugins } from "@capacitor/core";
import api from '../api.json';
import en from '../en.json';
import th from '../th.json';
import axios from 'axios';


	 const { Storage } = Plugins;
	 // eslint-disable-next-line
	 let selectPlaceHold:any, carID:any  ;
	 let carNumber = [{value : 0 , label: '' , latitude: 0, longitude:0 }]
	 let selectedCar = {value: 0 ,label:'', latitude: 0, longitude:0} ;
	  
	  const colourStyles = {
		control: (styles: any) => ({ ...styles, backgroundColor: 'rgba(139, 140, 142, 0.1)' }),
		option: (styles: { [x: string]: any; }, { data, isDisabled, isFocused, isSelected }: any) => {
		  
		  return {
			...styles,
			backgroundColor: isDisabled
			  ? null
			  : isSelected
			  ? isSelected
			  : '#202021'
			  ? data.color
			  : isFocused
			  ? '#202021'
			  : isSelected,
			cursor: isSelected ? 'not-allowed' : 'default',
	  
			':active': {
			  ...styles[':active'],
			  backgroundColor: !isDisabled && (isSelected ? data.color : 'rgba(139, 140, 142, 0.1)'),
			},
		  };
		},
		input: (styles: any) => ({ ...styles, height:'2rem',color:'#666666' }),
		placeholder: (styles: any) => ({ ...styles,color:'#666666'  }),
		singleValue: (styles: any, { data }: any) => ({ ...styles, color:data.color }),
	  };
	  
export default class ListCar extends Component {


		state={
			carSelect:[{value:0 , label:'' }] ,
			selectPlaceHold : 'ALL' ,
			defaultVal : [{value:0 , label:''}] ,
			car:[{value:0 , label:''}],
			device: 0
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
			let lang =await this.getStorage('language');
			let token =await this.getStorage('token');
			let car =await this.getStorage('carID');
			let device =await this.getStorage('deviceID');
			let apiHost = await this.getStorage('api')

			if(lang === '"th"'|| lang === 'th'){
				selectPlaceHold = th.home.carList
			}else if(lang === '"en"' || lang === 'en'){
				selectPlaceHold = en.home.carList
			}
			
			if(device === '0' || Number(device) === 0){
				if(lang === '"th"'|| lang === 'th'){
					selectPlaceHold = th.home.carList
					this.setStorage('carID', th.home.carList )
					this.setState({
						selectPlaceHold : selectPlaceHold
					})
				}else if(lang=== '"en"' || lang=== 'en'){
					selectPlaceHold = en.home.carList
					this.setStorage('carID', en.home.carList)
					this.setState({
						selectPlaceHold : selectPlaceHold
					})
				}
			}


			if(car !== undefined || car !== null || car !== ''){
				this.setState({
					selectPlaceHold : car
				})

				selectPlaceHold = th.home.carList
				if(lang === '"th"'|| lang === 'th'){
					carNumber[0] ={
						value : 0 ,
						label:   th.home.carList ,
						latitude: 0 ,
						longitude : 0
					}
				}else if(lang === '"en"' || lang === 'en'){
					selectPlaceHold = en.home.carList
					carNumber[0] ={
						value : 0 ,
						label: en.home.carList ,
						latitude: 0 ,
						longitude : 0
					}
				}
			}else{
				if(lang === '"th"'|| lang === 'th'){
					selectPlaceHold = th.home.carList
					carNumber[0] ={
						value : 0 ,
						label:  selectPlaceHold ,
						latitude: 0 ,
						longitude : 0
					}
					this.setState({selectPlaceHold : th.home.carList})

				}else if(lang === '"en"' || lang === 'en'){
					selectPlaceHold = en.home.carList
					carNumber[0] ={
						value : 0 ,
						label:  selectPlaceHold ,
						latitude: 0 ,
						longitude : 0
					}

					this.setState({selectPlaceHold : en.home.carList})
				}
			} 


			axios.get(`${apiHost}/home` ,{
				headers: {
					"language": lang  ,
					"token" : token ,
					"authorization": api.authorization
				}		
			}).then(res => {
				for (let index = 0 ; index < res.data.length; index ++){
					carNumber[index+1] = {
						value : res.data[index].device_id ,
						label: res.data[index].name ,
						latitude: res.data[index].latitude ,
						longitude : res.data[index].longitude 
					}
				}
			})
			
            console.log("ListCar -> carNumber", carNumber)

			
			// this.setState({
			// 	car : carNumber ,
			// 	defaultVal : carNumber
			// })
			
			
		}

		
		async componentWillUnmount(){
			let lang = await this.getStorage('language')
			this.setStorage('device', '0')
			this.setStorage('deviceID', '0')
			
			if(lang === '"th"'|| lang === 'th'){
				selectPlaceHold = th.home.carList
				this.setStorage('carID',selectPlaceHold)
			}else if(lang === '"en"' || lang === 'en'){
				selectPlaceHold = en.home.carList
				this.setStorage('carID',selectPlaceHold)
			}
			
		}


		refreshPage(){ 
			window.location.reload(); 
		}

		handleChange = ( carSelect:any) => {
			this.setState({ 
				carSelect 
			});
			selectedCar = carSelect
			carID = selectedCar.value
			let car = selectedCar.label
			let latitude = selectedCar.latitude
			let longitude = selectedCar.longitude

			console.log(selectedCar)

			this.checkList()

			this.setStorage( 'deviceID', JSON.stringify(carID));
			this.setStorage( 'device',JSON.stringify(carID));
			this.setStorage( 'carID',car);
			this.setStorage( 'latitude',latitude.toLocaleString());
			this.setStorage('longitude', longitude.toLocaleString());
 
		};

		checkList=async ()=>{
			if(carID === 0){
					let lang =await this.getStorage('language');
					let token =await this.getStorage('token');
					let apiHost = await this.getStorage('api');

					axios.get(`${apiHost}/home` ,{
						headers: {
							"language": lang  ,
							"token" : token ,
							"authorization": api.authorization
						}		
					}).then(res => {
						this.setState({
							car : carNumber
						})
					})
			}
		}

		render() {
		
			
			return (
					<div >
						<Select 
							onChange={this.handleChange}
							options={carNumber}
							placeholder={this.state.selectPlaceHold}
							styles={colourStyles}
						/>    
					</div>
			);
		}
}
 
