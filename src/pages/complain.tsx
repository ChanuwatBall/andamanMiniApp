import {
	IonButtons,
	IonPage,
	IonToolbar,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
	IonMenuButton,
	IonBackButton,
	IonTitle,
	IonAlert,
	IonTextarea,
	IonLoading,
	IonLabel,
	IonInput
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import { Redirect } from 'react-router';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";
import axios from 'axios'
import api from '../api.json'

const { Storage } = Plugins;
let title:any , name:any , phone:any , message:any , send:any , alertTitle:any , alertMessage:any, errWarning:any ;
let loading:any , ok:any, messageTitle:any ;

export default class complain extends React.Component{
	
	
	title:any;
	messageBox:any
	name:any;
	telephone:any;

	constructor(props : any, private geolocation : Geolocation) {
		super(props);
		this.messageBox = React.createRef();
		this.title = React.createRef();
		this.name = React.createRef();
		this.telephone = React.createRef();
	}

	state= {
		redirect : false,
		showAlertSuccess : false,
		setShowAlertSuccess :false,
		showLoading: false ,
		setShowLoading:false,
		localLang:'th',
		messageDetails:"",
		title:"ติดต่อเรา" , 
		messageTitle: "เรื่อง",
		name:"ชื่อ" , 
		phone:"เบอร์โทรติดต่อกลับ" , 
		message:"รายละเอียด" , 
		telephone:"เบอร์โทรติดต่อกลับ",
		send:"ส่ง" , 
		alertTitle:"สำเร็จ" , 
		alertMessage:"ส่งข้อความสำเร็จ" ,
		showWarning:'none',
		errWarning:"โปรดระบุข้อมูลให้ครบถ้วน ก่อนส่งข้อความ !! ",
		loading:"กำลังโหลด...",
		ok:"ตกลง"
	}
	showAlertSuccess=()=>{
		this.setState({
			showAlertSuccess : true,
			setShowAlertSuccess :true
		})
	}
	
	closeAlertSuccess=()=>{
		this.setState({
			showAlertSuccess : false,
			setShowAlertSuccess :false
		})
	}

	setShowLoading=()=>{
		this.setState({
		  showLoading :true ,
		  setShowLoading:true
		})
	}

	setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
		})
	}

	goToMap =()=>{
		this.setState({
			redirect : true
		})
	}

	componentDidMount(){
		this.setLanguage()
		// if (Capacitor.isNative) {
		// 	Plugins.App.addListener('backButton', e => {
		// 		this.goBack()
		// 	})
		// }
	}

	sendMessage= async ()=>{
		const apiHost = localStorage.getItem('api')
		const lang = localStorage.getItem( 'language')
		const token = localStorage.getItem('token')
		const userId = localStorage.getItem('userId')
		const account= localStorage.getItem('account')
		const username = localStorage.getItem( 'username')

		axios.post(`${apiHost}/contact` ,{
			title: this.title.current,
			details: this.messageBox.current ,
			name: this.name.current,
			telephone: this.telephone.current,
		  } ,{
			headers: {
				"token" : token ,
			 	"authenication" : api.authorization,
				"userid": userId ,
				"account": account,
				"username": username,
				"version":api.version
			}		
		  })
		  .then(res => {
			console.log(res)
			// if(this.state.showLoading === false){
			// 	setTimeout(() =>{  },2000)
			// }
			if(res.data.status === 1){
				this.showAlertSuccess()
			}else{
				this.setState({
					showWarning : 'block'
				})
			}
			
		  }).catch(err => {
			  console.log(err)
			  this.setState({
				showWarning : 'block'
			})
		  })
	}

	onSubmit=(e:any)=>{
		e.preventDefault()
		// if(this.messageBox.current.value !== '' &&this.messageBox.current.value !== null && this.messageBox.current.value !== undefined){
		// 	this.setShowLoading()
		// 	this.sendMessage()

		// 	console.log(this.state.messageDetails)
		// 	this.setState({
		// 		showWarning : 'none'
		// 	})
		// }else{
		// 	this.setState({
		// 		showWarning : 'block'
		// 	})
		// }
		let messageLength = this.messageBox.current.value.length

		if(this.telephone.current.value !== '' && this.telephone.current.value !== null && this.telephone.current.value !== undefined){
			if(this.messageBox.current.value !== '' &&this.messageBox.current.value !== null && this.messageBox.current.value !== undefined){
				if(messageLength >= 5){
					this.setShowLoading()
					this.sendMessage()
					console.log(this.state.messageDetails)
					this.setState({
						showWarning : 'none'
					})
				}else if(messageLength < 5){
					if(this.state.localLang === 'th'){
						errWarning = 'รายละเอียดต้องมีมากกว่า 5 ตัวอักษร !!'
						this.setState({
							showWarning : 'block'
						})
					}else if(this.state.localLang === 'en'){
						errWarning = 'Details box must enter more then 5 character !!'
						this.setState({
							showWarning : 'block'
						})
					}
				}
			}else{
				this.setState({
					showWarning : 'block'
				})
			}
			
		}else{
			this.setState({
				showWarning : 'block'
			})
		}

	}

	setLanguage = async ()=>{
		let languag = localStorage.getItem('language');
		let l
		this.setState({
			localLang : languag
		})

		if (languag === '"th"' || languag === 'th'){
			l = th.contact
			title = l.title 
			messageTitle = l.inputTitle
			name = l.name
			phone = l.phone
			message =l.message
			send = l.btnSend
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			errWarning = l.errWarning
			loading = l.loading
			ok = l.ok

		} else if(languag === '"en"' || languag === 'en'){
			l = en.contact
			title = l.title 
			messageTitle = l.inputTitle
			name = l.name
			phone = l.phone
			message =l.message
			send = l.btnSend
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			errWarning = l.errWarning
			loading = l.loading
			ok = l.ok
		}

		if(title === undefined){
			const l = this.state
			title = l.title 
			messageTitle = l.messageTitle
			name = l.name
			phone = l.phone
			message =l.message
			send = l.send
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			errWarning = l.errWarning
			loading = l.loading
			ok = l.ok
		}
		this.setShowLoading()
	}
	render(){
		if (this.state.redirect === true) {
			return <Redirect to='/map' />
		  }
		 // this.setLanguage()
		  if(title === undefined){
			const l = this.state
			title = l.title 
			messageTitle = l.messageTitle
			name = l.name
			phone = l.phone
			message =l.message
			send = l.send
			alertTitle = l.alertTitle
			alertMessage = l.alertMessage
			errWarning = l.errWarning
			loading = l.loading
			ok = l.ok
		}
		
		return(
			<IonPage>
				<IonHeader className='nav-title'>
					<IonToolbar style={{backgroundColor:'#fff'}} >
						<IonButtons>
							<IonBackButton color='primary'  defaultHref='/home' text=''></IonBackButton>
								<IonTitle color='primary' className="ion-text-center" ><strong>{title}</strong></IonTitle>
									</IonButtons>
									<IonButtons slot="end" color='primary'>
								<IonMenuButton  color='primary'/>
							</IonButtons>
					</IonToolbar>
				</IonHeader>
			<IonContent>
            <IonGrid>
		 <IonRow>
		  <IonCol size="12" >
			<form style={{padding:'0px', margin:'0px'}}>

				<div className="dateBox">
					<IonInput
						style={{paddingLeft:'.5rem'}}
						ref={this.title}
						color='medium'
						placeholder={messageTitle}>
					</IonInput>
				</div>

				<div className="dateBox">
					<IonTextarea
						ref={this.messageBox}
						onIonChange={(e:any)=>this.setState({messageDetails : e.target.value})}
						rows={5}
						required={true} 
						maxlength={500}
						minlength={5}
						color='medium' 
						placeholder={message}>
					</IonTextarea>
				</div>

				<div className="dateBox">
					<IonInput
						ref={this.name}
						color='medium' 
						placeholder={name}>
					</IonInput>
				</div>

				<div className="dateBox">
					<IonInput
						type="number"
						maxlength={10}
						max="10"
						minlength={10}
						min="10"
						ref={this.telephone}
						color='medium' 
						placeholder={phone}>
						</IonInput>
				</div>

				<IonButton 
					type='button'
					mode='ios' 
					style={{margin:'10px',marginTop:'1rem'}} 
					expand="block"
					onClick={(e:any)=>this.onSubmit(e)} >
					{send}
				</IonButton>
			</form>

			<IonLabel 
				color='danger'
				style={{display: this.state.showWarning,margin:'1rem',fontSize:'0.8em',letterSpacing:'1px'}} 
				className='ion-text-center'>
				{errWarning}
			</IonLabel>

		  </IonCol>
		 </IonRow>
		</IonGrid> 
		 
		</IonContent>
		<IonAlert
			mode='ios'
        	isOpen={this.state.showAlertSuccess}
        	onDidDismiss={this.closeAlertSuccess}
        	header={alertTitle}
        	message={alertMessage}
			//buttons={['ตกลง']}
			buttons={[
				{
				  text:ok,
				  handler: () => {
					console.log('Message already send');
					this.messageBox.current.value = ''
					this.title.current.value =''
					this.name.current.value =''
					this.telephone.current.value =''
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
		</IonPage>
		)
	}
}
