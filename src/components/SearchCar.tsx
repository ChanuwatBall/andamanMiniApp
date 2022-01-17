import React from 'react';
import { IonAlert, IonButton, IonCheckbox, IonCol,  IonGrid, IonIcon, IonItem, IonLabel, IonModal,  IonRow, IonSearchbar, IonToast } from '@ionic/react';
import { car, checkmarkCircle, checkmarkCircleOutline, closeCircleOutline, cog,  create, warning } from 'ionicons/icons';
import AddMaintanace from './AddVehicle'
import th from '../th.json'
import en from '../en.json'
import { Plugins } from "@capacitor/core";
import axios from 'axios'
import api from '../api.json'

const { Storage } = Plugins;
let moment = require ('moment')
moment().format()
let cancel: any, ok : any , alertSuccess: any, alertFail: any

export default class SearchCar  extends React.Component{

  state={
    toastErr:false,
    toastSuccess: false,
    actionSheetDistance:false ,
    actionSheetDay: false ,
    searchCar : "ค้นหารถ" ,
    addCarAndMaintenence : "เพิ่มรถและรายการซ่อม",
    vehicleInput : "ทะเบียนรถ",
    copyMaintainFrom : "คัดลอกรายการซ่อม",
    selectMaintainType : "เลือกรายการซ่อม",
    itemsToRepair: "รายการที่ต้องซ่อม",
    scheduled : "รอบการซ่อมบำรุง" ,
		alertWhen : "แจ้งเตือนเมื่อครบ" ,
    vehicle : "ทะเบียนรถ" ,
    MaintananceList:"รายการซ่อม",
    btnSuccess:"เรียบร้อย",
		btnCancle:"ยกเลิก",
    normalStatus:"ปรกติก",
		repairStatus:"ถึงรอบซ่อม",
    editMaintanance : "แก้ไขรายการซ่อม",
		saveEditMaintanance : "บันทึกการแก้ไข",
    cancel : "ยกเลิก",
		ok : "ตกลง" ,
		alertSuccess:"ดำเนินการสำเร็จ",
		alertFail:"ดำเนินการไม่สำเร็จ",
    keyword:'',
    showModal :false,
    modalEdit :false ,
    vehicleSelect:'',
    carIdSelected:0,

    alertHeader :'',
    alertSubheader:'',
    alertCondition:'',

    carlist: [
      {
        id : 2158, 
        vehicle:'30-5121 บจ',
        scheduled : false ,
        scheduledNumber: 0 ,
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
    mantainSelectType: [
      {
        name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        mantain_id: 321 ,
        scheduled : true ,
        mantain_when:'1000 กม.',
        warnning_before: '800',
        choose :true ,
        mainten_condition: 2,
        disable : true ,
        type_id:0
      }],
    mantainList : [
      {
        name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        mantain_id: 321 ,
        scheduled : true ,
        mantain_when:'1000 กม.',
        warnning_before: '800',
        choose :true ,
        mainten_condition: 2,
        disabled : true 
      }
    ],
     
  }

  toastErr=(e:any)=>{
    this.setState({
      toastErr : e
    })
  }

  toastSuccess=(e:any)=>{
    this.setState({
      toastSuccess : e
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

  setLanguage= async ()=>{
    let lang = await this.getStorage('language') 
    if(lang === 'th'){
      let l = th.maintenence
      this.setState({
        searchCar : l.searhCarTitle ,
        addCarAndMaintenence : l.addMainteneceTitle,
        vehicleInput : l.vehicle ,
        copyMaintainFrom : l.copyMaintainFrom,
        selectMaintainType : l.selectMaintainType,
        itemsToRepair : l.itemstToRepair,
        scheduled : l.scheduled ,
	    	alertWhen :  l.alertWhen ,
        vehicle : l.vehicle ,
        MaintananceList: l.MaintananceList,
        btnSuccess: l.btnSuccess,
        btnCancle: l.btnCancle,
        normalStatus: l.normalStatus,
        repairStatus: l.repairStatus,
        editMaintanance : l.editMaintanance,
		    saveEditMaintanance : l.saveEditMaintanance,
        cancel : l.cancel
      })
      cancel= l.cancel
      ok = l.ok 
      alertSuccess= l.alertSuccess
      alertFail= l.alertFail

    }else if(lang === 'en'){
      let l = en.maintenence
      this.setState({
        searchCar : l.searhCarTitle ,
        addCarAndMaintenence : l.addMainteneceTitle,
        vehicleInput : l.vehicle ,
        copyMaintainFrom : l.copyMaintainFrom,
        selectMaintainType : l.selectMaintainType,
        itemsToRepair : l.itemstToRepair,
        scheduled :  l.scheduled ,
	    	alertWhen :  l.alertWhen ,
        vehicle : l.vehicle ,
        MaintananceList: l.MaintananceList,
        btnSuccess: l.btnSuccess,
        btnCancle: l.btnCancle,
        normalStatus: l.normalStatus,
        repairStatus: l.repairStatus,
        editMaintanance : l.editMaintanance,
		    saveEditMaintanance : l.saveEditMaintanance
      })
      cancel= l.cancel
      ok = l.ok 
      alertSuccess= l.alertSuccess
      alertFail= l.alerYellow
    }else{ 
      let l = this.state
      cancel= l.cancel
      ok = l.ok 
      alertSuccess= l.alertSuccess
      alertFail= l.alertFail
    } 
  }

  getMaintanance=async()=>{
    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId')

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
      if(res.data.list !== null || res.data.list !== undefined){
        this.setState({
          carlist : res.data.list ,
          listBackup : res.data.list
        },()=>{
          this.setState({
            carlist :this.state.carlist.filter((carlist) => carlist.scheduledNumber > 0) ,
            listBackup : this.state.listBackup.filter((listBackup) => listBackup.scheduledNumber > 0)
          })
        })
      }
      
    }).catch(err=>{
      console.log('err ',err)
    }) 
  }

  async componentDidMount(){
    let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
    let userID = await this.getStorage('userId') 
    this.setState({
      listBackup : [],
      carlist: [] ,
      mantainList : []
    })
   
    console.log( JSON.parse(userID || '{}')) 

    this.getMaintanance() 
    this.setLanguage() 
  }

  async maintenFromCar(id:any,vehicle:any){
    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId')
    this.setState({
      carIdSelected : id ,
      vehicleSelect : vehicle
    })

    axios.get(apiHost+'/maintenFromCar' ,{
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
        mantainList : res.data.list
      })
    }).catch(err=>{
      console.log('err ',err)
      this.setState({
        mantainList : []
      })
    })
  }

  maintenSelectedType= async (id:any,vehicle:any)=>{
    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId')
    this.setState({
      carIdSelected : id
    })

    axios.get(apiHost+'/maintanSelectType' ,{
      headers: {
        "user_id" : JSON.parse(userID || '{}'),
        "car_id" : id,
        "language": lang  ,
        "token" : token ,
        "authenication": api.authorization,
        "version":api.version
      }
    }).then(res => { 
       console.log('res ',res)
        this.setState({
          mantainSelectType : res.data.list ,
          vehicleSelect: vehicle
        },()=>{
          console.log('mantainSelectType ',this.state.mantainSelectType)
          this.showModalEdit(true);
        })
       
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

  showModalEdit=(e:any)=>{
    this.setState({
      modalEdit : e
    })
  }

  showMaintenList(e:any){
      console.log(e)
    this.setState({
        vehicleSelect: e
    },()=>{
        this.setShowModal(true);
    }) 
  }

  editVehicle(e:any){
   // this.maintenSelectedType()
    this.setState({
      vehicleSelect: e
    },()=>{
        this.showModalEdit(true);
    }) 
    console.log('this.state.mantainList ',this.state.mantainList)
  }

  cheklastUpdate=(id:any, checked:any )=>{ 
     let lastChange = this.state.mantainSelectType.filter((mantainSelectType) => mantainSelectType.type_id === id)
     let changeList = lastChange[0]
     changeList.choose = checked 

     console.log('lastChange ',lastChange ,changeList)
    
   // console.log('this.state.maintenancelist ',this.state.maintenancelist) 

    this.setState({
      mantainSelectType : this.state.mantainSelectType
    })
  }

  submitUpdate= async()=>{ 
    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId')

    let choosedMainten =''
    let filterChooseMainten = this.state.mantainSelectType
    //.filter((maintenancelist) => maintenancelist.choose === true)
    // filterChooseMainten = this.state.maintenancelist.filter((maintenancelist) => maintenancelist.choose === true)
     console.log('filterChooseMainten ' ,filterChooseMainten)

   let filterDisable = this.state.mantainSelectType.filter((mantainSelectType) => mantainSelectType.disable === true)
   console.log('filterDisable ',filterDisable.length)

   if(filterDisable.length < 1){
    for(let i=0; i<= filterChooseMainten.length-1 ;i++){  
      if( this.state.mantainSelectType[i].choose === true){
        choosedMainten = choosedMainten+'#'+this.state.mantainSelectType[i].type_id
      } 
       console.log('choosedMainten ',choosedMainten)
     }
   } if(filterDisable.length > 0){
    for(let i=0; i<= filterChooseMainten.length-1 ;i++){  
      if( this.state.mantainSelectType[i].choose === true && this.state.mantainSelectType[i].disable === false){
        choosedMainten = choosedMainten+'#'+this.state.mantainSelectType[i].type_id
      } 
       console.log('choosedMainten ',choosedMainten)
     }
   }
   console.log('carIdSelected ',this.state.carIdSelected)

    axios.post(apiHost+'/addNewCarMaintennace',{
      car_id : this.state.carIdSelected,
      mainten_id: choosedMainten   
    },{
      headers: {
        "user_id" : JSON.parse(userID || '{}'),
        "language": lang  ,
        "token" : token ,
        "authenication": api.authorization,
        "version":api.version ,
        "date_device" : moment().format('YYYY-MM-DD HH:mm:ss')
      }
    }).then(res => { 
      console.log('res ',res.data) 
      if( res.data.result  === true){
        this.closeModalEdit()
        this.getMaintanance() 
      }else{
        this.toastErr(true)
        setTimeout(()=>{
          this.toastErr(false)
        },3000)
      }

    }).catch(err=>{
      console.log('err ',err)
      this.toastErr(true)
      setTimeout(()=>{
        this.toastErr(false)
      },3000)
    }) 
  }

  updateEachRepair= async (mainten_id:any,status:any)=>{
    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId')

    axios.post(apiHost+'/updateEachRepair',{},{
      headers: {
        "mainten_id": mainten_id, 
        "update_status" :status ,
        "user_id" : JSON.parse(userID || '{}'),
        "language": lang  ,
        "token" : token ,
        "authenication": api.authorization,
        "version":api.version ,
        "date_device" : moment().format('YYYY-MM-DD HH:mm:ss')
      }
    }).then(res => { 
      console.log('res ',res) 
      if( res.data.result  === true){
        this.setShowModal(false)
        this.toastSuccess(true)
        setTimeout(()=>{
          this.toastSuccess(false)
        },3000)

        this.getMaintanance() 
      }else{
        this.toastErr(true)
        setTimeout(()=>{
          this.toastErr(false)
        },3000)
        console.log('fail')
      }
    }).catch(err=>{
      console.log('err ',err)
      this.toastErr(true)
      setTimeout(()=>{
        this.toastErr(false)
      },3000)
    }) 
  }

  actionSheetDay=(e:any)=>{
    this.setState({
      actionSheetDay : e
    })
  }

  actionSheetDistance=(e:any)=>{
    this.setState({
      actionSheetDistance : e
    })
  }

  submitSuccess=(e:any,id:any,vehicle:any,repair:any)=>{
    // this.setState({
    //   alertSubheader : repair
    // },()=>{
    //   console.log('e ', e)
    //   if(e === 1){
    //     this.setState({
    //       alertCondition : 'เงื่อนไขการซ่อมด้วยจำนวนวัน'
    //     },()=>{
    //       this.actionSheetDay(true)
    //     }) 
    //   }else if(e === 2){
    //     this.setState({
    //       alertCondition : 'เงื่อนไขการซ่อมด้วยระยะทาง'
    //     },()=>{
    //       this.actionSheetDistance(true)
    //     })
    //   }
    //})
  }

 closeModalEdit=()=>{
   this.setState({
     mantainSelectType : []
   },()=>{
     console.log('mantainSelectType ',this.state.mantainSelectType)
    this.showModalEdit(false)
   }) 
 }

  render(){
    return(
      <>
        <IonRow>
              <IonCol size='10' >
                <IonSearchbar placeholder={this.state.searchCar}  mode='ios' onIonChange={e => this.searchCar(e.detail.value!)} ></IonSearchbar>
              </IonCol>
              <IonCol size='2' className='set-center' style={{alignItems:'flex-start'}} >
                 {/* <IonIcon icon={addOutline} color='dark' style={{fontSize:'1.5em'}} /> */}
                 <AddMaintanace/>
              </IonCol>
            </IonRow>
 
            {
              this.state.carlist.map((carlist) => 
                <IonRow key={carlist.id} style={{marginBottom:'.5rem'}} > 
                  <IonCol size='2' className='set-center'  onClick={(e)=>{ this.maintenFromCar(carlist.id,carlist.vehicle) }}>
                      <IonIcon icon={car} color='primary' mode='ios' style={{fontSize:'1.6em'}}/>
                  </IonCol>
                  <IonCol size='6'  onClick={(e)=>{this.maintenFromCar(carlist.id,carlist.vehicle);this.showMaintenList(true) }}>
                      <strong>{carlist.vehicle}</strong><br/>
                      {carlist.scheduledNumber > 0  ? 
                        <small style={{color:'#f75a36'}}>{this.state.itemsToRepair} {carlist.scheduledNumber}</small>:
                        <small style={{color:'#666'}}>{this.state.itemsToRepair} {carlist.scheduledNumber}</small>
                      }
                  </IonCol>
                  <IonCol size='2' className='set-center'>
                      {carlist.scheduled === true ? 
                        <IonIcon icon={warning} mode='ios' color='warning' style={{fontSize:'1.5em'}}/> :
                        <IonIcon icon={warning} mode='ios' color='medium' style={{fontSize:'1.2em'}}/> 
                    }
                  </IonCol>
                  <IonCol size='2' className='set-center' style={{borderLeft:'1px solid #eee'}} 
                   onClick={()=>{
                    this.maintenSelectedType(carlist.id,carlist.vehicle) 
                  }} >
                     <IonIcon icon={create}  mode='md' color='primary'  style={{fontSize:'1.5em'}} />
                  </IonCol>
                </IonRow>
            )}

        <IonModal onDidDismiss={()=>{this.showModalEdit(false)}} isOpen={this.state.modalEdit} cssClass='edit-mantain-modal'>
            <div className='mantain-list-modal'  style={{backgroundImage:"url('../assets/images/bg-mainten.png')" , backgroundSize:'cover'}}>
              <IonGrid>
                <IonRow>
                  <IonCol size='10' style={{marginTop:'.5rem',paddingLeft: '1rem'}}>
                    <strong style={{color:'#202021',fontSize:'1.2em'}}>{this.state.editMaintanance}</strong> <br/>
                    <small style={{color:'#202021'}} >{this.state.vehicle} {this.state.vehicleSelect}</small>
                  </IonCol>
                  <IonCol size='2' className='set-center'> 
                    <IonIcon icon={closeCircleOutline} color='medium' onClick={()=>{this.closeModalEdit()}} style={{fontSize:'1.5em'}} /> 
                  </IonCol> 
                </IonRow>
                <IonRow>
                  <IonCol size='12'  >
                    {
                      this.state.mantainSelectType.map((mantainSelectType , index) => 
                        <IonItem key={index} lines='none' color='transparent' style={{marginTop:'.5rem'}}>
                            <IonIcon icon={cog} color='primary' style={{fontSize:'1.5em'}} />
                            <IonLabel style={{fontSize:'.8em'}} className='set-center' > &nbsp;{mantainSelectType.name} </IonLabel> 
                           
                            <IonCheckbox checked={mantainSelectType.choose} disabled={mantainSelectType.disable} mode='ios' 
                            onIonChange={e => this.cheklastUpdate(mantainSelectType.type_id,e.detail.checked )} />
                        </IonItem>
                      )
                    } 
                  </IonCol>
                </IonRow> 
                <IonRow style={{marginTop:'2.5rem'}}>
                  <IonCol size='12'  > 
                    <IonButton expand="block" mode='ios' onClick={()=>{this.submitUpdate()}}> 
                      <IonIcon slot="start" icon={checkmarkCircleOutline} color='light' /> 
                      <IonLabel> {this.state.saveEditMaintanance} </IonLabel> 
                    </IonButton>
                  </IonCol>
                </IonRow> 
              </IonGrid>
            </div>
        </IonModal>

        <IonModal onDidDismiss={()=>{this.setShowModal(false)}} isOpen={this.state.showModal} cssClass='mantain-modal'>
            <div className='mantain-list-modal'  style={{backgroundImage:"url('../assets/images/bg-mainten.png')" , backgroundSize:'cover'}}>
              <IonGrid>
                <IonRow>
                  <IonCol size='10' style={{color:'#202021',paddingLeft: '1rem'}} > 
                    <strong style={{fontSize:'1.2em'}}>{this.state.MaintananceList}</strong> <br/>
                    <small>{this.state.vehicle} {this.state.vehicleSelect}</small>
                  </IonCol>
                  <IonCol size='2' className='set-center'> <IonIcon icon={closeCircleOutline} color='medium' onClick={()=>{this.setShowModal(false)}} style={{fontSize:'1.5em'}} /> </IonCol>
                </IonRow>
                {
                  this.state.mantainList.map((mainList) => 
                <IonRow key={mainList.mantain_id} style={{marginTop: '1.5rem',backgroundColor:'rgba(255, 255, 255 )',borderRadius:'10px',padding:'2px',boxShadow:' 1px -3px 37px -8px rgba(143,143,143,.4)'}} >
                      {mainList.scheduled === true ? 
                          <IonCol size='12' className='set-center' style={{backgroundColor:'#ff8a66',color:'#fcfdfe',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',flexDirection:'row'}}>
                            <IonIcon icon={closeCircleOutline} />
                            <small>&nbsp; {this.state.repairStatus}</small>
                          </IonCol>
                          :
                          <IonCol size='12'  className='set-center' style={{backgroundColor:'#a5cf93',color:'#fcfdfe',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',flexDirection:'row'}} >
                            <IonIcon icon={checkmarkCircleOutline} />
                            <small>&nbsp; {this.state.normalStatus}</small>
                          </IonCol>
                      } 
                  <IonCol size='2' className='set-center' >
                     <IonIcon icon={cog} color='primary' style={{fontSize:'1.5em'}} />
                  </IonCol>
                  <IonCol size='7'>
                    <strong  style={{color: '#202021'}} > {mainList.name} </strong> <br/>
                    <small style={{color: '#202021'}} >{this.state.scheduled} {mainList.mantain_when }</small> <br/>
                    <small style={{color: '#202021'}} >{this.state.alertWhen} {mainList.warnning_before} </small>
                  </IonCol><IonCol  size='1'></IonCol>
                  
                  <IonCol size='12' style={{borderTop:'1px solid #ccc',color:'#202021',backgroundColor:'rgba(242, 242, 242,.7)'}}>
                    <IonRow style={{justifyContent:'center'}}> 
                       <IonCol size='6' className='ion-text-center' 
                       onClick={()=>{this.updateEachRepair( mainList.mantain_id,1)}}> 
                          <IonIcon icon={checkmarkCircle} color='success' style={{fontSize:'1.5rem'}}/>
                          <br/>
                          <small>{this.state.btnSuccess}</small>
                       </IonCol>
                       <IonCol size='6' className='ion-text-center'
                        onClick={()=>{this.updateEachRepair( mainList.mantain_id,2)}}> 
                          <IonIcon icon={closeCircleOutline} color='danger' style={{fontSize:'1.5rem'}} />
                           <br/>
                          <small >{this.state.btnCancle}</small> 
                        </IonCol>
                    </IonRow>
                  </IonCol>
                </IonRow>
                )}
              </IonGrid>
          </div>
          {/* <IonActionSheet
            isOpen={this.state.actionSheetDay}
            onDidDismiss={() => this.actionSheetDay(false)}
            cssClass='my-custom-class'
            buttons={[{
              text: 'Delete',
              role: 'destructive',
              icon: trash,
              handler: () => {
                console.log('Delete clicked');
              }
            },{
              
            }
          ]}
          >
        </IonActionSheet>
        <IonActionSheet
            isOpen={this.state.actionSheetDistance}
            onDidDismiss={() => this.actionSheetDistance(false)}
            cssClass='my-custom-class'
            buttons={[{
              text: 'Delete',
              role: 'destructive',
              icon: trash,
              handler: () => {
                console.log('Delete clicked');
              }
            }]}>
        </IonActionSheet> */} 
        </IonModal>
        <IonAlert
          isOpen={this.state.actionSheetDay}
          mode='ios'
          onDidDismiss={() => this.actionSheetDay(false)}
          cssClass='my-custom-class'
          header={this.state.vehicleSelect}
          subHeader={this.state.alertSubheader}
          message={this.state.alertCondition}
          inputs={[
            {
              name: 'repairNext',
              type: 'text',
              placeholder: 'ซ่อมครั้งถัดไป'
            }]}
          buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel');
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  console.log('Confirm Ok');
                }
              }
          ]} 
          ></IonAlert>

        <IonAlert
          isOpen={this.state.actionSheetDistance}
          mode='ios'
          onDidDismiss={() => this.actionSheetDistance(false)}
          cssClass='my-custom-class'
          header={this.state.vehicleSelect}
          subHeader={this.state.alertSubheader}
          message={this.state.alertCondition}
          inputs={[
            {
              name: 'repairNext',
              type: 'number',
              placeholder: 'ซ่อมครั้งถัดไป'
            }]}
          buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel');
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  console.log('Confirm Ok');
                }
              }
          ]} 
          ></IonAlert> 
        <IonToast
            isOpen={this.state.toastErr}
            onDidDismiss={() => this.toastErr(false)}
            message={alertFail}
            position="bottom"
            color='dark'
            buttons={[ 
              {
                text: ok, 
                handler: () => {
                  this.toastErr(false)
                }
              }
            ]}
          />
          <IonToast
            isOpen={this.state.toastSuccess}
            onDidDismiss={() => this.toastSuccess(false)}
            message={alertSuccess}
            position="bottom"
            color='primary'
            buttons={[ 
              {
                text: ok, 
                handler: () => {
                  this.toastSuccess(false)
                }
              }
            ]}
          />
      </>
    )
  }
}