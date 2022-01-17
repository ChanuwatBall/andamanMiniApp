/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
	IonContent,
	IonItem,
	IonLabel,
	IonInput,
	IonAlert,
	IonLoading,
	IonSelectOption,
	IonSelect,
	IonCheckbox,
	IonButton,
	IonTitle,
	IonToast,
	IonRow,
	IonCol,
	IonIcon,
	IonRouterLink
} from '@ionic/react';
import React from 'react';
import './style.css';
import {Redirect} from 'react-router-dom';
import {  mobileVendor } from "react-device-detect";
import axios from 'axios'; 
import en from '../en.json';
import th from '../th.json';
import { Capacitor } from "@capacitor/core";
import { Storage } from '@capacitor/storage';
import { Device } from '@capacitor/device';
import { Geolocation } from '@ionic-native/geolocation';
import api from '../api.json';
import app from '../app.config.json' 
import { arrowBack } from 'ionicons/icons';
import { config } from 'process';

const localIpUrl = require('local-ip-url');
const customPopoverOptions = {
	// header: 'Hair Color', subHeader: 'Select your hair color', message: 'Only
	// select your dominant hair color'
}; 
let account : any,username : any,password : any,btnLogin : any,contact : any,alertTitle : any,alertMessage : any,l : any,
	serverTitle : any,server : any,version : any,errConTitle :any ,errConMessage : any ,accountVal:any,	usernameVal:any,
	passwordVal:any, remember:any,lang:any,	title:any,	lat:any,lon:any, loading:any, ok:any, exitApp:any,
	rememberMe = true;

class Login extends React.Component {
	[x : string] : any;

	textUsername : any;
	textPassword : any;
	textAccount : any;
	serverValue : any;

	constructor(props : any) {
		super(props);
		this.textUsername = React.createRef();
		this.textPassword = React.createRef();
		this.textAccount = React.createRef();
		this.serverValue = React.createRef();
	}

	state = {
		backRegister: 'none',
		redirect: false,
		showAlertFail: false,
		showAlertErr: false,
		showToast :false,
		currentPath:'',
		countPressBack:0, 
		serverVal: '1',
		location: '',
		lat: '7.995723',
		long: '98.334105',
		showLoading: false,
		setShowLoading: false,
		language: 'th',
		account: "บัญผู้ใช้",
		username: "ชื่อผู้ใช้",
		password: "รหัสผ่าน",
		btnLogin: "เข้าสู่ระบบ",
		contact: "ติดต่อเรา",
		alertTitle: "ไม่สามา่่รถเข้าสู่ระบบ",
		alertMessage: "โปรดตรวจสอบข้อมูลให้ถูกต้อง แล้วลองอีกครั้ง",
		serverTitle: "เซฟเวอร์",
		server: "เลือกเซฟเวอร์",
		version: "เวอร์ชั่น" ,
		errConTitle : "การเชื่่อมต่อผิดพลาด" ,
		errConMessage : "ไม่สามารถเชื่อมต่อระบบได้ในขณะนี้ โปรดลองอีกครั้งภายหลัง",
		remember: "จดจำฉัน ?",
		title:'AT Digital Co.,Ltd',
		loading: "กำลังโหลด...",
		ok: "ตกลง",
		exitApp : "กดอีกครั้งเพื่อออก",
		versionApp :'2.0.0',
		internetConnection: true,
		phonerFrst:'',
		phoneSecn:'',
		contacts:{
			backgroud :"../assets/images/bg-01.png",
			color:"",
			line:{code:'',image:'',url:""},
			logo:'../assets/icon/logo.svg',
			name:'',
			telephone:[{number:'062-2450981'},{number:'062-2450982'}]
		},
		languages: [
			{
				code:"th",
				file:"",
				image:"../assets/icon/th.png",
				name: "ไทย "
			},
			{
				code:"en",
				file:"",
				image:"../assets/icon/un.png",
				name: "อังกฤษ"
			}
		],
		serverList: [
			{
				id: 1,
				name: "server1",
				url: "https://mobileapp-s1.andamantracking.dev"
			},{
				id: 2,
				name: "server2" ,
				url: "https://mobileapp-s2.andamantracking.dev"
			},{
				id: 3,
				name: "server3",
				url: "https://mobileapp-s3.andamantracking.dev"
			}
		],
		showText: "",

		accountValue:'',
		usernameValue:'',
		passwordValue:'',

	}

