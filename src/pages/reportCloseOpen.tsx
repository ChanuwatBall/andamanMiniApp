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
	IonButton,
	IonPopover,
	IonSelect,
	IonSelectOption
	} from '@ionic/react'
import React from 'react'
import './Home.css'
import en from '../en.json'
import Select from 'react-select';
import th from '../th.json'
import { Plugins  } from "@capacitor/core" 
import axios from 'axios'
import api from '../api.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRoute, faCar , faParking , faRunning, faTachometerAlt, faStopCircle, faCarSide, faIdCard, faShippingFast, faDoorOpen, faDoorClosed,  } from '@fortawesome/free-solid-svg-icons';


import '../pages/flat-font/flaticon.css'
import { list, pin } from 'ionicons/icons'

var moment = require('moment');
moment().format();
library.add(faRoute,faCar, faParking , faRunning, faTachometerAlt, faStopCircle, faCarSide, faIdCard, faShippingFast, faDoorOpen ,faDoorClosed )
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

  let title:any , date:any , carId:any ;
  let   loading:any , showReport:any , doorOpen:any , doorClose:any , reportTitle:any;
export default class CloseOpenSensor extends React.Component{
	

	state= {
		currentSensor: 0 ,
		showDetails:'none',
		showSeneorList: 'none',
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
		dateSelectedStart: moment().format(),
		dateSelectedEnd: moment().format(),
		minDate: moment().format(),
		maxDate: moment().format(),
		distance : "0" ,
		carStop : "0" ,
		carParking : "0" ,
		carMoving : "0" ,
		topSpeed : 0 ,
		speedLimited : 0,
		driver : "" ,
	
		title:"เปิด-ปิด PTO" , 
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
		doorClosed:'ประตูปิด' ,
		doorOpen:'ประตูเปิด',
		reportTitle:"รายงานเปิด-ปิด PTO",
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
		
		closeOpenReport : [
			{
				id : 1,
				status_name : 'เปิดประตู' ,
				status_id : 1 ,
				date : '04/30/2021 07:05:23' ,
				place : 'ต.ป่าคลอก ภูเก็ต 83110, ประเทศไทย'
			},
			{
				id : 12,
				status_name : 'ปิดประตู' ,
				status_id : 0 ,
				date : '04/30/2021 07:15:23' ,
				place : 'ต.ป่าคลอก ภูเก็ต 83110, ประเทศไทย'
			},
			{
				id : 13,
				status_name : 'เปิดประตู' ,
				status_id : 1 ,
				date : '04/30/2021 08:05:23' ,
				place : 'ต.ป่าคลอก ภูเก็ต 83110, ประเทศไทย'
			},
			{
				id : 14,
				status_name : 'ปิดประตู' ,
				status_id : 0,
				date : '04/30/2021 08:25:23' ,
				place : 'ต.ป่าคลอก ภูเก็ต 83110, ประเทศไทย'
			}
		] ,
		sensorType: [
			{
				id: -7,
				name: "sensor.door",
				reportName: "เปิด-ปิด ประตู NC"
			}
		]
	}

	setShowLoading=()=>{
		this.setState({
			showLoading: true, 
			setShowLoading:true,
		})
	}


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

	handleChange = (selectedOption: any) => {
		this.setState(
		  { selectedOption },
		  () => console.log(`Option selected:`, this.state.selectedOption)
		);

		this.setState({ 
			selectValue :  selectedOption.value , 
			selectLabel : selectedOption.label
		},()=>{console.log("handleChange -> selectValue", this.state.selectValue); this.getSensorType( this.state.selectValue) })

		selectedCar = selectedOption
		let latitude = selectedCar.latitude
		let longitude = selectedCar.longitude

		 if(latitude !== 0 || longitude !==0){
			this.setStorage('latitude',JSON.stringify(latitude));
			this.setStorage('longitude',JSON.stringify(longitude));
		 } 
	  };
	
