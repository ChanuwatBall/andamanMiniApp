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
	NavContext,
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import './style.css';
import Chart from "react-apexcharts";
import api from '../api.json';
import app from '../app.config.json'
import en from '../en.json';
import th from '../th.json';
import axios from 'axios';
import { Plugins, Capacitor } from "@capacitor/core";
//import ListCar from '../components/listCar';
import Select from 'react-select';
import { closeCircle, alert } from 'ionicons/icons';


const { Storage } = Plugins;
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


let dateTime:any  ;
let selectPlaceHold:any ;
let title:any, date:any, vehicleID:any, showReport:any,reportTitle:any, closeReport:any, loading:any;
let timeUnit:any, details:any, times:any, duration:any,  maxSpeed:any, place:any, coordinates:any, driver:any;
export default class  OverSpeed extends React.Component{
	
	timer:any
	
	state= {
		selectPlaceHold : 'ALL' ,
		selectedOption: null ,
		selectValue: 0,
		selectLabel:'',
		dateSelected:'',
		showLoading: false, 
		setShowLoading:false,
		showPopover:false,
		title : "ขับเกินความเร็ว",
        date:"วันที่",
        carID : "ทะเบียนรถ" ,
        showReport:"แสดงรายงาน",
        reportTitle: "รายงานขับเกินความเร็ว",
        timeUnit: "ครั้ง",
        details: "รายละเอียด",
        duration : "Duration",
        maxSpeed : "Max Speed",
        place : "สถานที่",
        times : "เวลา",
        coordinates : "พิกัด",
        driver : "คันขับ",
        close : "ปิดหน้าต่าง",
		loading: "กำลังโหลด...",
		Overspeed :[ {
			time: "2020-08-21 15:57",
			duration: "02:02",
			maxSpeed: "97",
			place: "สถานที่",
			latitude:'156451234',
			longitude : '1564874551',
			driver_id: "123456",
			driver_maeesage: "ชื่อคนขับ"
		  }],
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


	setLanguage=async ()=>{
		const languag = await this.getStorage('language' );
		let l 
		if(languag === 'th'){
			l = th.overSpeedReport
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			timeUnit=l.timeUnit
			details = l.details
			duration = l.duration
			maxSpeed = l.maxSpeed
			place = l.place
			times = l.times
			coordinates = l.coordinates
			driver = l.driver
			closeReport= l.close
			loading = l.loading
		}else if(languag === 'en'){
			l = en.overSpeedReport
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			timeUnit=l.timeUnit
			details = l.details
			duration = l.duration
			maxSpeed = l.maxSpeed
			place = l.place
			times = l.times
			coordinates = l.coordinates
			driver = l.driver
			closeReport= l.close
			loading = l.loading
		}else if(title === undefined){
			l = this.state
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			timeUnit=l.timeUnit
			details = l.details
			duration = l.duration
			maxSpeed = l.maxSpeed
			place = l.place
			times = l.times
			coordinates = l.coordinates
			driver = l.driver
			closeReport= l.close
			loading = l.loading
		}
		//this.setShowLoading()
	}

	setLoading=(e:any)=>{
		this.setState({ 
			showLoading :e 
		})
	}

	dateNow= async()=>{
		var date =await this.getStorage('date')

		if(date === null && date === undefined && date === '' ){
			dateTime =  moment().format('YYYY-MM-DD')
			this.setStorage('date' ,moment().format('YYYY-MM-DD'))
		}else{
			dateTime = date
		}
	}

	async componentDidMount(){
		this.setLanguage()
		this.setLoading(true)
  
		let token =await this.getStorage( 'token');
		let lang = await this.getStorage('language')
		let host = await this.getStorage('api')
		let device = await this.getStorage( 'deviceID')
		
	
		dateTime = moment().format()
		this.setState({dateSelected : moment(dateTime).format('DD/MM/YYYY')})

		this.setState({
			Overspeed : this.state.Overspeed.filter((Overspeed) => Overspeed.time = ""  )
		})
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

	dateSelect=(e:any)=>{
		var date = moment(e.detail.value).format('YYYY-MM-DD')
		this.setStorage('date',date)
		console.log(date)
		dateTime = e.detail.value
		this.setState({dateSelected : moment(e.detail.value).format('DD/MM/YYYY')})
	}

	showPopover=()=>{
        this.setState({showLoading : true})
        setTimeout(()=>{
            this.setState({showPopover : true})
        },1000)
	  }
	
	submit=async (e:any)=>{
		e.preventDefault()
		this.setLoading(true)
		
		let apiHost  = await this.getStorage('api')
		let lang = await this.getStorage('language')
		let token = await this.getStorage('token') 
		
		if(this.state.selectValue!== 0){
			axios.post(`${apiHost}/report/overspeed`,{
				deviceId: this.state.selectValue ,
				date: this.state.dateSelected
			  } ,{
				headers: {
				  language: lang  ,
				  token : token ,
				  authenication : api.authorization,
				  version :api.version
				}		
			  })
			  .then(res => {
				console.log(res)
					this.setState({ Overspeed : res.data },()=>{
						this.showPopover() 
					})
					this.setLoading(false)
			  })

        }else{
           console.log("กรุณาเลือกรถ");
        }
	}

	handleChange = (selectedOption: any) => {
		this.setState(
		  { selectedOption },
		  () => console.log(`Option selected:`, this.state.selectedOption)
		);

		this.setState({
			selectValue :  selectedOption.value,
			selectLabel :  selectedOption.label
		},()=>console.log("handleChange -> selectValue", this.state.selectLabel))

		selectedCar = selectedOption
		let carValue = selectedCar.value
		let car = selectedCar.label
		let latitude = selectedCar.latitude
		let longitude = selectedCar.longitude

		//  Storage.set({key: 'deviceID', value: JSON.stringify(carValue)});
		//  Storage.set({key: 'carID',	value:car.toString() });
		 if(latitude !== 0 || longitude !==0){
			this.setStorage('latitude',JSON.stringify(latitude));
			this.setStorage('longitude',JSON.stringify(longitude));
		 }

	  };

	async componentWillUnmount(){
		clearTimeout(this.timer);
		this.setStorage('date', moment().format('YYYY-MM-DD'))
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

	
	  
	closePopover=()=>{
		this.setState({showPopover : false})
	  }

	doRefresh =(event: CustomEvent)=> {
		
		this.timer = setTimeout(() => {
		  event.detail.complete();
		}, 2000);
	  }

	setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
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
			timeUnit=l.timeUnit
			details = l.details
			duration = l.duration
			maxSpeed = l.maxSpeed
			place = l.place
			times = l.times
			coordinates = l.coordinates
			driver = l.driver
			closeReport= l.close
			loading = l.loading
		}
		return(
			<IonPage>
				<IonHeader className='nav-title'>
						<IonToolbar color='light' >
							<IonButtons>
								<IonBackButton color='primary' defaultHref='/allReport' text={title} ></IonBackButton>
								{/* <IonTitle className="ion-text-left" color='primary' ><strong>{title}</strong></IonTitle>	 */}
							</IonButtons>
							{/* <IonButtons slot="end">
								<IonMenuButton color='primary' />
							</IonButtons> */}
						</IonToolbar>
				</IonHeader>
			<IonContent>
			<IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={300}>
				<IonRefresherContent></IonRefresherContent>
			</IonRefresher>

        <div style={{paddingTop:'1rem',width:'100vw',backgroundColor:'#fff'}}>
		 <IonRow style={{padding:'0px'}}>
		  <IonCol size="12" style={{padding:'0px'}}>
		<IonLabel style={{margin:"10px"}}>{date}</IonLabel><br/>
		  		<div className="dateBox">
                    <div style={{float:"left"}} className="dateLabel">
                        <IonLabel color='medium'><h6>{date}</h6></IonLabel>
                    </div>
                        <div style={{float:'right',color:'#666666'}} className="dateItem">
						<IonDatetime 
							onIonChange={(e:any)=>{this.dateSelect(e); }}
							color='dark'
							id ="dateEnd"
							display-timezone="utc"
							value={dateTime}
							displayFormat="DD/MM/YYYY" >
							
                        </IonDatetime>
                        </div>
                </div>

			<div style={{width:'100vw', height:'1px',backgroundColor:'#f2f2f2',marginBottom:'1rem',marginTop:'1rem'}}></div>
		<IonLabel style={{margin:"10px"}}>{vehicleID}</IonLabel><br/>
			<div style={{margin: '10px'}}>
				{/* <ListCar/> */}

				<Select
					//Value={this.state.carSelect}
					onChange={this.handleChange}
					options={carNumber}
					placeholder={this.state.selectPlaceHold}
					styles={colourStyles}
				/>    
			</div>

			<IonButton 
				type='button'
				mode='ios' 
				style={{margin:'10px',marginTop:'1.5rem'}} 
				expand="block"
				onClick={(e)=>this.submit(e)}
				>
				{showReport}
			</IonButton>
      
		  </IonCol>
		 </IonRow>
		
		</div> 
			<IonPopover
				mode='ios'
				isOpen={this.state.showPopover}
				cssClass='reportDrivePopover-class'
				onDidDismiss={()=> this.closePopover()}
			>
			      
            <div className='ion-text-left' style={{width:'95%',height:'20vh',backgroundColor:'#134985',float:'right',overflow:'hidden',
            borderBottomLeftRadius:'20px',color:'#fff',position:'relative',backgroundImage:"url('../assets/images/bg.jpg')",
            backgroundSize:'cover',backgroundPosition:'bottom',display:'flex',flexDirection:'column',justifyContent:'center',paddingLeft:'1rem'}}>
                <p style={{lineHeight:'-10px',fontSize:'.7em'}}>{reportTitle}</p> 
                <p style={{lineHeight:'-10px',marginTop:'-1rem'}}>{this.state.Overspeed.length} {timeUnit}</p>
				<p style={{lineHeight:'-10px',fontSize:'.6em',marginTop:'-1.5rem'}}>{vehicleID} {this.state.selectLabel} </p> 
				<p style={{lineHeight:'-10px',fontSize:'.6em',marginTop:'-0.8rem'}}>{date} {this.state.dateSelected}</p>
            </div>
            <IonIcon icon={closeCircle} className='closePopover' color='dark' style={{fontSize:'3rem',position:'absolute',marginTop:'17.5vh',backgroundColor:'#fff',borderRadius:'50%',right:'1rem'}} onClick={() => this.closePopover()} />
            <div style={{width:'1px',height:'60vh',backgroundColor: app.color,zIndex:-1,position:'fixed',marginLeft:'1rem',marginTop:'30vh'}}></div>
            <div style={{width:'100%',marginTop:'25vh',textAlign:'left', paddingBottom:'1rem'}}>
                <IonLabel className='ion-text-left' color='primary' style={{fontSize:'0.7em',marginLeft:'1rem'}}>{details}</IonLabel><br/>
               
			   {this.state.Overspeed.map((Overspeed , index) => 
				<div 
					key = {index}
					style={{
						marginTop:'1rem',
						width:'90%',
						backgroundColor:"#fcfdfe",
						borderTopRightRadius:'20px',
						borderBottomRightRadius:'20px',
						zIndex:99,
						border:'1px solid #ccc'
					}}>
                    <IonRow  style={{fontSize:'.6em',color:'#000'}}>
                        <IonCol size='5'> 
                            <IonRow>
                                <IonCol size='6'>  <IonLabel>{times}</IonLabel> </IonCol>
								<IonCol size='6'>  <IonLabel> {moment(Overspeed.time).format('HH:mm:ss')}</IonLabel> </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='6'>  <IonLabel>{duration}</IonLabel> </IonCol>
								<IonCol size='6'>  <IonLabel> {Overspeed.duration}</IonLabel> </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='6'>  <IonLabel>{maxSpeed}</IonLabel> </IonCol>
                                <IonCol size='6'>  <IonLabel>{Overspeed.maxSpeed}</IonLabel> </IonCol>
                            </IonRow>
                        </IonCol>
                        <IonCol size='7'>
                            <IonRow>
                                <IonCol size='12'> 
                                    <IonLabel>{place}</IonLabel><br/> 
									<IonLabel  style={{fontSize:'.6em',fontWeight:'200'}}> {Overspeed.place}</IonLabel> <br/>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'>  <IonLabel>{coordinates}</IonLabel> </IonCol>
								<IonCol size='8'>  <IonLabel>{Overspeed.latitude}  {Overspeed.longitude}</IonLabel> </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size='4'>  <IonLabel>{driver}</IonLabel> </IonCol>
								<IonCol size='8'>  <IonLabel>{Overspeed.driver_id} {Overspeed.driver_id}</IonLabel> </IonCol>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                </div> )}
            </div>
				
          </IonPopover>

		</IonContent>
		<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={()=>this.setLoading(false)}
			message={loading} 
		/>
		</IonPage>
		)
	}
}
