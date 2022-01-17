import {
	IonButtons,
	IonPage,
	IonToolbar,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
	IonLabel,
	IonDatetime,
	IonBackButton,
	IonRefresher,
	IonRefresherContent,
	IonLoading,
	IonItem,
	IonIcon,
	IonButton,
	IonPopover
	} from '@ionic/react'
import React from 'react'
import './Home.css'
import en from '../en.json'
import Select from 'react-select';
import th from '../th.json'
import { Plugins} from "@capacitor/core"
import axios from 'axios'
import api from '../api.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRoute, faCar , faParking , faRunning, faTachometerAlt, faStopCircle, faCarSide, faIdCard, faShippingFast,  } from '@fortawesome/free-solid-svg-icons';


import '../pages/flat-font/flaticon.css'
import { list, pin } from 'ionicons/icons'

var moment = require('moment');
moment().format();
library.add(faRoute,faCar, faParking , faRunning, faTachometerAlt, faStopCircle, faCarSide, faIdCard, faShippingFast )
const { Storage } = Plugins;

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


let dateTime:any  ;
let selectPlaceHold:any ;

  let title:any , date:any , carId:any , dataSummary:any , theDistance:any , carStoping:any , carPark:any , carRunning:any , mostSpeed:any , speedLimit:any , Driver:any;
  let minUnit:any, timesUnit:any , km:any, loading:any , showReport:any ;
export default class report extends React.Component{
	

