/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
import {
	IonButtons,
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
		IonBackButton,
		IonIcon,
		IonSlides,
		IonSlide,
		IonButton,
		IonLabel,
		IonGrid,
		IonRow,
		IonCol,
		IonAlert,
		IonLoading,
		IonMenuButton,
		IonTitle,
		IonItem,
		NavContext
	} from '@ionic/react';
import React from 'react';
import './style.css';
// import axios from 'axios'; 
import { speedometer, thermometer , paperPlane, call,  power, reload} from 'ionicons/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab} from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee , faCar, faBus, faTruck, faShip, faLocationArrow, faMap, faGasPump, faMapMarkerAlt, faLock, faUnlockAlt} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import en from '../en.json';
import th from '../th.json';
import { Plugins , Capacitor  } from "@capacitor/core";
import axios from 'axios';
import api from '../api.json';
import app from '../app.config.json'
import { useHistory, Redirect } from 'react-router';

var moment = require('moment');
moment().format();
library.add(fab, faCheckSquare, faCoffee ,faCar ,faBus , faTruck ,faShip , faLocationArrow , faMap , faGasPump ,faMapMarkerAlt, faLock,faUnlockAlt)
const { Storage } = Plugins;

let place:any , carID:any, status:any , GSM:any , GPS:any, voltage:any, driver:any , lastStatus:any ;
let turnOffCar:any, engineStatus:any, cancel:any , alertEnterPass:any, alertPass:any;
let other:any, selectIcon:any, navigateToCar:any , callToDriver:any ,btnSave:any , btnCancel:any;;
let lastDate:any ,loading:any, kmUnit:any , date:any , time:any;
export default class Map extends React.Component{
	
	dateVal = moment().format('DD/MM/YYYY');
	timeVal =  moment().format('HH:mm:ss');
	sliderInterval:any;
	state= {
		lat:'',
		lon:'',
		goBack:false,
		showModal :false ,
		setShowModal :false ,
		carId: 'กข 62012 ภูเก็ต',
		showAlert:false ,
		setShowAlert : false ,
		showLoading :false ,
		place:"สถานที่" ,
		carID:"ทะเบียนรถ",
		status:"สถานะ" ,
		GSM:"GSM" , 
		GPS:"GPS", 
		voltage:"แรงดันไฟ", 
		driver: "ค่าบัตร/คนขับ",
		lastStatus:"สถานะล่า" ,
		turnOffCar:"สั่งดับเครื่อง", 
		engineStatus:"สถานะเครื่องยนต์", 
		cancel:"ยกเลิกการดับเครื่องยนต์" , 
		alertEnterPass:"โปรดกรอกรหัสผ่าน", 
		alertPass:"พิมพ์รหัสผ่าน" ,
		other:"อื่นๆ", 
		loading: "กำลังโหลด",
		selectIcon:"เลือก Icon", 
		navigateToCar:"นำทางไปยังรถ" , 
		callToDriver:"โทรหาคนขับ",
		turnOffTheCar: "สั่งดับเครื่อง" , 
		kmUnit: "กม/ชม",
		date:'วันที่',
		statusEngine: 0,
		alertPassword:0,
		List: [{
			device_id : 0,
			name:"" ,
			event_id: 0,
			phone_number:'',
			canCutEngin:{
				data:[]
			},
			expiration_date: "" ,
			lastEvent : "",
			address: "" ,
			latitude: 0 ,
			longitude: 0 ,
			event_stamp:'',
			fuel_liters:"",
			satellites:"",
			speed:"",
			status:"",
			status_time:"",
			temperature:"",
			fld_signalStrength:"",
			fld_engineLoad:"",
			fld_driverID:"",
			fld_driverMessage:"" ,
			modal: 0,
			status_name:'',
		}],
	}

	setShowLoading=()=>{
		this.setState({
			showLoading :true 
		  })
	}