	getSensorType=async(e:any)=>{ 
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api'); 

		if(e !== '0'|| Number(e)!== 0){
			axios.get( apiHost+'/report/pto/sensor',{
				headers:{
					token : token ,
					device_id: e ,
					authenication: api.authorization,
				}
			}).then(res =>{
				console.log(res)
			if(res.data !== null || res.data !== undefined || res.data !== ""){
				this.setState({
					sensorType : res.data ,
					currentSensor: res.data[0].id ,
					showSeneorList: 'block'
				})
			}else{
				this.setState({
					sensorType : [],
					showSeneorList: 'none'
				})
			} 
			}).catch(err =>{
				console.log('err ', err)
				this.setState({
					sensorType : [],
					showSeneorList: 'none'
				})
			})

		}
	}

	dateNow= async()=>{
		let device_id = await this.getStorage('deviceID')
		var dateTime =await this.getStorage( 'date')
		if(Number(device_id) === 0 ){
			this.setStorage( 'date',  moment().format('YYYY-MM-DD'))
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
		this.setStorage('date',date)
		console.log(date) 
		this.setState({
			dateSelectedStart : moment(e.target.value).format('YYYY-MM-DD') ,
			dateSelectedEnd : moment(e.target.value).format('YYYY-MM-DD'),
			minDate: moment(e.target.value).format('YYYY-MM-DD'),
			maxDate: moment(e.target.value).add(1,'Y').format('YYYY-MM-DD'),
		})
	}

	dateSelectEnd=(e:any)=>{
		var date = moment(e.target.value).format('YYYY-MM-DD')
		this.setStorage('date',date) 
		this.setState({dateSelectedEnd : moment(e.target.value).format('YYYY-MM-DD')})
	}

	fetchNewData= async ()=>{
		this.dateNow()

		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
		let device_id = await this.getStorage('deviceID')
		let date = await this.getStorage('date')

		if(device_id !== '0'|| Number(device_id)!== 0){
			axios.post(apiHost+ '/report/pto',{
				"date_start" : this.state.dateSelectedStart,
				"date_end": this.state.dateSelectedEnd ,
				"deviceId": this.state.selectValue ,
				"senser_type": this.state.currentSensor
			},{
				headers: {
				  "language": lang  ,
				  "token" : token ,
				  "authenication" : api.authorization,
				  "version":api.version,
				}
			}).then(res =>{
				console.log(res)
				this.setState({
					closeOpenReport : res.data.data
				})
			}).catch(err =>{
				console.log(err)
				this.setState({
					closeOpenReport : []
				})
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
		this.setState({
			dateSelectedStart : moment().format('YYYY-MM-DD'), 
			dateSelectedEnd : moment().format('YYYY-MM-DD'),
			minDate: moment().format('YYYY-MM-DD'),
			maxDate: moment().add(1,'Y').format('YYYY-MM-DD'),
			closeOpenReport:[]
		},()=>{
			console.log(this.state.dateSelectedStart)
		})
	
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

		axios.get(`${host}/home` ,{
			headers: {
				"language": lang  ,
				"token" : token ,
				"authorization": api.authorization
			}		
		}).then(res => { 

			this.setState({
				list : res.data
			})
			this.setState({
				list : this.state.list.filter((list)=>list.device_id !==  null && list.event_id !== null)
			})
			for (let index = 0 ; index < this.state.list.length; index ++){
				carNumber[index+1] = {
					value : this.state.list[index].device_id ,
					label: this.state.list[index].name ,
					latitude: this.state.list[index].latitude ,
					longitude : this.state.list[index].longitude 
				}
			}  
			console.log("componentDidMount -> carNumber", carNumber)
			this.setLoading(false)
		}).catch((e)=>{
			this.setLoading(false)
		})
		
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
		if(this.state.selectValue!== 0){
			axios.post(apiHost +'/report/pto',{
				"date_start" : this.state.dateSelectedStart,
				"date_end": this.state.dateSelectedEnd ,
				"deviceId": this.state.selectValue ,
				"senser_type": this.state.currentSensor
			},{
				headers: {
				  "language": lang  ,
				  "token" : token ,
				  "authenication" : api.authorization,
				  "version":api.version,
				}
			}).then(res =>{
				console.log(res)
				if(res.data.data !== null && res.data.data !== undefined && res.data.data !== ''){
					this.setState({
						closeOpenReport : res.data.data
					})
				}
				
			}).catch(err =>{
				console.log(err)
				this.setState({
					closeOpenReport : []
				})
			}) 
		   this.showPopover()
		   this.setLoading(false)
        }else{
           console.log("กรุณาเลือกรถ");
        }
	}

	componentWillUnmount(){
		this.setStorage('date',  moment().format('YYYY-MM-DD'))
	}

	setLanguage = async ()=>{ 
		const languag =await this.getStorage('language')
		let l
		if (languag === '"th"' || languag === 'th'){
			l = th.closeOpenPTO
			title = l.title 
			date = l.date
			carId= l.carID
			loading = l.loading
			showReport = l.showReport
			doorClose = l.doorClosed
			doorOpen = l.doorOpen
			reportTitle = l.reportTitle
		} else if(languag === '"en"'|| languag === 'en'){
			l = en.closeOpenPTO
			title = l.title 
			date = l.date
			carId= l.carID
			loading = l.loading
			showReport = l.showReport
			doorOpen = l.doorOpen
			doorClose = l.doorClosed
			reportTitle = l.reportTitle
		}
		
		//this.setShowLoading()
	}

	setSensorType=(e:any)=>{
		console.log('sensor type ' ,e)
	}

	render(){
		//this.setLanguage();
		let l = this.state
		if (title === undefined){
			title = l.title 
			date = l.date
			carId= l.carId
			doorOpen = l.doorOpen
			doorClose = l.doorClosed
			loading = l.loading
			showReport = l.showReport
			reportTitle = l.reportTitle
		}
		return(
		<IonPage>
			<IonHeader className='nav-title'>
					<IonToolbar color='light' >
							<IonButtons>
								<IonBackButton color='primary' defaultHref='/allReport' text={title} ></IonBackButton>
							</IonButtons>
						</IonToolbar>
				</IonHeader>
			<IonContent>
			<IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={300}>
			<IonRefresherContent></IonRefresherContent>
		</IonRefresher>
        <IonGrid style={{padding:'0px'}}>
		<IonRow>
		  <IonCol size="12"  style={{marginTop:'1rem',padding:'0px'}}> 
			{/* <div style={{width:'100vw', height:'1px',backgroundColor:'#f2f2f2',marginBottom:'1rem',marginTop:'1rem'}}></div>  	 */}
				<IonLabel style={{margin:"10px"}}>{carId}</IonLabel><br/>
				<div  style={{margin: '10px'}}> 
					<Select
					    onFocus={()=>this.setState({showSeneorList: 'none',})}
						onChange={this.handleChange}
						options={carNumber}
						placeholder={this.state.selectPlaceHold}
						styles={colourStyles}
					/>
			</div> 
		  </IonCol>
		 </IonRow> 

		<IonRow style={{paddingLeft:'.5rem',marginTop:'.5rem', paddingTop:'.5rem',borderTop:'1px solid #f2f2f2',display: this.state.showSeneorList}}>
			<IonCol size="6">  <IonLabel >{date}</IonLabel> </IonCol>
		</IonRow>
		<IonRow style={{paddingLeft:'.5rem',paddingRight:'.5rem',display: this.state.showSeneorList}}>
				<IonCol size='12' >
					<div style={{color:'#666666',backgroundColor:'#ffffff',border:'1px solid #ccc',borderRadius:'5px'}} >
						<IonDatetime 
							onIonChange={(e)=>{this.dateSelect(e); }}
							color='dark'
							id ="dateEnd"
							display-timezone="utc"
							value={this.state.dateSelectedStart}
							displayFormat="DD/MM/YYYY" >
							
                        </IonDatetime>
                    </div>
				</IonCol>
				<IonCol size='12' >
					<div style={{color:'#666666',backgroundColor:'#ffffff',border:'1px solid #ccc',borderRadius:'5px'}} >
						<IonDatetime 
							onIonChange={(e)=>{this.dateSelectEnd(e); }}
							color='dark'
							id ="dateEnd"
							display-timezone="utc"
							value={this.state.dateSelectedEnd}
							min={this.state.minDate}
							max={this.state.maxDate}
							displayFormat="DD/MM/YYYY" >
                        </IonDatetime>
                        </div>
				</IonCol>
			</IonRow> 
		
		 <IonRow style={{borderTop:'1px solid #f2f2f2', display: this.state.showSeneorList , padding:'.5rem', marginBottom:'.5rem'}}>
			<IonCol size="4">
				<IonLabel>เซนเซอร์ </IonLabel>
			</IonCol>
			 <IonCol size="8" style={{padding:'1rem'}}>
			 	<div style={{color:'#666666',backgroundColor:'#ffffff',border:'1px solid #ccc',borderRadius:'5px'}} >
					 <IonItem lines='none' color='transparent' >
					 	<IonLabel>ประเภทเซนเซอร์ </IonLabel>
						 <IonSelect value={this.state.currentSensor} placeholder="เลือก" okText="ตกลง" cancelText="ยกเลิก" mode='ios' onIonChange={e => this.setSensorType(e.detail.value)}>
							{
								this.state.sensorType.map((s) => <IonSelectOption key={s.id} value={s.id}>{s.reportName}</IonSelectOption>)
							} 
						</IonSelect>
					 </IonItem> 
				</div>
			 </IonCol>
			
		</IonRow>
		<IonRow style={{display: this.state.showSeneorList}}>
			<IonCol size="12">
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
			
		</IonGrid> 
		</IonContent>

		<IonPopover
			mode='ios'
			isOpen={this.state.showPopover}
			cssClass='reportCloseOpen-class'
			onDidDismiss={()=> this.closePopover()}
		>
			<div  id='ptoReport' className='' style={{fontSize:'.7em'}}>
				<div  className='ion-text-left ptoReportHead' style={{backgroundImage:"url('../assets/images/bg.jpg')"}}>
					<h4>{this.state.selectLabel}</h4>
					<p >{reportTitle}</p>
					<p >{this.state.dateSelected}</p>
				</div>
				<div  className='ptoReportBody'>
					{ this.state.closeOpenReport.map((closeOpenReport) =>
					<IonItem lines='none' key={closeOpenReport.id} style={{marginTop:'.5rem'}}>
						<IonCol size='2' className='set-center'>
							{closeOpenReport.status_id === 0 ?  <FontAwesomeIcon icon='door-closed' style={{color:'#f04141'}} /> : 
							closeOpenReport.status_id === 1 ? <FontAwesomeIcon icon='door-open' style={{color :'#10dc60'}} />:
							<FontAwesomeIcon icon='door-closed' style={{color:'#f04141'}} />}
						</IonCol>
						<IonCol size='10' >
							{closeOpenReport.status_id === 0 ? <IonLabel>{doorClose} {closeOpenReport.date}</IonLabel>:
							closeOpenReport.status_id === 1 ? <IonLabel>{doorOpen} {closeOpenReport.date}</IonLabel>:
							<IonLabel>{doorClose} {  closeOpenReport.date }</IonLabel>} 
							<small style={{color:'#666'}}>{closeOpenReport.place}</small>
						</IonCol>
					</IonItem>)} 
				</div>
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