	state= {
		showDetails:'none',
		showLoading: false, 
		showPopover : false,
		setShowLoading:false,
		redirect : false,
		selectedOption: null,
		selectPlaceHold : 'ALL' ,
		selectValue: 0,
		selectLabel: '',
		dateSelected:'',
		today:  moment().format(),
		distance : "0" ,
		carStop : "0" ,
		carParking : "0" ,
		carMoving : "0" ,
		topSpeed : 0 ,
		speedLimited : 0,
		driver : "" ,
	
		title:"รายงานสรุปการใช้รถ" , 
		date:"วันที่" , 
		carId:"ทะเบียนรถ" , 
		dataSummary:"สรุุปข้อมูลรายวัน" , 
		theDistance:"ระยะทาง" , 
		carStoping:"จอดติดเครื่องยนต์" , 
		carPark:"จอดนิ่ง" , 
		carRunning:"เคลื่อนที่" , 
		mostSpeed:"ความเร็วสูงสุด" , 
		speedLimit:"ความเร็วเกินกำหนด" , 
		Driver:"ผู้ขับ",
		minUnit:"นาที", 
		timesUnit:"ครั้ง" ,
		km:"กม/ชม.",
		loading:"กำลังโหลด...",
		showReport : "แสดงรายงาน",
		List:{
			date: moment().format('YYYY-MM-DD'),
            distance_all: 0,
            parking_engine_start: 0,
            parking: 0,
            move: 0,
            speed_max: 0,
            speed_limit: 0,
			count: 0,
			driver_id:"",
			driver_message:'',
			speed_max_address:""
		},
		list: [{
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
	}

	setShowLoading=()=>{
		this.setState({
			showLoading: true, 
			setShowLoading:true,
		})
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


	doRefresh =(event: CustomEvent)=> {
		console.log('กำลังโหลด');
	  
		setTimeout(() => {
			
		this.fetchNewData();
		console.log('โหลดสำเร็จ');
		event.detail.complete();
		}, 2000);
		
	  }
	
	setLoading=(e:any)=>{
		this.setState({
		  showLoading :e 
		})
	}
	goToMap =()=>{
		this.setState({
			redirect : true
		})
	}

	handleChange = (selectedOption: any) => {
		this.setState(
		  { selectedOption },
		  () => console.log(`Option selected:`, this.state.selectedOption)
		);

		this.setState({
			selectValue :  selectedOption.value , 
			selectLabel : selectedOption.label
		},()=>console.log("handleChange -> selectValue", this.state.selectValue))

		selectedCar = selectedOption
		let latitude = selectedCar.latitude
		let longitude = selectedCar.longitude

		 if(latitude !== 0 || longitude !==0){
			this.setStorage('latitude',JSON.stringify(latitude));
			this.setStorage('longitude',JSON.stringify(longitude));
		 }

	  };

	dateNow= async()=>{
		let device_id = await this.getStorage('deviceID')
		var dateTime =await this.getStorage( 'date')
		if(Number(device_id) === 0 ){
			this.setStorage('date',moment().format('YYYY-MM-DD') )
		}else if(Number(device_id) !== 0 ){
			if(dateTime === null && dateTime === undefined && dateTime === '' ){
				dateTime =  moment().format('YYYY-MM-DD')
				this.setState({
					today : moment().format('YYYY-MM-DD')
				})
			}else if(dateTime !== null || dateTime !== undefined || dateTime !== ''){
				this.setState({
					today : dateTime
				})
			}
		}
		
	}

	dateSelect=(e:any)=>{
		var date = moment(e.target.value).format('YYYY-MM-DD')
		this.setStorage('date', date)
		console.log(date)
		dateTime = e.target.value
		this.setState({dateSelected : moment(dateTime).format('DD/MM/YYYY')})
	}

	fetchNewData= async ()=>{
		this.dateNow()

		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
		let device_id = await this.getStorage('deviceID')
		let date = await this.getStorage('date')

		if(device_id !== '0'|| Number(device_id)!== 0){
			axios.post(`${apiHost}/report/summary`,{
				deviceId: device_id ,
				date: date
			  } ,{
				headers: {
				  "language": lang  ,
				  "token" : token ,
				  "authorization" : api.authorization,
				  "version":api.version.slice(2)
				}		
			  })
			  .then(res => {
				console.log(res.data)
				this.setState({ List : res.data })
			  }) 

			  this.setState({
				showDetails : 'block'
			})
		}
	}

	async componentDidMount(){
		this.setLanguage();
		//this.dateNow()
		this.setLoading(true)

		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let host = await this.getStorage('api')

		dateTime =  moment().format()
		this.setState({dateSelected : moment(dateTime).format('DD/MM/YYYY')})
	
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

		let carList =await this.getStorage('carList')
		this.setState({
			list : JSON.parse(carList  || '{}')
		})
		this.setState({
			list : this.state.list.filter((list) => list.device_id !== null && list.event_id !== null)
		})
		for (let index = 0 ; index < this.state.list.length; index ++){
			carNumber[index+1] = {
				value : this.state.list[index].device_id ,
				label: this.state.list[index].name ,
				latitude: this.state.list[index].latitude ,
				longitude : this.state.list[index].longitude 
			}
		}  
		this.setLoading(false)
		
	}

	showPopover=()=>{
        this.setState({showLoading : true})
        setTimeout(()=>{
            this.setState({showPopover : true})
        },1000)
	}
	closePopover=()=>{
		this.setState({showPopover : false})
	}

	submit=async (e:any)=>{
		e.preventDefault()
		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
		let device_id = await this.getStorage('deviceID')
		let date = await this.getStorage('date')
		let host = await this.getStorage('api')
        console.log("submit -> date", date)
		if(this.state.selectValue!== 0){

			console.log("submit -> this.state.selectValue", this.state.selectValue)
			axios.post(`${apiHost}/report/summary`,{
				deviceId: this.state.selectValue ,
				date: moment(date).format('DD/MM/YYYY')
			  } ,{
				headers: {
				  "language": lang  ,
				  "token" : token ,
				  "authenication" : api.authorization,
				  "version":api.version,
				}		
			  })
			  .then(res => {
				console.log(res)
				this.setState({ List : res.data })
			  }) 


		   this.showPopover()
		   this.setLoading(false)
        }else{
           console.log("กรุณาเลือกรถ");
        }
	}

	componentWillUnmount(){
		this.setStorage('date',moment().format('YYYY-MM-DD'))
	}

	setLanguage = async ()=>{ 
		let languag =await this.getStorage('language')
		let l
		if ( languag == 'th'){
			l = th.carUsage
			title = l.title 
			date = l.date
			carId= l.carID
		//carSelect = l.carSelect
			dataSummary = l.dataSummaryDaily
			theDistance = l.distance
			carStoping = l.carStop
			carPark = l.carParking
			carRunning = l.carRunning
			mostSpeed = l.mostSpeed
			speedLimit = l.speedLimited
			Driver = l.driver
			minUnit = l.minute
			timesUnit = l.times
			km = l.km
			loading = l.loading
			showReport = l.showReport
		} else if(languag === '"en"'){
			l = en.carUsage
			title = l.title 
			date = l.date
			carId= l.carID
			//carSelect = l.carSelect
			dataSummary = l.dataSummaryDaily
			theDistance = l.distance
			carStoping = l.carStop
			carPark = l.carParking
			carRunning = l.carRunning
			mostSpeed = l.mostSpeed
			speedLimit = l.speedLimited
			Driver = l.driver
			minUnit = l.minute
			timesUnit = l.times
			km = l.km
			loading = l.loading
			showReport = l.showReport
		}
		
		//this.setShowLoading()
	}
	render(){
		//this.setLanguage();
		let l = this.state
		if (title === undefined){
			title = l.title 
			date = l.date
			carId= l.carId
			dataSummary = l.title
			theDistance = l.distance
			carStoping = l.carStop
			carPark = l.carParking
			carRunning = l.carRunning
			mostSpeed = l.mostSpeed
			speedLimit = l.speedLimited
			Driver = l.driver
			minUnit = l.minUnit
			timesUnit = l.timesUnit
			km = l.km
			loading = l.loading
			showReport = l.showReport
		}
		return(
		<IonPage>
			<IonHeader className='nav-title'>
					<IonToolbar color='light' >
							<IonButtons>
								<IonBackButton color='primary' defaultHref='/allReport' text={title} ></IonBackButton>
								{/* <IonTitle className="ion-text-left" color='primary' ><strong>{title}</strong></IonTitle>	 */}
							</IonButtons>
							{/* <IonButtons slot="end">
								<IonMenuButton color='primary' />
							</IonButtons> */}
						</IonToolbar>
				</IonHeader>
			<IonContent>
			<IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={300}>
			<IonRefresherContent></IonRefresherContent>
		</IonRefresher>
        <IonGrid style={{padding:'0px'}}>
		 <IonRow>
		  <IonCol size="12" style={{marginTop:'1rem',padding:'0px'}}>
			<IonLabel style={{margin:"10px"}}>{date}</IonLabel><br/>
		  		<div  className="dateBox">
                    <div style={{float:"left"}} className="dateLabel">
                    <IonLabel color='medium'><h6>{date}</h6></IonLabel>
                    </div>
                        <div style={{float:'right'}} className="dateItem">
							<IonDatetime 
								onIonChange={(e:any)=>{this.dateSelect(e); }}
								style={{color:'#666666'}}
								id ="dateEnd"
								display-timezone="utc"
								value={dateTime}
								displayFormat="DD/MM/YYYY" 
								color='dark'>
							</IonDatetime>
                        </div>
                </div>
		<div style={{width:'100vw', height:'1px',backgroundColor:'#f2f2f2',marginBottom:'1rem',marginTop:'1rem'}}></div>  	
		<IonLabel style={{margin:"10px"}}>{carId}</IonLabel><br/>
			<div  style={{margin: '10px'}}>
				{/* <ListCar/> */}
				<Select
					//Value={this.state.carSelect}
					onChange={this.handleChange}
					options={carNumber}
					placeholder={this.state.selectPlaceHold}
					styles={colourStyles}
				/>    
			</div>
			<br/>
			<IonButton 
				type='button'
				mode='ios' 
				style={{margin:'10px',marginTop:'1.5rem'}} 
				expand="block"
				onClick={(e)=>this.submit(e)}
				>
				{showReport}
			</IonButton>
		  </IonCol>
		 </IonRow>
		{/*  */}
		 
		</IonGrid> 
		</IonContent>

		<IonPopover
			mode='ios'
			isOpen={this.state.showPopover}
			cssClass='reportDataSummary-class'
			onDidDismiss={()=> this.closePopover()}
		>
			<div  id='dataSummary' className='' style={{fontSize:'.7em'}}>
				<div  className='ion-text-left headDataSummary' style={{backgroundImage:"url('../assets/images/bg.jpg')"}}>
					<h4>{this.state.selectLabel}</h4>
					<p >{dataSummary}</p>
					<p >{this.state.dateSelected}</p>
				</div>
		
			<IonItem lines='none' style={{fontSize:'0.9em'}}>
				<IonCol size='1'> 
					<FontAwesomeIcon style={{color:'#134985',fontSize:'1.2em'}} icon='route' />
					</IonCol>
						<IonCol size="5" style={{fontWeight: 'normal',}}>
						{theDistance}
					</IonCol>
				<IonCol size="6" className="ion-text-right"> {l.List.distance_all} {km.slice(0, -3)}</IonCol>
			</IonItem>
			<IonItem lines='none' style={{fontSize:'0.9em'}}>
				<IonCol size='1'> 
					<FontAwesomeIcon style={{color:'#ffce00',fontSize:'1.2em'}} icon='stop-circle' />
				</IonCol>
				<IonCol size="5" style={{fontWeight: 'normal',}}>
					{carStoping}
				</IonCol>
				<IonCol size="6" className="ion-text-right"> {l.List.parking_engine_start} </IonCol>
			</IonItem >
			<IonItem lines='none' style={{fontSize:'0.9em'}}>
				<IonCol size='1'> 
					<FontAwesomeIcon style={{color:'#f04141',fontSize:'1.2em'}} icon='parking' />
				</IonCol>
				<IonCol size="5" style={{fontWeight: 'normal',}}>
				{carPark}
				</IonCol>
				<IonCol size="6" className="ion-text-right">{l.List.parking} </IonCol>
			</IonItem>
			<IonItem lines='none' style={{fontSize:'0.9em'}}>
				<IonCol size='1'> 
					<FontAwesomeIcon style={{color:'#10dc60',fontSize:'1.2em'}} icon='car-side' />
				</IonCol>
				<IonCol size="5" style={{fontWeight: 'normal',}}>
				{carRunning}
				</IonCol>
				<IonCol size="6" className="ion-text-right">{l.List.move} </IonCol>
			</IonItem>
			<IonItem lines='none' style={{fontSize:'0.9em'}}>
				<IonCol size='1'> 
					<FontAwesomeIcon style={{color:'#134985',fontSize:'1.2em'}} icon='shipping-fast' />
				</IonCol>
				<IonCol size="5" style={{fontWeight: 'normal',}}>
				{mostSpeed}
				</IonCol>
				<IonCol size="6" className="ion-text-right">{l.List.speed_max} {km}</IonCol>
			</IonItem>

			{l.List.speed_max_address !== null ?
			<IonItem lines='none' style={{fontSize:'0.9em'}}>
				<IonCol size='1'> 
					<IonIcon style={{fontSize:'1.2em'}} color='primary' icon={pin} />
				</IonCol>
				<IonCol size="12" className="ion-text-left">{l.List.speed_max_address} </IonCol>
			</IonItem>:
			<p></p>
			}


			{ l.List.driver_id === "" || Number(l.List.driver_id) === 0 ?
			<IonItem lines='none' style={{fontSize:'0.9em'}}></IonItem >:
			  l.List.driver_id === null ?
			  <IonItem lines='none'></IonItem>:
			<IonItem lines='none' style={{fontSize:'0.9em'}}>
				<IonCol size='1'> 
					<FontAwesomeIcon style={{color:'#134985',fontSize:'1.2em'}} icon='id-card' />
				</IonCol>
				<IonCol size="5" style={{fontWeight: 'normal'}}>
				{Driver}
				</IonCol>
				<IonCol size="6" className="ion-text-right">{l.List.driver_id} {l.List.driver_message}</IonCol>
			</IonItem>}
		</div>
		</IonPopover>
		<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={()=>this.setLoading(false)}
			message={loading} 
		/>
			
		</IonPage>
		)
	}
}