	setCloseLoading=()=>{
		this.setState({
		  showLoading :false 
		})
    }
	setShowModal=()=>{
		this.setState({
			showModal :true ,
			setShowModal :true 
		})
	}
	date=(x:any)=>{
		lastDate = moment( x ,  "YYYY-MM-DD HH:mm")
		x= lastDate._pf.parsedDateParts[2]+'/'+ parseInt(lastDate._pf.parsedDateParts[1]+1) +'/'+lastDate._pf.parsedDateParts[0]+' '+lastDate._pf.parsedDateParts[3]+':'+lastDate._pf.parsedDateParts[4]
		return x
	}

	setCloseModal=()=>{
		this.setState({
			showModal :false ,
			setShowModal :false 
		})
	}
	refreshPage(){ 
		window.location.reload(); 
	}
 
	setShowAlert=()=>{
		this.setState({
			showAlert : true ,
			setShowAlert :  true 
		})
	}
	setCloseAlert=()=>{
		this.setState({
			showAlert : false ,
			setShowAlert :  false 
		})
	}

	async componentDidMount(){
		this.setLanguage()
		

		let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let deviceID = await this.getStorage( 'device')
		let apiHost = await this.getStorage( 'api');
		let user = await this.getStorage('userId')

		let longitude = await this.getStorage( 'longitude')
		let latitude = await this.getStorage('latitude')
		this.setState({
			lat: latitude ,
			lon : longitude
		})


		axios.get(`${apiHost}/home` ,{
			headers: {
				"language": lang  ,
				"token" : token ,
				"Authorization": api.authorization
               
			}		
		}).then( res => {
			this.setState({ List : res.data })
			this.setState({
				List : this.state.List.filter((List) => List.device_id === Number(deviceID) ) 
			})

			this.dateVal =  moment(this.state.List[0].event_stamp).format('DD/MM/YYYY')
			this.timeVal = moment(this.state.List[0].event_stamp).format('HH:mm:ss')
			console.log(this.state.List)
		})

		this.sliderInterval = setInterval(() => {axios.get(`${apiHost}/home` ,{
			headers: {
				"language": lang  ,
				"token" : token ,
				"Authorization": api.authorization
				}		
			})
			.then(res => {
				this.setState({ List : res.data })

				this.setState({
					List : this.state.List.filter((List) => List.device_id === Number(deviceID) ) 
				})
				this.dateVal =  moment(this.state.List[0].event_stamp).format('DD/MM/YYYY')
				this.timeVal = moment(this.state.List[0].event_stamp).format('HH:mm:ss')
			})}, 60000)

			axios.post(`${apiHost}/shutdown/check`,'', {
				headers: {
					"deviceId": deviceID,
					"language": lang ,
					"token" : token ,
					"authorization": api.authorization
				}
			}).then(res => {
				console.log(res)
				this.setState({
					statusEngine : res.data
				})
				console.log('statusEngine',this.state.statusEngine)
			})
	}

	componentWillUnmount(){
		clearInterval(this.sliderInterval);
		this.sliderInterval = null
	}
	

