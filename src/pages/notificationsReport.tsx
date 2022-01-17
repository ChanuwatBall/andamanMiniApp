import {
	IonButtons,
	IonPage,
	IonToolbar,
    IonHeader,
    IonContent,
    IonRow,
    IonCol,
	IonMenuButton,
	IonTitle,
	IonBackButton,
	IonLoading,
	IonRefresher,
	IonRefresherContent,
	IonLabel,
	IonButton,
	IonDatetime,
	IonPopover,
	IonIcon,
	IonItem,
	NavContext
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import './style.css'; 
import api from '../api.json';
import en from '../en.json';
import th from '../th.json';
import axios from 'axios'; 
//import ListCar from '../components/listCar';
import Select from 'react-select';
import { alertCircle, closeCircle } from 'ionicons/icons';
import { Storage } from '@capacitor/storage';
 
var moment = require('moment');
moment().format();
let carNumber = [{value : 0 , label: '' , latitude: 0, longitude:0 }]
let selectedCar = {value: 0 ,label:'', latitude: 0, longitude:0} ;

const colourStyles = {
	control: (styles: any) => ({ ...styles, backgroundColor: 'white'}),
	option: (styles: { [x: string]: any; }, { data, isDisabled, isFocused, isSelected }: any) => {
	  return {
		...styles,
		backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? 'rgba(139, 140, 142, 0.1)'
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ?  '#202021'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

  
		':active': {
		  ...styles[':active'],
		  backgroundColor: !isDisabled && (isSelected ? data.color : 'rgba(139, 140, 142, 0.1)'),
		},
	  };
	},
	input: (styles: any) => ({ ...styles, height:'2rem',color:'#202021' }),
	placeholder: (styles: any) => ({ ...styles,color:'#666666'  }),
	singleValue: (styles: any) => ({ ...styles, color: '#202021' }),
  };


let dateTimeStart:any ,dateTimeEnd:any ;
let selectPlaceHold:any ;
let title:any, date:any, vehicleID:any, showReport:any,reportTitle:any, closeReport:any, loading:any;
 
export default class NotificationsReport extends React.Component{ 
	timer:any
	
	state= {
		selectPlaceHold : 'ALL' ,
		selectedOption: null ,
		selectValue: 0,
		selectLabel:'',
		showLoading: false, 
		setShowLoading:false,
		dateStartSelect:'',
		dateEndSelect:'',
		
		  series : [22, 44, 33 , 1],
		  showPopover:false,
		  title : "รายงานการแจ้งเตือน",
		  date:"วันที่",
		  carID : "ทะเบียน" ,
		  showReport:"แสดงรายงาน",
		  reportTitle: "รายงานการแจ้งเตือนตามช่วงวันที่",
		  close : "ปิด",
		  loading: "กำลังโหลด...",
		List: [{
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
		alertList: [
			{
				address: "( 365.3 m) บ้านเพลินจันทร์ 2  ต.ป่าคลอก อ.ถลาง  จ.ภูเก็ต 83110",
				codeRef: "221005886080600 HASSANEE$YAMMAART$MR.",
				eventName: "Log Out",
				eventTime: "2021-10-02 12:02",
			}
		]
	}

	deviceEvent=async()=>{
		let lang = await  this.getStorage('language')
		let token =await this.getStorage( 'token');
		let apiHost = await this.getStorage( 'api');
		let userID = await this.getStorage( 'userId');
         //this.state.dateStartSelect - this.state.dateEndSelect
		let start = moment(this.state.dateStartSelect).format('YYYY-MM-DD')
		let end = moment(this.state.dateEndSelect).format('YYYY-MM-DD')

		axios.post(apiHost +'/deviceEvent',{
			"deviceId":  this.state.selectValue ,
			"date_start": start ,
			"date_end":  end
		},
		{ 	
			headers: { 
				authenication: api.authorization,
				language:lang,
				token: token,
				version: api.version
			}
		}).then(res =>{
			console.log('res ',res)
			this.setState({
				alertList : res.data
			},()=>{
				this.setState({showPopover : true})
			})
		}).catch(err =>{
			console.log('err ',err)
			this.setState({
				alertList : []
			})
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

	dateNow= async()=>{
		var date =await this.getStorage('date')

		if(date === null && date === undefined && date === '' ){
			dateTimeStart =  moment().format('YYYY-MM-DD')
			this.setStorage('date' ,moment().format('YYYY-MM-DD'))
		}else{
			dateTimeStart = date
		}
	}

	setLanguage=async ()=>{
		const languag = await this.getStorage('language');
		let l 
		if(languag === 'th'){
			l = th.notificationReport
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			closeReport= l.close
			loading = l.loading
		}else if(languag === 'en'){
			l = en.notificationReport
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			closeReport= l.close
			loading = l.loading
		}else if(title === undefined){
			l = this.state
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			closeReport= l.close
			loading = l.loading
		}
	//	this.setShowLoading()
	}
	
	setShowLoading=()=>{
		this.setState({
			showLoading:true
		})
	}

	async componentDidMount(){
		this.setLanguage()
		this.setLoading(true)

		dateTimeStart =  moment().format()
		dateTimeEnd =  moment().format()
		this.setState({
			dateStartSelect : moment(dateTimeStart).format('YYYY-MM-DD'),
			dateEndSelect : moment(dateTimeEnd).format('YYYY-MM-DD')
		})

		let token =await this.getStorage( 'token');
		let lang = await this.getStorage('language')
		let car = await this.getStorage( 'carID')
		let host = await this.getStorage('api')
		let device = await this.getStorage( 'deviceID')
		
	
		if(device === null ||device === undefined || device === ''){
			device = '0'
		}
		console.log("previousPath -> componentDidMount -> device", device)

	
			
			if(lang === '"th"'|| lang === 'th'){
				selectPlaceHold = th.home.carList
			}else if(lang === '"en"' || lang === 'en'){
				selectPlaceHold = en.home.carList
			}
			
			if(device === '0' || Number(device) === 0){
				if(lang === '"th"'|| lang === 'th'){
					selectPlaceHold = th.home.carList
					this.setStorage('carID', th.home.carList)
					this.setState({
						selectPlaceHold : selectPlaceHold
					})
				}else if(lang === '"en"' || lang === 'en'){
					selectPlaceHold = en.home.carList
					this.setStorage('carID', en.home.carList)
					this.setState({
						selectPlaceHold : selectPlaceHold
					})
				}
			}

				if(lang === '"th"'|| lang === 'th'){
					selectPlaceHold = th.home.carList
					carNumber[0] ={
						value : 0 ,
						label:  selectPlaceHold ,
						latitude: 0 ,
						longitude : 0
					}
					this.setState({selectPlaceHold : th.home.carList})

				}else if(lang === '"en"' || lang === 'en'){
					selectPlaceHold = en.home.carList
					carNumber[0] ={
						value : 0 ,
						label:  selectPlaceHold ,
						latitude: 0 ,
						longitude : 0
					}

					this.setState({selectPlaceHold : en.home.carList})
				}
			
			let carList =await this.getStorage('carList')
			this.setState({
				List : JSON.parse(carList || '{}')
			})
			this.setState({
				List : this.state.List.filter((List) => List.device_id !== null && List.event_id !== null)
			})
			for (let index = 0 ; index < this.state.List.length; index ++){
					carNumber[index+1] = {
					value : this.state.List[index].device_id ,
					label: this.state.List[index].name ,
					latitude: this.state.List[index].latitude ,
					longitude : this.state.List[index].longitude 
				}
			}
			this.setLoading(false)
	}

	dateSelectStart=(e:any)=>{
		var date = moment(e).format('YYYY-MM-DD')
		this.setStorage('date', date)
		console.log(date)
		dateTimeStart = e
		this.setState({dateStartSelect : date})
	}

	dateSelectEnd=(e:any)=>{
		var date = moment(e).format('YYYY-MM-DD')
		this.setStorage('date', date) 
		dateTimeEnd = e
		this.setState({dateEndSelect : date})
	}

	handleChange = (selectedOption: any) => {
		this.setState(
		  { selectedOption },
		  () => console.log(`Option selected:`, this.state.selectedOption)
		);

		this.setState({
			selectValue :  selectedOption.value,
			selectLabel : selectedOption.label
		},()=>console.log("handleChange -> selectValue", this.state.selectValue))

		selectedCar = selectedOption
		let carValue = selectedCar.value
		let car = selectedCar.label
		let latitude = selectedCar.latitude
		let longitude = selectedCar.longitude

		 this.setStorage('deviceID',  JSON.stringify(carValue));
		 this.setStorage('carID',	car.toString() );
		 if(latitude !== 0 || longitude !==0){
			this.setStorage('latitude', JSON.stringify(latitude));
			this.setStorage('longitude', JSON.stringify(longitude));
		 }

	  };

	async componentWillUnmount(){
		clearTimeout(this.timer);
		this.setStorage('date',  moment().format('YYYY-MM-DD'))
		let lang = await this.getStorage('language')
			this.setStorage('device', '0')
			this.setStorage('deviceID', '0')
			
			if(lang === '"th"'|| lang === 'th'){
				selectPlaceHold = th.home.carList
				this.setStorage('carID',selectPlaceHold)
			}else if(lang === '"en"' || lang === 'en'){
				selectPlaceHold = en.home.carList
				this.setStorage('carID',selectPlaceHold)
			}
	}

	showPopover=()=>{
		//if(this.state.selectValue!== 0){
            this.setState({showLoading : true})
            setTimeout(()=>{
                this.setState({showPopover : true})
            },1000)
            
        // }else{
        //    console.log("กรุณาเลือกรถ");
        // }
	  }


	  submit=async (e:any)=>{
		e.preventDefault()
		let lang =await this.getStorage('language');
		let token =await this.getStorage('token');
		let apiHost = await this.getStorage('api');
		let date = await this.getStorage('date')
		
		console.log("this.state.dateEndSelect", this.state.dateEndSelect)
		if(this.state.selectValue!== 0){
			this.setLoading(true)
			console.log("submit -> this.state.selectValue", this.state.selectValue)
			axios.post(`${apiHost}/report/summarymonth`,{
				deviceId: this.state.selectValue ,
				dateStart : this.state.dateStartSelect,
				dateEnd  : this.state.dateEndSelect
			  } ,{
				headers: {
				  "language": lang  ,
				  "token" : token ,
				  "authenication" : api.authorization,
				  "version":api.version,
				}		
			  })
			  .then(res => {
				console.log("submit -> res.data", res.data)
				
				console.log(res.data.data)
				console.log(res.data.color)
				console.log(res.data.status)

			 
			  }).catch(err =>{
     			console.log("err", err)
				setTimeout(()=>{
					this.setLoading(false)
				},1000)
			  })
        }else{
           console.log("กรุณาเลือกรถ");
        }
	}
	  
	closePopover=()=>{
		this.setState({showPopover : false})
	  }

	doRefresh =(event: CustomEvent)=> {
		
		this.timer = setTimeout(() => {
		  event.detail.complete();
		}, 2000);
	  }

	setLoading=(e:any)=>{
		this.setState({
		  showLoading : e
		})
	}

	render(){
		let l
		if(title === undefined){
			l = this.state
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			closeReport= l.close
			loading = l.loading
		}
		return(
			<IonPage>
				<IonHeader className='nav-title'>
					<IonToolbar color='light' >
							<IonButtons>
								<IonBackButton color='primary' defaultHref='/allReport' text={title} ></IonBackButton> 
							</IonButtons> 
					</IonToolbar>
				</IonHeader>
			<IonContent>
			<IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={300}>
				<IonRefresherContent></IonRefresherContent>
			</IonRefresher>

			<div style={{paddingTop:'1rem',width:'100vw',backgroundColor:'#fff'}}>
			<IonLabel style={{margin:"10px"}}>{date}</IonLabel><br/>
				<IonRow style={{paddingLeft:'.5rem',paddingRight:'.5rem'}}>
					<IonCol size='6' className='ion-text-center'>
					<div style={{color:'#666666',backgroundColor:'#fcfdfe',border:'1px solid #ccc',borderRadius:'5px'}} >
						<IonDatetime 
							onIonChange={(e)=>{this.dateSelectStart(e.detail.value); }}
							color='dark'
							id ="dateEnd"
							display-timezone="utc"
							value={dateTimeStart}
							displayFormat="DD/MM/YYYY" > 
                        </IonDatetime>
                    </div>
					</IonCol>
					<IonCol size='6' className='ion-text-center'>
					<div style={{color:'#666666',backgroundColor:'#fcfdfe',border:'1px solid #ccc',borderRadius:'5px'}} >
						<IonDatetime 
							onIonChange={(e)=>{this.dateSelectEnd(e.detail.value); }}
							color='dark'
							id ="dateEnd"
							display-timezone="utc"
							value={dateTimeEnd}
							displayFormat="DD/MM/YYYY" >
							
                        </IonDatetime>
                        </div>
					</IonCol>
				</IonRow>
 
				<IonRow>
					<IonCol size='12'>
						<IonLabel style={{margin:"10px"}}>{vehicleID}</IonLabel><br/>
						<div style={{margin: '10px'}}>
							
							<Select
								onChange={this.handleChange}
								options={carNumber}
								placeholder={this.state.selectPlaceHold}
								styles={colourStyles}
							/>    
						</div>
					</IonCol>
				</IonRow>
			</div>
			<IonButton 
				type='button'
				mode='ios' 
				style={{margin:'10px',marginTop:'1.5rem'}} 
				expand="block"
				onClick={(e)=>this.deviceEvent()}
				>
				{showReport}
			</IonButton>

			<IonPopover
				mode='ios'
				isOpen={this.state.showPopover}
				cssClass='notifications-report'
				onDidDismiss={()=> this.closePopover()}
			><br/>
				<IonRow   >
					<IonCol size='10'></IonCol>
					<IonCol size='2' className="set-center">
					  <IonIcon icon={closeCircle} className='closePopover' color='primary' style={{fontSize:'2rem'}} onClick={() => this.closePopover()} />
					</IonCol>
				</IonRow>
				<div className='ion-text-center' style={{marginTop:'2rem',textAlign:'center' ,fontSize:'0.9em'}}>
					<IonLabel >{reportTitle}</IonLabel><br/>
					<IonLabel style={{fontSize:'.7em'}}> {date} {this.state.dateStartSelect} - {this.state.dateEndSelect}</IonLabel><br/>
					<IonLabel style={{fontSize:'.7em'}}> {vehicleID} {this.state.selectLabel}</IonLabel>
				</div>
				<div className='ion-text-left' style={{marginLeft:'0rem'}} >
				{
					this.state.alertList != null ?
					<IonCol size='12' className='ion-text-left' >
						{
						this.state.alertList.map((al,index) => 
							<IonItem key={index}>
							<IonCol size='1' className="set-center" > <IonIcon icon={alertCircle} color='primary' /> </IonCol>
							<IonCol size='10' className='ion-text-left' >
								<div className='alert-list'>
									<strong className="alert-name">{al.eventName}</strong> <br/>
									<small className="alert-time">{al.eventTime}</small><br/>
									<small className="alert-time" >{al.codeRef}</small>
									<small className="alert-time" >{al.address}</small>
								</div> 
							</IonCol>
						</IonItem>)
						} 
					</IonCol>:<div></div>
					}
				</div>
{/* 
				<div>
					<div style={{width:'98%',height:'1px',backgroundColor:'#ccc'}}></div>
					<p className='ion-text-center' onClick={()=>this.closePopover()}>
						{closeReport}
					</p>
				</div> */}
          </IonPopover>
		</IonContent>
		<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={()=>this.setLoading(false)}
			message={ loading} 
			/>
		</IonPage>
		)
	}
}
