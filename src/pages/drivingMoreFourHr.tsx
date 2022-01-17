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
    IonCard,
    IonGrid,
    IonCardContent,
	NavContext
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import './style.css';
import Chart from "react-apexcharts";
import api from '../api.json';
import en from '../en.json';
import th from '../th.json';
import axios from 'axios';
import { Plugins, Capacitor } from "@capacitor/core";
//import ListCar from '../components/listCar';
import Select from 'react-select';
import { closeCircle } from 'ionicons/icons';


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
let title:any, date:any, vehicleID:any, showReport:any, reportTitle:any, startEnd:any, duration:any, startPlace:any, endPlace:any, closeReport:any, loading:any;
export default class  DrivingMoreFourHr extends React.Component{
	
	timer:any
	
	state= {
		selectPlaceHold : 'Select Car' ,
		selectedOption: null ,
		selectValue: 0,
		selectLabel : '',
		showLoading: false, 
		setShowLoading:false,
		showPopover:false,
		dateSelected:'',
		title : "รายงานขับเกิน 4 ชม.",
		date:"วันที่",
        carID : "ทะเบียนรถ" ,
        showReport:"แสดงรายงาน",
        reportTitle: "รายงานขับเกิน 4 ชม.",
        startEnd:"เริ่มต้น / สิ้นสุด",
        duration : "ระยพเวลา",
        startPlace: "สถานที่เริ่มต้น",
        endPlace: "สถานที่สิ้นสุด",
        close : "ปิด",
		loading: "กำลังโหลด...",
		list: [
			{
				id: 1,
				start : '13:02:03',
				end : '17:05:05',
				time : '04:03:02',
				startPlace : '( 762.92 m) ศูนย์จัดการขยะมูลฝอยเทศบาลปทุมธานี ต.บ่อเงิน อ.ลาดหลุมแก้ว จ.ปทุมธานี 12140',
				endPlace : '( 762.92 m) ศูนย์จัดการขยะมูลฝอยเทศบาลปทุมธานี ต.บ่อเงิน อ.ลาดหลุมแก้ว จ.ปทุมธานี 12140'
			},
			{
				id: 2,
				start : '13:02:03',
				end : '17:05:05',
				time : '04:03:02',
				startPlace : '( 762.92 m) ศูนย์จัดการขยะมูลฝอยเทศบาลปทุมธานี ต.บ่อเงิน อ.ลาดหลุมแก้ว จ.ปทุมธานี 12140',
				endPlace : '( 762.92 m) ศูนย์จัดการขยะมูลฝอยเทศบาลปทุมธานี ต.บ่อเงิน อ.ลาดหลุมแก้ว จ.ปทุมธานี 12140'
			},
			{
				id: 3,
				start : '13:02:03',
				end : '17:05:05',
				time : '04:03:02',
				startPlace : '( 762.92 m) ศูนย์จัดการขยะมูลฝอยเทศบาลปทุมธานี ต.บ่อเงิน อ.ลาดหลุมแก้ว จ.ปทุมธานี 12140',
				endPlace : '( 762.92 m) ศูนย์จัดการขยะมูลฝอยเทศบาลปทุมธานี ต.บ่อเงิน อ.ลาดหลุมแก้ว จ.ปทุมธานี 12140'
			}
		]
	}

