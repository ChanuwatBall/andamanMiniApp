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
	IonTitle,
	IonBackButton,
    IonInput,
    IonTextarea,
    IonButton,
	IonAlert,
	IonLoading
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import en from '../en.json';
import th from '../th.json'; 
import ListCar from '../components/listCar';  

  let title:any , carID:any , name:any , nameEnter:any , driver:any , driverEnter:any, phone:any , phoneEnter:any, message:any , messageEnter:any , save:any;
  let alertSucTitle:any, alertSucMessage:any , alertFailTitle:any , alertFailMessage:any ; 
export default class deviceSetting extends React.Component{

	state= {
		redirect : false,
		selectedOption: null,
		showAlertSuccess : false,
		setShowAlertSuccess :false,
		showAlertFail : false,
		setShowAlertFail :false,
		showLoading: true ,
		setShowLoading:true,
		title:"ตั้งค่าอุปกรณ" , 
		carID:"ทะเบียนรถ" , 
		carSelect:"เลือกรถ" , 
		name:"ชื่อ" ,
		nameEnter:"พิมพ์ชื่อ" , 
		driver:"ชื่อผู้ขับขี่" , 
		driverEnter:"พิมพ์ชื่อผู้ขับขี่", 
		phone:"เบอร์โทรศัพท์" , 
		phoneEnter:"พิมพ์เบอร์โทรศัพท์", 
		message:"ข้อมูลอื่นๆ" , 
		messageEnter:"ข้อมูลอื่นๆ" , 
		save:"บันทึก",
		alertSucTitle:"สำเร็จ", 
		alertSucMessage:"ตั้งค่าอุปกรณ์สำเร็จ" , 
		alertFailTitle:"ไม่สำเร็จ" ,
		alertFailMessage:"ไม่สามารถตั้งค่าอุปกรณ์ โปรดระบุข้อมูลให้ครบถ้วน" 
	}

	inputName:any;
	inputDriver:any;
	inputPhone:any;
	inputOther:any;

