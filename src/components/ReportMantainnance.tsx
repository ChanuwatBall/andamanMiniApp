import React from 'react';
import { IonCol,  IonIcon, IonLabel, IonModal, IonRow, IonSearchbar } from '@ionic/react';
import { car,  closeCircleOutline,  repeat } from 'ionicons/icons';
import th from '../th.json'
import en from '../en.json'
import { Plugins } from "@capacitor/core";
import axios from 'axios'
import api from '../api.json'
import './styles.css'

const { Storage } = Plugins;
export default class SearchCar  extends React.Component{

  state={
    reportMaintenance : "รายงานประวัติการซ่อม",
    searhCarTitle : "ค้นหารถ" ,
    lastMaintenance : "ครั้งล่าสุด" ,
    keyword:'',
    showModal :false,
    carlist: [
      {
        id : 2158, 
        vehicle:'30-5121 บจ',
        scheduled : false ,
        scheduledNumber: 0 ,
      },
      {
        id : 2187, 
        vehicle:'30-5874 นร',
        scheduled : true ,
        scheduledNumber: 2
      },
      {
        id : 2268, 
        vehicle:'30-5136 ตต',
        scheduled : true ,
        scheduledNumber: 1
      }
    ],
    listBackup: [
      {
        id : 2268, 
        vehicle:'30-5136 ตต',
        scheduled : true ,
        scheduledNumber: 1
      }
    ],

    carSelect: '', 

    mantainHistory : [
      {
        name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        mantain_id: 321 , 
        mantainnance_date : '01/07/2563' ,
        mantainnance_cause : '2231 mile'
      },
      {
        name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        mantain_id: 322 , 
        mantainnance_date : '01/08/2563' ,
        mantainnance_cause : '2831 mile'
      },
      {
        name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        mantain_id: 323 , 
        mantainnance_date : '01/09/2563' ,
        mantainnance_cause : '3331 mile'
      },
      {
        name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        mantain_id: 324 , 
        mantainnance_date : '01/10/2563' ,
        mantainnance_cause : '3831 mile'
      },
      {
        name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        mantain_id: 325 , 
        mantainnance_date : '01/11/2563' ,
        mantainnance_cause : '4331 mile'
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

  setLanguage=async()=>{
    let lang = await this.getStorage( 'language')

    if(lang === 'th'){
      let l = th.maintenence
      this.setState({
        reportMaintenance : l.reportMaintenance,
        searhCarTitle : l.searhCarTitle ,
        lastMaintenance : l.lastMaintenance
      })
    }else if(lang === 'en'){
      let l = en.maintenence
      this.setState({
        reportMaintenance : l.reportMaintenance,
        searhCarTitle : l.searhCarTitle ,
        lastMaintenance : l.lastMaintenance
      })
    }
  }

  async componentDidMount(){
    this.setLanguage() 
    let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
    let userID = await this.getStorage('userId')

    this.setState({
      listBackup : [],
      carlist: [] ,
      mantainHistory : []
    })

    console.log( JSON.parse(userID || '{}')) 

    axios.get(apiHost+'/carMaintennance' ,{
			headers: {
        "user_id" : JSON.parse(userID || '{}'),
				"language": lang  ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
      console.log('res',res)
      this.setState({
        carlist : res.data.list ,
        listBackup : res.data.list
      },()=>{
        this.setState({
          carlist : this.state.carlist.filter((carlist) => carlist.scheduledNumber > 0) ,
          listBackup  : this.state.carlist.filter((carlist) => carlist.scheduledNumber > 0)
        })
      })
    }).catch(err=>{
      console.log('err ',err)
      this.setState({
        carlist :[] ,
        listBackup :[]
      })
    })
  }

  searchReport=async(id:any ,vehicle:any)=>{
    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId')
 
    axios.get(apiHost+'/reportMaintennance' ,{
			headers: {
        "user_id" : JSON.parse(userID || '{}'),
        "car_id": id,
				"language": lang  ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
      console.log('res',res) 
      this.setState({
        carSelect: vehicle ,
        mantainHistory : res.data.list
      },()=>{
        this.setShowModal(true);
      })

      //this.setShowModal(true);
    }).catch(err=>{
      console.log('err ',err)
    })
  }

  searchCar=(e:any)=>{
      console.log("vehicle.lenght", e.length)
    this.setState({
      keyword : e
    },()=>{
      if(this.state.keyword.length >= 4){
        this.setState({
          carlist : this.state.listBackup.filter((listBackup) => listBackup.vehicle.toLowerCase().search(this.state.keyword.toLowerCase()) !== -1)
        })
      }else if(this.state.keyword.length < 4){
        this.setState({
          carlist : this.state.listBackup
        })
      }
    }) 
  }

  setShowModal=(e:any)=>{
    this.setState({
      showModal :e
    })
  }

  render(){
    return(
      <>
        <IonRow>
              <IonCol size='12' >
                <IonSearchbar placeholder={this.state.searhCarTitle}  mode='ios' onIonChange={e => this.searchCar(e.detail.value!)} ></IonSearchbar>
              </IonCol>  
        </IonRow>

        {
              this.state.carlist.map((carlist) => 
                <IonRow key={carlist.id} style={{marginBottom:'.5rem'}} onClick={()=>{this.searchReport(carlist.id , carlist.vehicle) }} > 
                  <IonCol size='2' className='set-center' >
                      <IonIcon icon={car} color='primary' mode='md' style={{fontSize:'1.6em'}}/>
                  </IonCol>
                  <IonCol size='8' >
                      <IonLabel color='dark' style={{fontWeight:'500'}} ><i>{carlist.vehicle}</i></IonLabel><br/>
                  </IonCol> 
                  <IonCol size='1'>
                     <IonIcon icon={repeat} mode='ios' color='dark' style={{fontSize:'1.6em'}} />
                  </IonCol>
                </IonRow>
            )}

        <IonModal onDidDismiss={()=>{this.setShowModal(false)}} isOpen={this.state.showModal} cssClass='report-mantain-modal'>
          <div className='mantain-list-modal' style={{backgroundImage:"url('../assets/images/bg-mainten.png')"}}>
            <IonRow style={{justifyContent:'flex-end'}} >
              <IonCol size='2' className='set-center' onClick={()=>{this.setShowModal(false)}} >
                <IonIcon icon={closeCircleOutline} color='medium' style={{fontSize:'1.6em'}} />
              </IonCol>
            </IonRow>
            <IonRow style={{marginBottom:'1rem'}}>
              <IonCol size='12'>
                <h2 style={{marginBottom:'0px',fontWeight:600 ,color:'#202021'}}>{this.state.carSelect}</h2>
                <small style={{color:'#666'}}>{this.state.reportMaintenance}</small>
              </IonCol>
            </IonRow>

          {
            this.state.mantainHistory.map((mantainHistory) =>
            <IonRow key={mantainHistory.mantain_id}  style={{margin:'0px'}} >
                <IonCol size='2'  style={{padding :'0px'}} >
                   <img src='../assets/images/list-menu.png' alt=''/>
                </IonCol>
                <IonCol size='10'  style={{padding:'.5rem'}} >
                   <IonLabel color='dark'>{mantainHistory.name} | {mantainHistory.mantainnance_cause} </IonLabel><br/>
                   <small style={{color:'#666'}}>{this.state.lastMaintenance} {mantainHistory.mantainnance_date} </small>
                </IonCol>
            </IonRow>
          )}
          </div>
        </IonModal>  

      </>
    )
  }
}