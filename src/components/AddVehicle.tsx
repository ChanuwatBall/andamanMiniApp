import React from 'react';
import { IonBadge, IonButton, IonCheckbox, IonCol, IonIcon,IonInput,IonItem,IonLabel,IonModal, IonPopover, IonRow, IonSelect, IonSelectOption, IonToast} from '@ionic/react';
import { addCircleOutline, add , car , checkmarkCircleOutline, closeCircleOutline, cog , copy , list, play  } from 'ionicons/icons';
import th from '../th.json'
import en from '../en.json' 
import { Storage } from '@capacitor/storage';
import axios from 'axios'
import api from '../api.json'
import Select from 'react-select';
import List from './listCar'
import moment from 'moment'
 
let carNumber = [{value : 0 , label: '' , latitude: 0, longitude:0 }]
let selectedCar = {value: 0 ,label:'', latitude: 0, longitude:0} ;
let selectPlaceHold ;

export default class SearchCar  extends React.Component{

  state={
    toastErr:false,
    toastSuccess: false,
    selectedOption: null,
		selectPlaceHold : 'ALL' ,
		selectValue: 0,
		selectLabel: '',
    chooseCar:null,
    popoverList:false,

    addCarAndMaintenence : "เพิ่มรถและรายการซ่อม",
    vehiclePlaceholder : "ทะเบียนรถ",
    copyMaintainFrom : "คัดลอกรายการซ่อม",
    selectMaintainType : "เลือกรายการซ่อม",
    ok:"ตกลง",
    cancel:"ยกเลิก" ,

    keyword:'',
    showModal :false,
    vehicleInput:'',
    maintan: [{ 
      name : 'เปลี่ยนไฟเบรคท้าย',  mantain_id: 323 , next:  "02/01/2564"   , scheduled : true ,  mantain_when: '1000 กม.',  warnning_before: '800',type_id:0}],
    maintenSelect:[{
      miantenance_condition: 2,
      miantenance_id: 3,
      miantenance_name: "เปลี่ยนน้ำมันเครื่อง",
      miantenance_next: "10000",
      choose:false
    }],
    maintenlist:[{
      miantenance_condition: 2,
      miantenance_id: 3,
      miantenance_name: "เปลี่ยนน้ำมันเครื่อง",
      miantenance_next: "10000",
      choose:false
    }],
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

    List:[{
			device_id : 0,
			canCutEngin: false,
			name:"" ,
			event_id: 0,
			latitude: 0 ,
			longitude: 0,
			expiration_date: "" ,
			lastEvent : "",
			address: "" ,
			event_stamp:0,
			fuel_liters:"",
			heading:0,
			satellites:"",
			speed:"",
			status:0,
			status_time:"",
			temperature:"",
			fld_signalStrength:"",
			fld_engineLoad:"",
			fld_sensorHigh: "0",
			fld_driverID:"",
			fld_driverMessage:"" ,
			modal: 0,
			status_name:'',
			phone_number:'',
			online:0,
			status_engin: null,
			mile:0
		}],

    carSelect: 0, 
  
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

  setLanguage= async ()=>{
    let lang = await this.getStorage('language') 
    if(lang === 'th'){
      let l = th.maintenence
      this.setState({
        searchCar : l.searhCarTitle ,
        addCarAndMaintenence : l.addMainteneceTitle,
        vehiclePlaceholder : l.vehicle ,
        copyMaintainFrom : l.copyMaintainFrom,
        selectMaintainType : l.selectMaintainType,
        ok: l.ok,
        cancel: l.cancel ,
      })
    }else if(lang === 'en'){
      let l = en.maintenence
      this.setState({
        searchCar : l.searhCarTitle ,
        addCarAndMaintenence : l.addMainteneceTitle,
        vehiclePlaceholder : l.vehicle ,
        copyMaintainFrom : l.copyMaintainFrom,
        selectMaintainType : l.selectMaintainType,
        ok: l.ok,
        cancel: l.cancel ,
      })
    }
  }

  async componentDidMount(){
    let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
    let userID = await this.getStorage('userId')

    this.setState({
      listBackup : this.state.carlist ,
      maintan:[] ,
      maintenSelect:[]
    })
    this.setLanguage()
    carNumber =[]
  
		let device = await this.getStorage('deviceID') 
		if(device === null ||device === undefined || device === ''){
			device = '0'
		} 

    let lang = await this.getStorage('language')
		let car = await this.getStorage( 'carID')   
		if(device === null ||device === undefined || device === ''){
			device = '0'
		}
		console.log("previousPath -> componentDidMount -> device.value", device)
 
		 
		if(lang === '"th"'|| lang === 'th'){
			selectPlaceHold = th.home.carList
			this.setState({
				selectPlaceHold : selectPlaceHold
			})
		}else if(lang === '"en"' || lang === 'en'){
			selectPlaceHold = en.home.carList
			this.setState({
				selectPlaceHold : selectPlaceHold
			})
		}

    let carList =await this.getStorage('carList')
		this.setState({
			List : JSON.parse(carList || '{}')
		},()=>{
      this.setState({
        List : this.state.List.filter((List) => List.event_id !== null)
      })
    })

    for (let index = 0 ; index < this.state.List.length; index ++){
      carNumber[index+1] = {
        value : this.state.List[index].device_id ,
        label: this.state.List[index].name ,
        latitude: this.state.List[index].latitude ,
        longitude : this.state.List[index].longitude 
      }
    }
 
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
        
      })
    }).catch(err=>{
      console.log('err ',err)
    })

    axios.get(apiHost+'/maintenList' ,{
			headers: {
        "user_id" : JSON.parse(userID || '{}'),
				"language": lang  ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
      console.log('maintenList',res.data) 
      this.setState({
        maintenlist : res.data.list
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

  copyFromVehicle=async(e:any)=>{
    console.log(e)

    let lang =await this.getStorage( 'language');
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
    let userID = await this.getStorage('userId')
    

    axios.get(apiHost+'/maintenFromCar' ,{
			headers: {
        "user_id" : JSON.parse(userID || '{}'),
        "car_id": e ,
				"language": lang  ,
				"token" : token ,
				"authenication": api.authorization,
				"version":api.version
			}
		}).then(res => {
      console.log('res',res)
      if(res.data.list !== null){
        console.log('list ',res.data.list)
        this.setState({ 
          maintan :   res.data.list
        },()=>{ 
           let filter: any[] = [] 

          for(let i =0; i <= this.state.maintan.length-1 ; i++){
            let filterKeep = this.state.maintenlist.filter((maintenlist) => maintenlist.miantenance_id === this.state.maintan[i].type_id )
            filter = [...filter , ...filterKeep  ]
            filter[i].choose = true
          }

          this.setState({
            maintenSelect: filter
          }) 
          console.log('filter ',filter)

          // for(let i =0; i <= filter.length-1 ; i++){
          //   this.setState({
          //     maintenlist : this.state.maintenlist.filter((maintenlist) => maintenlist.miantenance_id !== filter[i].mantain_id)
          //   },()=>{
          //     this.setState({
          //       maintenlist : [...this.state.maintenlist , ...[filter[i]]]
          //     })
          //   })
          // } 
          // console.log('filter ',filter)
        })
      }
      
    }).catch(err=>{
      console.log('err ',err)
    })

  }

  removeVehicle=(e:any)=>{
    var array = [...this.state.maintan]; // make a separate copy of the array 
    if (e !== -1) {
      array.splice(e, 1);
      this.setState({maintan: array});
    }
  }

  filterMainten=(e:any)=>{
    let maintenname: any[] = []

    console.log('e ',e)
    maintenname = []
    try{
      this.setState({
        maintenSelect : e ,
        maintan :[]
      },()=>{ 

      })                                                                                                                                                                                                                       
    }catch{
      console.log('err')
    }

   

    console.log('maintenname ',maintenname) 
    try{
      // this.setState({
      //   maintan:maintenname
      // }) 
    }catch{
      console.log('err')
    }
     
  //   for(let i=0; i<= e.length-1 ;i++){
  //     let filteredMainten =  this.state.maintenlist.filter((maintenlist) => maintenlist.mantain_id === e[i])
  //     maintenname= [...maintenname , ...filteredMainten ] 
  //   }

  //   let mainten: any[] = []
  //   for(let i=0; i<= maintenname.length-1 ;i++){
  //     mainten[i]= maintenname[i].name
  //   } 
 
  //   try{
  //     this.setState({
  //       maintan: [...this.state.maintan, ...mainten]
  //     },()=>{console.log(this.state.maintan)}) 
  //   }catch{
  //     console.log('err')
  //   }
   }

   popoverList=(e:any)=>{
     this.setState({
      popoverList : e 
     })
   }
   
  cheklastUpdate=(id:any, checked:any )=>{ 
    console.log('checked ',checked )
    let lastChange = this.state.maintenlist.filter((maintenlist) => maintenlist.miantenance_id === id)
    console.log('lastChange ',lastChange)
    let changeList = lastChange[0]
    changeList.choose = checked 
 
    let choosedMainten = this.state.maintenlist.filter((maintenlist)=> maintenlist.choose === true)
    let maintemForm = [{  type_id: 4,choose: true, disable: false, mantain_id: 9, mantain_when: "3",   name: "เปลี่ยนสี",  scheduled: false,  warnning_before: "2021-04-10 09:33:46"  }]
    
    //choosedMainten = this.state.maintenlist.filter((maintenlist)=> maintenlist.choose === true)
    console.log('choosedMainten ', choosedMainten)

   
    try{
      let newMainten: any[] =[]
      // for(let i=0; i<= this.state.maintan.length ;i++){
      //   choosedMainten = choosedMainten.filter((choosedMainten) => choosedMainten.miantenance_id !== this.state.maintan[i].type_id )
      // } 
      this.setState({
        // maintenlist : this.state.maintenlist ,
         maintenSelect : choosedMainten 
       },()=>{console.log('maintenSelect ',this.state.maintenSelect)})

      for(let i=0; i<= choosedMainten.length-1;i++){
        console.log('choosedMainten ' ,choosedMainten)
  
        maintemForm[i].type_id = choosedMainten[i].miantenance_id
        maintemForm[i].name = choosedMainten[i].miantenance_name

        //newMainten=[...newMainten, ...maintemForm]
        console.log('maintemForm ' ,newMainten) 
      }
      

    }catch{
      console.log('err')
    }
 }
  

 submit=async ()=>{
  let lang =await this.getStorage( 'language');
  let token =await this.getStorage( 'token');
  let apiHost = await this.getStorage( 'api');
  let userID = await this.getStorage('userId')
  
   console.log(this.state.maintenSelect)
   let selectMainyenID =''
   for(let i =0; i<= this.state.maintenSelect.length-1; i++){
    selectMainyenID = selectMainyenID+'#'+this.state.maintenSelect[i].miantenance_id
   }

   console.log('selectMainyenID ',selectMainyenID)

    axios.post(apiHost+'/addNewCarMaintennace',{
      car_id : this.state.chooseCar,
      mainten_id: selectMainyenID 
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
      console.log('res ',res) 
      if( res.data.result  === true){
        this.setShowModal(false);  
        this.toastSuccess(true)
        setTimeout(()=>{
          this.toastSuccess(false)
        },3000)
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
  

  render(){
    return(
      <>
        <IonIcon icon={add} color='dark' style={{fontSize:'1.5em'}} onClick={()=>{this.setShowModal(true)}} />

        <IonModal onDidDismiss={()=>{this.setShowModal(false)}} isOpen={this.state.showModal} cssClass='report-mantain-modal'>
          <div className='mantain-list-modal' style={{backgroundImage:"url('../assets/images/bg-mainten.png')" , backgroundSize:'cover'}}>
            <IonRow style={{justifyContent:'flex-end'}} >
                <IonCol size='2' className='set-center' onClick={()=>{this.setShowModal(false)}} >
                  <IonIcon icon={closeCircleOutline} color='medium' style={{fontSize:'1.6em'}} />
                </IonCol>
            </IonRow> 

            <IonRow style={{marginBottom:'.5rem'}}>
              <IonCol size='12' className='set-center' style={{flexDirection:'row', justifyContent:'flex-start'}} >
                <IonIcon icon={addCircleOutline}  color='dark' style={{fontSize:'1.6em'}}  /> &nbsp;
                 <strong style={{color:'#202021'}}> เพิ่มการซ่อม </strong><br/><br/>
              </IonCol>
            </IonRow>
            {/* <IonRow className='input-add-maintan' >
              <IonCol size='2' className='set-center' > 
                <IonIcon icon={car}  color='dark' style={{fontSize:'1.6em'}} />
              </IonCol>
              <IonCol size='10' >
                <div> 
                    <IonInput value={this.state.vehicleInput} color="medium" placeholder={this.state.vehiclePlaceholder} 
                    onIonChange={e => this.setState({vehicleInput: e.detail.value!})}></IonInput> 
                </div>
              </IonCol>
            </IonRow> */}

            <IonRow className='input-add-maintan' >
              <IonCol size='2' className='set-center' > 
                <IonIcon icon={car}  color='dark' style={{fontSize:'1.6em'}} />
              </IonCol>
              <IonCol size='10' >
                <div>  
                  <IonItem lines='none'>
                     <IonLabel color='medium' >{this.state.vehiclePlaceholder}</IonLabel> 
                    <IonSelect value={this.state.chooseCar}  mode='ios'  cancelText={this.state.cancel} okText={this.state.ok}   
                    onIonChange={e =>{  
                      this.setState({chooseCar :  e.detail.value },()=>{
                        console.log('chooseCar', this.state.chooseCar )
                      })
                    }} >
                      {
                        carNumber.map((carNumber,index)=> 
                        <IonSelectOption key={index} value={carNumber.value}>{carNumber.label}</IonSelectOption> 
                      )}
                    </IonSelect>
                  </IonItem>
                </div>
              </IonCol>
            </IonRow>

            <IonRow className='input-add-maintan' >
              <IonCol size='2' className='set-center' > 
                <IonIcon icon={copy}  color='dark' style={{fontSize:'1.6em'}} />
              </IonCol>
             
              <IonCol size='10' >
                <div>  
                  <IonItem lines='none'>
                  <IonLabel color='medium' >{this.state.copyMaintainFrom}</IonLabel>
                  <IonSelect value={this.state.carSelect}  mode='ios'  cancelText={this.state.cancel} okText={this.state.ok} 
                  onIonChange={e =>{  
                    this.setState({carSelect :  e.detail.value }) ;
                    this.copyFromVehicle(e.detail.value)
                  }} >
                    {
                      this.state.carlist.map((carlist,index)=> 
                      <IonSelectOption key={index} value={carlist.id}>{carlist.vehicle}</IonSelectOption> 
                    )}
                  </IonSelect>
                  </IonItem>
                </div>
              </IonCol>
            </IonRow>

            <IonRow className='input-add-maintan' >
              <IonCol size='2' className='set-center' > 
                <IonIcon icon={list}  color='dark' style={{fontSize:'1.6em'}} />
              </IonCol> 
              <IonCol size='10' >
                <div>  
                <IonItem lines='none' onClick={()=>{this.popoverList(true)}}>
                  <IonLabel color='medium' >{this.state.addCarAndMaintenence}</IonLabel>
                 
                  {/* <IonSelect value={this.state.maintenSelect}  mode='ios' multiple={true} okText={this.state.ok} cancelText={this.state.cancel} onIonChange={(e)=>{this.filterMainten( e.detail.value )}}>
                    {
                      this.state.maintenlist.map((maintenlist , index) => 
                      <IonSelectOption key={maintenlist.mantain_id} selected={maintenlist.choose} value={maintenlist.mantain_id}>{maintenlist.name}</IonSelectOption>
                    )} 
                  </IonSelect> */}
                    <IonIcon icon={play} style={{transform:'rotate(90deg)', fontSize:'.7em',color:'#aaa'}} />
                  </IonItem>
                </div>
              </IonCol>
            </IonRow>
          {/*
            {
              this.state.maintan.length > 0 ? 
                <div style={{width:'100%',padding:'.5rem',borderBottom:'1px solid #eee'}}>
                  {
                    this.state.maintan.map((maintan,index) => 
                      <IonBadge color="primary" key={index}  style={{margin:'.2rem',}} >   {maintan.name}</IonBadge>
                    )}
                </div> :
              <div></div>
            } */} 
            {
              this.state.maintenSelect.length > 0 ? 
                <div style={{width:'100%',padding:'.5rem',borderBottom:'1px solid #eee'}}>
                  {
                    this.state.maintenSelect.map((maintenSelect,index) => 
                      <IonBadge color="primary" key={index}  style={{margin:'.2rem',}} > {maintenSelect.miantenance_name}</IonBadge>
                    )}
                </div> :
              <div></div>
            }
          <IonRow style={{marginTop:'2rem'}} >
            <IonCol size='12' > 
              <IonButton 
                color='dark'
                mode='ios'
                className='btn-log'
                expand='block'
                type="button"
                style={{width:'100%',height:'2.5rem'}}
                onClick={()=>{this.submit()}}
              >
                {this.state.addCarAndMaintenence}
			        </IonButton>
            </IonCol>
          </IonRow>
          </div>  
        </IonModal>  
        <IonPopover
          cssClass='popover-maintennance-list' 
          isOpen={this.state.popoverList}
          onDidDismiss={() => {this.popoverList(false)}}
          mode='ios'
        >
           <div style={{minWidth:'80vw',minHeight:'30vh'}} >
              <IonRow>
                <IonCol size='12' style={{padding:'1rem',paddingLeft:'1rem',borderBottom:'1px solid #ccc'}} >
                  <strong> {this.state.addCarAndMaintenence}</strong>
                </IonCol>
              </IonRow>
             <div style={{width:'100%',overflow:'scroll',minHeight:'30vh',maxHeight:'60vh'}}>
             <IonRow>
                <IonCol size='12'  >
                  {
                    this.state.maintenlist.map((maintenlist , index) =>  
                      <IonRow  key={index} color='transparent' style={{marginTop:'.5rem'}} >
                        <IonCol size='2' className='set-center'>
                         <IonIcon icon={cog} color='primary' style={{fontSize:'1.5em'}} /> 
                        </IonCol>
                        <IonCol size='8' >
                          <IonLabel style={{fontSize:'.8em'}} > {maintenlist.miantenance_name} </IonLabel><br/>
                        </IonCol>
                        <IonCol size='2' className='set-center' >
                            <IonCheckbox checked={maintenlist.choose} mode='ios' onIonChange={e => this.cheklastUpdate(maintenlist.miantenance_id,e.detail.checked )} />
                        </IonCol>
                      </IonRow>   
                    )
                  } 
                </IonCol>
              </IonRow> 
             </div>
             <div style={{width:'100%',height:'3rem'}} ></div>
              <IonRow style={{borderTop:'1px solid #ccc',padding:'.5rem',bottom:'0px',position:'absolute',width:'100%',backgroundColor:'#fcfdfe'}}>
                <IonCol size='12' className='ion-text-right' onClick={()=>{this.popoverList(false)}}>
                   ปิด
                </IonCol>
              </IonRow>
           </div>
        </IonPopover>
        <IonToast
            isOpen={this.state.toastErr}
            onDidDismiss={() => this.toastErr(false)}
            message="ไม่สำเร็จ"
            position="bottom"
            color='dark'
            buttons={[ 
              {
                text: 'ตกลง', 
                handler: () => {
                  this.toastErr(false)
                }
              }
            ]}
          />
          <IonToast
            isOpen={this.state.toastSuccess}
            onDidDismiss={() => this.toastSuccess(false)}
            message="ดำเนินการสำเร็จ"
            position="bottom"
            color='primary'
            buttons={[ 
              {
                text: 'ตกลง', 
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