	setLanguage = async ()=>{
		let ret =await this.getStorage('language');
		let languag =JSON.stringify( ret || '{}')
		let l
		if (languag === '"th"' || languag === 'th'){
			l = th.map
			place= l.place
			carID=l.carID
			status=l.status
			GSM=l.GSM
			GPS=l.GPS
			voltage=l.voltage
			driver = l.driver
			lastStatus=l.lastStatus
			turnOffCar=l.turnOffTheCar
			engineStatus=l.engineStatus
			cancel=l.cancel
			other=l.other
			selectIcon=l.selectIcon
			navigateToCar= l.navigateToCar
			callToDriver=l.callToDriver
			alertEnterPass= l.alertEnterPass
			alertPass = l.alertPass
			loading = l.loading
			kmUnit = l.kmUnit
			btnSave = 'บันทึก'
            btnCancel = 'ยกเลิก'
			date = l.date
			time= l.time
		} else if(languag === '"en"' || languag === 'en'){
			l = en.map
			place= l.place
			carID=l.carID
			status=l.status
			GSM=l.GSM
			GPS=l.GPS
			voltage=l.voltage
			driver = l.driver
			lastStatus=l.lastStatus
			turnOffCar=l.turnOffTheCar
			engineStatus=l.engineStatus
			cancel=l.cancel
			other=l.other
			selectIcon=l.selectIcon
			navigateToCar= l.navigateToCar
			callToDriver=l.callToDriver
			alertEnterPass= l.alertEnterPass
			alertPass = l.alertPass
			loading = l.loading
			kmUnit = l.kmUnit
			btnSave = 'Save'
			btnCancel = 'Cancel'
			date = l.date
			time= l.time
		}

		this.setShowLoading()
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

	getIconId=(e:any)=>{
		var img = e.target.value
		var alt  =  img.getAttribute("alt");
		console.log("alt : ", alt );
		this.setStorage('iconID' , alt)
	}

	shutDownEngine=async ()=>{
		let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let deviceID = await this.getStorage('device')
		let apiHost = await this.getStorage( 'api');
		let user = await this.getStorage('userID')

		axios.get(`${apiHost}/shutdown` ,{
			headers: {
				"password" : this.state.alertPassword,
				"userId": user,
				"deviceId": deviceID,
				"language": lang ,
				"token" : token ,
				"authorization": api.authorization
				},
				params:{
					deviceId : deviceID
				}		
			})
			.then(res => {
				console.log(res)
				this.setState({
					showLoading :true
				},()=>{if(res.data === 1){
					this.setState({
						statusEngine : 0
					})
				}else if(res.data === 0){
					this.setState({
						statusEngine : 0
					})
				} })
				
			})

			


		// axios.post(`${apiHost.value}/shutdown`,{
		// 	password : this.state.alertPassword
		// }, {
		// 	headers: {
		// 		"userId": user.value,
		// 		"deviceId": deviceID.value,
		// 		"language": lang.value ,
		// 		"token" : token.value ,
		// 		"authorization": api.authorization
		// 	}
		// }).then(res => {
		// 	console.log('res  ',res.data)
		// })
	}

	cancelShutdown=async ()=>{
		let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let deviceID = await this.getStorage( 'device')
		let apiHost = await this.getStorage( 'api');
		let user = await this.getStorage('userID')

		axios.get(`${apiHost}/shutdown` ,{
			headers: {
					"userid": user,
					"language": lang ,
					"token" : token ,
					"authorization": api.authorization
				},
			params:{
					deviceId : deviceID
				}		
			})
			.then(res => {
				console.log(res)
				this.setState({
					showLoading :true
				},()=>{if(res.data === 1){
					this.setState({
						statusEngine : 1
					})
				}else if(res.data === 0){
					this.setState({
						statusEngine : 1
					})
				} })
				
			})
	}

	
	
	render(){
		// this.setLanguage()

		// const s = this.state
		// if(place === undefined ){
		// 	place= s.place
		// 	carID= s.carID
		// 	status=s.status
		// 	GSM= s.GSM
		// 	GPS= s.GPS
		// 	voltage= s.voltage
		// 	driver = s.driver
		// 	lastStatus= s.lastStatus
		// 	turnOffCar=s.turnOffTheCar
		// 	engineStatus=s.engineStatus
		// 	cancel=s.cancel
		// 	other=s.other
		// 	selectIcon=s.selectIcon
		// 	navigateToCar= s.navigateToCar
		// 	callToDriver=s.callToDriver
		// 	alertEnterPass= s.alertEnterPass
		// 	alertPass = s.alertPass
		// 	loading = s.loading
		// }

		const slideOpts = {
			initialSlide: 0,
			speed: 400
		};
		const mapKey = '5e3612dcbfa88a77bf9cc6773e5a1545';
		
		return(
			<IonPage>
			 	<IonHeader className='nav-title'>
					<IonToolbar  color='light' className="ion-text-center">
						<IonButtons slot="start">
							<IonBackButton color='primary' defaultHref="/home" />
									</IonButtons>
											{this.state.List.map((List) => <IonTitle key={List.device_id} color='primary'> <strong>{List.name}</strong></IonTitle>)}
											
												<a href='/fullmap' className='bell-alert'  style={{paddingTop:'0.8rem',marginLeft:'1rem',color: app.color}}>
													<FontAwesomeIcon icon="map"/>
												</a>
											<IonButtons  slot="end">
									<IonMenuButton color='primary' />
							</IonButtons>	 
						</IonToolbar>
				</IonHeader>
			<IonContent>
				<div className="map" style={{position:'fixed'}}> 
					</div>
					 <div className="map-details map-shadow">

						<div className='button-bar'></div>
				{this.state.List.map((List) =>  
					<IonSlides options={slideOpts} pager={true} key={List.device_id} style={{borderTopLeftRadius:'30px'}}>
						
						<IonSlide>
							<div className="map-detail" >
								<div className="modal-footer" >
									<div size-sm="4" size-md="4" size-lg="4" size-xl="4" className="modal-footer-left">

										{
										JSON.stringify(List.speed) === "0" ? <b style={{color:"#666666" , fontSize:"16px"}}><IonIcon color='primary' icon={speedometer} /> : - </b>:
										<b style={{color:"#666666" , fontSize:"16px"}}><IonIcon color='primary' icon={speedometer} /> : {List.speed} {kmUnit}</b>
										}
										
									</div>
									<div size-sm="4" size-md="4" size-lg="4" size-xl="4" className="modal-footer-center">

										{
										List.fuel_liters === null ? <b  style={{color:"#666666" , fontSize:"16px"}}><FontAwesomeIcon icon="gas-pump" style={{color:'#10dc60'}} /> : - </b>:
										List.fuel_liters != null ? <b  style={{color:"#666666" , fontSize:"16px"}}><FontAwesomeIcon icon="gas-pump" style={{color:'#10dc60'}} /> : {List.fuel_liters} </b>:
										<b  style={{color:"#666666" , fontSize:"16px"}}><FontAwesomeIcon icon="gas-pump" style={{color:'#10dc60'}} /> : - </b>
										}
										
									</div>
									<div size-sm="4" size-md="4" size-lg="4" size-xl="4" className="modal-footer-right">

										{
										List.temperature === null ? <b style={{color:"#666666" , fontSize:"16px"}}><IonIcon icon={thermometer} color='warning' /> : - </b>:
										List.temperature != null ? <b style={{color:"#666666" , fontSize:"16px"}}><IonIcon icon={thermometer} color='warning' /> : {List.temperature} ํc</b>:
										<b style={{color:"#666666" , fontSize:"16px"}}><IonIcon icon={thermometer} color='warning' /> : - </b>
										}
										
									</div>
								</div><br/>
								<div className="modal-detail" style={{padding:'4%'}}>
									<h1 > {List.name}</h1>
									<IonGrid style={{color:'#7f7f7f'}}>
										<IonRow  >
											<IonCol size='1'> <FontAwesomeIcon icon="map-marker-alt" style={{color:'#134985'}}/></IonCol>
											<IonCol size='11'>{List.address} </IonCol>
										</IonRow>
										<IonRow  >
											<IonCol size='1'> </IonCol>
											<IonCol size='11'>{date} {this.dateVal} &nbsp;&nbsp;  {time} {this.timeVal}</IonCol>
										</IonRow>
										<br/>

										<IonRow >
											{
												JSON.stringify(List.status) === '7'?  <IonCol style={{paddingLeft:'2rem'}} size='7'> <strong>{status}<br/>  </strong> {List.status_name} {List.status_time}</IonCol>:
												JSON.stringify(List.status) === '23'? <IonCol style={{paddingLeft:'2rem'}} size='7'> <strong>{status}<br/>   </strong> {List.status_name} {List.status_time}</IonCol>:
												JSON.stringify(List.status) === '24'? <IonCol style={{paddingLeft:'2rem'}} size='7'> <strong>{status}<br/>   </strong> {List.status_name} {List.status_time}</IonCol>:
												<IonCol size='9'><strong> </strong> </IonCol>
											}
										
											<IonCol  size='5'>
												 <strong>{GSM} : </strong> {List.fld_signalStrength} <br/>
												 <strong>{GPS} : </strong> {List.satellites}
											</IonCol>
										</IonRow>
										<br/>

										<IonRow>
											<IonCol style={{paddingLeft:'2rem'}} size='7'>
												<strong>{voltage}  </strong> <br/> {List.fld_engineLoad}
											</IonCol>
											<IonCol size='5'>
											<strong> {driver} </strong><br/>{List.fld_driverID} {List.fld_driverMessage}
											</IonCol>
										</IonRow>
										<br/>

										{/* <IonRow>
											<IonCol style={{paddingLeft:'2rem'}}  size='12'>
											<strong>{lastStatus} </strong><br/> {List.status_name} { this.date(List.event_stamp) }
											</IonCol>
										</IonRow> */}

									</IonGrid>
										
								</div>
							</div>  
						</IonSlide>
						{List.canCutEngin.data[0] === 1? 
						<IonSlide>
							<div className="map-detail">
								<IonGrid>
									<IonRow>
										<IonCol>
											<h4>{turnOffCar}</h4>
											<div style={{width:"100%" , overflow:"hidden"}}>
												<p style={{fontSize:"small"}}>
														{engineStatus} : { this.state.statusEngine === 1 ? <FontAwesomeIcon icon='unlock-alt'  style={{color:'#10dc60',fontSize:'1.2em' }}/>:
														<FontAwesomeIcon icon='lock'  style={{color:'#f04141',fontSize:'1.2em' }}/> }  <br/>
														{carID} : {List.name} <br/>
												</p>
											</div>
										</IonCol>  
									</IonRow>
									<IonRow>
										<IonCol size='6'>
													<IonButton  onClick={this.setShowAlert} mode='ios' color='primary'  expand='block'>
														<IonIcon icon={power}/> &nbsp;&nbsp;
														<IonLabel>{turnOffCar}</IonLabel>
													</IonButton>
											</IonCol>
											<IonCol size='6'>
													<IonButton mode='ios' color='dark' onClick={()=>this.cancelShutdown()}  expand='block'>
														<IonIcon icon={reload}/>&nbsp;&nbsp;
														<IonLabel>{cancel}</IonLabel>
													</IonButton>
											</IonCol>
										</IonRow>
								</IonGrid>
							</div>
						</IonSlide>:
						<IonSlide style={{display:'none'}}></IonSlide>
						}
						<IonSlide>
						<div className="map-detail">
								<IonGrid>
										<IonRow>
											<IonCol>
												<h4>{other}</h4>
											</IonCol>
										</IonRow>
										{List.phone_number === null || List.phone_number === "" ? 
											<IonRow>
												<IonCol size='12' >
														<IonItem lines='none' href={"https://www.google.com/maps/dir/?api=1&destination="+this.state.lat+","+this.state.lon}>
															<IonIcon icon={paperPlane}/> &nbsp;&nbsp;
															<IonLabel style={{fontSize:'14px'}}>{navigateToCar}</IonLabel>
														</IonItem>
												</IonCol>
											</IonRow>:
											<IonRow>
												<IonCol size='6' >
														<IonItem lines='none' href={"https://www.google.com/maps/dir/?api=1&destination="+this.state.lat+","+this.state.lon}>
															<IonIcon icon={paperPlane}/> &nbsp;&nbsp;
															<IonLabel style={{fontSize:'14px'}}>{navigateToCar}</IonLabel>
														</IonItem>
												</IonCol>
												<IonCol size='6'>
													<IonItem lines='none' href={"tel:"+List.phone_number}>
														<IonIcon icon={call}/>&nbsp;&nbsp;
														<IonLabel>{callToDriver}</IonLabel>
													</IonItem>
												</IonCol>
											</IonRow>}
										</IonGrid>
										<br/>
									</div>
								</IonSlide>
						</IonSlides> 
					)} 
						
					 </div>
					 <IonAlert
						isOpen={this.state.showAlert}
						onDidDismiss={this.setCloseAlert}
						header={alertEnterPass}
						mode='ios'
						inputs={[
							{
							name: 'password',
							type: 'password',
							placeholder: alertPass
							}
						]}
						buttons={[
							{
							text: 'cancel',
							role: 'cancel',
							cssClass: 'secondary',
							handler: () => {
								console.log('cancel')
							}
							},
							{
							text: 'OK',
							handler: data => {
								this.setState({
									alertPassword : data.password
								})
								console.log(this.state.alertPassword);
								this.shutDownEngine()
							}
							}
						]}
						/>
			</IonContent>
			<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={this.setCloseLoading}
			message={loading}
			duration={2000}
		    />
		</IonPage>
		)
	}
}