	showAlertFail = () => {
		this.setState({showAlertFail: true, setShowAlertFail: true})
	}
	closeAlertFail = () => {
		this.setState({showAlertFail: false, setShowAlertFail: false})
	}
	showAlertErr = () => {
		this.setState({showAlertErr: true, setShowAlertErr: true})
	}
	closeAlertErr = () => {
		this.setState({showAlertErr: false, setShowAlerErr: false})
	}
	setShowLoading = () => {
		this.setState({showLoading: true})
	}
	setCloseLoading = () => {
		this.setState({showLoading: false})
	}

	Submit = async (e : any) => {
		e.preventDefault()
		if(this.state.serverList.length <= 1){
			this.setState({serverVal : this.state.serverList[0].url},
			()=>console.log(this.state.serverList))
		}

		const IMEI_GenCheck = require("imei_gencheck");
		const imeigc = new IMEI_GenCheck();
		let server = await this.getStorage('server');
		let language =await this.getStorage('language')
		let info = await Device.getInfo() 
		let uuid = await Device.getId()
		
		if(server === undefined || server === null || server === ''){
			server = this.state.serverVal
		}
		let header = {
			"latitude": this.state.lat,
			"longitude": this.state.long,
			"device" : mobileVendor,
			"device-model" : info.model,
			"os": info.operatingSystem,
			"os-version": info.osVersion,
			"device-imei": uuid,
			"language": language,
			"ip" : localIpUrl('public', 'ipv4') ,
			"server" : this.state.serverVal ,
			"authorization": api.authorization,
			"version":api.version ,
			"platform" : api.platform
		}


		if( this.textUsername.current.value === undefined || this.textPassword.current.value  === undefined || this.textAccount.current.value === undefined){
            console.log("Login -> Submit -> textUsername undifine")
			this.showAlertFail();
		}else if( this.textUsername.current.value === null || this.textPassword.current.value  === null || this.textAccount.current.value === null){
			console.log("Login -> Submit -> textUsername null")
			this.showAlertFail();
		}else if( this.textUsername.current.value === '' || this.textPassword.current.value  === '' || this.textAccount.current.value === ''){
			console.log("Login -> Submit -> textUsername ''")
			this.showAlertFail();
		}else{
			console.log(this.textAccount.current.value ,this.textUsername.current.value,this.textPassword.current.value)
			let path = this.state.serverVal+'/'+api.type+'/v'+api.version
			//let path = 'https://api-testapp.andamantracking.dev/app/v2'
			//let path =  api.apiTest+'/'+api.type+'/v2-1'
			//  this.setStorage({key:'api',value:'https://api-testapp.andamantracking.dev/app/v2'})
				 axios.post(path+'/signin' ,{
					 account: this.textAccount.current.value,
					 username: this.textUsername.current.value,
					 password: this.textPassword.current.value
				 }, {
					 headers: {
						"latitude": this.state.lat,
						"longitude": this.state.long,
						"device" : mobileVendor,
						"device-model" : info.model,
						"os": info.operatingSystem,
						"os-version": info.osVersion,
						"device-imei": uuid,
						"language": language ,
						"ip" : localIpUrl('public', 'ipv4') ,
						"server" : this.state.serverVal ,
						"authorization": api.authorization,
						"version":api.version ,
						"platform" : api.platform
					}
				 }).then(res => {
					 this.setState({username: res.data.username, password: res.data.password});
					 console.log(res)

					if(res.status !== 200){
                        console.log("Login -> Submit -> res.status", res.status)
						this.showAlertFail();
					}else if(res.status === 200){
						if( res.data === ""){
							if(language ==='en' || language === '"en"'){
								alertTitle='Username not found in the system.' ,
				   				alertMessage='Please check and try again. or contact us'
							}else{
								alertTitle='ไม่พบชื่อผู้ใช้ในระบบ' ,
								alertMessage='โปรดตรวจสอบแล้วลองอีกครั้ง หรือติดต่อเรา'
							}
							this.showAlertFail();
						}else if( res.data.token === null ||  res.data.token === undefined ||  res.data.token === ""){
							this.setState({redirect: false})
						}else{
							const userID = JSON.stringify(res.data.id)
							const token = res.data.token
							console.log("Login -> Submit -> token", token)
							localStorage.setItem('account',this.textAccount.current.value);
							localStorage.setItem('username',this.textUsername.current.value);
							localStorage.setItem('password', this.textPassword.current.value);
							localStorage.setItem('appVersion',JSON.stringify(app.versionNumber))
							localStorage.setItem( 'userId',userID.toString() );
							localStorage.setItem( 'server',this.state.serverVal );
							localStorage.setItem( 'token',token);
							localStorage.setItem( 'api',path );
							localStorage.setItem( 'first_name',res.data.first_name)
							localStorage.setItem( 'last_name',res.data.last_name) 
							localStorage.setItem( 'domain', res.data.url_realtime )
							this.setState({redirect: true})
						}
						 
					 }
				 }).catch(err => {
					console.log('err', err)
					this.showAlertFail(); 
				 })
		}

		// this.setStorage({key:'account', value: this.textAccount.current.value})
		// this.setStorage({key:'username', value: this.textUsername.current.value})
		// this.setStorage({key:'password', value: this.textPassword.current.value})

		if(rememberMe === true){
			this.setStorage('account',this.state.accountValue)
			this.setStorage('username',this.state.usernameValue)
			this.setStorage('password',this.state.passwordValue)
		}else if(rememberMe === false){
			this.setStorage('account','')
			this.setStorage('username','')
			this.setStorage('password','')
		}
        console.log("TCL: rememberMe", rememberMe)
	}

