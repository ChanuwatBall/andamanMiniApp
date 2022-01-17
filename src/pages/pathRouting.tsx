/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
import {
		IonPage,
		IonIcon,
		IonLoading,
		IonRouterLink
	} from '@ionic/react'
import React from 'react'
import { arrowBack } from 'ionicons/icons'; 
import { faCheckSquare, faCoffee , faCar, faBus, faTruck, faShip, faLocationArrow} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import en from '../en.json'
import th from '../th.json'
import axios from 'axios'
import './style.css'
import LeafletMap from '../leaflet-map/previous-route/MapPrevious'
import {Storage} from '@capacitor/storage'
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
 
library.add( faCheckSquare, faCoffee ,faCar ,faBus , faTruck ,faShip , faLocationArrow)

let title:any, loading:any;

export default class PathRouting extends React.Component{
	
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
	 
            
    refreshPage(){ 
        window.location.reload(); 
	}
	
	setLanguage = async ()=>{
		const ret =await Storage.get({ key: 'language' } );
			const languag =JSON.stringify( ret.value || '{}')
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

	clearValue=async ()=>{
		//Storage.set({key : 'deviceID' , value : '0'})
		let lang = await Storage.get({key : 'language'})
				// Storage.set({key:'device', value:'0'})
				// Storage.set({key:'deviceID', value:'0'})
				
			// 	if(lang.value === '"th"'|| lang.value === 'th'){
			// 		let selectPlaceHold = th.home.carList
			// 		Storage.set({key:'carID',value:selectPlaceHold})
			// 	}else if(lang.value === '"en"' || lang.value === 'en'){
			// let	selectPlaceHold = en.home.carList
			// 		Storage.set({key:'carID',value:selectPlaceHold})
			// 	}
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
			 	
					<IonRouterLink 
						onClick={()=>this.clearValue()}
						routerDirection="back" 
						className='back-arrow set-center'  
						target="_self" 
						routerLink='/previous' 
						color='dark' 
						style={{
							zIndex:999,
							position:'fixed', 
							marginTop:'2.5rem',
							marginLeft:'1.2rem',
							width:'40pt',
							height:'40pt',
							}}
					> 
						<IonIcon 
							mode='ios' 
							color='light' 
							icon={arrowBack} 
							style={{
								fontSize:'1.7rem', 
								padding:'.5rem',
								backgroundColor:'#134985' ,
								borderRadius:'50%',
								boxShadow:' 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)'
							}} />
					</IonRouterLink>

						
					<LeafletMap />
						
			
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
