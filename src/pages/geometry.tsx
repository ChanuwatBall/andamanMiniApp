import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonItem,
	IonHeader,
	IonContent,
	IonLabel,
	IonMenuButton,
	IonBackButton,
	IonTitle,
	IonLoading,
	IonList,
	IonCol,
	IonIcon,
	IonPopover,
	IonRouterLink,
	IonAlert, IonRefresher, IonRefresherContent, IonModal, IonRow
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import en from '../en.json';
import th from '../th.json';
import { Plugins, Capacitor } from "@capacitor/core"; 
import { Storage } from '@capacitor/storage';
import {Device} from '@capacitor/device'
import { faCar, faChartPie, faChartLine, faMapMarkedAlt, faRoute, faShippingFast, faDrawPolygon, faGripHorizontal, faMagic, faThermometerThreeQuarters, faBurn, faHourglassEnd } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import { addCircle, closeCircle } from 'ionicons/icons'
import Leaflet from '../leaflet-map/geometry/MapGeometry'
import axios from 'axios'
import api from '../api.json' 

library.add(faCar, faChartPie, faChartLine, faMapMarkedAlt , faRoute, faShippingFast ,faDrawPolygon, faGripHorizontal, faMagic, faThermometerThreeQuarters, faBurn,faHourglassEnd)
 
let title: any, loading:any  , addGeometry:any , deleteGeometry :any, cannotDelGeometry : any, cancel :any , ok :any;
export default class geometry extends React.Component{

	buttonPressTimer:any
	pullRefresh:any 

	constructor(props:any) {
		super(props)
		this.handleButtonPress = this.handleButtonPress.bind(this)
		this.handleButtonRelease = this.handleButtonRelease.bind(this)
	  }
	state={
		showPopover:false,
		showLoading: false, 
		showAlert: false,
		cannotDelGeo: false,
		platformHight: '1 ',
		icons:
			{
				id : 1,
				icon: 'key',
				title: 'รหัสผ่าน',
				detail : 'เปลี่ยนรหัสผ่าน'
			} ,
		title: "เขตพื้นที่", 
		addGeometry : "เพิ่มเขตพื้นที่" ,
		loading : 'กำลังโหลด',
		deleteGeometry : "ลบเขตพื้นที ??",
        cannotDelGeometry : "ไม่สามารถลบเขตพื้นที่",
        cancel :"ยกเลิก" ,
        ok : "ตกลง",
		geometry: [{
			geoId:0,
			icon: 29 ,
			canDelete: false,
			name: "",
			position: [{lat: 0 , lon:0}]
		}],
		selectGeoId: 0 ,
		selectGeometry: ''
	}
	
	refreshPage(){ 
		window.location.reload(); 
	}

	setCloseLoading=()=>{
		this.setState({
		  showLoading :false 
		})
	}

	setShowLoading=()=>{
		this.setState({
		  showLoading :true 
		})
	}
	
	showPopover=()=>{
        this.setState({
			showLoading:true,
			showPopover : true
		})
	}

	closePopover=()=>{
		this.setState({
			showPopover : false
		},()=>{
			this.fetchData();
		})
	}
	setShowAlert=(e:any)=>{
		this.setState({showAlert : e})
	}

