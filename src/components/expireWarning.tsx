import React from 'react';
import axios from 'axios';
import api from '../api.json';
import { Plugins } from "@capacitor/core";
import {  IonGrid, IonRow, IonCol, IonBadge, IonLabel } from '@ionic/react';
import en from '../en.json';
import th from '../th.json';


var moment = require('moment');
moment().format();
const { Storage } = Plugins;
let leftMonth = new Date(), leftWeek = new Date() , Expire = new Date() ;
let expireMessage:any , expireLeft:any, days:any;

export default class ExpireDateWarning extends React.Component {

    state={
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
			temperature:"",
			fld_signalStrength:"",
			fld_engineLoad:"",
			fld_driverID:"",
			fld_driverMessage:"" ,
			modal: 0,
			status_name:'',
        }],
        alertSts:'block',
        exList:[{
            device_id : 0,
			name:"" ,
            expiration_date: "" ,
            length:0 
        }],
        monthList:[{
            device_id : 0,
			name:"" ,
            expiration_date: "" ,
            length:0
        }],
       weekList:[{
            device_id : 0,
			name:"" ,
            expiration_date: "" ,
            length:0
        }]
    }

    dateNow=()=>{
		let tempDate  = new Date()
		let dateTime = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1)+ '-' + tempDate.getDate()+ ' ' +
		tempDate.getHours()+':'+ tempDate.getMinutes()+ ':' + tempDate.getSeconds();

        Expire = moment(dateTime,'YYYY-MM-DD')
       // console.log("Expire", Expire)

        leftMonth.setMonth(leftMonth.getMonth()-1)
        //console.log(leftMonth)
         
        leftWeek.setDate(leftWeek.getDate()-7)
       // console.log(leftWeek)
        
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

    setLanguage = async ()=>{
		const ret =await this.getStorage('language');
		const languag =JSON.stringify( ret || '{}')
		let l
		if (languag === '"th"'){
            l = th.home
            expireMessage = l.dateExpire
            expireLeft = l.dateExpireLeft
            days = l.days
			
		} else if(languag === '"en"'){
			l = en.home
            expireMessage = l.dateExpire
            expireLeft = l.dateExpireLeft
            days = l.days
		}
		
    }

    async componentDidMount(){
        let lang =await this.getStorage( 'language');
        let token =await this.getStorage( 'token');
        let apiHost = await this.getStorage( 'api');
        
        this.dateNow()
        const ret =await this.getStorage({ key: 'language' } );
		const languag =JSON.stringify( ret || '{}')
		let l
		if (languag === '"th"'){
            l = th.home
            expireLeft = l.dateExpire
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
        console.log("ExpireDateWarning -> componentDidMount -> res", res)
            this.setState({ List : res.data })
            this.setState({
                exList: this.state.List.filter((List) => moment(List.expiration_date, 'YYYY-MM-DD') < Expire),
                monthList : this.state.List.filter((List) => moment(List.expiration_date, 'YYYY-MM-DD') < leftMonth) ,
                weekList : this.state.List.filter((List) => moment(List.expiration_date, 'YYYY-MM-DD') < leftWeek)
            })

            // console.log('expire',this.state.exList)
            // console.log(this.state.monthList)
            // console.log(this.state.weekList)
                
        }) 
    }  

    setCloseWarning=()=>{
        this.setState({
            alertSts: 'none'
        })
    }

    render() {
        this.setLanguage();
      
        return (
            <div>
                <div className='expire-warning' style={{display:this.state.alertSts,position:'fixed',zIndex:6}}>
                    <IonGrid style={{padding:'0px'}}>
                        <IonRow>
                            <IonCol size='12' style={{padding:'5px',fontSize:'12px'}}>

                                {this.state.exList.map((exList) =>  <IonBadge mode='ios' style={{fontSize:'11px'}} color='danger' key={exList.device_id}>
                                    {exList.length === 0 ? <IonLabel> </IonLabel>:
                                     <IonLabel> {exList.name} {expireMessage} {exList.expiration_date}</IonLabel>}
                                  </IonBadge>)}

                                {this.state.monthList.map((monthList) =>  <IonBadge mode='ios' style={{fontSize:'11px'}} color='warning' key={monthList.device_id}>
                                    {monthList.length === 0 ? <IonLabel></IonLabel>:
                                    <IonLabel> {monthList.name}  {monthList.expiration_date} {expireLeft} 30 {days}</IonLabel>}
                                    </IonBadge>)}

                                {this.state.weekList.map((weekList) =>  <IonBadge mode='ios' style={{fontSize:'11px'}} color='warning' key={weekList.device_id}>
                                    {weekList.length === 0 ? <IonLabel></IonLabel>:
                                    <IonLabel> {weekList.name} {expireMessage} {weekList.expiration_date} {expireLeft} 7 {days}</IonLabel>}
                                  </IonBadge>)}

                            </IonCol>
                            
                        </IonRow>
                    </IonGrid>
                </div>
            </div>
        )
    }
}