	setLanguage=async ()=>{
		const languag = await this.getStorage('language' );
		let l 
		if(languag === 'th'){
			l = th.driveMoreFourHr
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			startEnd = l.startEnd
			duration = l.duration
			startPlace = l.startPlace
			endPlace = l.endPlace
			closeReport= l.close
			loading = l.loading
		}else if(languag === 'en'){
			l = en.driveMoreFourHr
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			startEnd = l.startEnd
			duration = l.duration
			startPlace = l.startPlace
			endPlace = l.endPlace
			closeReport= l.close
			loading = l.loading
		}else if(title === undefined){
			l = this.state
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			startEnd = l.startEnd
			duration = l.duration
			startPlace = l.startPlace
			endPlace = l.endPlace
			closeReport= l.close
			loading = l.loading
		}
		//this.setShowLoading()
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

	setShowLoading=()=>{
		this.setState({
			showLoading : true ,
			setShowLoading :true
		})
	}

	async componentDidMount(){
		this.setLanguage()

		let token =await this.getStorage( 'token');
		let lang = await this.getStorage('language')
		let host = await this.getStorage('api')
		let device = await this.getStorage( 'deviceID')
		
		dateTime =  moment().format()
		this.setState({dateSelect : moment(dateTime).format('DD/MM/YYYY')})
		if(device === null ||device === undefined || device === ''){
			device = '0'
		}
		console.log("previousPath -> componentDidMount -> device.value", device )

	
			
			if(lang === '"th"'|| lang === 'th'){
				selectPlaceHold = th.home.carList
			}else if(lang === '"en"' || lang === 'en'){
				selectPlaceHold = en.home.carList
			}
			
			if(device === '0' || Number(device) === 0){
				if(lang === '"th"'|| lang === 'th'){
					selectPlaceHold = th.home.carList
					this.setStorage('carID', th.home.carList )
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
			

			axios.get(`${host}/home` ,{
				headers: {
					"language": lang  ,
					"token" : token ,
					"authorization": api.authorization
				}		
			}).then(res => {
				for (let index = 0 ; index < res.data.length; index ++){
					carNumber[index+1] = {
						value : res.data[index].device_id ,
						label: res.data[index].name ,
						latitude: res.data[index].latitude ,
						longitude : res.data[index].longitude 
					}
				}
			})
	}

	dateSelect=(e:any)=>{
		var date = moment(e.detail.value!).format('YYYY-MM-DD')
		dateTime = e.detail.value
		this.setStorage('date',  date) 
		this.setState({dateSelected : moment(dateTime).format('DD/MM/YYYY')})
	}

	showPopover=()=>{
        this.setState({showLoading : true})
            setTimeout(()=>{
            this.setState({showPopover : true})
        },1000)
	  }

	submit=async (e:any)=>{
		e.preventDefault()
		// if(this.state.selectValue!== 0){
        //     this.showPopover()
        // }else{
        //    console.log("กรุณาเลือกรถ");
		// }
		
		let apiHost  = await this.getStorage('api')
		let lang = await this.getStorage('language')
		let token = await this.getStorage('token')
		let device_id = await this.getStorage('deviceID')
		let date = await this.getStorage('date')

		console.log("submit -> this.state.dateSelected", this.state.dateSelected)
		console.log("submit -> apiHost.value", apiHost)  
		console.log("submit -> device_id", this.state.selectValue) 
		if( this.state.selectValue !== 0  ){
			axios.post(`${apiHost}/report/overtime`,{
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
					this.setState({ list : res.data },()=>{
						this.showPopover()
					})
			  }).catch(err =>{
				  console.log('err',err)
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
			selectValue :  selectedOption.value ,
			selectLabel : selectedOption.label
		},()=>console.log("handleChange -> selectValue", this.state.selectValue))

		selectedCar = selectedOption
		let latitude = selectedCar.latitude
		let longitude = selectedCar.longitude

		 if(latitude !== 0 || longitude !==0){
			this.setStorage( 'latitude', JSON.stringify(latitude));
			this.setStorage( 'longitude', JSON.stringify(longitude));
		 }

	  };

	  

	async componentWillUnmount(){
		clearTimeout(this.timer);
		this.setStorage('date',moment().format('YYYY-MM-DD'))
		let lang = await this.getStorage('language')
			this.setStorage('device','0')
			this.setStorage('deviceID','0')
			
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
			startEnd = l.startEnd
			duration = l.duration
			startPlace = l.startPlace
			endPlace = l.endPlace
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
                        <IonLabel color='medium'><h6> {date}</h6></IonLabel>
                    </div>
                        <div style={{float:'right',color:'#666666'}} className="dateItem">
						<IonDatetime 
							onIonChange={(e:any)=>{this.dateSelect(e);  }}
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
				type='submit'
				mode='ios' 
				style={{margin:'10px',marginTop:'1.5rem'}} 
				expand="block"
				onClick={(e)=>{this.submit(e); e.preventDefault()}}
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
				     <IonIcon icon={closeCircle} className='closePopover' color='light' style={{fontSize:'2rem',position:'fixed',zIndex:1000}} onClick={() => this.closePopover()} />
                     <div className='headPopDrive4Hr' style={{backgroundImage:"url('../assets/images/bg.jpg')"}}>
                        <div className='ion-text-left' style={{fontSize:'0.6em',width:'100%'}}>
                            <IonLabel style={{fontSize:'1.5em'}}>{vehicleID} {this.state.selectLabel}</IonLabel> <br/>
                            <IonLabel> {reportTitle}</IonLabel><br/>
                            <IonLabel> {date} {this.state.dateSelected} </IonLabel>
                        
                        </div>
                     </div>
                 <div style={{width:'100%',padding:"0.5rem",marginTop:'15vh'}}>
					 {this.state.list.map((list, index)=> 
                   <div className='cardDrive4Hr' key={list.id}>
                        <IonRow>
                            <IonCol size='1' class='cardDrive4HrTitle'>
					 			<IonLabel>{index+1}</IonLabel>
                            </IonCol>
                            <IonCol >
                                <IonRow>
                                    <IonCol size='6'>
                                        <strong><IonLabel>{startEnd}</IonLabel></strong><br/>
                                        <span className='cardDrive4HrValue'><IonLabel>{list.start} - {list.end} </IonLabel></span>
                                    </IonCol>
                                    <IonCol size='6'>
                                        <strong><IonLabel>{duration}</IonLabel></strong><br/>
                                        <span className='cardDrive4HrValue'><IonLabel>{list.time}</IonLabel></span>
                                    </IonCol>
                                </IonRow>

                                <IonRow className='ion-text-left'>
                                    <IonCol size='12'>
                                        <strong><IonLabel>{startPlace}</IonLabel></strong><br/>
                                        <IonLabel className='cardDrive4HrValue'>{list.startPlace}</IonLabel>
                                    </IonCol>
                                </IonRow>

                                <IonRow className='ion-text-left'>
                                    <IonCol size='12'>
                                        <strong><IonLabel>{endPlace}</IonLabel></strong><br/>
                                        <IonLabel className='cardDrive4HrValue'>{list.endPlace}</IonLabel>
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                   </div>)}
                 </div>
          </IonPopover>

		</IonContent>
		<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={this.setCloseLoading}
			message={loading}
			duration={700}
			/>
		</IonPage>
		)
	}
}
