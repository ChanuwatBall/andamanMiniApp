import React from 'react';
import { IonButton, IonCol, IonDatetime, IonGrid, IonIcon,IonInput,IonItem,IonLabel,IonModal, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonToast, IonToggle} from '@ionic/react';
import { addCircleOutline, add, build, calendar ,  closeCircleOutline, cog,  gitMerge, keypad,  lockClosed, lockOpen, notificationsOutline, globe } from 'ionicons/icons';
import moment from 'moment';
import th from '../th.json'
import en from '../en.json'
import { Plugins } from "@capacitor/core";
import axios from 'axios'
import api from '../api.json'

const { Storage } = Plugins;
export default class SearchCar  extends React.Component{

  state={
    toastErr:false,
    toastSuccess: false,
    addNewMaintenace : "เพิ่มรายการซ่อมบำรุงใหม่" ,
		maintenanceName : "ชื่อการซ่อม" ,
		maintenanceCondition : "เงื่อนไขการซ่อม",
		maintenanceCondition_time: "เวลา" ,
		maintenanceCondition_distance : "ระยะทาง",
    searchMaintenece : "ค้นหารายการซ่อม" ,
		distance_unit : "กม./ไมล์",
    day_unit: "วัน" ,
		cancel : "ยกเลิก",
		ok : "ตกลง" ,
		next_maintenance : "ครั้งต่อไป" ,
		days : "จำนวนวัน" , 
		alertSuccess:"ดำเนินการสำเร็จ",
		alertFail:"ดำเนินการไม่สำเร็จ",
    keyword:'',
    showModal : false,
    vehicleInput:'',
    maintan: [], 
    condition: 1,
    daysNumber:'',
    mileage:'',
    checkedPublic : false,
    alertBeforCondition: '0' ,
    dateSelect: moment().format() ,
    conditionSelect:[
      {id: 1, name: "เวลา"},
      {id: 2, name: "ระยะทาง"}
    ],
   
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
        miantenance_id: 5632 ,
        miantenance_name : 'เปลี่ยนยาง',
        miantenance_condition : 1 ,
        miantenance_next : '5000 ',
        is_public : true
      }
    ],

    carSelect: '', 
    maintenanceList : [
      {
        miantenance_id: 5521 ,
        miantenance_name : 'เปลี่ยนถ่ายน้ำมันเครื่อง',
        miantenance_condition : 1 ,
        miantenance_next : '365',
        is_public : false
      },
      {
        miantenance_id: 5632 ,
        miantenance_name : 'เปลี่ยนยาง',
        miantenance_condition : 2 ,
        miantenance_next : '5000',
        is_public : true
      },
      {
        miantenance_id: 5644 ,
        miantenance_name : 'เปลี่ยนไฟเบรคหลัง',
        miantenance_condition : 1 ,
        miantenance_next : '365',
        is_public : false
      }
    ]
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

  setSelectMaintan=(e:any)=>{
    this.setLanguage()
    this.setState({
      maintan : e
    },()=>{
      console.log(this.state.maintan)
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

  setLanguage=async()=>{
    let lang = await Storage.get({key:'language'})
    if(lang.value === 'th'){
      let l = th.maintenence
      this.setState({
        addNewMaintenace : l.addMainteneceTitle ,
        maintenanceName : l.maintenanceName ,
        maintenanceCondition : l.maintenanceCondition,
        maintenanceCondition_time:  l.maintenanceCondition_time ,
        maintenanceCondition_distance : l.maintenanceCondition_distance,
        distance_unit : l.distance_unit,
        day_unit: l.day_unit ,
        cancel : l.cancel,
        ok : l.ok ,
        next_maintenance : l.next_maintenance ,
		    days :  l.days ,
        searchMaintenece : l.searchMaintenece ,
        alertSuccess: l.alertSuccess ,
		    alertFail: l.alertFail,
      })
    }else if(lang.value === 'en'){
      let l = en.maintenence
      this.setState({
        addNewMaintenace : l.addMainteneceTitle ,
        maintenanceName : l.maintenanceName ,
        maintenanceCondition : l.maintenanceCondition,
        maintenanceCondition_time:  l.maintenanceCondition_time ,
        maintenanceCondition_distance : l.maintenanceCondition_distance,
        distance_unit : l.distance_unit,
        day_unit: l.day_unit ,
        cancel : l.cancel,
        ok : l.ok ,
        next_maintenance : l.next_maintenance ,
		    days :  l.days  ,
        searchMaintenece : l.searchMaintenece,
        alertSuccess: l.alertSuccess ,
		    alertFail: l.alertFail,
      })
    }
  }

  config=async ()=>{
    let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
    let userID = await this.getStorage('userId')

    axios.get(apiHost+'/maintenList' ,{
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
        maintenanceList : res.data.list ,
        listBackup  : res.data.list ,
      })
    }).catch(err=>{
      console.log('err ',err)
    })
  }

  async componentDidMount(){
    this.setLanguage()
    this.setState({
      listBackup : this.state.maintenanceList
    }) 

    let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
    let userID = await this.getStorage('userId')

    this.setState({
      listBackup : this.state.carlist ,
      carlist: []
    }) 
    console.log( JSON.parse(userID || '{}')) 

    this.config()
    axios.get(apiHost+'/maintennanceCondition' ,{
			headers: {
        "user_id" : JSON.parse(userID || '{}'),
				"language": lang  ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
      console.log('res',res)
      if( res.data.list !== null){
        this.setState({
           conditionSelect : res.data.list
         })
      }
     
    }).catch(err=>{
      console.log('err ',err)
    }) 
  }

  addNewRepair= async ()=>{
    let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
    let userID = await this.getStorage('userId')

    if(this.state.condition === 1){
      this.setState({
        mileage : null
      })
    }else{
      this.setState({
        daysNumber : null
      })
    }
      
    axios.post(apiHost+'/addNewRepair',{
      repair_name :this.state.vehicleInput, 
      condition_id : this.state.condition,
      day: this.state.daysNumber ,
      distance : this.state.mileage
    },{
			headers: {
        "user_id" : JSON.parse(userID || '{}'),
				"language": lang  ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
      console.log('res',res)
      if(res.data.result === true){
        this.config() 
        this.toastSuccess(true)
        setTimeout(()=>{
          this.toastSuccess(false)
          this.setShowModal(false)
        })
      }else{
        console.log('fail')
        this.toastErr(true)
        setTimeout(()=>{
          this.toastErr(false)
        })
      } 
    }).catch(err=>{
      console.log('err ',err)
      this.toastErr(true)
        setTimeout(()=>{
          this.toastErr(false)
        })
    })
  }

  searchCar=(e:any)=>{
      console.log("vehicle.lenght", e.length)
    this.setState({
      keyword : e
    },()=>{
      if(this.state.keyword.length >= 3){
        this.setState({
          maintenanceList : this.state.listBackup.filter((listBackup) => listBackup.miantenance_name.toLowerCase().search(this.state.keyword.toLowerCase()) !== -1)
        })
      }else if(this.state.keyword.length < 3){
        this.setState({
          maintenanceList : this.state.listBackup
        })
      }
    }) 
  }

  setShowModal=(e:any)=>{
    this.setState({
      showModal :e
    })
  }

  setChecked=(e:any)=>{
    this.setState({
      checkedPublic : e
    })
  }

  copyFromVehicle=(e:any)=>{
  console.log("e", e)
    this.setState({
      carSelect : e , 
    },()=>{
      if(this.state.carSelect !== ""){
        console.log("carSelect", this.state.carSelect)
        this.setState({
          maintan :  ["ถ่ายน้ำมัน", "เปลี่ยนยาง", "เปลี่ยนไฟเบรคท้าย"]
        })
      }
    }) 
  }
  removeVehicle=(e:any)=>{
    var array = [...this.state.maintan]; // make a separate copy of the array 
    if (e !== -1) {
      array.splice(e, 1);
      this.setState({maintan: array});
    }
  }

  setSelectedDate=(e:any)=>{
    this.setState({
      dateSelect : e
    },()=>{
      let today = moment().format() 
      let dateDiffer =   moment(e).diff(today, 'days');
    //  dateDiffer +=1
      console.log('dateDiffer', dateDiffer)
      this.setState({
        daysNumber : dateDiffer
      })
    }) 
  } 

  closeModal=()=>{
    this.setState({
      vehicleInput :'' ,
      condition:1 ,
      daysNumber:'',
      mileage:''
    },()=>{this.setShowModal(false)}) 
  }

  render(){
    return(
      <> 
      <IonGrid  style={{padding:'.5rem'}} >
        <IonRow>
            <IonCol size='10' >
                <IonSearchbar placeholder={this.state.searchMaintenece}    mode='ios' onIonChange={e => this.searchCar(e.detail.value!)} ></IonSearchbar>
              </IonCol>
              <IonCol size='2' className='set-center' style={{alignItems:'flex-start'}} > 
                <IonIcon icon={add}  color='dark' style={{fontSize:'1.5em'}} onClick={()=>{this.setShowModal(true)}} />
            </IonCol>
        </IonRow>
      

        { this.state.maintenanceList.map((maintenanceList) => 
          <IonRow key={maintenanceList.miantenance_id} style={{marginBottom:'.5rem'}}>
            <IonCol size='2'>
              <IonIcon icon={cog} color='primary' style={{fontSize:'1.6em'}} />
            </IonCol>
            <IonCol size='9'>
              <IonLabel style={{fontWeight:'600'}}>{maintenanceList.miantenance_name}</IonLabel><br/>
              <small>{this.state.next_maintenance}  {maintenanceList.miantenance_next}</small> 
              {
                maintenanceList.miantenance_condition === 1 ? 
                <small> {this.state.day_unit}</small>: 
                <small> {this.state.distance_unit}</small>
              }
            </IonCol>
            <IonCol  size='1' style={{fontSize:'1.5em'}}> 
            </IonCol>
          </IonRow>
        )}
      </IonGrid> 
        <IonModal onDidDismiss={()=>{this.setShowModal(false)}} isOpen={this.state.showModal} cssClass='add-mantain-modal' >
          <div className='mantain-list-modal' style={{backgroundImage:"url('../assets/images/bg-mainten.png')" , backgroundSize:'cover'}}>
            <IonRow style={{justifyContent:'flex-end',marginBottom:'.5rem'}} >
                <IonCol size='2' className='set-center' onClick={()=>{this.closeModal()}} >
                  <IonIcon icon={closeCircleOutline} color='medium' style={{fontSize:'1.6em'}} />
                </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size='12' className='set-center'   style={{flexDirection:'row', justifyContent:'flex-start', color:'#134985'}} >
                <IonIcon icon={addCircleOutline}  style={{fontSize:'1.6em'}}  /> &nbsp;
                 <strong>{this.state.addNewMaintenace}</strong><br/><br/>
              </IonCol>
            </IonRow>
            <IonRow className='input-add-maintan' >
              <IonCol size='2' className='set-center' > 
                <IonIcon icon={cog}  color='dark' style={{fontSize:'1.6em'}} />
              </IonCol>
              <IonCol size='10' >
                <div> 
                    <IonInput color='medium' value={this.state.vehicleInput} placeholder={this.state.maintenanceName} onIonChange={e => this.setState({vehicleInput: e.detail.value!})}></IonInput> 
                </div>
              </IonCol>
            </IonRow>

            <IonRow className='input-add-maintan' >
              <IonCol size='2' className='set-center' > 
                <IonIcon icon={gitMerge}  color='dark' style={{fontSize:'1.6em'}} />
              </IonCol>
              <IonCol size='10' >
                <div> 
                  <IonItem lines='none' >
                      <IonLabel color='medium'>{this.state.maintenanceCondition}</IonLabel>
                      <IonSelect value={this.state.condition} mode='ios' okText={this.state.ok} cancelText={this.state.cancel} placeholder="Select One" onIonChange={e => this.setState({condition : e.detail.value})}>
                        {/* <IonSelectOption value="time">{this.state.maintenanceCondition_time}</IonSelectOption>
                        <IonSelectOption value="distance">{this.state.maintenanceCondition_distance}</IonSelectOption> */}
                        {this.state.conditionSelect.map((conditionSelect) =>
                           <IonSelectOption key={conditionSelect.id} value={conditionSelect.id} >{conditionSelect.name}</IonSelectOption>
                        )}
                      </IonSelect>
                  </IonItem>
                </div>
              </IonCol>
            </IonRow>

            <div style={{borderBottom:'1px solid #ccc',width:'100%',marginTop:'.5rem',padding:'.5rem',color:'#666'}}>
              <small> -- {this.state.maintenanceCondition} </small>
            </div>
            {
              this.state.condition === 1 ?
              <IonGrid>
                <IonRow  className='input-add-maintan' >
                  <IonCol size='2' className='set-center' > 
                      <IonIcon icon={keypad}  color='dark' style={{fontSize:'1.6em'}} />
                    </IonCol>
                    <IonCol size='8'>
                      <IonItem lines='none' color='transparent'> 
                        <IonInput value={this.state.daysNumber} type='number' placeholder='0' onIonChange={e => this.setState({dateSelect : moment().add(e.detail.value! ,'day').format(),daysNumber: e.detail.value! })}></IonInput> 
                      </IonItem>
                    </IonCol>
                    <IonCol size='2' className='set-center'>
                      <IonLabel color='medium'>{this.state.day_unit}</IonLabel>
                    </IonCol>
                </IonRow>
                {/* <IonRow className='input-add-maintan' >
                  <IonCol size='2' className='set-center' > 
                    <IonIcon icon={calendar }  color='dark' style={{fontSize:'1.6em'}} />
                  </IonCol>
                  <IonCol size='10'>
                    <IonItem lines='none' color='transparent'>
                      <IonLabel  color='medium'>ซ่อมบำรุงครั้งแรก</IonLabel>
                      <IonDatetime  displayFormat="DD/MM/YYYY"  placeholder="Select Date" value={this.state.dateSelect} onIonChange={e => this.setSelectedDate(e.detail.value!)}></IonDatetime>
                    </IonItem>
                  </IonCol>
                </IonRow>  */}
              </IonGrid> :
              this.state.condition === 2 ?
              <IonRow className='input-add-maintan' >
                <IonCol size='2' className='set-center' > 
                  <IonIcon icon={build}  color='dark' style={{fontSize:'1.6em'}} />
                </IonCol>
                <IonCol size='7' > 
                    <IonInput value={this.state.mileage} placeholder={this.state.maintenanceCondition_distance} color='medium' type='text' onIonChange={e => this.setState({mileage: e.detail.value!})}></IonInput> 
                </IonCol>
                <IonCol size='3' className='set-center'>
                    <IonLabel  color='medium'>{this.state.distance_unit}</IonLabel>
                </IonCol>
              </IonRow>:
              <IonItem lines='none'></IonItem> 
            }  
          <IonRow style={{marginTop:'.5rem'}} >
          <IonButton 
              color='dark'
              mode='ios'
              className='btn-log'
              expand='block'
              type="button"
              style={{width:'100%',height:'2.5rem'}}
              onClick={()=>{ this.addNewRepair() }}
            >
              {this.state.addNewMaintenace}
			</IonButton>
          </IonRow> 
          </div>  
        </IonModal>  
        <IonToast
            isOpen={this.state.toastErr}
            onDidDismiss={() => this.toastErr(false)}
            message={this.state.alertFail}
            position="bottom"
            color='dark'
            buttons={[ 
              {
                text: this.state.ok, 
                handler: () => {
                  this.toastErr(false)
                }
              }
            ]}
          />
          <IonToast
            isOpen={this.state.toastSuccess}
            onDidDismiss={() => this.toastSuccess(false)}
            message={this.state.alertSuccess}
            position="bottom"
            color='primary'
            buttons={[ 
              {
                text: this.state.ok, 
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