/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonItem,
	IonHeader,
	IonContent,
	IonIcon,
	IonLabel,
	IonMenuButton,
	IonBackButton,
	IonTitle,
	IonActionSheet,
	IonList,
	IonCol
	} from '@ionic/react';
import React , { Suspense } from 'react';
import './Home.css';
import app from '../app.config.json'
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
  
let languages: any, language_det: any,Password: any,Password_det: any , profile: any ,profile_det:any,title: any, notification:any ;
export default class notificationSetting extends React.Component{
	[x: string]: any;
	 
	state={
			showActionSheet : false ,
			setShowActionSheet: false ,
			language : 'th' ,
			languages: "ภาษา", 
			languageSetting: "เปลี่ยนภาษา",
			Password: "รหัสผ่าน",
			Password_det: "เปลี่ยนรหัสผ่าน" , 
			profile: "โปรไฟล์" ,
			profile_det:"จัดการโปรไฟล ์",
			title: "ตั้งค่าการแจ้งเตือน",
			notificationSetting :"ตั้งค่าการแจ้งเตือน"
	}
	
	
	async componentDidMount() {
		let lang = await Storage.get({ key: 'language' });
		this.setState({
			language : lang
		})
	}


	getLanguage= async ()=> {
		const ret =await Storage.get({ key: 'language' } );
		const languag =JSON.stringify( ret.value || '{}')
		console.log(languag )
		//return(language)
	  }

	  refreshPage(){ 
		window.location.reload(); 
	}
	setLanguage=async ()=>{
		
		const languag =await Storage.get({ key: 'language' } );
		if(languag.value === 'th'){
			let l =  th.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
		}else if(languag.value === 'en'){
			let l =  en.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
		}else if(title === ' '){
			title = 'ตั้งค่า'
		}
		
	}
	
	render(){
		this.setLanguage()
	
		return(
			<IonPage>
			<IonHeader className='nav-title'>
				<IonToolbar color='dark' >
					<IonButtons>
							<IonBackButton  color='light' defaultHref='/home'></IonBackButton>
								<IonTitle className="ion-text-center" color='primary' ><strong>ตั้งค่าการแจ้งเตือน</strong></IonTitle>
							</IonButtons>
							<IonButtons slot="end">
								<IonMenuButton  color='light' />
							</IonButtons>
				</IonToolbar>

			</IonHeader>
			<IonContent>
			<IonList>
                <h1>content</h1>
			</IonList>
			</IonContent>	
		</IonPage>
		)
	}
};