	cannotDelGeo=(e:any)=>{
		this.setState({cannotDelGeo : e})
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

	fetchData=async ()=>{
		let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
		
		axios.get(apiHost+'/geometry' ,{
			headers: {
				"language": lang   ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
			console.log("geometry -> componentDidMount -> res", res)
			this.setState({
				geometry : res.data
			})
		})
	}

	async componentDidMount(){
		this.setLanguage()
		this.fetchData()
		let platform = await Device.getInfo()
		if(platform.operatingSystem === 'ios'){ 
			this.setState({
				platformHight : '2.8'
			})
		}else{
			this.setState({
				platformHight : '1'
			})
		}
	}

	doRefresh =(event: CustomEvent)=> {
		this.pullRefresh = setTimeout(async () => {
			event.detail.complete();
			this.fetchData()
		}, 2000);
	  }
	  
	componentWillUnmount(){
		clearInterval(this.pullRefresh); 
		localStorage.removeItem('position')
	}
 

	setLanguage = async ()=>{ 
		const languag = await this.getStorage('language')
		let l

		if (languag === '"th"' || languag === 'th'){
			l = th.addGeometry
			title = l.title 
			addGeometry = l.addGeometry
			loading = l.loading
			deleteGeometry = l.deleteGeometry
			cannotDelGeometry = l.cannotDelGeometry
			cancel = l.cancel
			ok = l.ok
			
		} else if(languag === '"en"' || languag === 'en'){
			l = en.addGeometry
			title = l.title 
			addGeometry = l.addGeometry
			loading = l.loading
			deleteGeometry = l.deleteGeometry
			cannotDelGeometry = l.cannotDelGeometry
			cancel = l.cancel
			ok = l.ok
		}
		this.setShowLoading()
	}

	handleButtonPress (e:any , id:any , name:any) {
		this.setState({selectGeoId: id , selectGeometry: name},()=>{console.log(this.state.selectGeoId , this.state.selectGeometry )})
		if(e){
			this.buttonPressTimer = setTimeout(() => {
				this.setShowAlert(true)
			}, 500);
		}else{
			this.buttonPressTimer = setTimeout(() => {
				this.cannotDelGeo(true)
			}, 500);
		}
		
	  }

	handleButtonRelease () {
		clearTimeout(this.buttonPressTimer);
	  }
	  

	deleteGeometry=async ()=>{
		let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
		let userID = await this.getStorage( 'userId');
		
		console.log("geometry -> deleteGeometry -> this.state.selectGeoId ", this.state.selectGeoId.toString() )
		
		this.setShowLoading()
		axios.post(apiHost+'/deletegeometry', {
			userId : userID ,
			geoId: this.state.selectGeoId.toString()
		},
		{
			headers:{
				authenication : api.authorization ,
				token : token ,
				language : lang ,
				version : api.version
			}
		}).then(res =>{
        	console.log("geometry -> deleteGeometry -> res", res)
			this.fetchData()
		})
	}

	saveIconID=(icon:any)=>{
		if(icon !== undefined || icon !== null){
			this.setStorage('iconId',JSON.stringify(icon))
		}else{
			this.setStorage('iconId',JSON.stringify(0))
		}
		
	}

	render(){
		const mapKey = '5e3612dcbfa88a77bf9cc6773e5a1545';
		//this.setLanguage();
		if(title === undefined){
			const l = this.state
			title = l.title 
			addGeometry = l.addGeometry
			loading = l.loading
			deleteGeometry = l.deleteGeometry
			cannotDelGeometry = l.cannotDelGeometry
			cancel = l.cancel
			ok = l.ok
		}
		return(
			<IonPage>
			<IonHeader className='nav-title'>
				<IonToolbar color='light'>
					<IonButtons>
						<IonBackButton color='primary' text="" defaultHref='/home'></IonBackButton>
							<IonTitle className="ion-text-center" color='primary' ><strong>{title}</strong></IonTitle>	
								</IonButtons>
							<IonButtons slot="end">
						<IonMenuButton color='primary' />
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent >
			<IonRefresher slot="fixed" onIonRefresh={(event)=>this.doRefresh(event)} pullFactor={0.5} pullMin={100} pullMax={2000}>
					<IonRefresherContent  refreshingSpinner="lines-small" style={{marginBottom:'3rem'}}  refreshingText={loading}></IonRefresherContent>
			</IonRefresher>
					<IonList >
							<IonItem mode='md' lines='none' >
								<IonCol size='10' color='medium' >
									<IonLabel color='medium' style={{marginBottom:'0rem',fontSize:'0.8em'}}>
									&nbsp;&nbsp;&nbsp;{addGeometry} &nbsp;&nbsp;&nbsp;
									{/* <a href='/addGeometry' >
										<IonIcon icon={addCircle} color='primary' style={{fontSize:'1.4em',paddingTop:'1rem'}} />
									</a> */}
										<IonRouterLink  routerDirection='forward' routerLink='/addGeometry' target="_self" >
											<IonIcon icon={addCircle} color='primary' style={{fontSize:'1.4em',marginTop:'.5vh',position:'fixed'}} />
										</IonRouterLink>
									</IonLabel>
								</IonCol>
							</IonItem>
							<br/>
							{this.state.geometry.map((geometry ,index) => 
								<IonItem  key={geometry.geoId} mode='md' lines='full' type='button' detail 
									onClick={()=>{ 
										this.setStorage('position',JSON.stringify(geometry.position) ) ;
										this.setStorage('geoName',JSON.stringify(geometry.name) ) ;
										this.setStorage('geoId',JSON.stringify(geometry.geoId) ) ;
										this.saveIconID( geometry.icon)
										this.showPopover();
									}}
									onTouchStart={(e)=>this.handleButtonPress(geometry.canDelete , geometry.geoId ,geometry.name)} 
									onTouchEnd={this.handleButtonRelease} >
									<IonCol size='10' color='medium'><IonLabel  color='medium' > {geometry.name} </IonLabel></IonCol>
									<IonCol size='2' color='medium'></IonCol>
								</IonItem>
							)}


						</IonList>
						

				{/* <IonPopover
					mode='ios'
					isOpen={this.state.showPopover}
					cssClass='reportDrivePopover-class'
					onDidDismiss={()=> this.closePopover()}
				>
					<div style={{width:'100%',height:'100vh',position:'relative'}}> 
						<IonIcon  icon={closeCircle} color="danger" style={{position:'absolute',zIndex:999,right:'1rem',top:'1rem',backgroundColor:'#fff',borderRadius:'50%'}} onClick={()=>{ this.closePopover()}}/>
						<Leaflet />
					</div>
						
				</IonPopover> */}
				<IonModal isOpen={this.state.showPopover} onDidDismiss={()=>{this.closePopover()}} cssClass='my-custom-class'>
					<div style={{position:'fixed',zIndex: 999,width:'100%',backgroundColor:'rgba(255,255,255,0.6)',paddingTop: this.state.platformHight+'em',paddingBottom:'1em'}}>
						<IonRow style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',fontSize:'1.7em'}}>
							<IonCol size='2' className='set-center' >
								<IonIcon  icon={closeCircle} color="danger"  onClick={()=>{this.closePopover()}}/>
							</IonCol>
						</IonRow>
					</div> 
					{/* <IonIcon  icon={closeCircle} color="danger" style={{position:'absolute',zIndex:999,right:'1rem',top:'3.5rem',backgroundColor:'#fff',borderRadius:'50%',fontSize:'1.8em'}} onClick={()=>{ this.closePopover()}}/> */}
					<Leaflet />
				</IonModal>
					
			</IonContent>	
			<IonAlert
				isOpen={this.state.showAlert}
				onDidDismiss={() => this.setShowAlert(false)}
				header={this.state.selectGeometry}
				message={deleteGeometry}
				mode='ios'
				buttons={[
				{
					text: cancel,
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log('Confirm Cancel');
					}
					},
					{
					text: ok ,
					handler: () => {
						this.deleteGeometry()
						console.log('Confirm Ok');
					}
				}
			  ]}
			/>
			<IonAlert
				isOpen={this.state.cannotDelGeo}
				onDidDismiss={(e) => this.cannotDelGeo(false)}
				header= {this.state.selectGeometry}
				message={cannotDelGeometry}
				mode='ios'
				buttons={[
					{
					text: ok,
					handler: () => {
						console.log('Confirm Ok');
					}
				}
			  ]}
			/>
			<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={this.setCloseLoading}
			message={loading}
			duration={700}
			/>
		</IonPage>
		)
	}
};
