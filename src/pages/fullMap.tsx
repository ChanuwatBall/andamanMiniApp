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
		IonTitle,
		IonLoading,
	} from '@ionic/react'
import React from 'react' 
import {  refresh } from 'ionicons/icons'; 
import { Storage } from '@capacitor/storage';
import { faCheckSquare, faCoffee , faCar, faBus, faTruck, faShip, faLocationArrow} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import en from '../en.json'
import th from '../th.json'
import { Redirect } from 'react-router';
import axios from 'axios'
import './style.css'
import LeafletMap from '../leaflet-map/full-map/MapFull'
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
 
library.add( faCheckSquare, faCoffee ,faCar ,faBus , faTruck ,faShip , faLocationArrow)

let title:any, loading:any;

export default class fullMap extends React.Component{
	
	state= {
		carId: 'กข 62012 ภูเก็ต',
		title:"แผนที่",
		loading:'กำลังโหลด...',
		showLoading:false,
		goBack:false,
		incidents: [],
	}

	setCloseLoading=()=>{
		this.setState({
			showLoading:false
		})
	}

	setShowLoading=()=>{
		this.setState({
			showLoading: true
		})
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

	async componentDidMount (){
		this.setLanguage()
		
		// if (Capacitor.isNative) {
		// 	window.screen.orientation.lock('landscape')
		// 	setTimeout(()=>{
		// 		window.screen.orientation.unlock();
		// 	},500)
		//   }

		const res = await axios.get('https://data.sfgov.org/resource/wr8u-xric.json', {
			params: {
			"$limit": 500,
			"$$app_token": 'YOUR_APP_TOKEN'
			}
		})
		const incidents = res.data;
		this.setState({incidents: incidents });
	}
	
	componentWillUnmount(){
		this.setStorage('zoom' ,'');
	}
 
            
    refreshPage(){ 
        window.location.reload(); 
	}
	
	setLanguage = async ()=>{
		const ret =await this.getStorage('language');
		const languag =JSON.stringify( ret || '{}')
		let l
		if (languag === '"th"' || languag ==='th'){
			l = th.fullMap
			title = l.title 
			loading = l.loading
		} else if(languag === '"en"' || languag === 'en'){
			l = en.fullMap
			title = l.title 
			loading = l.loading
		}
			
		this.setShowLoading()
	}

	render(){

		let l = this.state
		if (title === undefined){
			title = l.title 
			loading = l.loading
		}
				
		const mapKey = '5e3612dcbfa88a77bf9cc6773e5a1545'
		return(
			<IonPage>
			 	<IonHeader className='nav-title'>
						<IonToolbar color='light'>
							<IonButtons slot="start">
								<IonBackButton color='primary' defaultHref="/home" />
									</IonButtons>
										<IonTitle color='primary' className="ion-text-center"><strong>{title}</strong>  </IonTitle>
									<IonIcon color='primary' icon={refresh} 
								slot='end'
                                style={{fontSize:"25px", marginRight:'0.5rem'}}
                            onClick={this.refreshPage }/> 
                           
					</IonToolbar>
				</IonHeader>
			<IonContent>
					
						<div style={{width:'100%' , height:'100vh'}}> 
								<LeafletMap />
						</div>
			</IonContent>
			<IonLoading
                mode = 'ios'
                isOpen={this.state.showLoading}
                onDidDismiss={this.setCloseLoading}
                message={loading}
                duration={2600}
              />
		</IonPage>
		)
	}
}
