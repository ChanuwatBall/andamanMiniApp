import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonHeader,
	IonContent,
	IonMenuButton,
	IonBackButton,
	IonTitle,
	IonCard,
	IonIcon,
	IonRefresher,
	IonRefresherContent,
	IonLoading,
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import { alert } from 'ionicons/icons';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;
let title:any;

export default class appWarning extends React.Component{

	state={
		icons:
			{
				id : 1,
				icon: 'key',
				title: 'รหัสผ่าน',
				detail : 'เปลี่ยนรหัสผ่าน'
			},
		showLoading: true ,
		setShowLoading:true,
		title: "การแจ้งเตือน"
	}

	setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
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

	doRefresh =(event: CustomEvent)=> {
		console.log('กำลังโหลด');
	  
		setTimeout(() => {
		  console.log('โหลดสำเร็จ');
		  event.detail.complete();
		}, 2000);
	  }

	  setLanguage = async ()=>{
		const ret =await this.getStorage('language');
		const languag =JSON.stringify( ret || '{}')
		let l
		if (languag === '"th"'){
			l = th.alert
			title = l.title 
		} else if(languag === '"en"'){
			l = en.alert
			title = l.title 
		}
		
	}

	render(){
		if( title === undefined ){
			title = this.state.title 
		}
		this.setLanguage();
		return(
			<IonPage>
			<IonHeader className='nav-title' >
				<IonToolbar color='light'>
					<IonButtons>
							<IonBackButton color='light' defaultHref='/home'></IonBackButton>
								<IonTitle className="ion-text-center" color='primary' >{title}</IonTitle>	
							</IonButtons>
							<IonButtons slot="end">
								<IonMenuButton color='light' />
							</IonButtons>
				</IonToolbar>

			</IonHeader>
			<IonContent>
			<IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={300}>
				<IonRefresherContent></IonRefresherContent>
			</IonRefresher>
			<IonCard className="warning-card">
				<div className="warning-icon">
					<p><IonIcon icon={alert} style={{color:'red',fontSize:'30px'}}/></p>
				</div>
				<div className="warning-detail">
					<p><strong>จอดติดเครื่องนาน</strong><br/>
					<span style={{color:'#b0b2b3'}}>พนักงานขับรถ </span><br/>
						82-8025
					</p>
				</div>
				<div className="warning-right">
					<p>
					<span style={{color:'#b0b2b3'}}> เวลา :</span> 08:35 <br/>
					<span style={{color:'#b0b2b3'}}> วันที่ :</span> 82-8025
					</p>
				</div>
			</IonCard>
			<IonCard className="warning-card">
				<div className="warning-icon">
					<p><IonIcon icon={alert} style={{color:'red',fontSize:'30px'}}/></p>
				</div>
				<div className="warning-detail">
					<p><strong>จอดติดเครื่องนาน</strong><br/>
					<span style={{color:'#b0b2b3'}}>พนักงานขับรถ </span><br/>
						82-8025
					</p>
				</div>
				<div className="warning-right">
					<p>
					<span style={{color:'#b0b2b3'}}> เวลา :</span> 08:35 <br/>
					<span style={{color:'#b0b2b3'}}> วันที่ :</span> 82-8025
					</p>
				</div>
			</IonCard>
			<IonCard className="warning-card">
				<div className="warning-icon">
					<p><IonIcon icon={alert} style={{color:'red',fontSize:'30px'}}/></p>
				</div>
				<div className="warning-detail">
					<p><strong>จอดติดเครื่องนาน</strong><br/>
					<span style={{color:'#b0b2b3'}}>พนักงานขับรถ </span><br/>
						82-8025
					</p>
				</div>
				<div className="warning-right">
					<p>
					<span style={{color:'#b0b2b3'}}> เวลา :</span> 08:35 <br/>
					<span style={{color:'#b0b2b3'}}> วันที่ :</span> 82-8025
					</p>
				</div>
			</IonCard>
			
			</IonContent>	
			
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
};