	refreshPage(){ 
		window.location.reload(); 
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

	getPosition(){ 
		// navigator.geolocation.getCurrentPosition( (position)=> {
		// 	console.log(position);
		// 	let latitude =  position.coords.latitude
		// 	let longitude = position.coords.longitude
		// 	console.log("getPosition -> longitude", longitude)
		// 	// this.setStorage({key : 'latitude' , value: JSON.stringify(latitude)})
		// 	// this.setStorage({key : 'longitude' , value: JSON.stringify(longitude)})

		// 	this.setStorage('latitude' , JSON.stringify(latitude))
		// 	this.setStorage('longitude' , JSON.stringify(longitude))
		//   },
		//  (error)=> {
		// 	console.error("Error Code = " + error.code + " - " + error.message);
		//   }
		// );
		Geolocation.getCurrentPosition().then((resp) => {
			let latitude = resp.coords.latitude
			let longitude = resp.coords.longitude 
			this.setStorage('latitude' , JSON.stringify(latitude))
			this.setStorage('longitude' , JSON.stringify(longitude))
			
			// resp.coords.latitude
			// resp.coords.longitude
		   }).catch((error) => {
			 console.log('Error getting location', error);
		   });
	  }

	internetConnect=()=>{
		axios.get('https://jsonplaceholder.typicode.com/todos/1')
		.then(res => {
			if(res.status === 200){
				this.setState({internetConnection : true})
			}else{
				this.setState({internetConnection : false})
			}
			//console.log("internetConnect -> res", res)
		}).catch(err=>{
        	console.log("internetConnect -> err", err)
		})
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
		  //await this.setStorage({ key: keyStore , value: valueStore });
		  this.setStorageItem(keyStore , valueStore)
		  console.log('set done')
		}catch{
		  return ''
		} 
	  };

