import React from 'react';
import { IonCol,  IonIcon, IonLabel, IonModal, IonRow } from '@ionic/react';
import { alert,  close,  help,  warning  } from 'ionicons/icons';
import './styles.css'
import th from '../th.json'
import en from '../en.json'
import { Plugins } from "@capacitor/core";
import './styles.css'

const { Storage } = Plugins;
export default class FloatQuesion  extends React.Component{

  state={
    keyword:'',
    ask:false,
    iconMaintenanceMenu : "ไอคอนหน้ารายการซ่อมบำรุง",
		warningYello : "ไอคอนสีเหลือง หมายถึง  มีรายการซ่อมที่ต้องซ่อมของทะเบียนรถ" ,
		warningGray : "ไอคอนสีเทา หมายถึง ไม่มีรายการซ่อมที่ต้องซ่อมของทะเบียนรถ" ,
		checkmarkGray :"ไอคอนกาถูกสีเทา หมายถึง รายการซ่อมนั้นยังไม่ถึงกำหนดเวลาซ่อม",
		alerYellow : "ไอคอนสีเหลือง หมายถึง รายการซ่อมนั้นถึงกำหนดเวลาซ่อมแล้ว",
		iconScheduled : "ไอคอนหน้ากำหนดซ่อม" ,
		redAlert : "ไอคอนสีแดง หมายถึง ถึงกำหนดเวลาซ่อมของรายการที่เลือก" ,
		yellowAlert : "ไอคอนสีเหลือง หมายถึง ใกล้ถึงกำหนดเวลาซ่อมของรายการนั้น" ,
		grayAlert : "ไอคอนสีเขียว หมายถึง ยังไม่ถึงกำหนดเวลาซ่อมของรายการนั้น"
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
    let lang = await this.getStorage('language')
    
    if(lang === 'th'){
      let l = th.maintenence
      this.setState({
        iconMaintenanceMenu : l.iconMaintenanceMenu,
        warningYello : l.warningYello ,
        warningGray : l.warningGray ,
        checkmarkGray : l.checkmarkGray,
        alerYellow : l.alerYellow,
        iconScheduled :l.iconScheduled ,
        redAlert : l.redAlert,
        yellowAlert : l.yellowAlert ,
        grayAlert : l.grayAlert
      }) 
    }else if(lang === 'en'){
      let l = en.maintenence
      this.setState({
        iconMaintenanceMenu : l.iconMaintenanceMenu,
        warningYello : l.warningYello ,
        warningGray : l.warningGray ,
        checkmarkGray : l.checkmarkGray,
        alerYellow : l.alerYellow,
        iconScheduled :l.iconScheduled ,
        redAlert : l.redAlert,
        yellowAlert : l.yellowAlert ,
        grayAlert : l.grayAlert
      })
    }
  }

  componentDidMount(){
    this.setLanguage()
  }


  render(){
    return(
      <>
        <div className='set-center' 
            onClick={()=>{this.setState({ask:true})}}
            style={{position:'fixed',right:'1rem',bottom:'1rem',padding:'.5rem',borderRadius:'50%', border:'1px solid #ccc',width:'2rem',height:'2rem',zIndex:999,backgroundColor:'#fcfdfe'}}>
            <IonIcon icon={help} style={{color:'#ccc'}} />
        </div>
        <IonModal isOpen={this.state.ask} cssClass='modal-schedled-ask'>
            <div className='modal-schedled-ask-content' style={{padding:'.5rem'}}>
                <IonRow style={{justifyContent: 'flex-end',marginTop:'.5rem' }}>
                    <IonCol size='2' class='set-center'>
                        <IonIcon icon={close} color='medium'  onClick={()=>{this.setState({ask:false})}} />
                    </IonCol>
                </IonRow>

                <IonRow  style={{borderBottom:'1px solid #eee'}}> 
                  <IonCol size='12' >
                    <strong style={{color:'#666'}} >{this.state.iconMaintenanceMenu }</strong>
                  </IonCol>
                  <IonCol size='1' >
                      <IonIcon icon={warning} mode='ios' color='warning' style={{fontSize:'1.5em'}}/>
                    </IonCol>
                  <IonCol size='11' >
                      <IonLabel color='medium'> <small>{this.state.warningYello}</small> </IonLabel>
                  </IonCol>

                  <IonCol size='1' >
                      <IonIcon icon={warning} mode='ios'  color='medium' style={{fontSize:'1.2em'}}/> 
                  </IonCol>
                  <IonCol size='11' >
                      <IonLabel color='medium'> <small>{this.state.warningGray }</small> </IonLabel>
                  </IonCol> 

                  <IonCol size='12' style={{padding:'.5rem'}}>
                  </IonCol>
                  {/* <IonCol size='1' >
                      <IonIcon icon={checkmarkCircleOutline} color='medium' style={{fontSize:'1.5em'}} />
                  </IonCol>
                  <IonCol size='11' >
                      <IonLabel color='medium'> <small>{this.state.checkmarkGray }</small> </IonLabel>
                  </IonCol>
                  <IonCol size='1' >
                      <IonIcon icon={alert} color='warning' style={{fontSize:'1.5em'}} />
                  </IonCol>
                  <IonCol size='11' >
                      <IonLabel color='medium'> <small>{this.state.alerYellow }</small> </IonLabel>
                  </IonCol> */}
                </IonRow>

                <IonRow style={{marginTop:'.5rem'}}>
                  <IonCol size='12' >
                    <strong style={{color:'#666'}} >{this.state.iconScheduled }</strong>
                  </IonCol>

                  <IonCol size='1' >
                    <IonIcon icon={alert} color='danger' style={{fontSize:'1.2em'}} /> 
                  </IonCol>
                  <IonCol size='11' >
                      <IonLabel color='medium'> <small>{this.state.redAlert }</small> </IonLabel>
                  </IonCol>

                  <IonCol size='1' >
                      <IonIcon icon={alert} color='warning' style={{fontSize:'1.2em'}} /> 
                  </IonCol>
                  <IonCol size='11' >
                      <IonLabel color='medium'> <small>{this.state.yellowAlert }</small> </IonLabel>
                  </IonCol>

                  <IonCol size='1' >
                      <IonIcon icon={alert} color='success' style={{fontSize:'1.2em'}} />
                  </IonCol>
                  <IonCol size='11' >
                      <IonLabel color='medium'> <small>{this.state.grayAlert }</small> </IonLabel>
                  </IonCol> 
                    
                </IonRow>
                
            </div> 
      </IonModal>
      </>
    )
  }
}