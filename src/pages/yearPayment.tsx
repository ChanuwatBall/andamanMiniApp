import {
	IonButtons,
	IonPage,
	IonToolbar,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
	IonMenuButton,
	IonLabel,
	IonDatetime,
	IonTitle,
	IonBackButton,
	IonButton,
	IonAlert,
	IonLoading
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";
import ListCar from '../components/listCar';

const { Storage } = Plugins;

let title:any , date:any , carID:any , note:any , send:any , alertTitle:any , alertMeassage:any  ;
export default class yearPayment extends React.Component{

	carNumber: any;

	constructor(props:any) {
		super(props);
		
		this.carNumber = React.createRef()
	   }
	state= {
		showModal :false ,
		setShowModal :false ,
		redirect : false,
        selectedOption: null,
		files: [],
		showAlertSuccess :false,
		setShowAlertSuccess:false,
		showAlertFail :false,
		setShowAlertFail:false,
		showLoading: true ,
		setShowLoading:true,
	}

	handleChange = (selectedOption: any) => {
		this.setState(
		  { selectedOption },
		  () => console.log(`Option selected:`, this.state.selectedOption)
		);
	  };
	  
	submit=(e:any)=>{
		if(e.target.value !== '' || e.target.value !== null){
			this.showAlertSuccess()
			console.log(e.target.value)
		}else if(e.target.value === '' || e.target.value === null){
			this.showAlertFail()
			console.log(e.target.value)
		}
	}
	showAlertFail=()=>{
		this.setState({
			showAlertFail : true,
			setShowAlertFail :true
		})
	}
	closeAlertFail=()=>{
		this.setState({
			showAlertSuccess : false,
			setShowAlertSuccess :false
		})
	}
	setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
		})
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
	
	
    fileSelectedHandler = (e:any) => {
        this.setState({ files: [...this.state.files, ...e.target.files] })
	  }
	setLanguage = async ()=>{
		const ret = localStorage.getItem( 'language');
		const languag =JSON.stringify( ret || '{}')
		let l
		if (languag === '"th"'){
			l = th.yearPayment
			title = l.title 
			date = l.date
			carID = l.carID
			//carSelect = l.carSelect
			note = l.note
			send =l.btnSend
			alertTitle = l.alertTitleSuc
			alertMeassage = l.alertMessageSuc
			//Loading = l.Loading
			//alertOK= l.alertOK
		} else if(languag === '"en"'){
			l = en.yearPayment
			title = l.title 
			date = l.date
			carID = l.carID
			//carSelect = l.carSelect
			note = l.note
			send =l.btnSend
			alertTitle = l.alertTitleSuc
			alertMeassage = l.alertMessageSuc
			//Loading = l.Loading
			///alertOK= l.alertOK
		}
		
	}

	render(){
		this.setLanguage();
		return(
			<IonPage>
			<IonHeader className='nav-title'>
						<IonToolbar color='light'>
							<IonButtons>
								<IonBackButton color='light' defaultHref='/home'></IonBackButton>
								<IonTitle className="ion-text-center" color='primary' ><strong>{title}</strong></IonTitle>	
							</IonButtons>
							<IonButtons slot="end">
								<IonMenuButton color='light'/>
							</IonButtons>
						</IonToolbar>
				</IonHeader>
			<IonContent>
            <IonGrid>
		 <IonRow>
		  <IonCol size-sm="12" size-xs="12" size-md="12" size-lg="12" size-xl="12">
			<IonLabel style={{margin:"10px"}}>{date}</IonLabel><br/>
		  		<div className="dateBox">
                    <div style={{float:"left"}} className="dateLabel">
                        <IonLabel color='medium'><h6> {date}</h6></IonLabel>
                    </div>
                        <div style={{float:'right',color:'#666666'}} className="dateItem">
                        <IonDatetime 
						id ="dateEnd"
						value="9-1-2020"
                        displayFormat="D/MM/YYYY" >
							
                        </IonDatetime>
                        </div>
                </div>
		  	
			<IonLabel style={{margin:"10px"}}>{carID}</IonLabel><br/>
				<div style={{marginTop: '10px'}}>
					<ListCar/>
				</div>
			<br/>
				<p>**{note}**</p>
				
            <input type="file" multiple className="custom-file-input" onChange={this.fileSelectedHandler}  />
			<IonButton mode='ios' expand='block' style={{marginTop:'20px'}} onClick={(e:any)=>this.submit(e)} >{send}</IonButton>
		  </IonCol>
		 </IonRow>
		</IonGrid> 
		</IonContent>
		<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={this.setCloseLoading}
			message={'Loading....'}
			duration={500}
		/>
		<IonAlert
          isOpen={this.state.showAlertSuccess}
          onDidDismiss={this.closeAlertSuccess}
          header={alertTitle}
          message={alertMeassage}
		  buttons={['OK']}
        />
		<IonAlert
          isOpen={this.state.showAlertFail}
          onDidDismiss={this.closeAlertFail}
          header={'บันทึกไม่สำเร็จ'}
          message={'กรุณาเพิ่มบันทึกข้อมูลให้ครบถ้วน'}
          buttons={['ตกลง']}
        />
		</IonPage>
		)
	}
}