	async componentDidMount() {
		this.internetConnect()
		this.getPosition() 
		let info = await Device.getInfo()
        console.log("info", info) 
		if(info.operatingSystem === 'ios'){
			 this.setState({
				 backRegister : 'block'
			 })
		} 
		let lang = localStorage.getItem('language');
		if(lang === null || lang === undefined){
			localStorage.setItem('language','th')
			this.setState({
				language : lang
			})
		}
	
		//https://atmobileappv2.attg.cc
		console.log("componentDidMount -> this.state.internetConnection", this.state.internetConnection)
		if(this.state.internetConnection === true){
			axios.post(api.https+ '/'+api.type+'/v'+api.version+'/index')
			.then(res=>{
				console.log(res)
				this.setState({
				//	contacts: res.data.contact ,  
					languages: res.data.language ,
					serverList: res.data.server, 
					serverVal : res.data.server[0].url,
					showText:   res.data.contact.showText
				},()=>console.log('languages -> ',this.state.languages))
				console.log("res.data.server", res.data.server)
				this.setStorage('domain',  res.data.url_realtime)
			 
				this.setState({
					serverVal : this.state.serverList[0].url,
				})

				if(res.data.server === [] || res.data.server.length === 0){
					this.setState({
						serverList: [{
							id: 1,
							name: "server1",
							url:  api.https
						}]
					})
				}
				if(res.data.language[0].image === null ){
					this.setState({
						languages: [
							{
								code:"th",
								file:"",
								image:"../assets/icon/th.png",
								name: "ไทย "
							},
							{
								code:"en",
								file:"",
								image:"../assets/icon/un.png",
								name: "อังกฤษ"
							},
						],
					})
				}
				this.setStorage('app-name', res.data.contact.name)
			}).catch(err=>{
				console.log("componentDidMount -> err", err)
				this.showAlertErr() 
			}) 
			
		}else if(this.state.internetConnection === false){
			alert('please chech internet connection')
		}
		

		this.setLanguage();
	 
		let language =await this.getStorage('language')
		let server = await this.getStorage('server')
		console.log('language ',language)
		if(language === null || language === undefined || language === ''){ 
			this.setStorage('language',  'th')
			this.setStorage('carID',  th.home.carList)
			this.setState({
				language : 'th'
			})
		}  
		if(server === undefined || server === null || server === ''){
			this.setState({serverVal: api.https})
			this.setStorage('server', api.https ) 
		}else{
			this.setState({serverVal : server}) 
			console.log('serverVal', this.state.serverVal)
		}
	
		const currentPath = window.location.pathname
		this.setState({currentPath : currentPath})
		  if(this.state.currentPath === '/'||this.state.currentPath === '/Login'){
			if (Capacitor.isNative === true) {
				window.addEventListener('IonBackButton',e =>{
					this.showToast()
					this.setState({countPressBack : this.state.countPressBack + 1})
					if(this.state.countPressBack === 2){
						window.document.exitFullscreen()
						//Plugins.App.exitApp()
					}
				})
				// Plugins.App.addListener('backButton', e => {
				// 	this.showToast()
				// 	this.setState({countPressBack : this.state.countPressBack + 1})
				// 	if(this.state.countPressBack === 2){
				// 		Plugins.App.exitApp()
				// 	}
					
				// })
			}
		  }

		let account = await this.getStorage('account');
		let user   = await  this.getStorage('username');
		let pass  = await  this.getStorage('password');
		lang = await  this.getStorage('language');
		lat = await  this.getStorage('latitude');
		lon = await  this.getStorage('longitude');

        console.log("componentDidMount -> account", account)
        console.log("componentDidMount ~ user", user)
        console.log("componentDidMount ~ pass", pass)

		// if(account.value === undefined|| account.value === null || account.value === 'undefined' || account.value === ""){
		// 	accountVal = ''  
		// 	usernameVal = ''
		// 	passwordVal = ''
		// } 
		
		this.setState({language: lang})
		var locate = {latitude : lat , longitude: lon}
		this.setState({location: locate})
        console.log("componentDidMount -> location", this.state.location)


		if(account !== '' || account !== undefined || account !== null || account !== 'undefined'){
			accountVal = account
			usernameVal = user
			passwordVal = pass
			this.textAccount.current.value = account 
			this.textUsername.current.value = user 
			this.textPassword.current.value = pass 

			this.setState({
				usernameValue: user ,
				passwordValue : pass,
				accountValue : account
			})
		}else if(account === '' || account === undefined || account === 'undefined' || account=== null){
			accountVal = ''  
			usernameVal = ''
			passwordVal = ''
			this.textAccount.current.value = ''
			this.textUsername.current.value = ''
			this.textPassword.current.value = ''
		}
		 

		// if(username.value !== '' || username.value !== undefined || username.value !== null || username.value !== 'undefined'){
		// 	usernameVal = username.value
		// 	this.textUsername.current.value = username.value
		// }else if(username.value === '' || username.value === undefined || username.value === 'undefined' || username.value=== null){
		// 	usernameVal = ''
		// 	this.textUsername.current.value = ''
		// }

		// if(password.value !== '' || password.value !== undefined || password.value !== null || password.value !== 'undefined'){
		// 	passwordVal = password.value
		// 	this.textPassword.current.value = password.value
		// }else if(password.value === '' || password.value === undefined || password.value === 'undefined' || password.value=== null){
		// 	passwordVal = ''
		// 	this.textPassword.current.value = ''
		// }

		if( user !== '' || user !== undefined || user !== null || user !== 'undefined'){
			usernameVal = username
			this.textUsername.current.value = user
		}else if(user === '' || user === undefined || user === 'undefined' || user=== null){
			usernameVal = ''
			this.textUsername.current.value = ''
		}

		if( pass !== '' || pass !== undefined || pass !== null || pass !== 'undefined'){
			passwordVal = pass 
			this.textPassword.current.value = pass 
		}else if(pass  === '' || pass === undefined || pass === 'undefined' || pass=== null){
			passwordVal = ''
			this.textPassword.current.value = ''
		}
		
		const token =await  this.getStorage('token')
		if(token !== '' && token !== undefined && token !== null){
			this.setState({redirect : true})
		}else 	if(token === '' && token === undefined && token === null){
			this.setState({redirect : false})
		}
	}
 

