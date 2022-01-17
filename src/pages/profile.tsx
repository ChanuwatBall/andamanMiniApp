import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonBackButton,
	IonItem,
	IonHeader,
	IonContent,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
	IonButton,
	IonAlert,
	IonLoading,
	IonTitle,
	IonMenuButton,
	IonLabel,
	IonDatetime
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;
let title:any , name:any, phone:any, birthday:any, save:any, alertTitle:any, alertMessage:any;
export default class profile extends React.Component{

	state= {
		showModal :false ,
		setShowModal :false ,
		redirect : false,
		showAlertSuccess : false,
        setShowAlertSuccess :false,
        name: 'ชานุวัฒน์ ทองบุตร' ,
        phone : '090-0000000' ,
		birthday : '10-5-1997' ,
		showLoading: true, 
		setShowLoading:true ,
		title:"any" , 
		namePlc:"any", 
		phonePlc:"any",
		birthdayPlc:"any", 
		save:"any", 
		alertTitle:"any", 
		alertMessage:"any"
	}

	setShowModal=()=>{
		this.setState({
			showModal :true ,
			setShowModal :true 
		})
	}

	setCloseAlert=()=>{
		this.setState({
			showAlertSuccess : false,
        	setShowAlertSuccess :false,
		})
	}

	setCloseModal=()=>{
		this.setState({
			showModal :false ,
			setShowModal :false 
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
	changePassword=()=>{
		this.setState({
			showAlertSuccess : true,
			setShowAlertSuccess :true
		})
	}

	setLanguage = async ()=>{
		const ret = localStorage.getItem('language');
		const languag =JSON.stringify( ret || '{}')
		let l
		if (languag === '"th"'){
			l = th.profile
			title=l.title
			name= l.name
			phone=l.phone
			birthday=l.birthDay
			save=l.btnSave
			alertTitle= l.alertTitle
			alertMessage= l.alertMessage
		} else if(languag === '"en"'){
			l = en.profile
			title=l.title
			name= l.name
			phone=l.phone
			birthday=l.birthDay
			save=l.btnSave
			alertTitle= l.alertTitle
			alertMessage= l.alertMessage
		}	
  	}

	render(){
		this.setLanguage()
		if(title === undefined){
			const l = this.state
			title=l.title
			name= l.namePlc
			phone=l.phonePlc
			birthday=l.birthdayPlc
			save=l.save
			alertTitle= l.alertTitle
			alertMessage= l.alertMessage
		}	
		return(
			<IonPage>
			<IonHeader className='nav-title'>
						<IonToolbar >
							<IonButtons slot="start">
								<IonBackButton color="medium" defaultHref="/setting" />
							</IonButtons>

							<IonTitle className="ion-text-center">{title}</IonTitle> 
							<IonButtons slot="end">
								<IonMenuButton color='medium'  />
							</IonButtons>
						
						</IonToolbar>
				</IonHeader>
			<IonContent>
			<IonGrid>
		 <IonRow>
		  <IonCol size-sm="12" size-xs="12" size-md="12" size-lg="12" size-xl="12">
			<IonItem>

				<IonInput 
				required 
				type = "text"
				className="fontAthiti "
                placeholder={name}
                value={this.state.name}
			   // ref={this.currentPassword}
				>
				</IonInput>
			</IonItem>
			<IonItem>

				<IonInput 
				required 
				type = "text"
				className="fontAthiti "
                placeholder={phone}
                value={this.state.phone}
			  //  ref={this.newPassword}

				>
				</IonInput>
			</IonItem>
			<IonItem>
			  
				<IonInput 
				required 
				type = "text"
				className="fontAthiti "
                placeholder={birthday}
                value={this.state.birthday}
				//ref={this.confirmNewPassword}
			   
				>
				</IonInput>
			</IonItem>
			<IonItem>

			<IonLabel position="floating" >MM/DD/YYYY</IonLabel>
				<IonDatetime displayFormat="MM/DD/YYYY" min="1994-03-14" max="2012-12-09"></IonDatetime>
			</IonItem>
			<br/>
			
			<IonButton expand="block" mode='ios' onClick={this.changePassword}>
            {save}
          </IonButton>
		
		  </IonCol>
		 </IonRow>
		</IonGrid> 
			
		</IonContent>	
		<IonAlert
          isOpen={this.state.showAlertSuccess}
          onDidDismiss={this.setCloseAlert}
          header={alertTitle}
        
          message={alertMessage}
          buttons={['OK']}
        />
		 <IonLoading
		 	mode='ios'
            isOpen={this.state.showLoading}
            onDidDismiss={this.setCloseLoading}
            message={'Loading...'}
            duration={200}
          />
		</IonPage>
		)
	}
}
