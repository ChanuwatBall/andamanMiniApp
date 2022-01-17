import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonItem,
	IonHeader,
	IonContent,
	IonLabel,
	IonMenuButton,
	IonBackButton,
	IonTitle,
	IonLoading,
	IonList,
	IonCol, 
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";

import { faCar, faChartPie, faChartLine, faMapMarkedAlt, faRoute, faShippingFast, faDrawPolygon, faGripHorizontal, faMagic, faThermometerThreeQuarters, faBurn, faHourglassEnd, faDoorOpen, faGasPump, faBell } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faCar, faChartPie, faChartLine, faMapMarkedAlt , faRoute, faShippingFast ,faDrawPolygon, faGripHorizontal, faMagic, faThermometerThreeQuarters, 
	faBurn,faHourglassEnd ,faDoorOpen,faGasPump,faBell)

const { Storage } = Plugins;
let title: any, carUsage:any ,   loading:any ;
let dayTripReport:any ,   reportGraph:any, pieChartDaily:any, pieChartMonth:any, graphGasoline:any, temperatureChart:any ,other:any,notiHistory:any;
let reportDepartOfLandTransport:any, overSpeed:any, drivingMoreFourHr:any , closeOpenPTO:any, gasoloneUsed:any;

export default class allReport extends React.Component{
	

	state={
		language : 'ไทย',
		showLoading: false, 
		goBack:false,
		icons:
			{
				id : 1,
				icon: 'key',
				title: 'รหัสผ่าน',
				detail : 'เปลี่ยนรหัสผ่าน'
			} ,
		title: "รายงาน", 
		previousRoute:"เส้นทางย้อนหลัง" , 
		previousRouteReport:"รายงานเส้นทางย้อนหลัง" , 
		carUsage:"การใช้รถ" , 
		carUsageReport:"รายงานการใช้รถ" , 
		pieChart:"กราฟวงกลม", 
		pieChartReport: "รายงานกราฟวงกลม" , 
		lineChart:"กราฟเส้น" , 
		lineChartReport:"รายงานกราฟเส้น" ,
		loading:'กำลังโหลด..',
		dayTrips:"รายงานการเดินทางรายวัน",
		drivenReport: "รายงานการใช้รถรายวัน",
		reportGraph : "รายงานกราฟ",
		pieChartDaily : "กราฟวงกลมรายวัน",
		pieChartMonth : "กราฟวงกลมรายเดือน",
		graphGasoline : "กราฟน้ำมัน",
		temperatureChart : "กราฟอุณหภูมิ",
		reportDepartOfLandTransport : "รายงานกฎหมายกรมขนส่งทางบก",
		overSpeed : "เกินความเร็ว" ,
		drivingMoreFourHr :  "ขับเกิน 4 ชั่วโมง" ,
		closeOpenPTO : "รายงานเปิด-ปิด PTO",
		gasoloneUsed: "การใช้น้ำมัน",
		other: "อื่นๆ",
		notiHistory:"ประวัติการแจ้งเตือน"
	}
	
	refreshPage(){ 
		window.location.reload(); 
	}

	setCloseLoading=()=>{
		this.setState({
		  showLoading :false 
		})
	}

