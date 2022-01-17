import React from 'react';
import { IonPopover, IonBadge, IonIcon, IonList,  IonItem, IonLabel, IonRow, IonCol  } from '@ionic/react';
import '../pages/style.css'
import { notifications ,alert, alertCircle, warning } from 'ionicons/icons';
import axios from 'axios';
import api from '../api.json';
import { Plugins } from "@capacitor/core";
import en from '../en.json';
import th from '../th.json';


var moment = require('moment');
moment().format();
const { Storage } = Plugins;
let leftMonth = new Date(), leftWeek = new Date() , Expire = new Date() ;
let expireMessage:any  ;

export class AlertPopover extends React.Component{

  state={
    dateExpire : "ครบกำหนดชำระวันที่" ,
		dateExpireLeft : "ภายใน",
    days : "วัน",
    alertList:'block',
    alertDetails:[ 
      {
          device_id : 0,
          name:"" ,
          expiration_date: "" ,
          length:0,
          color:"warning"
      }
    ],
    showPopover:false ,
    showBadge:0,
    List:[{
        device_id : 0,
        name:"" ,
        event_id: 0,
        latitude: 0 ,
        longitude: 0,
        expiration_date: "" ,
        lastEvent : "",
        address: "" ,
        event_stamp:0,
        fuel_liters:"",
        satellites:"",
        speed:"",
        status:"",
        status_time:"",
        dltText:"",
        temperature:"",
        fld_signalStrength:"",
        fld_engineLoad:"",
        fld_driverID:"",
        fld_driverMessage:"" ,
        modal: 0,
        status_name:'',
      }],
      dltText:[{
        device_id : 0,
        name:"" ,
        event_id: 0,
        latitude: 0 ,
        longitude: 0,
        expiration_date: "" ,
        lastEvent : "",
        address: "" ,
        event_stamp:0,
        fuel_liters:"",
        satellites:"",
        speed:"",
        status:"",
        status_time:"",
        temperature:"",
        fld_signalStrength:"",
        fld_engineLoad:"",
        fld_driverID:"",
        fld_driverMessage:"" ,
        modal: 0,
        status_name:'',
        dltText:"",
      }],
  }


  setClosePopover(){
    this.setState({
      showPopover : !true
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
	setStorage = async (keyStore:any , valueStore:any) => {
		try{ 
		  localStorage.setItem(keyStore , valueStore)
		  console.log('set done')
		}catch{
		  return ''
		} 
	};

  setShowPopover(){
    this.setState({
      showPopover : !this.state.showPopover, 
    })
  } 

    async componentDidMount(){
        let lang =await this.getStorage( 'language');
        let token =await this.getStorage( 'token');
        let apiHost = await this.getStorage( 'api');
        this.checkLang() 
        
        const ret =await this.getStorage({ key: 'language' } );
        const languag =JSON.stringify( ret || '{}')
        let l
        if (languag === '"th"'){
                l = th.home
                //expireLeft = l.dateExpire
        } else if(languag === '"en"'){
          l = en.home
        }

        axios.get(apiHost+`/home` ,{
            headers: {
                "language": lang  ,
                "token" : token ,
                "Authorization": api.authorization,
                "version":api.version
            }		
        }).then(res => {
            this.setState({ List : res.data },()=>{
              console.log('List ',this.state.List)
              this.setState({
                dltText : this.state.List.filter((l)=> l.dltText !== '')  
              },()=>{
                console.log(' this.state.dltText.length ', this.state.dltText.length)
                this.setState({
                  showBadge : this.state.dltText.length
                })
              })
            })
             
        }) 
    }  

    checkLang=async ()=>{
      let lang = await this.getStorage( 'language') ;
      let l
        if (lang === '"th"' || lang === 'th'){
          l = th.alert
          expireMessage = l.dateExpire
          //expireLeft = l.dateExpire
        } else if(lang === '"en"' || lang === 'en'){
          l = en.alert
          expireMessage = l.dateExpire
        }else if(lang === undefined){
          l = this.state
          expireMessage = l.dateExpire
        }

    }

  render(){
    
    return (
      <IonLabel>
        <IonPopover 
          isOpen={this.state.showPopover} 
          mode='ios' 
          cssClass= 'bottom-sheet-popover' 
          onDidDismiss={ ()=>this.setState({showPopover : false})}
        >  
            <div style={{width:'100%',padding:'.5rem'}}>
            {
                this.state.dltText.map((L)=> 
                 <IonRow key={L.device_id} style={{borderBottom:'1px solid #eee'}}>
                   <IonCol size="2" className="set-center" >
                     <IonIcon icon={warning} color="medium" style={{fontSize:'1.7em'}}/>
                   </IonCol>
                   <IonCol size="10">
                     <IonLabel><strong>{L.name}</strong></IonLabel><br/>
                     <IonLabel color="danger"> <small style={{fontSize:'.7em'}}>{L.dltText}</small></IonLabel>
                   </IonCol>
                 </IonRow> 
              )} 
            </div>
        </IonPopover>
          <IonIcon icon={notifications} style={{fontSize: '1.2em',marginTop:'0.5rem', }} onClick={() => {this.setShowPopover()}  } mode='md' color='primary' />
          {
             Number(this.state.showBadge) > 0  ?
             <small onClick={() => {this.setShowPopover()} } 
                style={{position:'absolute', fontSize:'.55rem' , padding:'2px',marginLeft:'-20%',marginTop:'2%', backgroundColor:'red',color:"#fff", borderRadius:'10px'
                }}>
             {this.state.showBadge}
            </small>:<small></small>
          }
            
      </IonLabel>
    );
  }
};