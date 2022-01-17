import React from 'react';
import { IonCol, IonGrid,  IonIcon, IonLabel, IonModal, IonRow } from '@ionic/react';
import { alert, car, close, cog, help, list, warning  } from 'ionicons/icons';
import th from '../th.json'
import en from '../en.json'
import { Plugins } from "@capacitor/core";
import axios from 'axios'
import api from '../api.json'
import './styles.css'

const { Storage } = Plugins;
export default class Scheduled  extends React.Component{

  state={
    keyword:'', 
    noData:'none',
    vehicle : "ทะเบียนรถ" ,
		lastMaintenance : "ครั้งล่าสุด" ,
    mantainList: [ 
      {
        name:'เปลี่ยนถ่ายน้ำมันเครื่อง',
        vehicle : '30-5121 บจ',
        lastTime : '201450',
        piority : 1 ,
        lastTimeUnit:'ไมล์'
      },
      {
        name:'เปลี่ยนถ่ายน้ำมันเครื่อง',
        vehicle : '30-5874 กข',
        lastTime : '201450',
        piority : 2,
        lastTimeUnit:'ไมล์'
      }
    ], 
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

  setLanguage= async ()=>{
    let lang = await this.getStorage('language')
    if(lang === 'th'){
      let l = th.maintenence
      this.setState({
        vehicle : l.vehicle ,
        lastMaintenance : l.lastMaintenance ,
      })
    }else if(lang === 'en'){
      let l = en.maintenence
      this.setState({
        vehicle : l.vehicle ,
        lastMaintenance : l.lastMaintenance ,
      })
    }
  }

  async componentDidMount(){ 
    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId') 

    axios.get(apiHost+'/scheduledList' ,{
			headers: {
        "user_id" : JSON.parse(userID || '{}'),
				"language": lang  ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
      console.log('res',res)
      if(res.data.list === null){
        this.setState({
          mantainList :[],
          noData: 'block'
        })
      }else{
        this.setState({
          mantainList : res.data.list ,
          noData: 'none'
        })
      }
      
    }).catch(err=>{
      console.log('err ',err)
      this.setState({ 
        mantainList :[],
        noData: 'block'
      })
    })
    this.setLanguage()
  }
 

  render(){
    return(
      <>
        <IonGrid style={{marginTop:'1rem',padding:'.5rem'}}> 
        <IonRow style={{display:this.state.noData}}>
          <IonCol size='12' className='ion-text-center set-center' style={{flexDirection:'row',paddingTop:'15vh', color:'#ccc'}}>
             <IonIcon icon={alert}   />&nbsp;&nbsp;
             <small style={{color:'#ccc'}} >ไม่พบข้อมูลกำหนดซ่อมบำรุง</small>
          </IonCol>
        </IonRow>
        {this.state.mantainList.map((mantainList ,index) => 
          <IonRow key={index}  style={{marginTop:'1rem'}}>
              <IonCol size='2' className='set-center' > 
                  <IonIcon icon={cog} color='primary' style={{fontSize:'1.7em'}} />
              </IonCol>
              <IonCol size='9' >
                  <strong>{mantainList.name}</strong><br/>
                  <small>{this.state.vehicle} {mantainList.vehicle}</small>  
                  {/* <small>{this.state.lastMaintenance} {mantainList.lastTime} {mantainList.lastTimeUnit}</small> */}
              </IonCol>
              <IonCol size='1' className='set-center'>
                  {
                   mantainList.piority === 1 ? 
                   <IonIcon icon={alert} color='danger' style={{fontSize:'1.2em'}} /> :
                   mantainList.piority === 2 ?
                   <IonIcon icon={alert} color='warning' style={{fontSize:'1.2em'}} /> :
                   mantainList.piority === 0 ?
                   <IonIcon icon={alert} color='success' style={{fontSize:'1.2em'}} /> :
                   <IonIcon icon={alert} color='success' style={{fontSize:'1.2em'}} />
                  }
              </IonCol>
          </IonRow>
        )}
        <div style={{width:'100%',height:'2.5rem'}}> </div>
        </IonGrid>
      </>
    )
  }
}