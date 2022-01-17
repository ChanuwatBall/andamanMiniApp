import React from 'react';
import axios from 'axios';
import api from '../api.json';
import { Plugins } from "@capacitor/core";
import { IonAlert } from '@ionic/react';
import en from '../en.json';
import th from '../th.json';
import config from '../app.config.json'


var moment = require('moment');
moment().format();
const { Storage } = Plugins; 
export class AlertSystemUpdate extends React.Component {

    state={
        alertSystemUpdate: false ,
        alertHeader: 'กำลังปรับปรุงระบบ' ,
        alertMessage : 'กำลังปรับปรุง  ไม่สามารถใช้งานแอพพลิเคชั่นได้ในขณะนี้'
    }
 
    getStorage = async (keyStore:any) => {
		try{
		  const { value } = await Storage.get({ key: keyStore }); 
		  return value ;
		}catch{
		  return ''
		} 
	  };

    async componentDidMount(){
        const languag =await this.getStorage('language'); 
		let token =await this.getStorage('token'); 
        
		let l
		if (languag === '"th"'){
            l = th.home
            //expireLeft = l.dateExpire
		} else if(languag === '"en"'){
			l = en.home
        }
 
        let server = await this.getStorage('server')  
        console.log('server.value' ,server)
        if (  server === '1' || server === '2' || server === '3' || server === null){ 
            this.setState({
                alertHeader: 'โปรดออกจากระบบ' ,
                alertMessage : 'กรุณาออกจากระบบ แล้วเข้าสู่ระบบอีกครั้ง!!! เพื่อเริ่มใช้งานแอพพลิเคชั่น!!!'
            },()=>{
                this.alertSystemUpdate(false)
            })
        }else if ( server === undefined ){
            axios.post(api.https+ '/'+api.type+'/v'+api.version+'/index')
            .then(res=>{
                if(res.data.server.length >0){
                    let apiAlert =  res.data.server[0].url+'/'+api.type+'/v'+api.version+'/alert'
                    axios.get(apiAlert,{
                            headers: {
                                "language": languag  ,
                                "token" : token ,
                                "authenication": api.authorization,
                                "version":api.version
                            }
                        }).then(res => {
                            if(res.data.headerAlert === null || res.data.messageAlert === null ){
                                this.setState({
                                    alertHeader: 'กำลังปรับปรุงระบบ' ,
                                    alertMessage : 'กำลังปรับปรุง  ไม่สามารถใช้งานแอพพลิเคชั่นได้'
                                },()=>{
                                    this.alertSystemUpdate(res.data.showAlert)
                                })
                            }else{
                            this.setState({ 
                                    alertHeader:  res.data.headerAlert ,
                                    alertMessage : res.data.messageAlert
                                },()=>{
                                    this.alertSystemUpdate(res.data.showAlert)
                                })
                            }  
                        }).catch(err => {
                            console.log(err) 
                            this.alertSystemUpdate(true) 
                        })
                }else{
                    this.alertSystemUpdate(false) 
                }
            }) 
        } 
			
    }  


    setCloseWarning=()=>{
        this.setState({
            alertSts: 'none'
        })
    }

    alertSystemUpdate=(e:any)=>{
        this.setState({
            alertSystemUpdate : e
        })
    }

    render() {
      //  this.setLanguage();
      
        return (
            <div>
                <IonAlert
                mode='ios'
                isOpen={this.state.alertSystemUpdate}
                onDidDismiss={() => this.alertSystemUpdate(false)}
                header={this.state.alertHeader}
                message={this.state.alertMessage}
                buttons={[
                    {
                        text: 'ตกลง',
                        handler: () => {
                            console.log('Confirm Okay');
                        }
                    }
                ]}
                />
            </div>
        )
    }
}
