/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
	IonContent,
	IonItem,
	IonLabel,
	IonInput,
	IonAlert, 
	IonButton, 
	IonRow,
	IonCol,
	IonIcon,
	IonModal,
	IonTextarea
} from '@ionic/react';
import React from 'react';
import './style.css';
import {Redirect} from 'react-router-dom'; 
import { Device } from '@capacitor/device'; 
import { arrowBackCircle, logIn,   personAdd } from 'ionicons/icons';
 
class Register extends React.Component {
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
		redirectLogin: false ,
		showFormContact : false ,
		registerFail: 'none' ,
		alertSuccess : false , 
		contacts:{
			backgroud :"../assets/images/bg-01.png",
			color:"",
			line:{code:'',image:'',url:""},
			logo:'../assets/icon/logo.svg',
			name:'',
			telephone:[{number:'062-2450981'},{number:'062-2450982'}]
		},

		name:'',
		telephone:'',
		email:'',
		message:''
	}
	
	async componentDidMount(){
		let info = await Device.getInfo()
        console.log("info", info)

		if(info.operatingSystem === 'android'){
			this.setState({
				redirectLogin : true
			})
		}

		const token =  localStorage.getItem('token')
		if(token !== '' && token !== undefined && token !== null){
			this.setState({redirectLogin : true})
		}else 	if(token === '' && token === undefined && token === null){
			this.setState({redirectLogin : false})
		}
	}

	showFormContact=(e:any)=>{
		this.setState({
			showFormContact :e 
		})
	}

	register=()=>{
		console.log(this.state.name)
		console.log(this.state.telephone)
		console.log(this.state.email)
		console.log(this.state.message)

		// axios.post(api.https+ '/'+api.type+'/v'+api.version+'/register',{
		// 	name : this.state.name ,
		// 	telephone : this.state.telephone ,
		// 	email : this.state.email ,
		// 	message : this.state.message
		// }).then( res => {
		// 	console.log(res)
		// }).catch(err =>{
		// 	console.log(err)
		// 	this.setState({
		// 		registerFail : 'block'
		// 	})
		// })
		this.alertSuccess(true)
	}

	alertSuccess=(e:any)=>{
		this.setState({
			alertSuccess : e
		})
	}

	render() {
		 if(this.state.redirectLogin === true){
			 return <Redirect to='/Login' />
		 }
		return (
		<IonContent style={{backgroundColor:'#31beb6'}}>
			<div className="loginColor " style={{backgroundImage:"url("+this.state.contacts.backgroud+")",backgroundRepeat:'no-repeat',backgroundSize:'cover',backgroundColor:'#fcfdfe' }}>
				<IonRow  style={{paddingTop:'2rem'}} >
					<IonCol size='12' className='ion-text-center'>
						<img src={this.state.contacts.logo} width='28%' className='img_logo' alt='' />
					</IonCol>
				</IonRow>


				<form style={{marginTop:'15vh', padding:'1.5rem'}}>
					<IonButton
						color='primary'
						mode='ios'
						expand='block'
						type="button"
						style={{marginBottom:'1rem'}}
						onClick={()=>{this.setState({redirectLogin : true })}}
					>
						<IonIcon icon={logIn} mode='md' />
						<IonLabel> &nbsp;เข้าสู่ระบบ / Sign in</IonLabel>
					</IonButton>

					<IonButton
						color='dark'
						mode='ios'
						expand='block'
						type="button"
						onClick={()=>{this.showFormContact(true)}}
					>
						<IonIcon icon={personAdd} mode='md' />
						<IonLabel> &nbsp;สมัครใช้บริการ / Register </IonLabel>
					</IonButton>
				</form>
				<IonModal isOpen={this.state.showFormContact} onDidDismiss={()=>this.showFormContact(false)} cssClass="modal-form-contact">
					<div className='modal-form-contact-content'  style={{backgroundImage:"url("+this.state.contacts.backgroud+")",height:'100%' }}  >
						
						<IonRow >
							<IonCol size='12' className='ion-text-center'>
								<img src={this.state.contacts.logo} width='40%'  alt='' />
							</IonCol>
						</IonRow>

					<form className='' style={{marginTop:'3%'}}>
						<IonRow onClick={()=>{this.showFormContact(false)}}> 
							<IonCol size='1' className='ion-text-center set-center' style={{fontSize:'1.6em', padding:'.5em'}} >
								<IonIcon icon={arrowBackCircle} color='dark'   />
							</IonCol>
							<IonCol size='10' style={{paddingLeft: '1rem', display:'flex',flexDirection:'row' ,alignItems:'center'}} > 
								<IonLabel color='dark'>สมัครใช้บริการ  / Register </IonLabel> 
							</IonCol>
						</IonRow>

						<IonItem   color='transparent'  >
							<IonLabel position="floating"  ><small> ชื่อ / Name </small></IonLabel>
							<IonInput type="text" value={this.state.name} onIonChange={(e:any)=>{this.setState({name: e.detail.value! })}}></IonInput>
						</IonItem>
						<IonItem   color='transparent' >
							<IonLabel position="floating"  ><small> หมายเลขโทรศัพท์ / Phone Number </small></IonLabel>
							<IonInput type="tel" maxlength={10} value={this.state.telephone} onIonChange={(e:any)=>{this.setState({telephone: e.detail.value! })}}></IonInput>
						</IonItem>
						<IonItem  color='transparent' >
							<IonLabel position="floating"  ><small> อีเมลล์ / Email </small></IonLabel>
							<IonInput type="email" value={this.state.email} onIonChange={(e:any)=>{this.setState({email: e.detail.value! })}}></IonInput>
						</IonItem>
						<IonItem  color='transparent' >
							<IonLabel position="floating"  ><small> ข้อความ / Message </small></IonLabel>
							<IonTextarea   value={this.state.message} onIonChange={(e:any)=>{this.setState({message: e.detail.value! })}}></IonTextarea>
						</IonItem>

						<IonButton
							style={{marginTop:'1.5rem'}}
							color='primary'
							mode='ios'
							expand='block'
							type="button"
							onClick={()=>{this.register()}}
						> 
							<small> &nbsp;สมัครใช้บริการ / Register </small>
						</IonButton>
						
						<IonRow >
							<IonCol size='12'  style={{textAlign:'center', display: this.state.registerFail}} >
								<small style={{color:'#f56056'}} > สมัครใช้บริการไม่สำเร็จ : Register failed </small>
							</IonCol>
						</IonRow>
					</form>
					
					</div>
				</IonModal>
			</div> 
			<IonAlert
			mode='ios'
			isOpen={this.state.alertSuccess}
			onDidDismiss={() =>this.alertSuccess(false)} 
			header={'การสมัครใช้บริการ'} 
			message={'ส่งข้อมูลสมัครใช้บริการเรียบร้อย'}
			buttons={[
				{
					text: 'ตกลง', 
					cssClass: 'secondary',
					handler: blah => {
					  console.log('Confirm Cancel: blah');
					  this.setState({
						name:'',
						telephone:'',
						email:'',
						message:''
					 })
					}
				},
			]}
			/>
		</IonContent>
		)
	}
}
export default Register;
