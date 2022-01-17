/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
import {
        IonContent,
        IonPage,
        IonButton,
        IonGrid,
        IonRow,
        IonCol,
        IonPopover,
        IonItem,
        IonLabel,
        IonIcon
	} from '@ionic/react';
import React from 'react';
import '../pages/style.css';
import { fab} from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee , faCar, faBus, faTruck, faShip, faLocationArrow, faMap, faGasPump} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";
import axios from 'axios';
import api from '../api.json';
import { call, keypad, paperPlane } from 'ionicons/icons';

library.add(fab, faCheckSquare, faCoffee ,faCar ,faBus , faTruck ,faShip , faLocationArrow , faMap , faGasPump)
const { Storage } = Plugins;

let place:any ;
let other:any, selectIcon:any, navigateToCar:any , callToDriver:any , btnSave:any , btnCancel:any;

export default class SelectIcon extends React.Component{

	sliderInterval:any;
	state= {
		carId: 'กข 62012 ภูเก็ต',
		other:"อื่นๆ", 
		selectIcon:"เลือก Icon", 
		navigateToCar:"นำทางไปยังรถ" , 
		callToDriver:"โทรหาคนขับ",
        turnOffTheCar: "สั่งดับเครื่อง" , 
        btnSave:'บันทึก',
        btnCancel:'ยกเลิก',
		List: [{
			device_id : 0,
			name:"" ,
		}],
	}

	setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
		})
    }
	setShowModal=()=>{
		this.setState({
			showModal :true ,
			setShowModal :true 
		})
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

	async componentDidMount(){
		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let deviceID = await this.getStorage('device')
		let apiHost = await this.getStorage('api');
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
			
		})
	}

	componentWillUnmount(){
        clearInterval(this.sliderInterval);
        other= null
        selectIcon= null
        navigateToCar= null 
        callToDriver= null 
        btnSave= null
        btnCancel= null;
    }

    closePopover=()=>{
        this.setState({
            showPopover : false
        })
    }

    showPopover=()=>{
        this.setState({
            showPopover : true
        })
    }

	setLanguage = async ()=>{
		const ret =await this.getStorage('language');
	
		let l
		if (ret === '"th"' || ret === 'th'){
			l = th.map
            other=l.other
			selectIcon=l.selectIcon
			navigateToCar= l.navigateToCar
            callToDriver=l.callToDriver
            btnSave = 'บันทึก'
            btnCancel = 'ยกเลิก'
           
		} else if(ret === '"en"' || ret === 'en'){
			l = en.map
			other=l.other
			selectIcon=l.selectIcon
			navigateToCar= l.navigateToCar
			callToDriver=l.callToDriver
            btnSave = 'Save'
            btnCancel = 'Cancel'
		}
		
	}
	
	render(){
		const s = this.state
		if(other === undefined ){
			other=s.other
			selectIcon=s.selectIcon
			navigateToCar= s.navigateToCar
			callToDriver=s.callToDriver
		}
		 this.setLanguage()
		

		return(
        <div >  
			<IonGrid>
                <IonRow>
				    <IonCol>
                        <h4>{other}</h4>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                            <IonItem lines='none'>
                                <IonIcon icon={paperPlane}/> &nbsp;&nbsp;
                                <IonLabel>{navigateToCar}</IonLabel>
                            </IonItem>
                    </IonCol>
                    <IonCol size='6'>
                            <IonItem lines='none'>
                                <IonIcon icon={keypad}/>&nbsp;&nbsp;
                                <IonLabel>{callToDriver}</IonLabel>
                            </IonItem>
                    </IonCol>
                </IonRow>
					    <IonRow style={{textAlign:"center"}}>
							<IonCol size='3' className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_coupe.png"}></img>
                            </IonCol>
                            <IonCol size='3' className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_suv.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_supercar.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_micro.png"}></img>
                            </IonCol>
						</IonRow>
                        <IonRow style={{textAlign:"center"}}>
							<IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_big truck.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_mini truck.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_truck.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_van.png"}></img>
                            </IonCol>
						</IonRow>
                        <IonRow style={{textAlign:"center"}}>
							<IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_campervan.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_minivan.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_pickup.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_speedboat.png"}></img>
                            </IonCol>
					</IonRow>
                        <IonRow style={{textAlign:"center"}}>
							<IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_sailboat.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_ship.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' width='100%' src={"../assets/icon/icon_cruise ship.png"}></img>
                            </IonCol>
                            <IonCol size='3'className='icon-select'>
                                <img alt='' style={{paddingTop:'20%'}} width='50%' src={"../assets/icon/navigator-02.png"}></img>
                            </IonCol>
						</IonRow>
						<IonRow>
                            <IonCol size='6'>  <IonButton mode='ios' color='dark'  expand='block'>{btnSave}</IonButton> </IonCol>
                            <IonCol size='6'> <IonButton mode='ios' color='dark' expand='block'>{btnCancel}</IonButton> </IonCol>
                    </IonRow>
				</IonGrid>
            
		</div>
		)
	}
}
