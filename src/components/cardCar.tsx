import {
	IonRow, 
	IonCol,
	IonIcon,
	IonGrid,
	IonLabel,
	IonSegment,
	IonSegmentButton,
	IonRefresher,
	IonRefresherContent,
	IonContent,
	IonToast,
	NavContext,
	IonCard,
	IonCardContent,
	IonAlert,
	IonPopover,
	IonRouterLink, IonInput, IonItem, IonButton, IonLoading
	} from '@ionic/react'
import React from 'react'
import { card, location, wifi, thermometer, apps, warning, pin, batteryCharging, lockClosed, batteryDead, call ,closeCircle,checkmarkCircle, flash, chevronForward, alertCircleOutline, alertCircle, timeOutline, time } from "ionicons/icons"
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab} from '@fortawesome/free-brands-svg-icons'
import { faGasPump , faEye, faLocationArrow, faCar, faUserTag, faCircle, faSatelliteDish, faRoute, faTachometerAlt, faDoorClosed, faShareSquare, faDoorOpen} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import en from '../en.json'
import th from '../th.json'
import { Plugins } from "@capacitor/core"
import axios from 'axios'
import api from '../api.json'
import app from '../app.config.json'
import ProgressbarCount from './progressCount'
import Select from 'react-select';
import copy from "copy-to-clipboard";
import '../pages/Home.css'
import '../pages/style.css' 
import '../pages/flat-font/flaticon.css'

var moment = require('moment');
moment().format();
const { Storage , Clipboard } = Plugins;
library.add(fab, faGasPump ,faEye , faLocationArrow ,faCar,faUserTag,faCircle , faSatelliteDish ,faRoute, faTachometerAlt , faLocationArrow ,faDoorClosed  ,faShareSquare ,faDoorOpen)

// eslint-disable-next-line
// eslint-disable-next-line
let  all: any[] = []