	setShowLoading=()=>{
		this.setState({
		  showLoading :true 
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
	
	async componentDidMount(){
		let lang = await this.getStorage ('language');
		if(lang === 'th'){
			this.setState({
				language : 'ไทย'
			})
		}else if(lang === 'en'){
			this.setState({
				language : 'Eng'
			})
		}
	}

	setLanguage = async ()=>{
		const languag =await this.getStorage ('language');
		//const languag =JSON.stringify( ret.value || '{}')
        console.log("allReport -> setLanguage -> languag", languag)
		let l

		if (languag === 'th' ||languag === '"th"'){
			l = th.allReport
			title = l.title 
			//previousRoute = l.previousRoute
			carUsage = l.carUsage 
			//pieChart = l.pieChart
			//lineChart = l.lineChart
			loading = l.loading
			dayTripReport= l.dayTrips
			//drivenReport= l.drivenReport
			reportGraph = l.reportGraph
			pieChartDaily = l.pieChartDate
			pieChartMonth = l.pieChartMonth
			graphGasoline = l.graphGasoline
			temperatureChart = l.temperatureChart
			reportDepartOfLandTransport = l.reportDepartOfLandTransport
			overSpeed = l.overSpeed
			drivingMoreFourHr =l.drivingMoreFourHr
			closeOpenPTO = l.closeOpenPTO
			gasoloneUsed = l.gasoloneUsed
			other=l.other
			notiHistory=l.notiHistory
		} else if( languag === 'en'  ||languag === '"en"'){
			l = en.allReport
			title = l.title 
			//previousRoute = l.previousRoute
			carUsage = l.carUsage 
			//pieChart = l.pieChart
			//lineChart = l.lineChart
			loading = l.loading
			dayTripReport= l.dayTrips
			//drivenReport= l.drivenReport
			reportGraph = l.reportGraph
			pieChartDaily = l.pieChartDate
			pieChartMonth = l.pieChartMonth
			graphGasoline = l.graphGasoline
			temperatureChart = l.temperatureChart
			reportDepartOfLandTransport = l.reportDepartOfLandTransport
			overSpeed = l.overSpeed
			drivingMoreFourHr =l.drivingMoreFourHr
			closeOpenPTO = l.closeOpenPTO
			gasoloneUsed = l.gasoloneUsed
			other = l.other
			notiHistory=l.notiHistory
		}
	}

	render(){
		this.setLanguage()
		
		return(
			<IonPage>
			<IonHeader className='nav-title'>
				<IonToolbar >
					<IonButtons>
						<IonBackButton color='primary' defaultHref='/home' text=''></IonBackButton>
							<IonTitle className="ion-text-center" color='primary' > <strong>{title}</strong> </IonTitle>	
					</IonButtons>
							<IonButtons slot="end">
								<IonMenuButton color='primary' />
							</IonButtons>
				</IonToolbar>

			</IonHeader>
			<IonContent >
			
					<IonList >
				
							{/* <IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/previous">
									<IonLabel color='medium' slot='start'> &nbsp;&nbsp;&nbsp;{previousRoute}</IonLabel>
									<FontAwesomeIcon  icon='route' style={{fontSize:'25px',color:'#134985', marginLeft:'7rem'}}/>
							</IonItem> */}
							<br/>
							<IonLabel color='medium' style={{margin:'1rem',fontSize:'0.8em'}}>{dayTripReport}</IonLabel>
								<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/report">
									<IonCol size='10' color='medium'><IonLabel  color='medium' > {carUsage}</IonLabel></IonCol>
									<IonCol size='2' color='medium'><FontAwesomeIcon icon='car' style={{color:'#134985',fontSize:'25px'}}/></IonCol>
								</IonItem>
								<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/closeopensensor">
									<IonCol size='10' color='medium'><IonLabel  color='medium' > {closeOpenPTO}</IonLabel></IonCol>
									<IonCol size='2' color='medium'><FontAwesomeIcon icon='door-open' style={{color:'#134985',fontSize:'25px'}}/></IonCol>
								</IonItem>


							<br/> 
							<IonLabel color='medium' style={{margin:'1rem',fontSize:'0.8em'}}>{reportGraph}</IonLabel>
								
							<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/pieChart"> 
								<IonCol size='10' color='medium'>
									<IonLabel color='medium' > {pieChartDaily}</IonLabel>
								</IonCol>
								<IonCol size='2' color='medium'>
									<FontAwesomeIcon icon='chart-pie' style={{fontSize:'25px',color:'#134985'}}/>
								</IonCol>
							</IonItem>

							
							<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/monthlyPieChart">
								<IonCol size='10' color='medium'><IonLabel  color='medium' >{pieChartMonth}</IonLabel></IonCol>
								<IonCol size='2' color='medium'><FontAwesomeIcon  icon='chart-pie' style={{fontSize:'25px',color:'#134985'}}/></IonCol>
							</IonItem>
							
							
							<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/tempLineChart">
								<IonCol size='10' color='medium'>
									<IonLabel color='medium'>{temperatureChart}</IonLabel>
								</IonCol>
								<IonCol size='2' color='medium'>
									<FontAwesomeIcon icon='thermometer-three-quarters' style={{fontSize:'25px',color:'#134985'}}/>
								</IonCol>
							</IonItem>

							
							
							<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/lineChart">
								<IonCol size='10' color='medium'>
									<IonLabel color='medium'>{graphGasoline}</IonLabel>
								</IonCol>
								<IonCol size='2' color='medium'>
									<FontAwesomeIcon icon='burn' style={{fontSize:'25px',color:'#134985'}}/>
								</IonCol>
							</IonItem>
							{/* <IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/gasUsedChart">
								<IonCol size='10' color='medium'>
									<IonLabel color='medium'>{gasoloneUsed}</IonLabel>
								</IonCol>
								<IonCol size='2' color='medium'>
									<FontAwesomeIcon icon='gas-pump' style={{fontSize:'25px',color:'#134985'}}/>
								</IonCol>
							</IonItem> */}
							

							<br/> 
							<IonLabel color='medium' style={{margin:'1rem',fontSize:'0.8em'}}>{reportDepartOfLandTransport}</IonLabel>

							<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/overSpeed">
								<IonCol size='10' color='medium'><IonLabel  color='medium' >{overSpeed}</IonLabel></IonCol>
								<IonCol size='2' color='medium'><FontAwesomeIcon icon='shipping-fast' style={{fontSize:'25px',color:'#134985'}}/></IonCol>
							</IonItem>

							<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/drivingMoreFourHr">
								<IonCol size='10' color='medium'><IonLabel  color='medium' >{drivingMoreFourHr}</IonLabel></IonCol>
								<IonCol size='2' color='medium'><FontAwesomeIcon icon='hourglass-end' style={{fontSize:'25px',color:'#134985'}}/></IonCol>
							</IonItem>

							<br/>
							<IonLabel color='medium' style={{margin:'1rem',fontSize:'0.8em'}}>{other}</IonLabel>
							<IonItem mode='md' lines='full' routerDirection='forward' type='button' target="_self" routerLink="/notificationsReport">
								<IonCol size='10' color='medium'><IonLabel  color='medium' >{notiHistory}</IonLabel></IonCol>
								<IonCol size='2' color='medium'><FontAwesomeIcon icon='bell' style={{fontSize:'25px',color:'#134985'}}/></IonCol>
							</IonItem>
						</IonList>
					
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
};