	changeLanguageTH = () => {
		this.setState({language: 'th'})
		
			l = th.Login
			title = l.title
			account = l.account
			username = l.username
			password = l.password
			btnLogin = l.login
			contact = l.contact
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			serverTitle = l.serverTitle
			server = l.selectServer
			version = l.version
			errConTitle= l.errConTitle
			errConMessage= l.errMessage
			remember = l.remember
			loading = l.loading
			ok = l.ok
			exitApp = l.exitApp 
		localStorage.setItem('language' , 'th')
		this.setStorage('carID' , th.home.carList) 
		console.log(this.state.language)

		this.refreshPage()
	}

	changeLanguageEN = () => {
	//	this.setState({language: '"en"'})
			l = en.Login
			title = l.title
			account = l.account
			username = l.username
			password = l.password
			btnLogin = l.login
			contact = l.contact
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			serverTitle = l.serverTitle
			server = l.selectServer
			version = l.version
			errConTitle= l.errConTitle
			errConMessage= l.errMessage
			remember = l.remember
			loading = l.loading
			ok = l.ok
			exitApp = l.exitApp
		localStorage.setItem('language' , 'en')
		this.setStorage('carID' , en.home.carList) 
		console.log(this.state.language)
		
		this.refreshPage()
	}

	setLanguage = async() => { 
		let  languag = await this.getStorage('language')
		console.log('languag ',languag) 
		let l
		if (languag === '"th"' || languag === 'th') {
			l = th.Login
			title = th.home.title
			account = l.account
			username = l.username
			password = l.password
			btnLogin = l.login
			contact = l.contact
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			serverTitle = l.serverTitle
			server = l.selectServer
			version = l.version
			errConTitle= l.errConTitle
			errConMessage= l.errMessage
			remember = l.remember
			loading = l.loading
			ok = l.ok
			exitApp = l.exitApp
		} else if (languag === '"en"' || languag === 'en') {
			l = en.Login
			title = en.home.title
			account = l.account
			username = l.username
			password = l.password
			btnLogin = l.login
			contact = l.contact
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			serverTitle = l.serverTitle
			server = l.selectServer
			version = l.version
			errConTitle= l.errConTitle
			errConMessage= l.errMessage
			remember = l.remember
			loading = l.loading
			ok = l.ok
			exitApp = l.exitApp
		} else if (languag === "" || languag === '""') {
			localStorage.setItem('language','th')
			this.setState({
				language : 'th'
			})
			l = this.state
			title = l.title
			account = l.account
			username = l.username
			password = l.password
			btnLogin = l.btnLogin
			contact = l.contact
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			serverTitle = l.serverTitle
			server = l.server
			version = l.version
			errConTitle= l.errConTitle
			errConMessage= l.errConMessage
			remember = l.remember
			loading = l.loading
			ok = l.ok
			exitApp = l.exitApp
		}
		this.setShowLoading()
	}

