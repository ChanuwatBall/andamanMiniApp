import {
	IonButtons,
	IonPage,
	IonToolbar,
    IonHeader,
    IonContent,
	IonMenuButton,
	IonLabel,
	IonDatetime,
	IonTitle,
	IonLoading,
	IonToast,
	IonButton,
	IonItem,
	IonRouterLink,
	IonIcon,
	IonBackButton
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import api from '../api.json';
import en from '../en.json';
import th from '../th.json';
import axios from 'axios'; 
import Select from 'react-select';
import {Storage} from '@capacitor/storage'
import { Device } from '@capacitor/device';
import { arrowBack, calendar, watch } from 'ionicons/icons';
import { Redirect } from 'react-router';
import config from '../app.config.json'

 
var moment = require('moment');
moment().format();
let carNumber = [{value : 0 , label: '' , latitude: 0, longitude:0 }]
let selectedCar = {value: 0 ,label:'', latitude: 0, longitude:0} ;

const colourStyles = {
	control: (styles: any) => ({ ...styles, backgroundColor: 'white'}),
	option: (styles: { [x: string]: any; }, { data, isDisabled, isFocused, isSelected }: any) => {
	  return {
		...styles,
		backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? 'rgba(139, 140, 142, 0.1)'
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ?  '#202021'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

  
		':active': {
		  ...styles[':active'],
		  backgroundColor: !isDisabled && (isSelected ? data.color : 'rgba(139, 140, 142, 0.1)'),
		},
	  };
	},
	input: (styles: any) => ({ ...styles, height:'2rem',color:'#202021' }),
	placeholder: (styles: any) => ({ ...styles,color:'#666666'  }),
	singleValue: (styles: any) => ({ ...styles, color: '#202021' }),
  };


let title: any , date:any ; 
let dateTime:any ,toastAlert:any , loading:any , dateEnd:any ;
let selectPlaceHold:any ,btnShowRoute:any;
let startTime:any, accessTime:any ;
let dateEndBackup:any, dateStartBackup:any , dateAccess:any;

export default class previousPath extends React.Component{
	
	showMap = 'none';
	state= {
		redirectBackHome : false ,
		showToast:false,
		showModal :false ,
		setShowModal :false ,
		goBack:false,
		redirect : false,
		selectedOption: null ,
		showLangLoading:false ,
		showLoading: false ,
		selectPlaceHold : 'ALL' ,
		selectValue: 0,

		deviceSelect:'',
		carSelect:'',
		latSelect:'',
		lonSelect:'',

		Btspeed : '-' ,
		Bttime : '-' ,
		Btplace : '-' ,
		speed: "ความเร็ว" , 
		time: "เวลา" , 
		place : "สถานที่" ,
		title: "เส้นทางย้อนหลัง" , 
		date:"วันที่" , 
		carID:"ทะเบียนรถ" , 
		selectCar :"เลือกรถ" , 
		speedTitle:"ความเร็ว" , 
		timeTitle:"เวลา" , 
		placeTitle:"สถานที่",
		toastAlert:"โปรดรอสักครู่ ขณะนี้ระบบกำลังค้นหาเส้นทางย้อนหลัง",
		loading : "กำลังโหลด...",
		btnShowRoute: "แสดงเส้นทางย้อนหลัง",
		dateAccess: "วันที่สิ้นสุด",
		StartTime : "เวลาเริ่ม",
        AccessTime : "เวลาสิ้นสุด",
        ok : "ตกลง",
        cancel: "ยกเลิก",

		startTime:  moment().format('YYYY-MM-DD') + ' 00:00:00',
		accessTime:  moment().format('YYYY-MM-DD')+ ' 23:59:59',

		List: [{
			device_id : 0,
			canCutEngin: false,
			name:"" ,
			event_id: 0,
			latitude: 0 ,
			longitude: 0,
			expiration_date: "" ,
			lastEvent : "",
			address: "" ,
			event_stamp:0,
			fuel_liters:"",
			heading:0,
			satellites:"",
			speed:"",
			status:0,
			status_time:"",
			temperature:"",
			fld_signalStrength:"",
			fld_engineLoad:"",
			fld_sensorHigh: "0",
			fld_driverID:"",
			fld_driverMessage:"" ,
			modal: 0,
			status_name:'',
			phone_number:'',
			online:0,
			status_engin: null,
			mile:0
		}],
		os:'android' ,
		dateStart: moment().format( 'YYYY-MM-DD'),
		dateEnd: moment().format('YYYY-MM-DD' ),
		dateEndMin :  moment().format( ) ,
		dateEndMax : moment().add(7,'days').format() 
	}

	getStorage = async (keyStore:any) => {
		try {
		  let value = localStorage.getItem(keyStore);
		  return value;
		} catch {
		  return "";
		}
	  };
	  setStorage = async (keyStore:any, valueStore:any) => {
		try {
		  localStorage.setItem(keyStore, valueStore);
		  console.log("set done");
		} catch {
		  return "";
		}
	  };


	async componentDidMount(){

		var date =await this.getStorage('date')

		if(date === null || date === undefined || date === '' ){
			dateTime =  moment().format('YYYY-MM-DD') 
			this.setState({
				dateStart : moment().format('YYYY-MM-DD')  ,
				dateEnd :  moment().format('YYYY-MM-DD') 
			}) 
			
			this.setStorage('date' , moment().format('YYYY-MM-DD') )
		}else if(date !== null || date !== undefined || date !== '' ){
			dateTime = date
			this.setState({
				dateStart : moment(date).format('YYYY-MM-DD')  ,
				dateEnd :  moment(date).format('YYYY-MM-DD') 
			}) 
			// dateEndMin = date.value
			// dateEndMax = moment(date.value).add(7,'days').format('YYYY-MM-DD') 
		}
		dateEnd =  moment().format('YYYY-MM-DD') 

		let info = await Device.getInfo()
		this.setState({
			os : info.operatingSystem
		})  

		// startTime:  moment().format('YYYY-MM-DD') + ' 00:00:00',
		// accessTime:  moment().format('YYYY-MM-DD')+ ' 23:59:59',
		let start =  moment().format('YYYY-MM-DD')+ ' 00:00:00'
		let end = moment().format('YYYY-MM-DD')+ ' 23:59:59'
		
		this.setStorage('startTime', start )
		this.setStorage('accessTime', end)
		this.setState({
			startTime:  moment(start).format()  ,
			accessTime:  moment(end).format(),
		},()=>{
			console.log('startTime ',this.state.startTime)
			console.log('accessTime ',this.state.accessTime)
		})

 
		let lang = await this.getStorage('language')
		let car = await this.getStorage( 'carID') 
		let device = await this.getStorage( 'deviceID')
		this.dateNow()
		if(device === null ||device === undefined || device === ''){
			device = '0'
		}
		console.log("previousPath -> componentDidMount -> device ", device )

		if(Number(device) === 0 || device === '0'){
			this.showMap  = 'none'
			this.setShowLangLoading()
		}else if(Number(device) !== 0 || device !== '0'){
			this.showMap  = 'block'
			this.setShowLoading()
			
		}
		 
		if(lang === '"th"'|| lang === 'th'){
			selectPlaceHold = th.home.carList
			this.setState({
				selectPlaceHold : selectPlaceHold
			})
		}else if(lang === '"en"' || lang === 'en'){
			selectPlaceHold = en.home.carList
			this.setState({
				selectPlaceHold : selectPlaceHold
			})
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

			let carList =await this.getStorage('carList')
			this.setState({
				List : JSON.parse(carList || '{}')
			})
			this.setState({
				List : this.state.List.filter((List) => List.device_id !== null && List.event_id !== null)
			})
			for (let index = 0 ; index < this.state.List.length; index ++){
				carNumber[index+1] = {
					value : this.state.List[index].device_id ,
					label: this.state.List[index].name ,
					latitude: this.state.List[index].latitude ,
					longitude : this.state.List[index].longitude 
				}
			} 
		this.setCloseLangLoading()
	}

	dateNow= async()=>{
		var date =await this.getStorage('date')

		if(date === null && date === undefined && date === '' ){
			dateTime =  moment().format('YYYY-MM-DD')

			this.setStorage( 'date' ,  moment().format('YYYY-MM-DD') )
			dateEnd =  moment().format('YYYY-MM-DD')
		}else{
			dateTime = date
			dateEnd =  moment(date).format('YYYY-MM-DD')
		}
	}

	async componentWillUnmount(){
		this.setStorage('date',  moment().format('YYYY-MM-DD'))
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

	
	  
	goToMap =()=>{
		this.setState({
			redirect : true
		})
	}

	doRefresh =(event: CustomEvent)=> {
		console.log('กำลังโหลด');
	  
		setTimeout(() => {
		  console.log('โหลดสำเร็จ');
		  event.detail.complete();
		}, 2000);
	  }
 
	  carDatails=()=>{
		  this.setState({
			speed : 60 ,
			time : '16:53:24' ,
			place : 'Phuket'
		  })
	  }

	setSelectOptions= async ()=>{
			let lang =await this.getStorage('language');
			let token =await this.getStorage('token');
			let host = await this.getStorage('api')
			
			if(lang === '"th"'|| lang === 'th'){
				selectPlaceHold = th.home.carList
				this.setState({selectPlaceHold : selectPlaceHold})
				carNumber[0] = {value : 0 , label: selectPlaceHold , latitude: 0, longitude:0 } 
			}else if(lang === '"en"' || lang === 'en'){
				selectPlaceHold = en.home.carList
				this.setState({selectPlaceHold : selectPlaceHold})
				carNumber[0] = {value : 0 , label: selectPlaceHold , latitude: 0, longitude:0 } 
			}
			
			axios.get(`${host}/home` ,{
				headers: {
					"language": lang  ,
					"token" : token ,
					"authorization": api.authorization
				}		
			}).then(res => {
            console.log("res", res)
				for (let index = 0 ; index < res.data.length; index ++){
					carNumber[index+1] = {
						value : res.data[index].device_id ,
						label: res.data[index].name ,
						latitude: res.data[index].latitude ,
						longitude : res.data[index].longitude 
					}
				}
			})
	}

	handleChange = (selectedOption: any) => {
		this.setState(
		  { selectedOption },
		  () => console.log(`Option selected:`, this.state.selectedOption)
		);

		this.setState({
			selectValue :  selectedOption.value
		},()=>console.log("handleChange -> selectValue", this.state.selectValue))

		selectedCar = selectedOption
		let carValue = selectedCar.value
		let car = selectedCar.label
		let latitude = selectedCar.latitude
		let longitude = selectedCar.longitude

		this.setStorage('deviceID',JSON.stringify(carValue));
		this.setStorage('carID',car.toString());
		 if(latitude !== 0 || longitude !==0){
			this.setStorage('latitude',JSON.stringify(latitude));
			this.setStorage('longitude',JSON.stringify(longitude));
		 }
 
	  };

	setShowLoading=()=>{
		this.setState({
			showLoading: true
		})
	}
	setCloseLoading=()=>{
		this.setState({
		  showLoading :false 
		})
	}

	setShowLangLoading=()=>{
		this.setState({
			showLangLoading :true ,
		  })
	}
	setCloseLangLoading=()=>{
		this.setState({
			showLangLoading :false ,
		  })
	}

	setShowToast=()=>{
		this.setState({
			showToast: true
		})
	}
	setCloseToast=()=>{
		this.setState({
			showToast: false
		})
	}

	refreshPage(){
		window.location.reload(); 
	  }

	  
	dateSelect=(e:any)=>{
		var date = moment(e).format('YYYY-MM-DD')
		dateStartBackup = moment(e).format('YYYY-MM-DD')
		dateEndBackup = moment(e).format('YYYY-MM-DD')

		dateTime = moment(e).format()
		dateEnd = moment(e).format() 

		this.setState({
			dateStart : moment(e).format('YYYY-MM-DD'),
			dateEnd : moment(e).format('YYYY-MM-DD'),
			dateEndMin :  moment(e).format( ) ,
		    dateEndMax : moment(e).add(7,'days').format() 
		},()=>{
			this.setStorage('date',this.state.dateStart) 
			this.setStorage('dateEnd',this.state.dateEnd) 
		})

        console.log("change dateEnd", dateEnd) 
        console.log("dateSelect -> e.detail.value", e ) 
		console.log(date)

		//this.refreshPage()
	}

	dateEndSelect=(e:any)=>{ 

		//var date = moment(e.detail.value).format('YYYY-MM-DD')
		//dateEnd = moment(e.detail.value).format()
		dateEndBackup = moment(e).format('YYYY-MM-DD')

		this.setState({ 
			dateEnd : moment(e).format('YYYY-MM-DD')
		},()=>{
			this.setStorage('dateEnd',this.state.dateEnd) 
		})
		  
	}


	timeStart=(e:any)=>{ 
		var time = moment(e.target.value).format('YYYY-MM-DD HH:mm:ss')
		this.setState({
			startTime : time
		},()=>console.log('startTime -> ',this.state.startTime))
		this.setStorage('startTime',time)
		// console.log(date)
	}
	timeAccess=(e:any)=>{
		var time = moment(e.target.value).format('YYYY-MM-DD HH:mm:ss')
		this.setState({
			accessTime : time
		},()=>console.log('accessTime -> ' ,this.state.accessTime))
		this.setStorage('accessTime',time)
		// console.log(date)
	}
	 

	setLanguage = async()=>{
		let languag =await this.getStorage('language' );
		
		let l
		if (languag === '"th"' || languag === 'th'){
			l = th.previousRoute
			title = l.title 
			date = l.date
			toastAlert = l.toastAlert
			loading = l.loading
			btnShowRoute = l.btnShowRoute
			startTime = l.startTime
			accessTime = l.accessTime
			dateAccess= l.dateEnd
		} else if(languag === '"en"' || languag === 'en'){
			l = en.previousRoute
			title = l.title 
			date = l.date
			toastAlert = l.toastAlert
			loading = l.loading
			btnShowRoute = l.btnShowRoute
			startTime = l.startTime
			accessTime = l.accessTime
			dateAccess= l.dateEnd
		}else if(title === undefined || title === null){
			 l = this.state
			title = l.title 
			date = l.date
			toastAlert = l.toastAlert
			loading = l.loading
			btnShowRoute = l.btnShowRoute
			startTime = l.startTime
			accessTime = l.accessTime
			dateAccess= l.dateAccess
		}

	}

	render(){
		this.setLanguage()
		let s = this.state
		if(title === undefined || title === null){
			title = s.title 
			date = s.date
			toastAlert = s.toastAlert
			loading = s.loading
			startTime = s.startTime
			accessTime = s.accessTime
			dateAccess= s.dateAccess
		}
		this.dateNow()

		if(this.state.redirectBackHome === true){
			return <Redirect to='/home' />
		}
		return(
			<IonPage>
			<IonHeader className='nav-title'>
						<IonToolbar color='light'> 
							 {
								this.state.os === 'ios' ? 
								<div>
									<IonIcon mode='ios' icon={arrowBack} color='primary' style={{fontSize:'1.5em'}} onClick={()=>{this.setState({redirectBackHome : true})}} />
								    <IonTitle color='primary'>{title}</IonTitle>
								</div>:
								''
							}
							<IonButtons  slot="end">
								<IonMenuButton color='primary' />
							</IonButtons>
						
						</IonToolbar>
				</IonHeader>
			<IonContent>

        <div style={{paddingTop:'0rem',width:'100vw',backgroundColor:'#fff',minHeight:'75vh'}}>
		{
			this.state.os === 'android' ? 
			 <IonTitle style={{fontSize:'1.7rem'}}> <IonIcon mode='ios' icon={arrowBack} onClick={()=>{this.setState({redirectBackHome : true})}} /> {title}</IonTitle>:null
		}
		
			
				<IonItem lines='none'>
					<IonIcon icon={calendar} color='primary' mode='ios' />
					<IonLabel  color='medium'> &nbsp;&nbsp;{date}</IonLabel>

					<IonDatetime 
							onIonChange={(e:any)=>{this.dateSelect( e.detail.value!); }}
							color='primary'
							style={{color:config.color}}
							value={this.state.dateStart}
							displayFormat="DD/MM/YYYY" >
                    </IonDatetime>
				</IonItem> 
				<IonItem lines='none'>
					<IonIcon icon={watch} color='light' mode='md' />
					<IonLabel  color='medium'> &nbsp;&nbsp;{startTime}</IonLabel>

					<IonDatetime 
							onIonChange={(e:any)=>{this.timeStart(e); }}
							color='primary'
							style={{color:config.color}}
							value={this.state.startTime}
							displayFormat="HH:mm:ss" >
                    </IonDatetime>
				</IonItem> 
<br/>

				<IonItem lines='none'>
					<IonIcon icon={calendar} color='primary' mode='ios' />
					<IonLabel  color='medium'> &nbsp;&nbsp; {dateAccess}</IonLabel>
					<IonDatetime 
							onIonChange={(e:any)=>{this.dateEndSelect(e.detail.value!); }}
							color='primary'
							style={{color:'#134985'}}
							value={this.state.dateEnd}
							min={this.state.dateEndMin}
							max ={this.state.dateEndMax}
							displayFormat="DD/MM/YYYY" >
                    </IonDatetime>
				</IonItem> 
				<IonItem lines='none'>
					<IonIcon icon={watch} color='light' mode='md' />
						<IonLabel  color='medium'> &nbsp;&nbsp; {accessTime}</IonLabel>
					<IonDatetime 
							onIonChange={(e:any)=>{this.timeAccess(e); }}
							color='primary'
							style={{color:'#134985'}}
							value={this.state.accessTime}
							displayFormat="HH:mm:ss" >
                    </IonDatetime>
				</IonItem>
 
				<div style={{margin: '15px',marginTop:'2rem',marginBottom:'3rem'}}>
					<Select
						//Value={this.state.carSelect}
						onChange={this.handleChange}
						options={carNumber}
						placeholder={this.state.selectPlaceHold}
						styles={colourStyles}
					/>
				</div>

			
				<IonRouterLink 
						routerDirection="forward" 
						className='back-arrow set-center'  
						target="_self" 
						routerLink='/pathrouting'  
						onClick={()=>{    
							this.setStorage('date', this.state.dateStart) 
							this.setStorage('dateEnd',this.state.dateEnd) 
						}}
					> 
						<IonButton 
							type='button'
							mode='ios'  
							className='btn-log' 
							expand='block' 
							style={{margin:'10px', position:'relative',width:'80vw',fontSize:'1em'}}  
							>
							<p  style={{color:"#fff"}} >{btnShowRoute}</p>
						</IonButton> 
				</IonRouterLink>
				 
		
		</div>  

		 
			
		</IonContent>
			<IonLoading
				mode='ios'
				isOpen={this.state.showLangLoading}
				onDidDismiss={()=>{this.setCloseLangLoading()}}
				message={loading} 
			/>

			<IonLoading
				mode='ios'
				isOpen={this.state.showLoading}
				onDidDismiss={()=>{this.setCloseLoading()}}
				message={loading}
				duration={2000}
			/>
			<IonToast
				mode='ios'
				color='primary'
				isOpen={this.state.showToast}
				onDidDismiss={() => this.setCloseToast()}
				message={toastAlert}
				duration={3000}
			/>
		</IonPage>
		)
	}
} 

