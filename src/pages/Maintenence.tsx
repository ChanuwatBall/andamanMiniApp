import { IonBackButton, IonButtons, IonCol,  IonContent,  IonHeader,  IonIcon,IonMenuButton,IonPage, IonRow,  IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import { addCircleOutline, document, home, list, logOut, timer } from 'ionicons/icons';
import React from 'react';
import { Redirect } from 'react-router-dom';
import './style.css';
import SearchCar from '../components/SearchCar'
import Scheduled from '../components/Scheduled'
import ReportMantain from '../components/ReportMantainnance'
import AddMaintanace from '../components/AddMaintanace'
import FloatQuesion from '../components/FloatQuesion'
import th from '../th.json'
import en from '../en.json'
import { Plugins , Capacitor } from "@capacitor/core";

const { Storage } = Plugins;
let moment = require ('moment')
moment().format()

export default class Home extends  React.Component {

  state={
    title: 'ซ่อมบำรุง',
    dateToday: '',
    redirect: false ,
    menuValue: 'home', 

		maintenenceTitle : "ซ่อมบำรุง" ,
		addMainteneceTitle : "เพิ่มการซ่อม",
		scheduledTitle : "กำหนดการซ่อม",
		reportTitle : "รายงาน",

    carlist: [
      {
        id : 2158, 
        vehicle:'30-5121 บจ',
        scheduled : false ,
      },
      {
        id : 2187, 
        vehicle:'30-5874 นร',
        scheduled : true ,
      },
      {
        id : 2268, 
        vehicle:'30-5136 ตต',
        scheduled : true ,
      }
    ]
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

  changeLanguage=async()=>{
    let lang = await this.getStorage('language')
    console.log(lang)
     if(lang === 'th'){
      let t = th.maintenence
      this.setState({
        maintenenceTitle : t.maintenenceTitle ,
        addMainteneceTitle : t.addMainteneceTitle ,
        scheduledTitle : t.scheduledTitle ,
        reportTitle : t.reportTitle,
      })
     }else if(lang === 'en'){
      let t = en.maintenence
      this.setState({
        maintenenceTitle : t.maintenenceTitle ,
        addMainteneceTitle : t.addMainteneceTitle ,
        scheduledTitle : t.scheduledTitle ,
        reportTitle : t.reportTitle,
      })
     }
  }

  logout=()=>{
    this.setState({
      redirect : true
    })
  }

  componentDidMount(){
    this.setState({
      dateToday : moment().format('dddd DD , MM YYYY')
    })
  

    this.changeLanguage()
  }
 
  searchCar=(vehicle:any)=>{
    console.log(vehicle)
  }

  render(){
    if(this.state.redirect === true ){
      return <Redirect to='/login' />
    }
    return(
      <IonPage>
        <FloatQuesion/>
        <IonHeader  className='nav-title'>
			<IonToolbar  >
				<IonButtons>
					<IonBackButton  defaultHref='/home' color='primary' text={this.state.maintenenceTitle}></IonBackButton>
						{/* <IonTitle className="ion-text-center" >{this.state.title}</IonTitle>	 */}
						</IonButtons>
						<IonButtons slot="end">
					<IonMenuButton  />
				</IonButtons>
			</IonToolbar>
		</IonHeader>
        <IonContent>
            <IonSegment  scrollable onIonChange={(e )=> this.setState({menuValue: e.detail.value})} style={{marginTop:'1rem',marginLeft:'.5rem',marginRight:'.5rem'}} value={this.state.menuValue}>
              <IonSegmentButton style={{padding:'.5rem'}} value="home">
                <IonIcon icon={list} />
                <small>{this.state.maintenenceTitle}</small>
              </IonSegmentButton>
              <IonSegmentButton style={{padding:'.5rem'}} value="add">
                <IonIcon icon={addCircleOutline} />
                <small>{this.state.addMainteneceTitle}</small>
              </IonSegmentButton>
              <IonSegmentButton style={{padding:'.5rem'}} value="scheduled">
                <IonIcon icon={timer} />
                <small>{this.state.scheduledTitle}</small>
              </IonSegmentButton>
              <IonSegmentButton style={{padding:'.5rem'}} value="report">
                <IonIcon icon={document} />
                <small>{this.state.reportTitle}</small>
              </IonSegmentButton>
            </IonSegment>

            <div style={{padding:'.2rem'}}>
                {
                    this.state.menuValue === 'home' ?  <SearchCar/> :
                    this.state.menuValue === 'add' ?  <AddMaintanace/> :
                    this.state.menuValue === 'scheduled' ? <Scheduled /> :
                    this.state.menuValue === 'report' ?  <ReportMantain/> :
                    <SearchCar/>
                }
            </div>
        </IonContent>

        {/* </div> */}
      </IonPage>
    )
  }
}