	rememberMe=(e:any)=>{
		console.log("TCL: rememberMe -> e.target.checked", e.target.checked)
		if(e.target.checked === true){
			rememberMe = true
			this.setStorage('account', this.state.accountValue );
			this.setStorage('username', this.state.usernameValue);
			this.setStorage( 'password', this.state.passwordValue);
            console.log("TCL: rememberMe -> rememberMe", rememberMe)

		}else if(e.target.checked === false){
			rememberMe = false
			this.setStorage( 'account','');
			this.setStorage('username','');
			this.setStorage('password', '');
			
            console.log("TCL: rememberMe -> rememberMe", rememberMe)
		}else{
			rememberMe = true
			this.setStorage('account',this.state.accountValue);
			this.setStorage( 'username', this.state.usernameValue);
			this.setStorage( 'password', this.state.passwordValue);
			
			console.log("TCL: rememberMe -> else ", rememberMe)
		}
		
	}
	
	serverChange = (e : any) => {

		console.log(e.target.value)
		let server =  e.target.value
		this.setState({
			serverVal : server
		})

		this.setStorage('server', server);
	}
	
	changeStateAccount=(e:any)=>{
		accountVal = e.target.value
		console.log("acc", e.target.value)
		this.setState({
			accountValue: e.target.value 
		},()=>{
			this.setStorage( 'account',this.state.accountValue);
		})
		
	}

	changeStateUsername=(e:any)=>{
		usernameVal = e.target.value
		console.log("user", e.target.value)
		this.setState({
			usernameValue: e.target.value
		},()=>{
			this.setStorage( 'username', this.state.usernameValue);
		})
		// this.setStorage({
		// 	key: 'username',
		// 	value:e.target.value
		// });
	}

	changeStatePassword=(e:any)=>{
		passwordVal = e.target.value
        console.log("pass", e.target.value)
		this.setState({
			passwordValue:e.target.value,
		},()=>{
			this.setStorage( 'password',this.state.passwordValue);
		})
		 
		// this.setStorage({
		// 	key: 'password',
		// 	value:e.target.value
		// });
	}