let segmentAll: any, segmentOnline:any, segmentOffline:any, refreshingText:any ,selectPlaceHold:any ,exitApp:any , powerCharge:any , expire:any;
let modalStatus:any , modalGSM:any,modalGPS:any, modalTempurature: any ,  modalDriver:any, modalDateVal:any , modalPowerCharging:any ,  exDate:any;
let  kmUnit:any , enterPassword:any, cancel:any, ok:any , shutdownDevice:any ;
let odometer: any , km :any , save: any , Mileage:any , Expired:any , cantOpenMap:any;
let carNumber = [{value : 0 , label: '' , latitude: 0, longitude:0 }]
let DoorSensor:any ,   DoorOpen:any , DoorClose:any ;
let cornerRightDetail = ['0']
const colourStyles = {
	control: (styles: any) => ({ ...styles, backgroundColor: 'white' , zIndex: 9999}),
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

export default class CardCar extends React.Component{
	static contextType = NavContext
	
	showComponent = false;
	sliderInterval:any;
	rotate=0;
	logoRotate='rotate(' +this.rotate+'deg)';

	state= {
		prompReasonOofline:false,
		cannotOpenMap:false,
		showToast : false ,
		showLoading:false,
		countPressBack : 0,
		showModal :false ,
		setShowModal :false ,
		redirectLog: false ,
		redirect : false,
		carSelect:null ,
		carSelectID:0 ,
		currentPath :'/',
		showCutEngine: false,
		showPopover: false,
		copyToclipBoard: false , 
		deviceIDSelect: 0,
		cancelShutdownCount: 0,
		mileNumber:'1254',
		alertPassword:'',
		carId: '',
		id: 0,
		coppyToClipboard : 'copy to clipboard',
		selectPlaceHold : 'Choose car' ,
		title:'บริษัท อันดามัน แทร็คกิ้ง จำกัด',
		segmentAll: "ทั้งหมด" ,
		segmentOnline:"ออนไลน์",
		segmentOffline :"ออฟไลน์" ,
		carList:"เลือกรถ" ,
		modalPlace:"สถานที่" ,
		modalStatus:"สถานะ" ,
		modalGSM:"GSM",
		modalGPS:"GPS",
		modalVoltage:"แรงดันไฟ" ,
		closeModal:"ปิดหน้าต่าง" ,
		modalDate : "วันที่",
		modalDriver: "คนขับ",
		modalTempurature: "อุณหภูมิ",
		modalPower:   "การชาร์ตไฟ",
		modalPowerCharging:'กำลังชาร์ต',
		modalGas: "น้ำมัน",
		refreshingText:'กำลังโหลด',
		segmentSelect:'all',
		exitApp:"กดอีกครั่งเพื่อออก",
		licenceExpire:"วันหมดอายุ",
		litUnit: 'ลิตร', 
		kmUnit: 'กม/ชม',
		enterPassword : "พิมพ์รหัสผ่าน",
		cancel :"ยกเลิก",
		ok : "ตกลง",
		shutdownDevice:'สั่งดับเครื่อง',
		odometer : "เลขไมล์" ,
		km : "กม" ,
		save: "บันทึก",
		Mileage: "เลขไมล์ระยะทาง",
		loading: 'กำลังโหลด...',
		Expired:'หมดอายุแล้ว',
		cantOpenMap:'ไม่สารถดูรายละเอียดของรถคันนี้ได้',
        DoorSensor : "เซนเซอร์ประตู",
        DoorOpen : "เปิด" ,
        DoorClose : "ปิด",
		editMile:false ,
		cornerRightDetail:['0'], 
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
			dltText:'',
			status:"",
			status_time:"",
			temperature:"",
			fld_signalStrength:"",
			fld_engineLoad:"",
			fld_sensorHigh: "0",
			fld_driverID:"",
			fld_driverMessage:"" ,
			showInputInform: false ,
			phone_number:'',
			modal: 0,
			status_name:'',
			online:0,
			status_engin: null,
			mile:0 ,
			closeOpenSensor: '0'
		}],
		List_Select: [{
			device_id : 0,
			canCutEngin: false,
			name:"" ,
			event_id: 0,
			latitude: 0 ,
			longitude: 0,
			expiration_date: "" ,
			showInputInform: false ,
			lastEvent : "",
			address: "" ,
			event_stamp:0,
			fuel_liters:"",
			heading:0,
			dltText:'',
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
			mile:0,
			closeOpenSensor: '0'
		}],
		on: [{
			device_id : 0,
			canCutEngin: false,
			name:"" ,
			event_id: 0,
			latitude: 0 ,
			longitude: 0,
			showInputInform: false ,
			expiration_date: "" ,
			lastEvent : "",
			address: "" ,
			event_stamp:0,
			fuel_liters:"",
			heading:0,
			satellites:"",
			speed:"",
			status:"",
			dltText:'',
			status_time:"",
			temperature:"",
			fld_signalStrength:"",
			fld_engineLoad:"",
			fld_sensorHigh: "0",
			fld_driverID:"",
			fld_driverMessage:"" ,
			modal: 0,
			phone_number:'',
			status_name:'',
			online:0,
			status_engin: null,
			mile:0,
			closeOpenSensor: '0'
		}] ,
		off:[{
			device_id : 0,
			canCutEngin: false,
			showInputInform: false ,
			name:"" ,
			event_id: 0,
			dltText:'',
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
			status:"",
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
			mile:0,
			closeOpenSensor: '0'
		}] ,
		alertList: [
			{
				address: "( 365.3 m) บ้านเพลินจันทร์ 2  ต.ป่าคลอก อ.ถลาง  จ.ภูเก็ต 83110",
				codeRef: "221005886080600 HASSANEE$YAMMAART$MR.",
				eventName: "Log Out",
				eventTime: "2021-10-02 12:02",
			}
		]
	}

	showLoading=(e:any)=>{
		this.setState({
			showLoading: e
		})
	}

	getStorage = async (keyStore:any) => {
		try{
		  // let { value } = await Storage.get({ key: keyStore }); 
		  let value = localStorage.getItem(keyStore)
		  return value ;
		}catch{
		  return ''
		} 
	  };
	setStorage = async (keyStore:any , valueStore:any) => {
		try{
		  //await Storage.set({ key: keyStore , value: valueStore });
		  localStorage.setItem(keyStore , valueStore)
		  console.log('set done')
		}catch{
		  return ''
		} 
	  };

	handleChange = (carSelect: any) => {
		this.setState(
		  { carSelect },
		  () => console.log(`Option selected:`, this.state.carSelect)
		);
			let devicID =carSelect.value
		console.log("CardCar -> handleChange -> carSelect", devicID)
		this.setState({
			carSelectID : devicID
		})
		
		if(devicID === 0){
			this.setState({
				List : 	all
			})
			console.log('this.state.List',this.state.List)
		}else if(devicID !== 0){
			console.log('devicID I= 0 ',devicID)
			this.setState({
				List : 	this.state.List.filter((List) => List.device_id === devicID ) 
			})
			if(this.state.List.length <= 1){
				this.setState({
					List : 	all
				},()=>
				this.setState({
					List : 	this.state.List.filter((List) => List.device_id === devicID ) 
				}))
			}else if(devicID === 0){
				this.setState({
					List : all
				})
			}
			console.log('this.state.List',this.state.List)
		} 
	  };

	cannotOpenMap=(e:any)=>{
		this.setState({
			cannotOpenMap : e
		})
	}

	setShowModal=()=>{
		this.setState({
			showModal :true ,
			setShowModal :true ,
			countPressBack : 0
		})
	}

	setCloseModal=()=>{
		this.setState({
			showModal :false ,
			setShowModal :false ,
			countPressBack : 0
		})
	}

	goToMap =()=>{
		this.setState({
			redirect : true
		})
	}
	closeToast=()=>{
		this.setState({
			showToast :false,
			countPressBack : 0
		})
	}

	showToast=()=>{
		this.setState({
			showToast : true,
		})
	}

	setShowCutEngine=(e:any)=>{
		this.setState({ showCutEngine : e})
	}
	setShowPopover=(e:boolean)=>{
		this.setState({ showPopover : e})
        console.log("CardCar -> setShowPopover -> e", e)
	}
	prompReasonOofline=(e:any ,id:any , car:any)=>{
		console.log(id)
		this.setState({
			prompReasonOofline : e ,
			deviceIDSelect : id ,
			carId: car
		})
	}

	seeOnline=(e:any , lat:any , lon:any , mile:boolean ,id:any)=>{
		console.log("CardCar -> e", e)
		if(lat !== null && lon !== null){
			this.setState({
				editMile : mile ,
				deviceIDSelect : e,
				id: e
			},()=>{
				this.deviceEvent(id)
				setTimeout(()=>{
					this.setShowPopover(true)
				},500)
				
			})
			
		}else if(e === 0 && lat === null ){
			this.canOpenMap()
		}
	}

	redirectLog=()=>{
		this.setState({
			redirectLog : true
		})
		this.refreshPage()
    }
    
	doRefresh =(event: CustomEvent)=> {
	  
		this.sliderInterval = setTimeout(async () => {
			let lang =await this.getStorage('language');
			let token =await  this.getStorage('token');
			let apiHost = await  this.getStorage('api');
			console.log("apiHost : ",apiHost ,token)
		  event.detail.complete();
		  axios.get(apiHost+'/home' ,{
			headers: {
				"language": lang  ,
				"token" : token ,
				"authorization": api.authorization,
				"version":api.version
				}		
			})
			.then(res => {
				this.setState({List : res.data})
				this.setState({
					List : this.state.List.filter((List) => List.device_id !== 0  && List.name !== null),
					List_Select : this.state.List.filter((List) => List.device_id === this.state.deviceIDSelect )
				},()=>{
					console.log('doRefresh > List.device_id !== 0  || List.name !== null > ' ,this.state.List)
				})
				all = res.data
				all = all.filter((all) => all.device_id !== 0  && all.name !== null)
				
				this.setState({
					on : this.state.List.filter((List) => List.online === 1) ,
					off : this.state.List.filter((List) => List.online === 0)
				})
				if(this.state.segmentSelect === 'all'){
					this.setState({ List : all })
				}else if(this.state.segmentSelect === 'on'){
					this.setState({ List : this.state.on })
				}else if(this.state.segmentSelect === 'off'){
					this.setState({ List : this.state.off })
				}
			});
		}, 2000);
      }
      
	refreshPage(){ 
		window.location.reload(); 
	}

	dateNow=()=>{
		exDate = moment( modalDateVal ).format("YYYY-MM-DD HH:mm")
		modalDateVal= moment(exDate).format("DD/MM/YYYY HH:mm")
	}

	goBack=()=> {
		this.context.navigate('/Home', 'back');
	}

	async componentDidMount() {
		this.showLoading(true)
		let lang = localStorage.getItem('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
		console.log('apiHost : ',apiHost)
		this.showComponent = true
		this.setStorage('carSts','all') 
		console.log("componentDidMount -> apiHost", apiHost+'/home')
		this.setState({
			on : [] ,
			off : [] ,
			alertList :[]
		})

		var timeStart =  moment().format('YYYY-MM-DD')
		var timeAccess =  moment().format('YYYY-MM-DD')
		this.setStorage('accessTime',timeAccess + ' 23:59:59') 
		this.setStorage('startTime',timeStart +' 00:00:00')  

		this.setState({
			List : this.state.List.filter((List) => List.device_id !== 0  )
		})
	 
		axios.get(apiHost+'/home' ,{
			headers: {
				"language": lang  ,
				"token" : token ,
				"authorization": api.authorization,
				"version":api.version
			}
		}).then(res => {
			
			if(res.data !== "" || res.data !== null || res.data !== undefined){
				console.log("CardCar -> componentDidMount -> res", res)
				 
				this.setState({ List : res.data  })
				this.setState({
					List : this.state.List.filter((List) => List.device_id !== null  && List.name !== null),
				},()=>{
					console.log('List.device_id !== 0  || List.name !== null -> ' ,this.state.List)
					this.setStorage('carList',JSON.stringify(this.state.List))  
				})

				this.setState({
					on : this.state.List.filter((List) => List.online === 1) ,
					off : this.state.List.filter((List) => List.online === 0 ||  List.online === undefined ||  List.online === null)
				})
				all = res.data
				all = all.filter((all) => all.device_id !== 0  && all.name !== null)
			}else{
				this.setState({ List : [] })
				this.setState({
					on : [] ,
					off : []
				})
				all = []
			}

			cornerRightDetail.length = this.state.List.length
			
			for (let index = 0 ; index <this.state.List.length; index ++){
					carNumber[index+1] = {
						value :this.state.List[index].device_id ,
						label:this.state.List[index].name ,
						latitude:this.state.List[index].latitude ,
						longitude :this.state.List[index].longitude 
					}
					cornerRightDetail[index] = '0'
				}
				
				console.log("CardCar -> componentDidMount -> cornerRightDetail.length", cornerRightDetail)

				/****************************************************** */
				console.log('lang ',lang)
				if(lang === '"th"'|| lang === 'th'){
					selectPlaceHold = th.home.carList
					carNumber[0] ={
						value : 0 ,
						label:  selectPlaceHold ,
						latitude: 0 ,
						longitude : 0
					}
					console.log('selectPlaceHold ', selectPlaceHold)
					this.setState({selectPlaceHold : th.home.carList})

				}else if(lang === '"en"' || lang === 'en'){
					selectPlaceHold = en.home.carList
					carNumber[0] ={
						value : 0 ,
						label:  selectPlaceHold ,
						latitude: 0 ,
						longitude : 0
					}
					console.log('selectPlaceHold ', selectPlaceHold)
				}
				this.showLoading(false)
		  }).catch(err =>{
    		console.log("CardCar -> componentDidMount -> err", err)
			  setTimeout(()=>{
				this.showLoading(false)
			  },1000) 
		  })

		this.sliderInterval = setInterval(() => {
		//this.setShowPopover(false)
		axios.get(`${apiHost}/home` ,{
			headers: {
					"language": lang  ,
					"token" : token ,
					"authorization": api.authorization,
					"version":api.version
				}		
		})
		.then(res => {
			if(res.data !== "" || res.data !== null || res.data !== undefined){
				console.log("CardCar -> componentDidMount -> res", res.data)
				this.setState({ List : res.data })

				this.setState({
					List : this.state.List.filter((List) => List.device_id !== null  && List.name !== null), 
				} )
				if(this.state.showPopover === true){
					this.setState({
						List_Select : this.state.List.filter((List) => List.device_id === this.state.deviceIDSelect )
					},()=>{
						this.setState({ 
						 mileNumber : this.state.List_Select[0].mile, 
					 	}) 
					})
				}

				this.setState({
					on : this.state.List.filter((List) => List.online === 1) ,
					off : this.state.List.filter((List) => List.online === 0 ||  List.online === undefined ||  List.online === null)
				})
				all = res.data
				all = all.filter((all) => all.device_id !== 0  && all.name !== null)
				if(this.state.segmentSelect === 'all'){
					this.setState({ List : all })
				}else if(this.state.segmentSelect === 'on'){
					this.setState({ List : this.state.on })
				}else if(this.state.segmentSelect === 'off'){
					this.setState({ List : this.state.off })
				}

			}else{
				this.setState({ List : [] })
				this.setState({
					on : [] ,
					off : []
				})
				all = []
			}
			
				for (let index = 0 ; index < this.state.List.length; index ++){
					carNumber[index+1] = {
						value : this.state.List[index].device_id ,
						label: this.state.List[index].name ,
						latitude: this.state.List[index].latitude ,
						longitude : this.state.List[index].longitude 
					}
				}

		});console.log('getted')}, 60000)
	}

	 componentWillUnmount(){
		this.setState({countPressBack : 0}) 
		this.setStorage('deviceID','all')  
		clearInterval(this.sliderInterval);
		modalStatus= null
		modalGSM= null
		segmentAll= null
		modalGPS = null
		modalDateVal= null
		exDate= null
		modalDriver= null
		modalPowerCharging = null

	}

	copyCodeToClipboard= async (e:any) => {
		//copy(e);
		console.log(e)
		Clipboard.write({
			string: e
		  }); 
		this.copyClipboard(true)
	  }

	copyClipboard=(e:any)=>{
		this.setState({
			copyToclipBoard : e
		})
	}
	
	setLanguage = async ()=>{
		const languag =await this.getStorage('language') 
		let l
		if (languag === '"th"' || languag === 'th'){
			l = th.home
			segmentAll =l.segmentAll 
			segmentOnline=l.segmentOnline
			segmentOffline=l.segmentOffline
			modalStatus = l.modalStatus
			modalGSM = l.modalGSM
			modalGPS = l.modalGPS
			modalDriver = l.modalDriver
			modalTempurature= l.modalTemp
			modalPowerCharging = l.modalPowerCharging
			refreshingText =l.loading
			powerCharge = l.modalPower
			expire = l.licenceExpire
			exitApp = l.exitApp
			enterPassword = l.enterPassword 
			cancel = l.cancel
			ok = l.ok
			shutdownDevice = l.shutdownDevice
			odometer = l.odometer
			km = l.km
			save = l.save
			Mileage = l.Mileage
			Expired = l.expired
			cantOpenMap = l.cantOpenMap
			DoorSensor = l.DoorSensor
			DoorOpen = l.DoorOpen
			DoorClose = l.DoorClose
		} else if(languag === '"en"' || languag === 'en'){
			l = en.home
			segmentAll = l.segmentAll 
			segmentOnline=l.segmentOnline
			segmentOffline=l.segmentOffline
			modalStatus = l.modalStatus
			modalGSM = l.modalGSM
			modalGPS = l.modalGPS
			modalDriver = l.modalDriver
			modalTempurature= l.modalTemp
			modalPowerCharging = l.modalPowerCharging
			refreshingText =l.loading
			powerCharge = l.modalPower
			expire = l.licenceExpire
			exitApp = l.exitApp
			enterPassword = l.enterPassword 
			cancel = l.cancel
			ok = l.ok
			shutdownDevice = l.shutdownDevice
			odometer = l.odometer
			km = l.km
			save = l.save
			Mileage = l.Mileage
			Expired = l.expired
			cantOpenMap = l.cantOpenMap
			DoorSensor = l.DoorSensor
			DoorOpen = l.DoorOpen
			DoorClose = l.DoorClose
		}
		
	}


	segmentAll=()=>{
		if(all.length !== 0){
			if(this.state.on.length + this.state.off.length !== 0){
				this.setState({
					List : all,
					segmentSelect:'all'
				},()=>console.log(this.state.segmentSelect))
				//console.log(all) 
				this.setStorage('carSts','all')  
			}
		}
	}

	segmentOnline=()=>{
		this.setState({
			List : this.state.on,
			segmentSelect:'on'
		},()=>{console.log(this.state.segmentSelect);console.log(this.state.List)}) 
		this.setStorage('carSts','on')  
	}

	segmentOffline=()=>{
		this.setState({
			List : this.state.off,
			segmentSelect:'off'
		},()=>{console.log(this.state.segmentSelect);console.log(this.state.List)})
	 
		this.setStorage('carSts','off')  
	}

	filterList=(e:any, mile:any)=>{
        console.log("CardCar -> filterList -> mile", typeof(mile) , mile)
		this.setState({
			List_Select : this.state.List.filter((List_Select)=> List_Select.device_id === e ) ,
			mileNumber : mile,
			deviceIDSelect : e
		}) 
	}

	setCornerRightDetail=(index: any, value:any)=>{
		console.log("CardCar -> setCornerRightDetail -> value", value)
		console.log("CardCar -> setCornerRightDetail -> index", index)
		
		var getIndex = cornerRightDetail.indexOf(index);

		console.log(typeof(cornerRightDetail[getIndex]))
		cornerRightDetail[index] = value
		console.log(" cornerRightDetail[getIndex]", cornerRightDetail[index])
		
		return cornerRightDetail[index]
	}

	setEditMileage=async ()=>{
		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
		let userID = await this.getStorage('userId');
		
		console.log("CardCar -> setEditMileage ->  this.state.List_Select[0].device_id",  this.state.deviceIDSelect)
		console.log("CardCar -> setEditMileage -> odometer", this.state.mileNumber )

		axios.post(apiHost+'/editmileage', {
			userId : userID ,
			deviceId: this.state.deviceIDSelect ,
			odometer : parseFloat(this.state.mileNumber)
		},
		{
			headers:{
				authenication : api.authorization ,
				token : token ,
				language : lang ,
				version : api.version
			}
		}).then(res =>{
			console.log("CardCar -> setEditMileage -> res", res)
			if(res.data.status===1){
				this.setShowPopover(false);
				setTimeout(()=>{
					axios.get(apiHost+'/home' ,{
						headers: {
							"language": lang  ,
							"token" : token ,
							"authorization": api.authorization,
							"version":api.version
						}
					})
					  .then(res => {
						
						if(res.data !== "" || res.data !== null || res.data !== undefined){
							console.log("CardCar -> componentDidMount -> res", res.data)
							// this.setState({ List : res.data })
							this.setState({ List : res.data  })
							this.setState({
								List : this.state.List.filter((List) => List.device_id !== 0  && List.name !== null),
								List_Select : this.state.List.filter((List) => List.device_id !== this.state.deviceIDSelect )
							},()=>{
								console.log('List.device_id !== 0  || List.name !== null -> ' ,this.state.List)
							})
							this.setState({
								on : this.state.List.filter((List) => List.online === 1) ,
								off : this.state.List.filter((List) => List.online === 0 ||  List.online === undefined ||  List.online === null)
							})
							all = res.data
							all = all.filter((all) => all.device_id !== 0  && all.name !== null)
						}else{
							this.setState({ List : [] })
							this.setState({
								on : [] ,
								off : []
							})
							all = []
						}
			
						cornerRightDetail.length =  res.data.length
						
						for (let index = 0 ; index < res.data.length; index ++){
								carNumber[index+1] = {
									value : res.data[index].device_id ,
									label: res.data[index].name ,
									latitude: res.data[index].latitude ,
									longitude : res.data[index].longitude 
								}
								cornerRightDetail[index] = '0'
							}
							
							console.log("CardCar -> componentDidMount -> cornerRightDetail.length", cornerRightDetail)
			
							/****************************************************** */
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
							}
					  }) 
				},1000)
			}
		})
	}


	shutDownEngine=async ()=>{
		//let lang =await Storage.get({key: 'language'});
		//let token =await Storage.get({key: 'token'});
		let apiHost = await  this.getStorage('api')
		let userID = await  this.getStorage('userId')
		let token =await this.getStorage('token')
		let lang = await this.getStorage('language')
		  
		let apiShutdown = apiHost+'/cutengine'  
		axios.post( apiShutdown ,{},{
			headers : {
				password  : this.state.alertPassword,
				userId: userID, 
				language: lang ,
				token : token ,
				authenication : api.authorization,
				deviceId : this.state.deviceIDSelect.toString()
			}
		}).then(res => { 
        console.log("CardCar -> res", res)
				axios.get(apiHost+'/home' ,{
					headers: {
						"language": lang  ,
						"token" : token ,
						"authorization": api.authorization,
						"version":api.version
						}		
					})
					.then(res => {
						this.setState({List : res.data})
						this.setState({
							List : this.state.List.filter((List) => List.device_id !== 0  && List.name !== null),
							List_Select : this.state.List.filter((List) => List.device_id !== this.state.deviceIDSelect )
						},()=>{
							console.log('cutengine > list > ' ,this.state.List)
						})
						all = res.data
						all = all.filter((all) => all.device_id !== 0  && all.name !== null)
						
						this.setState({
							on : this.state.List.filter((List) => List.online === 1) ,
							off : this.state.List.filter((List) => List.online === 0)
						})
						if(this.state.segmentSelect === 'all'){
							this.setState({ List : all })
						}else if(this.state.segmentSelect === 'on'){
							this.setState({ List : this.state.on })
						}else if(this.state.segmentSelect === 'off'){
							this.setState({ List : this.state.off })
						}
					}); 
		}).catch(err =>{
        	console.log("CardCar -> err", err)
			//console.log("CardCar -> header", header)
		})
	}

	informDisconnect=async ( comment:any)=>{
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api'); 
		let lang = await  this.getStorage('language')   

		console.log(this.state.deviceIDSelect , comment , token )
		axios.put(apiHost+'/informDisconnect',{
			deviceId: this.state.deviceIDSelect ,
			comment: comment
		},{
			headers: {  
				"token" : token ,
				"authenication": api.authorization
			}
		}).then(res => {
			console.log('987:informDisconnect res ',res)
			if(res.data.result=== true){ 
				this.setState({
					coppyToClipboard : 'ส่งข้อความสำเร็จ'
				},()=>{
					this.copyClipboard(true)
					setTimeout(()=>{
						this.setState({
							coppyToClipboard :'copy to clipboard'
						})
					},2100)
					axios.get(apiHost+'/home' ,{
						headers: {
							"language": lang  ,
							"token" : token ,
							"authorization": api.authorization,
							"version":api.version
							}		
						})
						.then(res => {
							console.log('res ',res)
							this.setState({List : res.data})
							this.setState({
								List : this.state.List.filter((List) => List.device_id !== 0  && List.name !== null),
								List_Select : this.state.List.filter((List) => List.device_id !== this.state.deviceIDSelect )
							},()=>{
								console.log('cutengine > list > ' ,this.state.List)
							})
							all = res.data
							all = all.filter((all) => all.device_id !== 0  && all.name !== null)
							
							this.setState({
								on : this.state.List.filter((List) => List.online === 1) ,
								off : this.state.List.filter((List) => List.online === 0)
							})
							if(this.state.segmentSelect === 'all'){
								this.setState({ List : all })
							}else if(this.state.segmentSelect === 'on'){
								this.setState({ List : this.state.on })
							}else if(this.state.segmentSelect === 'off'){
								this.setState({ List : this.state.off })
							}
						}); 
				}) 
			}else{
				this.setState({
					coppyToClipboard : 'ส่งข้อความ ไม่สำเร็จ'
				},()=>{
					this.copyClipboard(true)
					setTimeout(()=>{
						this.setState({
							coppyToClipboard :'copy to clipboard'
						})
					},2100)
				}) 
			}
		}).catch(err =>{
			console.log('informDisconnect err ',err)
			this.setState({
				coppyToClipboard : 'ส่งข้อความ ไม่สำเร็จ'
			},()=>{
				this.copyClipboard(true)
				setTimeout(()=>{
					this.setState({
						coppyToClipboard :'copy to clipboard'
					})
				},2100)
			}) 
		})
	}

	cancelShutdownEngine=async ()=>{
		let lang = await  this.getStorage('language')
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
		let userID = await this.getStorage( 'userId');
		

		let apiShutdown = apiHost+'/cancelshutdown'
		if(this.state.cancelShutdownCount >= 2 ){
			console.log('alredy cancelshutdown')
			this.setState({
				coppyToClipboard :'สั่งยกเลิกดับเครื่่องแล้ว' ,
				cancelShutdownCount: this.state.cancelShutdownCount +1
			},()=>{
				this.copyClipboard(true)
				setTimeout(()=>{
					this.setState({
						coppyToClipboard :'copy to clipboard'
					})
				},2100)
				setTimeout(()=>{
					this.setState({ 
						cancelShutdownCount:0
					})
				},5000)
			})
		}else{
			this.setState({
				coppyToClipboard :'สั่งยกเลิกดับเครื่อง' ,
				cancelShutdownCount: this.state.cancelShutdownCount +1
			},()=>{
				this.copyClipboard(true)
				setTimeout(()=>{
					this.setState({
						coppyToClipboard :'copy to clipboard'
					})
				},2100)
			}) 
			console.log('cancel shutdown working')

			axios.post( apiShutdown,{} ,{
				headers: { 
					"userId": userID,
					"deviceId": this.state.deviceIDSelect.toString(),
					"language": lang ,
					"token" : token ,
					"authenication": api.authorization
				}		
			}).then(res => {
				console.log("CardCar -> shutDownEngine -> res", res)
				axios.get(apiHost+'/home' ,{
					headers: {
						"language": lang  ,
						"token" : token ,
						"authorization": api.authorization,
						"version":api.version
						}		
					})
					.then(res => {
						console.log('res ',res)
						this.setState({List : res.data})
						this.setState({
							List : this.state.List.filter((List) => List.device_id !== 0  && List.name !== null),
							List_Select : this.state.List.filter((List) => List.device_id !== this.state.deviceIDSelect )
						},()=>{
							console.log('cutengine > list > ' ,this.state.List)
						})
						all = res.data
						all = all.filter((all) => all.device_id !== 0  && all.name !== null)
						
						this.setState({
							on : this.state.List.filter((List) => List.online === 1) ,
							off : this.state.List.filter((List) => List.online === 0)
						})
						if(this.state.segmentSelect === 'all'){
							this.setState({ List : all })
						}else if(this.state.segmentSelect === 'on'){
							this.setState({ List : this.state.on })
						}else if(this.state.segmentSelect === 'off'){
							this.setState({ List : this.state.off })
						}
					}); 
			})
		} 
	}



	createBinaryString=(dec:any)=>{
		// let uni =  (dec >>> 0).toString(2);
		// return uni;

		let id = JSON.stringify(dec) +':Andaman067'
		// let uni = Buffer.from( id , 'utf16le');
		// console.log("CardCar -> createBinaryString -> uni", uni)
		// return uni
		let encodedString =  Buffer.from(id).toString('base64');
		console.log("CardCar -> createBinaryString -> encodedString", encodedString)
		return encodedString
	  }
	  

	openExternalLink=async (e:any , lat:any ,long:any)=>{  
		let domain = await this.getStorage('domain')
		let url = domain +  this.createBinaryString(e) 
		console.log(url);
		this.createBinaryString(e)
		this.copyCodeToClipboard(url)
		this.copyClipboard(true)

		
		window.open( url ,'_self')
	}

	canOpenMap=()=>{ 
		this.setState({
			cannotOpenMap : true
		},()=>{
			setTimeout(()=>{
				this.setLanguage()
			},2000)
		}) 
	}

	deviceEvent=async(device_id:any)=>{
		let lang = await  this.getStorage('language')
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
		let userID = await this.getStorage( 'userId');

		axios.post(apiHost +'/deviceEvent',{
			deviceId: device_id 
		},
		{ 	
			headers: { 
				authenication: api.authorization,
				language:lang,
				token: token,
				version: api.version
			}
		}).then(res =>{
			console.log('res ',res)
			this.setState({
				alertList : res.data
			},()=>{
				console.log('this.state.alertList ', this.state.alertList)
			})
		}).catch(err =>{
			console.log('err ',err)
			this.setState({
				alertList : []
			})
		})
	}


	render(){ 
		if (this.state.redirectLog === true) {
			return <Redirect to='/login'/>
			
		}
		const l = this.state
		if(segmentAll === undefined){
			segmentAll = l.segmentAll 
			segmentOnline=l.segmentOnline
			segmentOffline=l.segmentOffline
			modalStatus = l.modalStatus
			modalGSM = l.modalGSM
			modalGPS = l.modalGPS
			modalDriver = l.modalDriver
			modalTempurature= l.modalTempurature
			modalPowerCharging = l.modalPowerCharging
			refreshingText =l.refreshingText
			powerCharge = l.modalPower
			expire = l.licenceExpire
			exitApp = l.exitApp
			kmUnit = l.kmUnit
			enterPassword = l.enterPassword 
			cancel = l.cancel
			ok = l.ok
			shutdownDevice = l.shutdownDevice
			odometer = l.odometer
			km = l.km
			save = l.save
			Mileage = l.Mileage
			Expired= l.Expired
			cantOpenMap = l.cantOpenMap
			DoorSensor = l.DoorSensor
			DoorOpen = l.DoorOpen
			DoorClose = l.DoorClose
		}
		if (this.state.redirect === true) {
			return <Redirect to='/map' />
		  }

		this.setLanguage();
		return(
        <IonContent>
			<IonRefresher slot="fixed" onIonRefresh={(event)=>this.doRefresh(event)} pullFactor={0.5} pullMin={100} pullMax={2000}>
					<IonRefresherContent  refreshingSpinner="lines-small" style={{marginBottom:'3rem'}}  refreshingText={refreshingText}></IonRefresherContent>
			</IonRefresher>
			<div>
        	<div >
				<div style={{zIndex:9999}}>
					<IonSegment className='segmentSelect' value={this.state.segmentSelect}>
						<IonSegmentButton mode='md' value="all" onClick={this.segmentAll} className='segmentHome'>
							<IonIcon icon={apps}  mode='ios' color='primary' style={{fontSize:'1.6rem'}} />
							<IonLabel style={{fontSize:'0.6rem'}}  color='primary'>{segmentAll} ({this.state.on.length + this.state.off.length})</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton mode='md' value="on" onClick={this.segmentOnline} className='segmentHome' >
							<IonIcon icon={wifi} color='success' style={{fontSize:'1.6rem'}} mode='ios' />
							<IonLabel style={{fontSize:'0.6rem'}} color='success'>{segmentOnline} ({this.state.on.length})</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton mode='md' value="off" onClick={this.segmentOffline} className='segmentHome'>
							<IonIcon icon={warning} color='medium' style={{fontSize:'1.6rem'}}/>
							<IonLabel style={{fontSize:'0.6rem'}} color='medium'>{segmentOffline} ({this.state.off.length})</IonLabel>
						</IonSegmentButton>
					</IonSegment>

					<div style={{padding:"0.5rem",border:'0px '}}>
						<Select 
							onChange={this.handleChange}
							options={carNumber}
							placeholder={this.state.selectPlaceHold}
							styles={colourStyles} 
						/>    
					</div>
					
					{this.showComponent === true ? <ProgressbarCount/> : <div></div>}
				</div>
				
				{this.state.List.map((List,index) =>
				<IonCard mode='md'  key={List.device_id} style={{padding:'0px'}}>
					<IonCardContent style={{padding:'0px'}}>
						{List.showInputInform ===  true ?
							<div className='closed-device-when-expire' style={{zIndex:1}} >
								<IonRow style={{ borderBottom:'1px solid #ccc',}} >
									<IonCol size="2">
									  <img src='../assets/icon/status_offline.png' width='100%' style={{  transform: "rotate("+List.heading+"deg)" }} alt='' /> 
									</IonCol>
									<IonCol size='10'>
										<strong>{List.name}</strong>
										<p>{List.dltText}</p>  
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol size='12'>
										<IonIcon icon={time } /> &nbsp;
									{List.event_stamp === null ? 
										<small> - </small>:
										<small> 
											 {moment(List.event_stamp).format('DD/MM/YYYY HH:mm:ss')}
									    </small>}
									</IonCol> 
									{
										List.address !== null && List.address !== undefined && List.address !== "" ?
										<IonCol size='12'  style={{paddingLeft:'4px' ,paddingTop:'.5rem',paddingBottom:'.5rem'}}> 
											<IonIcon icon={location} style={{fontSize:'1.2em'}} color='primary' />
											<IonLabel color="dark" style={{fontSize:'8.5pt'}} >{List.address}  </IonLabel> 
										</IonCol>:
										<></>
									}   
									{/* <IonCol size='9'>
										<IonInput placeholder='ระบุสาเหตุ / แจ้งซ่อม'  style={{border:'1px solid #eee',borderRadius:'10px'}}></IonInput>
									</IonCol> */} 
									<IonCol size='3' className="set-center">
									  <IonButton mode='ios' size="small" onClick={()=>{this.prompReasonOofline(true , List.device_id , List.name)}}><small>ระบุสาเหตุ</small></IonButton>
									</IonCol>
								</IonRow>
							</div>:
							 <div style={{display:'none'}}></div>
						} 
						<IonRow id='bottom-top'>
							<IonCol size='2' className='center-content' onClick={()=>{
								this.seeOnline(List.online, List.latitude , List.longitude , false , List.device_id);
								this.filterList(List.device_id,  List.mile);
							}}>
								{ List.online === 0 ? 
									<img src='../assets/icon/status_offline.png' width='100%' style={{  transform: "rotate("+List.heading+"deg)" }} alt='' />
									:JSON.stringify(List.status)=== '23' ? 
									<img src='../assets/icon/status_stop.png' width='100%' style={{  transform: "rotate("+List.heading+"deg)" }} alt=''/>
									:JSON.stringify(List.status)==='7' ?  
									<img src='../assets/icon/status_move.png' width='100%' style={{  transform: "rotate("+List.heading+"deg)" }} alt=''/>
									:JSON.stringify(List.status)==='24' ?
									<img src='../assets/icon/status_idle.png' width='100%' style={{  transform: "rotate("+List.heading+"deg)" }} alt=''/> 
									:
									<img src='../assets/icon/status_offline.png' width='100%' style={{  transform: "rotate("+List.heading+"deg)" }} alt='' /> 
								}
							</IonCol>
							<IonCol size='5'>
								<h2><strong  style={{color:'#202021'}}>{List.name}</strong></h2>
								{ List.online === 0   ?
									<strong style={{color: '#333333',fontSize:'.8em'}}>{List.status_name} {List.status_time}</strong>
									:JSON.stringify(List.status)=== '23' ?
									<strong style={{color: '#f04141',fontSize:'.8em'}}>{List.status_name} {List.status_time}</strong>
									:JSON.stringify(List.status)==='7' ? 
									<strong style={{color: '#10dc60',fontSize:'.8em'}}>{List.status_name} {List.status_time}</strong>
									:JSON.stringify(List.status)==='24' ?
									<strong style={{color: '#ffce00',fontSize:'.8em'}}>{List.status_name} {List.status_time}</strong>
									:<strong style={{color: '#333333',fontSize:'.8em'}}> - </strong>
								}<br/>
								{List.event_stamp === null ? 
								<small> - </small>:
								<small>{moment(List.event_stamp).format('DD/MM/YYYY HH:mm:ss')}</small>}
							</IonCol>
							<IonCol size='2' className='ion-text-center' > 
								<IonRow>
									<IonCol size='12'><FontAwesomeIcon icon='gas-pump' style={{color:'#666',fontSize:'1.5em'}} /> </IonCol>
								</IonRow>
								<IonRow>
									<IonCol size='12'>
										{ List.fuel_liters === "-" || List.fuel_liters === null || List.fuel_liters === undefined || List.fuel_liters === '' ?
											<IonLabel> <strong>0</strong> </IonLabel> :
											<IonLabel> <strong>{List.fuel_liters }</strong> </IonLabel> 
										}
									</IonCol>
								</IonRow>
								
							</IonCol>
							<IonCol size='2'  className='ion-text-center'  > 
								<IonRow>
									<IonCol size='12'><FontAwesomeIcon icon='tachometer-alt' style={{color: app.color,fontSize:'1.5em'}} />  </IonCol>
								</IonRow>
								<IonRow>
									<IonCol size='12'>
										{List.speed === null || List.speed === undefined || List.speed === '' ?
											<IonLabel> <strong>0</strong> <p><small>{kmUnit}</small></p></IonLabel> :
											<IonLabel> <strong>{List.speed}</strong> <p><small>{kmUnit}</small></p></IonLabel>
										}
									</IonCol>
								</IonRow>
								
							</IonCol>
							
							{List.latitude !== null || List.longitude !== null ?
								<IonCol size='1' 
									style={{padding:'0',paddingTop:'.5rem'}} 
									onClick={()=>{  
										this.setStorage('latitude',JSON.stringify(List.latitude))  
										this.setStorage('longitude',JSON.stringify(List.longitude))  
										this.setStorage('zoom',JSON.stringify(16))  
										this.setStorage('deviceID', JSON.stringify(List.device_id))  
									}}> 
									<IonRouterLink routerDirection='forward'  target="_top" routerLink='/fullmap'>
										<div id='arrow-to-fullmap'>
											<IonIcon icon={chevronForward} mode='ios' style={{fontSize:'2em'}} color='light' /> 
										</div>
									</IonRouterLink >
								</IonCol>:
								<IonCol size='1' 
									style={{padding:'0',paddingTop:'.5rem'}} 
									onClick={()=>this.canOpenMap()}
								>
										<div id='arrow-to-fullmap'>
											<IonIcon icon={chevronForward} mode='ios' style={{fontSize:'2em'}} color='light' /> 
										</div>
								</IonCol>
							}

						</IonRow>

						{List.fld_driverID === "" || List.fld_driverID === null || List.fld_driverID === undefined ? 
						<div></div>:
						<IonRow id='bottom-center' onClick={(e)=>{ 
							this.seeOnline(List.online, List.latitude , List.longitude , false , List.device_id);
							this.filterList(List.device_id,  List.mile);
						}}>    
							<IonCol size='1'>
								<IonIcon icon={card} style={{fontSize:'1.4em'}} color='success' />  
							</IonCol>
							<IonCol size='10'> 
								<small >{List.fld_driverID}</small>
								{List.fld_driverMessage === "" || List.fld_driverMessage === null || List.fld_driverMessage === undefined ?
									<small ></small> :
									<small > / {List.fld_driverMessage}</small> 
								}
							</IonCol>
						</IonRow>}

						{List.latitude !== null || List.longitude !== null ?	 
						<IonRow id='bottom-center'>
							<IonRouterLink routerDirection='forward'  color='dark'  target="_top" routerLink='/fullmap'
								onClick={()=>{
									this.setStorage( 'latitude' , JSON.stringify(List.latitude));
									this.setStorage( 'longitude' , JSON.stringify(List.longitude));
									this.setStorage( 'zoom' , JSON.stringify(12));
									this.setStorage( 'openFromList' , JSON.stringify(true))
									this.setStorage('deviceID' , JSON.stringify(List.device_id))
								}}> 
								{/* <IonCol size='1' className='set-center'> <IonIcon icon={pin} style={{fontSize:'1.4em'}} color='primary' /> </IonCol> */}
								<IonCol size='8'  style={{paddingLeft:'4px'}}> <IonIcon icon={location} style={{fontSize:'1.4em'}} color='primary' /> <IonLabel style={{fontSize:'8.5pt'}}>{List.address} </IonLabel> </IonCol>
							</IonRouterLink>
						</IonRow>
						 : 
						<IonRow id='bottom-center'>
							{/* <IonCol size='1'> <IonIcon icon={location} style={{fontSize:'1.4em'}} color='medium' /> </IonCol> */}
							<IonCol size='8'> <IonLabel style={{fontSize:'8.5pt'}}> <IonIcon icon={location} style={{fontSize:'1.4em'}} color='medium' /> {List.address} </IonLabel> </IonCol>
						</IonRow>} 

						<IonRow id='bottom-row' style={{padding:'0px'}}>
							<IonCol size='10'  style={{padding:'0px'}}>
								<IonRow>
									<IonCol size='1.2' onClick={(e:any) => this.openExternalLink(List.device_id , List.latitude ,List.longitude)}> 
										<FontAwesomeIcon icon='share-square' style={{color:'#134985',fontSize:'1.2em'}} />
									</IonCol>

								{
									 List.closeOpenSensor ==='0'?
									<IonCol size='1.2' 
										onClick={(e)=>{
											this.filterList(List.device_id,  List.mile);
											this.seeOnline(List.online, List.latitude , List.longitude , false , List.device_id) }}>  
											<FontAwesomeIcon icon='door-closed' style={{color:'#f04141',fontSize:'1.2em'}} />  
									</IonCol>
									: List.closeOpenSensor === '1' ?
									<IonCol size='1.2' 
											onClick={(e)=>{
												this.filterList(List.device_id,  List.mile);
												this.seeOnline(List.online, List.latitude , List.longitude, false , List.device_id) }}>  
										<FontAwesomeIcon icon='door-open' style={{color:'#10dc60',fontSize:'1.2em'}} /> 
									</IonCol>: 
									<div></div>  
								}

								{
									List.temperature === '-' || List.temperature === null || List.temperature === "" ?
									<div></div>:
									<IonCol size='1.2' 
										onClick={()=>{this.setCornerRightDetail(index,List.temperature); 
										this.seeOnline(List.online, List.latitude , List.longitude, false , List.device_id) ;
										this.filterList(List.device_id,  List.mile);
									}}> 
										<IonIcon icon={thermometer} style={{fontSize:'1.2em'}} mode='ios' color='primary' />
									</IonCol>
								}

									{List.fld_sensorHigh === "" || List.fld_sensorHigh === null || List.fld_sensorHigh === "-" ? 
										<IonCol size='1.2' onClick={()=>{ 
											this.seeOnline(List.online, List.latitude , List.longitude, false , List.device_id);
											this.filterList(List.device_id,  List.mile);
										}} > 
											<IonIcon icon={batteryDead} style={{fontSize:'1.2em'}} mode='md'  color='danger' />
										</IonCol>:
										<IonCol size='1.2' onClick={()=>{ 
											this.seeOnline(List.online, List.latitude , List.longitude, false , List.device_id);
											this.filterList(List.device_id,  List.mile);
										}} > 
											<IonIcon icon={batteryCharging} style={{fontSize:'1.2em'}} mode='md'  color='success' />
										</IonCol>
									}

									<IonCol size='1.2'  onClick={()=>{
										this.setCornerRightDetail(index,List.fld_signalStrength ); 
										this.seeOnline(List.online, List.latitude , List.longitude, false, List.device_id);
										this.filterList(List.device_id,  List.mile); 
									}}> 
										<IonIcon icon={wifi} mode='ios' style={{fontSize:'1.2em'}} color='primary' />
									</IonCol>
									<IonCol size='1.2' onClick={()=>{
										this.setCornerRightDetail(index,List.satellites );   
										this.seeOnline(List.online, List.latitude , List.longitude, false, List.device_id);
										this.filterList(List.device_id,  List.mile); 
									}}> 
										<FontAwesomeIcon icon='satellite-dish' style={{color:'#134985',fontSize:'1.2em'}} />
									</IonCol>

									<IonCol size='1.2' onClick={()=>{ 
												this.setStorage( 'carID' ,  List.name);
												this.setStorage( 'deviceID' ,  JSON.stringify(List.device_id)); 
											}}> 
										<IonRouterLink 
											routerDirection="forward" 
											className='back-arrow set-center'  
											target="_self" 
											routerLink='/previous' 
										> 
										<FontAwesomeIcon icon='route' style={{color: app.color,fontSize:'1.3em'}} /> 
										</IonRouterLink>
									</IonCol>

									<IonCol size='1.2'> 
										<a href={"https://www.google.com/maps/dir/?api=1&destination="+List.latitude+","+List.longitude}>
											<FontAwesomeIcon icon='location-arrow' style={{color: app.color,fontSize:'1.2em'}} /> 
										</a>
									</IonCol>
									
									{List.phone_number === '' ||  List.phone_number ===  null || List.phone_number === undefined || List.phone_number === "-"? 
										<div></div>:
										<IonCol size='1.2'> 
											<a href={"tel:"+List.phone_number}>
												<IonIcon icon={call} style={{color: app.color,fontSize:'1.2em'}} /> 
											</a>
										</IonCol>
									}

									{/* { List.fld_driverID === '' || List.fld_driverID === null || List.fld_driverID === undefined ? 
									<div></div>:
									<IonCol size='1.2'  onClick={(e)=>{ 
										this.seeOnline(List.online, List.latitude , List.longitude);
										this.filterList(List.device_id,  List.mile);
									}}> 
										{ List.fld_driverID === '' || List.fld_driverID === null || List.fld_driverID === undefined ? 
											<IonIcon icon={card} style={{fontSize:'1.4em'}} color='medium' /> :
											<IonIcon icon={card} style={{fontSize:'1.4em'}} color='success' /> 
										}
									</IonCol>
									} */}
									{List.canCutEngin === true? 
										<IonCol size='1.2'>
												<IonLabel>
													{List.status_engin === 0 ?
													<IonIcon icon={lockClosed} color='success' style={{fontSize:'1.4em'}} 
													onClick={(e)=>{this.setState({carId:List.name, deviceIDSelect : List.device_id});this.cancelShutdownEngine()}} /> :
													List.status_engin === 1 ?
													<IonIcon icon={lockClosed} color='danger' style={{fontSize:'1.4em'}} 
													onClick={(e)=>{this.setState({carId:List.name, deviceIDSelect : List.device_id});this.setShowCutEngine(true)}} />:
													<IonIcon icon={lockClosed} color='danger' style={{fontSize:'1.4em'}} 
													onClick={(e)=>{this.setState({carId:List.name, deviceIDSelect : List.device_id});this.setShowCutEngine(true)}} />}
												</IonLabel>
											
										</IonCol>:
									<div></div>}
								</IonRow>
							
							</IonCol>
							<IonCol size='2' style={{padding:'0px' , height:'100%'}}
							onClick={(e)=>{ 
								this.seeOnline(List.online, List.latitude , List.longitude , true, List.device_id);
								this.filterList(List.device_id, List.mile);
							}}>
									<div style={{width:'100%', height:'100%'}}>
										<div className='dataCorner'> 
											<IonLabel>Mile</IonLabel>
											{/* <strong>{cornerRightDetail[index]}</strong> */}
											{List.mile === null ? 
											<IonLabel style={{fontSize:'7.5pt',marginBottom:'.3em'}}> - </IonLabel>
											:<IonLabel style={{fontSize:'7.5pt',marginBottom:'.3em'}}>{List.mile}</IonLabel> 
											}
										</div>
									</div>
							</IonCol>
							
							
						</IonRow>
						<IonRow id='expire-row'>
							<IonCol size='12'>
								{moment().format() >= moment(List.expiration_date).format() ?
								<p> <IonIcon icon={closeCircle} color='danger' style={{fontSize:'1.4em'}}/> 
									&nbsp;
									{expire} - {moment(List.expiration_date).format('DD/MM/YYYY')}
								</p>:
								List.expiration_date === null ?
								<p> <IonIcon icon={closeCircle} color='danger' style={{fontSize:'1.4em'}}/> 
									&nbsp; {Expired}
								</p>:
								<p> <IonIcon icon={checkmarkCircle} color='success' style={{fontSize:'1.4em'}}/> 
									&nbsp;
									{expire} - {moment(List.expiration_date).format('DD/MM/YYYY')}
								</p>}
							</IonCol>
						</IonRow>
					</IonCardContent>
				</IonCard>)}
        	</div>
        </div>
		
		
		<IonPopover
			mode='md'
			isOpen={this.state.showPopover}
			cssClass='home-popover-class'
			onDidDismiss={(e)=>this.setShowPopover(false)}
		>
			{this.state.List_Select.map((List_Select) => 
			<IonGrid key={List_Select.device_id}>
				<IonRow>
					<IonCol size='3'>
						{
							List_Select.online === 0 ? 
							<img src='../assets/icon/status_offline.png' width='80%' style={{  transform: "rotate("+List_Select.heading+"deg)" }} alt=''/>
							:JSON.stringify(List_Select.status)=== '23' ?
							<img src='../assets/icon/status_stop.png' width='80%' style={{  transform: "rotate("+List_Select.heading+"deg)" }} alt=''/>
							:JSON.stringify(List_Select.status)==='7' ? 
							<img src='../assets/icon/status_move.png' width='80%' style={{  transform: "rotate("+List_Select.heading+"deg)" }}alt='' />
							:JSON.stringify(List_Select.status)==='24' ?
							<img src='../assets/icon/status_idle.png' width='80%' style={{  transform: "rotate("+List_Select.heading+"deg)" }} alt=''/>:
							<img src='../assets/icon/status_offline.png' width='80%' style={{  transform: "rotate("+List_Select.heading+"deg)" }} alt=''/>
						}
					</IonCol>
					<IonCol size='9' className='ion-text-left' >
						<strong>{List_Select.name}</strong><br/>
						<p style={{fontSize:'.4em'}}>{List_Select.address}</p>
					</IonCol>
				</IonRow>
				{this.state.editMile === true ? 
				<IonRow 
				style={{
					backgroundImage:"url('../assets/images/bg.jpg')",backgroundRepeat:'no-repeat',backgroundSize:'cover',
					backgroundColor:'#fcfdfe',backgroundPosition:'bottom center',paddingBottom:'.5rem' }}
				className='ion-justify-content-center'>
					<IonCol size='12'>
						<IonLabel style={{fontSize:'.5em'}} color='light' >{Mileage}</IonLabel>
					</IonCol>
					<IonCol size='3'>
						<IonLabel style={{fontSize:'.5em'}} color='light'>{odometer}</IonLabel>
					</IonCol>
					<IonCol size='5'>
						<IonItem lines = 'none' className="itemShadowHome">
							{parseFloat(this.state.mileNumber) === 0 ||List_Select.online === 0  ? 
								<IonInput
									style={{fontSize:'.7em'}}
									id="text"
									required
									value={this.state.mileNumber}
									type="text"
									disabled = {true}
									onIonChange={(e:any)=>{
										this.setState({mileNumber: e.target.value!},()=>console.log('this.state.mileNumber ',this.state.mileNumber))
									}}
								></IonInput>:
								<IonInput
									style={{fontSize:'.7em'}}
									id="text"
									required
									value={this.state.mileNumber}
									type="text"
									onIonChange={(e:any)=>{
										this.setState({mileNumber:e.target.value!},()=>console.log('this.state.mileNumber ',this.state.mileNumber))
									}}
								></IonInput>
							}

						</IonItem>
					</IonCol>
					<IonCol size='2'>
						<IonLabel style={{fontSize:'.5em'}} color='light'>{km}</IonLabel>
					</IonCol>
					
						<IonCol size='8'>
							<IonButton 
								color='dark'
								mode='ios'
								expand='block'
								type="button"
								onClick={()=>this.setEditMileage()}
							>
								<IonLabel 	style={{fontSize:'.7em'}}>{save}</IonLabel>
							</IonButton>
						</IonCol>
				</IonRow>:<div></div>}
				<IonRow style={{fontSize:'.7em',marginTop:'.5rem'}}>
					<IonCol size='4' className='content-center'>
						{List_Select.online === 0 ? 
							<span className="flaticon-truck" style={{color: '#e0e0e0'}}/>:
						List_Select.status === 23 ?
							<span className="flaticon-truck" style={{color: '#f04141'}}/>:
						List_Select.status === 24 ?
							<span className="flaticon-truck" style={{color: '#ffce00'}}/>:
						List_Select.status === 7 ?
							<span className="flaticon-truck" style={{color: '#10dc60'}}/>:
							<span className="flaticon-truck" style={{color: '#e0e0e0'}}/>
						}<br/>
						<IonLabel >{modalStatus }</IonLabel><br/>
						<small >{List_Select.status_name}</small>
					</IonCol>


				{
					List_Select.temperature === '-' || List_Select.temperature === null || List_Select.temperature === "" ?
					<div></div> :
					<IonCol size='4'>
						<IonIcon icon={thermometer} style={{fontSize:'2em'}} mode='ios' color='primary' /><br/>
						<IonLabel >{modalTempurature}</IonLabel><br/>
						<small >{List_Select.temperature} ํc</small>
					</IonCol>
				}

				{List_Select.fld_sensorHigh === "" || List_Select.fld_sensorHigh === null || List_Select.fld_sensorHigh === "-" ? 
					<IonCol size='4'>
						<IonIcon icon={batteryDead} style={{fontSize:'2em'}} mode='md'  color='danger' /><br/>
						<IonLabel >{powerCharge}</IonLabel><br/>
						<small >-</small>
					</IonCol>:
					<IonCol size='4'>
						<IonIcon icon={batteryCharging} style={{fontSize:'2em'}} mode='md'  color='success' /><br/>
					<IonLabel >{powerCharge}</IonLabel><br/>
						<small >{modalPowerCharging}</small>
					</IonCol>} 
					
					<IonCol size='4'>
						<IonIcon icon={wifi} mode='ios' style={{fontSize:'1.2em'}} color='primary' /><br/>
						<IonLabel >{modalGSM}</IonLabel><br/>
						<small >{List_Select.fld_signalStrength}</small>
					</IonCol>
					<IonCol size='4'>
						<FontAwesomeIcon icon='satellite-dish' style={{color:'#134985',fontSize:'1.2em'}} /><br/>
						<IonLabel >{modalGPS}</IonLabel><br/>
						<small >{List_Select.satellites}</small>
					</IonCol>

					{List_Select.fld_driverID === "" || List_Select.fld_driverID === null || List_Select.fld_driverID === undefined ? 
						<div></div>:
						<IonCol size='4'>
							<IonIcon icon={card} style={{fontSize:'1.4em'}} color='success' /><br/>
							<IonLabel >{modalDriver}</IonLabel><br/>
							<small >{List_Select.fld_driverID}</small>
							{List_Select.fld_driverMessage === "" || List_Select.fld_driverMessage === null || List_Select.fld_driverMessage === undefined ?
								<small ></small> :
								<small > / {List_Select.fld_driverMessage}</small> 
							}
					</IonCol>} 

					{List_Select.fld_engineLoad === null || List_Select.fld_engineLoad === "" || List_Select.fld_engineLoad === undefined ?
				<div></div>:
					<IonCol size='4'>
						<IonIcon icon={flash}  style={{fontSize:'1.4em'}} color='primary' /><br/>
						<small>{List_Select.fld_engineLoad} Volts</small>
					</IonCol> 
				} 
				{
					List_Select.closeOpenSensor ===  '0' ?
						<IonCol size='4' 
							onClick={(e)=>{
								this.filterList(List_Select.device_id,  List_Select.mile);
								this.seeOnline(List_Select.online, List_Select.latitude , List_Select.longitude, false, List_Select.device_id) }}>  
							<FontAwesomeIcon icon='door-closed' style={{color:'#f04141',fontSize:'1.2em'}} />  <br/>
							<IonLabel >{DoorSensor}</IonLabel><br/>
							<small >{DoorClose}</small>
						</IonCol>
					: List_Select.closeOpenSensor === '1' ? 
						<IonCol size='4' 
							onClick={(e)=>{
								this.filterList(List_Select.device_id,  List_Select.mile);
								this.seeOnline(List_Select.online, List_Select.latitude , List_Select.longitude, false, List_Select.device_id) }}>  
							<FontAwesomeIcon icon='door-open' style={{color:'#10dc60',fontSize:'1.2em'}} /> <br/>
							<IonLabel >{DoorSensor}</IonLabel><br/>
							<small >{DoorOpen}</small>
						</IonCol>: 
					<div></div>  
				}
				</IonRow> 
			</IonGrid>
			)}
			 
			{
			 this.state.alertList.length > 0 ?
			<IonGrid style={{maxHeight: '15rem', overflow: 'scroll'}}> 
				<IonRow className="ion-justify-content-center">
				    <IonCol size='12' className='ion-text-left'>
					<div style={{width:'100%',height:'3px',borderTop:'1px solid #ccc'}} ></div>
					</IonCol>
					<IonCol size='11' className='ion-text-left'>
						<small>การแจ้งเตือน</small>
					</IonCol> 
						<IonCol size='12' className='ion-text-left' >
							{
							this.state.alertList.map((al,index) => 
							<IonItem key={index}>
								<IonCol size='1' className="set-center" > <IonIcon icon={alertCircle} color='primary' /> </IonCol>
								<IonCol size='10' className='ion-text-left' >
								   <div className='alert-list'>
										<IonLabel className="alert-name">{al.eventName}</IonLabel> 
										<small className="alert-time">{al.eventTime}</small><br/>
										<small className="alert-time" >{al.codeRef}</small>
										<small className="alert-time" >{al.address}</small>
									</div> 
								</IonCol>
							</IonItem>)
							} 
						</IonCol> 
				</IonRow>
			</IonGrid>: <></> }

      </IonPopover>
	  	<IonToast
			isOpen={this.state.showToast}
			onDidDismiss={() => this.closeToast()}
			message={exitApp}
			mode = 'ios'
			color='dark'
			cssClass='toast_exitApp'
			duration={2000}
		/>
		<IonToast
			isOpen={this.state.copyToclipBoard}
			onDidDismiss={(e) => this.copyClipboard(false)}
			message={this.state.coppyToClipboard}
			mode = 'ios'
			color='dark'
			cssClass='toast_exitApp'
			duration={2000}
		/>
		<IonToast
			isOpen={this.state.cannotOpenMap}
			onDidDismiss={(e) => this.cannotOpenMap(false)}
			message={cantOpenMap}
			mode = 'ios'
			color='dark'
			cssClass='toast_exitApp'
			duration={2000}
		/> 

		<IonAlert
			isOpen={this.state.showCutEngine}
			onDidDismiss={(e)=>this.setShowCutEngine(false)}
			header={shutdownDevice}
			subHeader={this.state.carId}
			mode='ios'
			inputs={[
					{
						name: 'password',
						type: 'password',
						placeholder: enterPassword
					}
				]}
			buttons={[
				{
							text: cancel,
							role: 'cancel',
							cssClass: 'secondary',
							handler: () => {
								console.log('cancel')
							}
							},
							{
							text: ok,
							handler: data => {
								this.setState({
									alertPassword : data.password
								}) 
								this.shutDownEngine()
							}
							}
						]}
					/>
			<IonLoading
                mode = 'ios'
                isOpen={this.state.showLoading}
                onDidDismiss={()=>this.showLoading(false)}
                message={refreshingText} 
            />
			<IonAlert
			isOpen={this.state.prompReasonOofline}
			mode='ios'
			onDidDismiss={() => this.prompReasonOofline(false,0,'')} 
			header={'ระบุสาเหตุ / แจ้งซ่อม '}
			subHeader={this.state.carId}
			inputs={[
				{
				name: 'message',
				type: 'text',
				placeholder: 'ระบุสาเหตุ / แจ้งซ่อม'
				}]}
			buttons={[
				{
				text: 'Cancel',
				role: 'cancel', 
				},
				{
				text: 'Ok',
				handler: (data) => {
					console.log('Confirm Ok');
					this.informDisconnect( data.message )
				}
			}
			]}
			/>
				
		</IonContent>
		)
	}
}
