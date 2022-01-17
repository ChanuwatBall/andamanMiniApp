import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonHeader,
	IonContent,
	IonMenuButton,
	IonBackButton,
	IonTitle,
	IonList,
	IonItem,
	IonLabel,
	IonModal,
	IonIcon,
	IonRefresher,
	IonRefresherContent,
	IonLoading,
	IonCol,
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import {  arrowForward ,newspaper , arrowDownCircle} from 'ionicons/icons';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;
let title:any;
export default class news extends React.Component{

	state={
		icons:
			{
				id : 1,
				icon: 'key',
				title: 'รหัสผ่าน',
				detail : 'เปลี่ยนรหัสผ่าน'
			},
		showModal:false ,
		setShowModal : false ,
		newTitle: 'BUS & TRUCK 2019' ,
		newsDetails: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet repellat aut vel at perferendis eos laborum consectetur quae, perspiciatis repudiandae quos, natus odit modi cum mollitia id fuga deserunt dolorum!',
		newUrl : 'http://www.google.com' ,
		showLoading: true ,
		setShowLoading:true,
	 	title: "ข่าวสาร"

	}
	setShowModal=()=>{
		this.setState({
			showModal:true ,
			setShowModal : true
		})
	}
	setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
		})
    }
	closeShowModal=()=>{
		this.setState({
			showModal:false ,
			setShowModal : false
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
		const languag =await this.getStorage('language'); 
		let l
		if (languag === '"th"'){
			l = th.news
			title = l.title 
		} else if(languag === '"en"'){
			l = en.news
			title = l.title 
		}
		
	}
	
	render(){
		this.setLanguage()
		if(title === undefined){
			title = this.state.title 
		}
		return(
			<IonPage>
			<IonHeader className='nav-title'>
				<IonToolbar color='light'>
					<IonButtons>
							<IonBackButton color='light' defaultHref='/home'></IonBackButton>
								  <IonTitle className="ion-text-center" color='primary' ><strong>{title}</strong></IonTitle>	
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
			<IonList >
				<IonItem onClick={this.setShowModal}>
					<IonCol size='2' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={newspaper}/>
					</IonCol>
					<IonCol size='9'>
						<IonLabel>{this.state.newTitle}</IonLabel>
					</IonCol>
					<IonCol size='1' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={arrowForward} mode='ios'/>
					</IonCol>
				</IonItem>
				<IonItem onClick={this.setShowModal}>
					<IonCol size='2' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={newspaper}/>
					</IonCol>
					<IonCol size='9'>
						<IonLabel>Mega Man X</IonLabel>
					</IonCol>
					<IonCol size='1' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={arrowForward} mode='ios'/>
					</IonCol>
				</IonItem>
				<IonItem onClick={this.setShowModal}>
					<IonCol size='2' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={newspaper}/>
					</IonCol>
					<IonCol size='9'>
						<IonLabel>The Legend of Zelda</IonLabel>
					</IonCol>
					<IonCol size='1' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={arrowForward} mode='ios'/>
					</IonCol>
				</IonItem>
				<IonItem onClick={this.setShowModal}>
					<IonCol size='2' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={newspaper}/>
					</IonCol>
					<IonCol size='9'>
						<IonLabel>Pac-Man</IonLabel>
					</IonCol>
					<IonCol size='1' style={{fontSize:'1.5rem'}}>
						<IonIcon color='primary' icon={arrowForward} mode='ios'/>
					</IonCol>
				</IonItem>
			</IonList>
			</IonContent>	
			<IonModal isOpen={this.state.showModal}>
				<div className={'closeNews-modal'}><IonIcon icon={arrowDownCircle} color='primary' onClick={this.closeShowModal}/></div>
				
				<div className='menu-item' style={{height:'100vh',backgroundImage:"url('../assets/images/new york.jpg')",backgroundRepeat:'no-repeat',backgroundSize:'cover'}} >
					<div  style={{height:'100vh',backgroundColor:'rgba(32,32,33,0.79)',paddingTop:'2rem'}}>
						<div style={{width:'100vw' ,height:'15vh',color:'#fff',padding:'2rem'}}>
							<h1 style={{marginBottom:'0',top:'0'}}>{this.state.newTitle}</h1>
							<IonLabel style={{fontSize:'0.8rem',marginTop:'0px',letterSpacing:'1px'}} color='primary'>Date 27/02/2563</IonLabel>
						</div>
						<div style={{padding:'2rem',height:'70vh', color:'#202021',backgroundColor:'#fff',borderTopLeftRadius:'30px',borderBottomRightRadius:'30px'}}>
							<IonLabel>{this.state.newsDetails}</IonLabel><br/><br/><br/>
							<IonLabel style={{fontSize:'0.8rem',marginTop:'3rem',paddingTop:'30px'}}>The post <a href={this.state.newUrl}>{this.state.newTitle}</a> appeared first on.</IonLabel>
						</div>
					</div>
					
					
				</div>


				{/* <IonButton onClick={this.closeShowModal}>Close Modal</IonButton> */}
			</IonModal>
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