	render() {
		if (this.state.redirect === true) {
			return <Redirect to='/home' />
		}
		if (account === undefined || username === null || username === null) {
			l = this.state
			title = l.title
			account = l.account
			username = l.username
			password = l.password
			btnLogin = l.btnLogin
			contact = l.contact
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			serverTitle = l.serverTitle
			server = l.server
			version = l.version
			errConTitle= l.errConTitle
			errConMessage= l.errConMessage
			remember = l.remember
			loading = l.loading
			ok = l.ok
			exitApp = l.exitApp
		}
		return (
			<IonContent style={{backgroundColor:'#31beb6'}}>
				{/* <AlertSystemUpdate/> */}
				{/* <Locate/> */}
				<div className="loginColor " style={{backgroundImage:"url("+this.state.contacts.backgroud+")",
				backgroundRepeat:'no-repeat',backgroundSize:'cover',backgroundColor:'#fcfdfe',backgroundPosition:'bottom center' }}>

					<div style={{ display: this.state.backRegister ,minWidth:'1rem', minHeight:'1rem' , position:'fixed',top:'2.2rem', left:'2rem', fontSize:'1.3rem'}}>
						<IonRouterLink target="_self" routerDirection="back" href="/register">
							<IonIcon icon={arrowBack} color='light' />
						</IonRouterLink>
					</div>
					<div className="formBorder ion-text-center" style={{minHeight:'84vh',overflow:'hidden',paddingTop:'3%',}} >
					<img className="img_logo" src={this.state.contacts.logo} alt=""/>
							{/* <IonTitle className='ion-text-center teal'>{title}</IonTitle><br/> */}
					<form style={{marginTop:'3%'}}>
					{this.state.serverList.length > 1 ? 
						<div>
							<IonItem
							className="itemtop "
							style={{
							fontSize: '14px'
						}}>
							<IonLabel className="" style={{color:'#000', opacity:'3'}}>{server}</IonLabel>
							
								<IonSelect
									value={this.state.serverVal}
									interfaceOptions={customPopoverOptions}
									placeholder={server}
									onIonChange={(e:any)=>{this.setState({serverVal : e.target.value}); console.log(this.state.serverVal);
									this.setStorage('server',e.target.value) }}
									mode="ios"
									ref={this.serverValue}>
										{this.state.serverList.map((serverList,index)=>
										<IonSelectOption key={index} value={serverList.url} color='dark'> {serverList.name} </IonSelectOption>)}

								</IonSelect>
						</IonItem>
						<IonItem className="itemShadow"  >
							<IonLabel position="floating"  className='fontAthiti'>
								<h5 className="">{account}</h5>
							</IonLabel>

							<IonInput
								color='dark'
								required
								id="account"
								type="text"
								value={this.state.accountValue}
								ref={this.textAccount}
								//onIonChange={(e:any)=>this.changeStateAccount(e)}
								onKeyUp={(e)=>{ this.setState({accountValue:e.currentTarget.value})}}
								className="fontAthiti "></IonInput>
						</IonItem>
						</div>:
						<IonItem className="itemtop"  >
							<IonLabel position="floating"  className='fontAthiti'>
								<h5 className="">{account}</h5>
							</IonLabel>

							<IonInput
								color='dark'
								required
								id="account"
								type="text"
								value={this.state.accountValue}
								ref={this.textAccount}
								//onIonChange={(e:any)=>this.changeStateAccount(e)}
								onKeyUp={(e)=>{ this.setState({accountValue:e.currentTarget.value})}}
								className="fontAthiti "></IonInput>
						</IonItem>}
						<IonItem  className="itemShadow">
							<IonLabel position="floating" className='fontAthiti'>
								<h5 className="">{username}</h5>
							</IonLabel>

							<IonInput
								required
								id="username"
								type="text"
								value={ this.state.usernameValue}
								ref={this.textUsername}
								//onIonChange={(e:any)=>this.changeStateUsername(e)}
								onKeyUp={(e)=>{ this.setState({usernameValue:e.currentTarget.value})}}
								className="fontAthiti"></IonInput>
						</IonItem>

						<IonItem lines = 'none' className=" itemShadow itemBtm">
							<IonLabel position="floating">
								<h5 >{password}</h5>
							</IonLabel>
							<IonInput
								id="password"
								required
								value={this.state.passwordValue}
								type="password"
								ref={this.textPassword}
								//onIonChange={(e:any)=>this.changeStatePassword(e)}
								onKeyUp={(e)=>{ this.setState({passwordValue:e.currentTarget.value})}}
								className=""></IonInput>

						</IonItem>

						{/* <button
							className="btnLogin"
							type="button"
							onClick={(e : any) => this.Submit(e)}>
							{btnLogin}
						</button> */}
						<IonButton 
							color='dark'
							mode='ios'
							 className='btn-log'
							expand='block'
							type="button"
							onClick={(e : any) => this.Submit(e)}>
							{btnLogin}
						</IonButton>

						
						<div className='ion-text-center checkboxRemember '>
							<IonCheckbox mode='ios' checked={rememberMe} color="dark" className='checkRemember'  onIonChange={(e:any)=>this.rememberMe(e)}/> 
							<IonLabel color="dark" >&nbsp;&nbsp;{remember}</IonLabel>
						</div> 
					</form>
					
					
					<div className="ion-text-center login-footer" style={{fontSize:'1em' ,marginTop:'17%',minHeight:'11.7vh'}} >
					<IonRow>
						<IonCol size='12' className='ion-text-center'>
							<IonLabel color='dark'>{this.state.showText}</IonLabel>
						</IonCol>
					</IonRow> 
						<p className=" ion-text-center " style={{color:'#fcfdfe',marginBottom:'3px'}}> 
							{contact} : 
							{this.state.contacts.telephone.map((telephone)=>
								<a className='loginContactLink' key={telephone.number} href={'tel:'+telephone.number}>
									&nbsp;{telephone.number}</a>
							)}
							{/* <a className='loginContactLink' href={'tel:'+this.state.phonerFrst}>{this.state.phonerFrst}</a> / 
							<a className='loginContactLink'  href={'tel:'+this.state.phoneSecn}>{this.state.phoneSecn}</a> */}
						</p>

						<IonRow className='ion-align-items-center ion-justify-content-center'>
						{this.state.languages.map((languages,index)=>
							<IonCol size='1' key={index} className='ion-align-self-center ' >
								{languages.code  !== this.state.language ?
									<img
										width="100%"
										src={languages.image}
										alt=" "
										className='iconLang-disable'
										onClick={()=>{
											console.log('languages.code ' ,languages.code.slice(0,2))
											localStorage.setItem('language',languages.code.slice(0,2) ); 
											this.setLanguage();
											this.refreshPage();
										}}
									/>
								 :
									<img
										width="100%"
										src={languages.image}
										alt=" "
										onClick={()=>{
											console.log('languages.code ' ,languages.code.slice(0,2))
											localStorage.setItem('language',languages.code.slice(0,2) ); 
											this.setLanguage();
											this.refreshPage();
										}}
									/>
								 }
								
							</IonCol>
						)}
						</IonRow>
						
						<p style={{fontSize: "smaller " ,color:'#fcfdfe',marginTop:'0em'}}
						className="ion-text-center " >
						 {app.appVersion}
						</p>
						
					</div>
					</div> 
				
				</div>

				<IonAlert
					mode='ios'
					isOpen={this.state.showAlertFail}
					onDidDismiss={this.closeAlertFail}
					header={alertTitle}
					message={alertMessage}
					buttons={[ok]}
				/>
				<IonAlert
					mode='ios'
					isOpen={this.state.showAlertErr}
					onDidDismiss={this.closeAlertErr}
					header={errConTitle}
					message={errConMessage}
					buttons={[ok]}
				/>
				<IonLoading
					mode='ios'
					isOpen={this.state.showLoading}
					onDidDismiss={this.setCloseLoading}
					message={loading}
					duration={1000}/>
				<IonToast
					isOpen={this.state.showToast}
					onDidDismiss={() => this.closeToast()}
					message={exitApp}
					mode = 'ios'
					color='dark'
					cssClass='toast_exitApp'
					duration={2000}
				/>
			</IonContent>
		)
	}
}
export default Login;
