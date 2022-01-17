import {
	IonButtons,
	IonHeader,
	IonMenuButton,
	IonToolbar,
	IonTitle,
	IonLoading,
	IonPage,
	IonToast,
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import { Redirect } from 'react-router-dom';
import { fab} from '@fortawesome/free-brands-svg-icons'
import { faGasPump , faEye, faLocationArrow, faCar} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import en from '../en.json';
import th from '../th.json';
import { Plugins, Capacitor } from "@capacitor/core";
import {AlertPopover} from '../components/alertPopover'
import CardCar from '../components/cardCar'
import Locate from '../components/Locate'
import {AlertSystemUpdate} from '../components/AlertSystemupdate'
import app from '../app.config.json'

var moment = require('moment');
moment().format();

const { Storage } = Plugins;
library.add(fab, faGasPump ,faEye , faLocationArrow ,faCar )

// eslint-disable-next-line
let  all:[] , title:any , carSts:any , loading:any ;
export default class Home extends React.Component{
	showComponent = false;
	sliderInterval:any
	stsAll= false ;
	stsOn =false;
	stsOff=false ;

	state= {
		redirectLog: false ,
		redirect : false,
		carSelect:null ,
		showLoading: false, 
		setShowLoading:false ,
		title:'บจ. อันดามัน แทร็คกิ้ง',
		loading  : 'กำลังโหลด...',
		showToast : true ,
		countPressBack : 0
	}

	handleChange = (carSelect: any) => {
		this.setState(
		  { carSelect },
		  () => console.log(`Option selected:`, this.state.carSelect)
		);
	  };

	goToMap =()=>{
		this.setState({
			redirect : true
		})
	}

	redirectLog=()=>{
		this.setState({
			redirectLog : true
		})
		this.refreshPage()
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

	refreshPage(){ 
		window.location.reload(); 
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

	async componentDidMount() {
		this.setLanguage();
		this.setStorage('date', moment().format('YYYY-MM-DD'))
		// await Storage.set({
		// 	key: 'date',
		// 	value: moment().format('YYYY-MM-DD'),
		//   });
		//await  Storage.set({key:'date' , value: moment().format('YYYY-MM-DD') })
		
        let appVersion = await this.getStorage('appVersion')  
		console.log('appVersion ', parseFloat(appVersion ||'{}') , app.versionNumber )
		if(parseFloat(appVersion||'{}') < app.versionNumber || parseFloat(appVersion||'{}') > app.versionNumber ){
			this.setStorage('token','').then(()=>{
				this.redirectLog()
			}) 
		}else if (appVersion  === null || appVersion  === undefined){
			this.setStorage('token','').then(()=>{
				this.redirectLog()
			})
		}

		carSts = await this.getStorage('carSts')
		if(carSts === 'all'){
			this.stsAll = true
		}else if(carSts === 'on'){
			this.stsOn = true
		}else if(carSts === 'off'){
			this.stsOff = true
		}
	
	}

	componentWillUnmount(){
		this.setStorage('deviceID','0')
		this.showComponent = false
		if(this.sliderInterval) clearInterval(this.sliderInterval);
		all= [] 
		title= null
	}

	setShowLoading=()=>{
		this.setState({
		  showLoading:true ,
		  setShowLoading:true
		})
	}

	setCloseLoading=()=>{
		this.setState({
		  showLoading:false ,
		  setShowLoading:false
		})
	}


	doRefresh =(event: CustomEvent)=> {
		console.log('กำลังโหลด');
		setTimeout( () => {
			event.detail.complete();
		},2000);
      }
	
	setLanguage = async ()=>{
		let languag = await this.getStorage('language')  
		let appName = await this.getStorage('app-name') 
		title = appName
		let l
		if (languag === '"th"' || languag === 'th'){
			l = th.home
			title = l.title
			loading = l.loading
		} else if(languag === '"en"' || languag === 'en'){
			l = en.home
			title = l.title
			loading = l.loading
		}
		//this.setShowLoading()
	}
	render(){
		

		this.showComponent = true
		if (this.state.redirectLog === true) {
			return <Redirect to='/login'/>
		}
		const l = this.state
		if(title === undefined || title === null){
			title = l.title
			loading = l.loading
		}
		if (this.state.redirect === true) {
			return <Redirect to='/map' />
		  }
		
		return(
			<IonPage >
				<Locate/>
				<AlertSystemUpdate/>
			<IonHeader  className='nav-title'>
				<IonToolbar mode='md'  color='light' className='header'>
					<img src='../assets/images/logo.svg' style={{width:'70%'}} />
						{/* <IonTitle  className="ion-text-center" color='primary' slot="start" style={{marginRight:'15px'}}> 
							<strong>{title}</strong>
						</IonTitle> */}
						{/* <p className='bell-alert'  >
							<AlertPopover/>
						</p> */}
					<IonButtons  color='medium' slot="end">
						<IonMenuButton  color='primary' />
					</IonButtons>	
				</IonToolbar>
			</IonHeader> 
			
		
				{/* <IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
					<IonRefresherContent></IonRefresherContent>
				</IonRefresher> */}
			<CardCar/>

		
			<IonLoading
                mode = 'ios'
                isOpen={this.state.showLoading}
                onDidDismiss={this.setCloseLoading}
                message={loading}
                duration={1000}
              />
		</IonPage>
		)
	}
}
