import {
	IonButtons,
	IonPage,
	IonToolbar,
	IonHeader,
	IonContent,
	IonLabel,
	IonMenuButton,
	IonBackButton,
	IonTitle,
	IonLoading,
	IonCol,
	IonPopover,
	IonInput,
	IonRow,
	IonButton,
	NavContext
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core"; 
import { faCar, faChartPie, faChartLine, faMapMarkedAlt, faRoute, faShippingFast, faDrawPolygon, faGripHorizontal, faMagic, faThermometerThreeQuarters, faBurn, faHourglassEnd } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import MapAddGeometry from '../leaflet-map/add-geometry/MapAddGeometry'

library.add(faCar, faChartPie, faChartLine, faMapMarkedAlt , faRoute, faShippingFast ,faDrawPolygon, faGripHorizontal, faMagic, faThermometerThreeQuarters, faBurn,faHourglassEnd)

const { Storage } = Plugins;
let title: any, loading:any ;
export default class AddGeometry extends React.Component{
	
	state={
		showPopover:false,
		showLoading: false, 
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
		drivingMoreFourHr :  "ขับเกิน 4 ชั่วโมง"
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
	
	showPopover=()=>{
        this.setState({
			showLoading:true,
			showPopover : true
		})
	}

	closePopover=()=>{
		this.setState({showPopover : false})
	}

	componentDidMount(){
		this.setLanguage()
	}

	getStorage = async (keyStore:any) => {
		try{ 
		  let value = localStorage.getItem(keyStore)
		  return value ;
		}catch{
		  return ''
		} 
	  };
 

	setLanguage = async ()=>{
		const ret =await this.getStorage('language');
		const languag =JSON.stringify( ret || '{}')
		let l

		if (languag === '"th"'){
			l = th.allReport
			title = l.title 
			
		} else if(languag === '"en"'){
			l = en.allReport
			title = l.title 
			
		}
		this.setShowLoading()
	}

	render(){
		const mapKey = '5e3612dcbfa88a77bf9cc6773e5a1545';
		//this.setLanguage();
		if(title === undefined){
			const l = this.state
			title = l.title 
			
		}
		return(
			<IonPage>
			
			<div style={{width:'100%',height:'100%'}}>
				<MapAddGeometry />
			</div>
					
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
