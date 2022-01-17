import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonBackButton,
	IonHeader,
	IonContent,
	IonInput,
	IonButton,
	IonAlert,
	IonLoading, 
	IonToast,
	NavContext
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import en from '../en.json';
import th from '../th.json';
import { Plugins  } from "@capacitor/core";
import { Redirect } from 'react-router-dom';
import axios from 'axios'
import api from '../api.json'


const { Storage } = Plugins;
let title:any , password:any, newPassword:any, confirmNewPassword:any, save:any, alertSucTitle:any, alertSucMessage:any;
let errMessase:any , ok:any , loading:any ,ToastErrDiff:any;

export default class changePassword extends React.Component{
	static contextType = NavContext
	goBack=()=> {
		this.context.navigate('/setting', 'back');
	}
	currentPassword: any;
	newPassword:any;
	confirmNewPassword:any;

	constructor(props : any) {
		super(props);

		this.currentPassword = React.createRef();
		this.newPassword = React.createRef();
		this.confirmNewPassword = React.createRef();
	}


	state= {
		showToastErrDiff : false ,
		showToast :false ,
		redirect : false,
		showAlertSuccess : false,
		setShowAlertSuccess :false,
		showLoading: false, 
		currentPassword:'',
		currentPass: '0',
		newPass:'0',
		confirmNewPass:'0',
		newToken: '',
		title:"เปลี่ยนรหัสผ่าน" , 
		password:"รหัสผ่าน", 
		newPassword:"รหัสผ่านใหม่", 
		confirmNewPassword:"ยืนยันรหัสผ่าน", 
		save:"เปลี่ยนรหัสผ่าน", 
		alertSucTitle:"สำเร็จ", 
		alertSucMessage:"เปลี่ยนรหัสผ่านสำเร็จ",
		ok: "ตกลง",
		loading:"กำลังโหลด...",
		ToastErrDiff : 'รหัสผ่านใหม่แตกต่างกัน ตรวจสอบอีกครั้ง',
		errMessase : 'รหัสผ่านไม่ถูกต้อง ตรวจสอบอีกครั้ง'
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

	setShowToastErrDiff=()=>{
		this.setState({
			showToastErrDiff :true 
		  })
	}

	setCloseToastErrDiff=()=>{
		this.setState({
			showToastErrDiff :false 
		  })
	}
	
	refreshPage(){ 
		window.location.reload(); 
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
		this.setLanguage();
		
		let password = await this.getStorage('password')
		const userId = await this.getStorage('userId')
		this.setState({
			currentPassword : password
		})
		const apiHost = await this.getStorage('api')
        console.log("apiHost.value", apiHost)
        console.log("cuserId",userId)

		// if (Capacitor.isNative) {
		// 	Plugins.App.addListener('backButton', e => {
		// 		if(this.state.showToastErrDiff === true){
		// 			this.setCloseToastErrDiff()
		// 		}else if (this.state.showToast === true){
		// 			this.setCloseToast()
		// 		}else if(this.state.setShowAlertSuccess === true){
		// 			this.closeAlertSuccess()
		// 		}else{
		// 			this.goBack()
		// 		}
		// 	})
		// }
	}

	changePassword= async ()=>{
		const apiHost = await this.getStorage( 'api')
		const lang = await this.getStorage( 'language')
		const token = await this.getStorage('token')
		const userId = await this.getStorage('userId') 
		
		axios.post(`${apiHost}/setting/changepassword` ,{
			userId: userId ,
			currentPassword: this.state.currentPass,
			newPassword : this.state.newPass ,
			confirmNewPassword : this.state.confirmNewPass
		  } ,{
			headers: {
			  "language": lang  ,
			  "token" : token ,
			  "authenication" : api.authorization,
			  "version":api.version
			}		
		  })
		  .then(res => {
			console.log(res)
				if(res.data.status === 0 ){
					this.setShowToast()
				}else if(res.data.status === 1 ){
					if(res.data.token !== '0' || res.data.token !== '{}'){
						this.setState({
							showAlertSuccess : true,
							setShowAlertSuccess :true
						})
	
						this.setState({
							newPass: this.newPassword.current.value ,
							currentPassword:  this.newPassword.current.value,
							currentPass:  this.newPassword.current.value ,
							newToken : res.data.token
						})
						
						console.log("changePassword -> newToken", this.state.newToken)
						 this.setStorage('token',this.state.newToken)
						 this.setStorage('password',this.state.newPass)

						this.clearValues()
					}else{
						this.clearValues()
						this.setShowToastErrDiff()
					}
					
				}else if(res.data.status === 2 ){
					this.setShowToastErrDiff()
				}
			
		  }).catch(err => {
			  console.log(err)
			  this.setShowToast()
		  })
	}

	clearValues=()=>{
		this.currentPassword.current.value = '';
		this.newPassword.current.value = '';
		this.confirmNewPassword.current.value = '';
	}

	onSummit=async()=>{
		
		//var l 
		let s = this.state
			if(s.currentPassword === s.currentPass&&s.currentPass !== s.newPass&&s.newPass === s.confirmNewPass){	
				this.setShowLoading()
				this.changePassword()
			}else if(s.currentPass  === s.newPass  || s.currentPass  === s.confirmNewPass){
				//errMessase = l.alertFailMessage
				this.setShowToast()
				this.clearValues()
			}else if(s.newPass !== s.confirmNewPass){
				//ToastErrDiff = l.alertDifferenceMessage
				this.setShowToastErrDiff()
				this.clearValues()
			}else if(s.currentPassword !== s.currentPass){
				//errMessase = l.alertFailMessage
				this.setShowToast()
				this.clearValues()
			}
		
	
		console.log(s.currentPassword+' '+ s.currentPass+' ' +s.newPass+' ' + s.confirmNewPass)
	}

	closeAlertSuccess=()=>{
		this.setState({
			showAlertSuccess : false,
			setShowAlertSuccess :false,
		})
	}
	
	signOut=()=>{
		this.clearValues()
		this.setStorage('token','')
	}

	setCloseToast=()=>{
		this.setState({
			showToast:false
		})
	}

	setShowToast=()=>{
		this.setState({
			showToast:true
		})
	}


	setLanguage = async ()=>{ 
		const languag =await this.getStorage('language');

		let l
		if (languag === '"th"' ||languag === 'th'){
			l = th.changPassword
			title=l.title
			password=l.presentPass
			newPassword=l.newPass
			confirmNewPassword=l.confirmNewPassword
			save=l.btnSave
			alertSucTitle=l.alertSucTitle
			alertSucMessage= l.alertSucMessage
			ToastErrDiff = l.alertDifferenceMessage
			errMessase = l.alertFailMessage
			ok = l.ok
			loading = l.loading
		} else if(languag === '"en"' ||languag === 'en'){
			l = en.changPassword
			title=l.title
			password=l.presentPass
			newPassword=l.newPass
			confirmNewPassword=l.confirmNewPassword
			save=l.btnSave
			alertSucTitle=l.alertSucTitle
			alertSucMessage= l.alertSucMessage
			ToastErrDiff = l.alertDifferenceMessage
			errMessase = l.alertFailMessage
			ok = l.ok
			loading = l.loading
		}	
		//this.setShowLoading()
	}

	render(){
		this.setLanguage()
		if(this.state.redirect === true){
			return <Redirect to='/login' />
		}
		if(title === undefined){
			const l = this.state
			title=l.title
			password=l.password
			newPassword=l.newPassword
			confirmNewPassword=l.confirmNewPassword
			save=l.save
			alertSucTitle=l.alertSucTitle
			alertSucMessage= l.alertSucMessage
			ok = l.ok
			loading = l.loading
			ToastErrDiff = l.ToastErrDiff
			errMessase = l.errMessase
		}	

		return(
			<IonPage>
			<IonHeader className='nav-title'>
					<IonToolbar color='light' >
						<IonButtons color='primary' slot="start">
							<IonBackButton color='primary' defaultHref="/setting"  text={title}/>
								</IonButtons >
									{/* <IonTitle className="ion-text-left" color='primary'><strong></strong></IonTitle>	 */}
								{/* <IonButtons slot="end">
							<IonMenuButton color='primary' />
						</IonButtons> */}
					</IonToolbar>
				</IonHeader>
		<IonContent>
			<form style={{padding:'0px',marginTop:'1rem'}}>
				<div className="changpassword" style={{marginTop:'1rem'}}>
						<IonInput 
							color='dark'
							required 
							type = "text"
							id='currentPassword'
							ref={this.currentPassword}
							placeholder={password}
							onIonChange={(e:any)=>{this.setState({currentPass : e.target.value});  }}
						// ref={this.currentPassword}
						>
						</IonInput>
					</div>
					<div className="changpassword" style={{marginTop:'1rem'}}>

						<IonInput 
							color='dark'
							id='newPassword'
							ref={this.newPassword}
							required 
							minlength={6}
							type = "password"
							className="fontAthiti "
							placeholder={newPassword}
							onIonChange={(e:any)=>{this.setState({newPass : e.target.value});  }}
					//  ref={this.newPassword}

						>
						</IonInput>
					</div>
					<div className="changpassword" style={{marginTop:'1rem'}}>
					
						<IonInput 
							color='dark'
							id='confirmNewPassword'
							ref={this.confirmNewPassword}
							required 
							minlength={6}
							type = "password"
							className="fontAthiti "
							placeholder={confirmNewPassword}
							onIonChange={(e:any)=>{this.setState({confirmNewPass : e.target.value}); }}
							//ref={this.confirmNewPassword}
						>
						</IonInput>
					</div>
					<IonButton 
						style={{margin:'10px',marginTop:'1.5rem' ,fontSize:'.9em'}}
						expand="block" 
						mode='ios' 
						color='primary' 
						onClick={()=>{this.onSummit()}}
					>{save}</IonButton>
			</form>
		</IonContent>

		<IonAlert
			mode='ios'
			isOpen={this.state.showAlertSuccess}
			onDidDismiss={()=>this.closeAlertSuccess()}
			header={alertSucTitle}
			message={alertSucMessage}
			buttons={[
				{
				  text:ok,
				  handler: () => {
					// console.log('Confirm Okay');
					this.signOut()
					this.setState({redirect: true},()=>this.refreshPage());
				  }
				}
			]}
        />

		<IonLoading
		 	mode='ios'
            isOpen={this.state.showLoading}
            onDidDismiss={this.setCloseLoading}
            message={loading}
            duration={1000}
        />

		<IonToast
			color='danger'
			mode='ios'
			isOpen={this.state.showToast}
			onDidDismiss={() => this.setCloseToast()}
			message={errMessase}
			duration={3000}
		/>
		<IonToast
			color='danger'
			mode='ios'
			isOpen={this.state.showToastErrDiff}
			onDidDismiss={() => this.setCloseToastErrDiff()}
			message={ToastErrDiff}
			duration={3000}
		/>
		</IonPage>
		)
	}
}
