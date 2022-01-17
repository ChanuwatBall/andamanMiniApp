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
	IonCol,
	IonToggle,
	NavContext, IonAlert, IonToast, IonPopover, IonSelect, IonSelectOption
	} from '@ionic/react';
import React , { Suspense } from 'react';
import './Home.css';
import {globe , lockClosed, alert, notifications, key, language, text, arrowRedo, share} from 'ionicons/icons';
import app from '../app.config.json'
import api from '../api.json'
  import en from '../en.json';
  import th from '../th.json';
  import { Plugins, Capacitor } from "@capacitor/core";
  import axios from 'axios'
  const { Storage } = Plugins;

let languages: any, language_det: any,Password: any,Password_det: any , profile: any ,profile_det:any,title: any, notification:any ;
let securitySetting:any ,displaySetting:any, displayLicensePlate:any, settingOnWebsite:any;
let yearsPayment:any , monthPayment:any, linekeyManagement:any,enterLinekey:any, enterPassword:any, ok:any, cancel:any,
lineKeyRecheck:any , lineKeyPassWrong:any , lineKeySuccess:any;

export default class setting extends React.Component{
	[x: string]: any;
	
	 
	state={ 
		showActionSheet : false ,
		setShowActionSheet: false ,
		showToastPassErr: false ,
		showToastChangeSuccess: false ,
		alertLineKey: false,
		language : 'th' ,
		languages: "ภาษา", 
		languageSetting: "เปลี่ยนภาษา",
		Password: "รหัสผ่าน",
		Password_det: "เปลี่ยนรหัสผ่าน" , 
		profile: "โปรไฟล์" ,
		profile_det:"จัดการโปรไฟล ์",
		title: "ตั้งค่า",
		notificationSetting :"ตั้งค่าการแจ้งเตือน",
		securitySetting :"ตั้งค่าความปลอดภัย",
		displaySetting : "ตั้งค่าการแสดงผล",
		lineKey:'',
		password:'',
		notiYearsPayment : "แจ้งเตือนครบกำหนดชำระรายปี",
		notiMonthPayment : "แจ้งเตือนครบกำหนดชำระรายเดือน",
		lineKeyManagement : "จัดการไลน์คีย์",
		enterLinekey : "พิมพ์ไลน์คีย์",
		enterPassword : "พิมพ์รหัสผ่าน",
		ok: "ตกลง",
		cancel :"ยกเลิก",
		lineKeyRecheck : "โปรดตรวจสอบรหัสผ่านและไลน์คีย์ก่อนกดตกลง",
		lineKeyPassWrong : "รหัสผ่านผิดพลาด ตรวจสอบแล้วลองอีกครั้ง",
		lineKeySuccess : "เปลี่ยนไลน์คีย์สำเร็จ",
		displayLicensePlate:"แสดงป้ายทะเบียน",
		settingOnWebsite :"ตั้งค่าบนเว็บไซต์",
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
	
	async componentDidMount() {
		let lang = await this.getStorage('language');
		//let localLang =JSON.stringify( lang.value || '{}')
		if(lang === 'th'){
			this.setState({
				language : 'ไทย'
			})
		}else if(lang === 'en'){
			this.setState({
				language : 'Eng'
			})
		}
	}

	setLineKey=(e:any)=>{
		this.setState({
			alertLineKey : e
		})
	}

	setShowActionSheet=()=>{
		this.setState({
			showActionSheet : true ,
			setShowActionSheet: true
		})
	}
	setCloseActionSheet=()=>{
		this.setState({
			showActionSheet : false ,
			setShowActionSheet: false
		})
	}


	changeLanguageTH=async ()=>{
		var device = await this.getStorage('deviceID')

		this.setState({
			language : 'ไทย'
		})
		if(this.state.language === 'th'){
			let l =  th.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
			securitySetting = l.securitySetting
			displaySetting = l.displaySetting
			lineKeyRecheck = l.lineKeyRecheck
			lineKeyPassWrong = l.lineKeyPassWrong 
			lineKeySuccess = l.lineKeySuccess
			displayLicensePlate = l.displayLicensePlate
			settingOnWebsite = l.settingOnWebsite
		}else if(this.state.language === 'en'){
			let l =  en.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
			securitySetting = l.securitySetting
			displaySetting = l.displaySetting
			lineKeyRecheck = l.lineKeyRecheck
			lineKeyPassWrong = l.lineKeyPassWrong 
			lineKeySuccess = l.lineKeySuccess
			displayLicensePlate = l.displayLicensePlate
			settingOnWebsite = l.settingOnWebsite
		}
		
		if(device === '0' || Number(device) === 0){
			if(this.state.language === '"th"'|| this.state.language === 'th'){
				this.setStorage('carID', th.home.carList )
			}else if(this.state.language === '"en"' || this.state.language === 'en'){
				this.setStorage('carID',en.home.carList)
				
			}
		}

		this.setStorage('language','th');
		console.log(this.state.language)
	}

	changeLanguageEN=async ()=>{
		var device = await this.getStorage('deviceID')
		this.setState({
			language : 'Eng'
		})
		
		if(this.state.language === 'th'){
			let l =  th.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
			securitySetting = l.securitySetting
			displaySetting = l.displaySetting
			yearsPayment = l.notiYearsPayment
			monthPayment= l.notiMonthPayment
			linekeyManagement = l.lineKeyManagement
			enterLinekey = l.enterLinekey
			enterPassword = l.enterPassword
			lineKeyRecheck = l.lineKeyRecheck
			lineKeyPassWrong = l.lineKeyPassWrong 
			lineKeySuccess = l.lineKeySuccess
			settingOnWebsite = l.settingOnWebsite
			ok = l.ok
			cancel =  l.cancel
		}else if(this.state.language === 'en'){
			let l =  en.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
			securitySetting = l.securitySetting
			displaySetting = l.displaySetting
			yearsPayment = l.notiYearsPayment
			monthPayment= l.notiMonthPayment
			linekeyManagement = l.lineKeyManagement
			enterLinekey = l.enterLinekey
			enterPassword = l.enterPassword
			lineKeyRecheck = l.lineKeyRecheck
			lineKeyPassWrong = l.lineKeyPassWrong 
			lineKeySuccess = l.lineKeySuccess
			settingOnWebsite = l.settingOnWebsite
			ok = l.ok
			cancel =  l.cancel
		}else if(title === ' '){
			title = 'ตั้งค่า'
		}

		if(device === '0' || Number(device) === 0){
			if(this.state.language === '"th"'|| this.state.language === 'th'){
				this.setStorage('carID',th.home.carList)
			}else if(this.state.language === '"en"' || this.state.language === 'en'){
				this.setStorage('carID', en.home.carList )
				
			}
		}
		
		this.setStorage('language', 'en');
		console.log(this.state.language)
	}

	getLanguage= async ()=> {
		const languag =await this.getStorage('language'); 
		console.log(languag )
		//return(language)
	  }

	  refreshPage(){ 
		window.location.reload(); 
	}
	setLanguage=async ()=>{
		const languag =await this.getStorage('language');
		if(languag === 'th'){
			let l =  th.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
			securitySetting = l.securitySetting
			displaySetting = l.displaySetting
			yearsPayment = l.notiYearsPayment
			monthPayment= l.notiMonthPayment
			linekeyManagement = l.lineKeyManagement
			enterLinekey = l.enterLinekey
			enterPassword = l.enterPassword
			lineKeyRecheck = l.lineKeyRecheck
			lineKeyPassWrong = l.lineKeyPassWrong 
			lineKeySuccess = l.lineKeySuccess
			displayLicensePlate = l.displayLicensePlate
			settingOnWebsite = l.settingOnWebsite
			ok = l.ok
			cancel =  l.cancel
		}else if(languag === 'en'){
			let l =  en.setting
			title = l.title 
			profile = l.profile
			Password = l.password
			languages = l.languageSetting
			language_det = l.languageChange
			profile_det = l.profileManage
			Password_det = l.passwordChange
			notification = l.notificationsSetting
			securitySetting = l.securitySetting
			displaySetting = l.displaySetting
			yearsPayment = l.notiYearsPayment
			monthPayment= l.notiMonthPayment
			linekeyManagement = l.lineKeyManagement
			enterLinekey = l.enterLinekey
			enterPassword = l.enterPassword
			ok = l.ok
			cancel =  l.cancel
			lineKeyRecheck = lineKeyRecheck
			lineKeyPassWrong = l.lineKeyPassWrong 
			lineKeySuccess = l.lineKeySuccess
			displayLicensePlate = l.displayLicensePlate
			settingOnWebsite = l.settingOnWebsite
		}else if(title === ' '){
			title = 'ตั้งค่า'
		}
		
	}

	setShowToastPassErr=(e:any)=>{
		this.setState({
			showToastPassErr : e
		})
	}

	setShowToastChangeSuccess=(e:any)=>{
		this.setState({
			showToastChangeSuccess : e
		})
	}

	changeLineKey=async ()=>{
		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
		let userID = await this.getStorage('userId');
		
		console.log(this.state.lineKey)
		console.log(this.state.password)
        console.log("setting -> changeLineKey -> userID.value", userID)


		axios.post(apiHost+'/setting/changelinekey', {
			userId : userID ,
			lineKey: this.state.lineKey,
			password: this.state.password,
		},
		{
			headers:{
				authenication : api.authorization ,
				token : token ,
				language : lang ,
				version : api.version
			}
		}).then(res =>{
			console.log("setting -> changeLineKey -> res", res)
			if(res.data.status === 0){
				this.setShowToastPassErr(true)
			}else{
				this.setShowToastChangeSuccess(true)
			}
		}).catch(err =>{
       		console.log("setting -> changeLineKey -> err", err)
		})
	}

	
	render(){
		this.setLanguage()
	
		return(
			<IonPage>
			<IonHeader className='nav-title'>
				<IonToolbar style={{backgroundColor:'#fff'}} >
					<IonButtons>
							<IonBackButton color='primary'  defaultHref='/home' text='' ></IonBackButton>
							<IonTitle color='primary' className="ion-text-center" ><strong>{title}</strong></IonTitle>
								</IonButtons>
									
								<IonButtons slot="end" color='primary'>
						<IonMenuButton  color='primary'/>
					</IonButtons>
				</IonToolbar>

			</IonHeader>
			<IonContent>
			<IonList>
						<br/>
					<IonLabel color='medium' style={{margin:'1rem',fontSize:'0.8em'}}>{notification}</IonLabel>
					{/* <IonItem lines='full' mode='ios'>
						<IonLabel color='medium'>
							{monthPayment}
						</IonLabel>
						<IonToggle mode='ios' value="mushrooms" checked={true} />
					</IonItem>

					<IonItem lines='full' mode='ios'>
						<IonLabel color='medium'>
							{yearsPayment}
						</IonLabel>
						<IonToggle mode='ios' value="mushrooms" />
					</IonItem> */}

					<IonItem  type='button'  lines='full' mode='ios' onClick={(e)=>{this.setLineKey(true)}}>
							<IonIcon icon={key} mode='ios' style={{color:app.color,fontSize:'1.3em' }}/>
							<IonLabel color='medium'>&nbsp;&nbsp;{linekeyManagement}</IonLabel>
					</IonItem>


					<br/><br/>
					<IonLabel color='medium' style={{margin:'1rem',fontSize:'0.8em'}}>{securitySetting}</IonLabel>
					<IonItem routerDirection='forward' type='button' target="_self" routerLink="/changePassword" lines='full' mode='ios'>
						<IonIcon icon={lockClosed} style={{color:app.color,fontSize:'1.3em' }}/>
						<IonLabel color='medium'>&nbsp;&nbsp;{Password}</IonLabel>
					</IonItem>
				
					<br/><br/>
					<IonLabel color='medium' style={{margin:'1rem',fontSize:'0.8em'}}>{displaySetting}</IonLabel> 
					<IonItem  onClick={()=>this.setShowActionSheet()} lines='full'  mode='ios'> 
						<IonIcon icon={language}  color='primary' style={{color:app.color,fontSize:'1.3em' }}/>
						<IonLabel color='medium' >&nbsp;&nbsp;{languages}</IonLabel>
						<IonLabel slot='end' color='medium' className='ion-text-right'>{this.state.language}</IonLabel> 
					</IonItem>
					<IonItem  type='button'  lines='full' mode='ios'  >
						<IonIcon icon={text} style={{color:app.color,fontSize:'1.3em' }}/>
						<IonLabel color='medium'>&nbsp;&nbsp; {displayLicensePlate}</IonLabel> 
						 <IonLabel slot='end' color='medium' className='ion-text-right'><small>{settingOnWebsite}</small></IonLabel>
					</IonItem> 
				</IonList>
			</IonContent>
			<IonActionSheet
				isOpen={this.state.showActionSheet}
				mode='ios'
				onDidDismiss={this.setCloseActionSheet}
				buttons={[ 
				{
					text: 'ไทย (ภาษาไทย)',
					icon: 'shareAlt',
					handler: () => { this.changeLanguageTH(); this.refreshPage()}
					}, 
					{
					text: 'Eng (ภาษาอังกฤษ)',
					icon: 'power' ,
					handler: () => {this.changeLanguageEN(); this.refreshPage()}
				}
			]}
			>
			</IonActionSheet>

			<IonAlert
			isOpen={this.state.alertLineKey}
			onDidDismiss={(e)=>this.setLineKey(false)}
			header={linekeyManagement}
			message={lineKeyRecheck}
			mode='ios'
			inputs={[
					{
						name: 'lineKey',
						type: 'text',
						placeholder: enterLinekey
					},
					{
						name: 'password',
						type: 'password',
						placeholder: enterPassword
					}
				]}
			buttons={[
				{
					text: cancel ,
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log('cancel')
						}
					},
						{
						text: ok ,
						handler: data => {
							this.setState({
								lineKey : data.lineKey ,
								password : data.password
							},()=>{
								this.changeLineKey()
							})
						}
					}
				]}
			/>
			<IonToast
				isOpen={this.state.showToastPassErr}
				onDidDismiss={(e) =>this.setShowToastPassErr(false)}
				message={lineKeyPassWrong}
				mode='ios'
				color='danger'
				duration={2000}
			/>
			<IonToast
				isOpen={this.state.showToastChangeSuccess}
				onDidDismiss={(e) =>this.setShowToastChangeSuccess(false)}
				message={lineKeySuccess}
				mode='ios'
				color='primary'
				duration={2000}
			/>
		</IonPage>
		)
	}
};