	constructor(props:any) {
		super(props);
		
		this.inputName = React.createRef()
		this.inputDriver = React.createRef()
		this.inputPhone = React.createRef()
		this.inputOther = React.createRef()
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

	handleChange = (selectedOption: any) => {
		this.setState(
		  { selectedOption },
		  () => console.log(`Option selected:`, this.state.selectedOption)
		);
	  };
	  
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
	showAlertFail=()=>{
		this.setState({
			showAlertFail : true,
			setShowAlertFail :true
		})
	}
	setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
		})
    }
	closeAlertFail=()=>{
		this.setState({
			showAlertFail : false,
			setShowAlertFail :false
		})
	}

	setLanguage = async ()=>{
		const languag =await this.getStorage('language'); 
		console.log('languag ', languag)
		let l
		if (languag === '"th"' || languag === 'th'){
			l = th.deviceSetting
			title = l.title 
			carID = l.carID
			//carSelect =l.carSelect
			name = l.name
			nameEnter =l.nameEnter
			driver = l.driver
			driverEnter= l.driverEnter
			phone = l.phone
			phoneEnter = l.phoneEnter
			message = l.message
			messageEnter = l.messageEnter
			save = l.btnSave
			alertSucTitle =l.alertSucTitle
			alertSucMessage = l.alertSucMessage
			alertFailTitle = l.alertFailTitle
			alertFailMessage= l.alertFailMessage
		} else if(languag === '"en"' || languag === 'en'){
			l = en.deviceSetting
			title = l.title 
			carID = l.carID
			//carSelect =l.carSelect
			name = l.name
			nameEnter =l.nameEnter
			driver = l.driver
			driverEnter= l.driverEnter
			phone = l.phone
			phoneEnter = l.phoneEnter
			message = l.message
			messageEnter = l.messageEnter
			save = l.btnSave
			alertSucTitle =l.alertSucTitle
			alertSucMessage = l.alertSucMessage
			alertFailTitle = l.alertFailTitle
			alertFailMessage= l.alertFailMessage
		}
		
	}

	submit=()=>{
		if(this.inputName.current.value !== '' || this.inputDriver.current.value !== '' || this.inputPhone.current.value !== '' || this.inputOther.current.value !== ''){
			this.showAlertSuccess()
		}else if(this.inputName.current.value === '' || this.inputDriver.current.value === '' || this.inputPhone.current.value === '' || this.inputOther.current.value === ''){
			this.showAlertFail()
		}
		
	}
	render(){
		this.setLanguage();
		
		if(title === undefined){
			const l = this.state
			title = l.title 
			carID = l.carID
			//carSelect =l.carSelect
			name = l.name
			nameEnter =l.nameEnter
			driver = l.driver
			driverEnter= l.driverEnter
			phone = l.phone
			phoneEnter = l.phoneEnter
			message = l.message
			messageEnter = l.messageEnter
			save = l.save
			alertSucTitle =l.alertSucTitle
			alertSucMessage = l.alertSucMessage
			alertFailTitle = l.alertFailTitle
			alertFailMessage= l.alertFailMessage
		}
		return(
			<IonPage>
			<IonHeader  className='nav-title'>
						<IonToolbar color='dark' >
							<IonButtons>
								<IonBackButton color='light'  defaultHref='/home'></IonBackButton>
									<IonTitle className="ion-text-center" color='primary' >{title}</IonTitle>	
							</IonButtons>
							<IonButtons slot="end">
								<IonMenuButton color='light'  />
							</IonButtons>
						</IonToolbar>
				</IonHeader>
			<IonContent>
            <IonGrid>
		 <IonRow>
		  
           <IonCol size-sm="12" size-xs="12" size-md="12" size-lg="12" size-xl="12">
			<IonLabel style={{margin:"10px"}}>{name}</IonLabel><br/>
		  	<div className="dateBox">
                <IonInput color='dark' placeholder={nameEnter} ref={this.inputName}></IonInput>
            </div>

			<IonLabel style={{margin:"10px"}}>{driver}</IonLabel><br/>
		  	<div className="dateBox">
                <IonInput color='dark' placeholder={driverEnter}  ref={this.inputDriver}></IonInput>
            </div>	
		<IonLabel style={{margin:"10px"}}>{phone}</IonLabel><br/>
		  	<div className="dateBox">
                <IonInput color='dark' placeholder={phoneEnter}  ref={this.inputPhone}></IonInput>
            </div>
		<IonLabel style={{margin:"10px"}}>{message}</IonLabel><br/>
		  	<div className="dateBox">
                <IonTextarea color='dark' placeholder={messageEnter}  ref={this.inputOther}></IonTextarea>
            </div>
		</IonCol>
			<IonCol size="12" style={{marginBottom:"10px"}}>
			<IonLabel >{carID}</IonLabel><br/>
				<div style={{marginTop: '10px'}}>
					{/* <Select
						value={selectedOption}
						onChange={this.handleChange}
						options={options}
						placeholder={carSelect}
					/> */}
					<ListCar/>
				</div>
           </IonCol>
		   <IonCol size="12">
				<IonButton mode='ios' expand="block" onClick={this.submit} >
					<IonLabel>{save}</IonLabel>
				</IonButton>
			</IonCol>
		 
		 </IonRow>
		
		
		</IonGrid> 
			
			</IonContent>
		<IonAlert
          isOpen={this.state.showAlertSuccess}
          onDidDismiss={this.closeAlertSuccess}
          header={alertSucTitle}
          message={alertSucMessage}
          buttons={['OK']}
        />
		<IonAlert
          isOpen={this.state.showAlertFail}
          onDidDismiss={this.closeAlertFail}
          header={alertFailTitle}
          message={alertFailMessage}
          buttons={['OK']}
        />
		<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={this.setCloseLoading}
			message={'Loading....'}
			duration={100}
		    />
		
		</IonPage>
		)
	}
}
