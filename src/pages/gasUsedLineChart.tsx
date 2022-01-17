import {
	IonButtons,
	IonPage,
	IonToolbar,
    IonHeader,
    IonContent,
    IonRow,
    IonCol,
	IonBackButton,
	IonLoading,
	IonRefresher,
	IonRefresherContent,
	IonLabel,
	IonButton,
	IonDatetime,
	IonPopover,
	IonIcon,
	IonToast
	} from '@ionic/react';
import React from 'react';
import './Home.css';
import Chart from "react-apexcharts";
import api from '../api.json';
import en from '../en.json';
import th from '../th.json';
import axios from 'axios'; 
import { Storage } from '@capacitor/storage';
//import ListCar from '../components/listCar';
import Select from 'react-select';
import { closeCircle } from 'ionicons/icons';

 
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
 
let options = {
	chart: {
		type: 'area',
		height: 350,
		animations: {
		  enabled: false
		},
		zoom: {
			enabled: true,
			type: 'x',  
			autoScaleYaxis: true,  
			zoomedArea: {
			  fill: {
				color: '#90CAF9',
				opacity: 0
			  },
			  stroke: {
				color: '#0D47A1',
				opacity: 1,
				width: 0.1
			  }
			}
		  },
	  },
	  dataLabels: {
		enabled: false
	  },
	  stroke: {
		curve: 'stepline'
	  },
	  fill: {
		type: 'solid',
	  },
	  legend: {
		show: false,
	  },
	  markers: {
		size: 0,
		hover: {
		  size: 0
		}
	  },
	  toolbar: {
		autoSelected: 'zoom'
	  },
	  tooltip: {
		shared: false,
		intersect: true,  
		offsetY: 0 ,
	  }, 

	xaxis: {
	  type: 'datetime', 
	  show: true,
	  labels: {
		show: true,
		rotate: -45 ,
		style:{ 
				colors: '#666'
			}
		},
		categories:[''] , 
	},
	colors: ['#6ffc03','#fce303','#fc1803','#134985'],
	yaxis: {
		labels: {
			formatter: function (value:any) {
				return value.toFixed(2) + ""; 
			} ,
			show: true,
			style:{ 
				colors: '#666'
			}
		},
	}
  }

	let series: { name: string; data: React.Key[][]; }[] = []
	

export default class gasUsedChart extends React.Component{
	
	timer:any;
	state= {
		setShowToast:false,
		showPopover:false,
		selectPlaceHold : 'ALL' ,
		selectedOption: null ,
		selectValue: 0,
		selectLabel:'',
		dateSelected: '',
		showLoading: false, 
		setShowLoading:false,

        series: [],
		list:[
			{
				color: "red",
				gasolone: "-30.56",
				time: "09:06"
			}
		],

		title: "การใช้น้ำมัน",
        date:"วันที่",
        carID : "ทะเบียน" ,
        showReport:"แสดงรายงาน",
        reportTitle: "รายงานกราฟการใช้น้ำมัน",
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
	}

	getStorage = async (keyStore:any) => {
		try {
		  let value = localStorage.getItem(keyStore);
		  return value;
		} catch {
		  return "";
		}
	  };
	  setStorage = async (keyStore:any, valueStore:any) => {
		try {
		  localStorage.setItem(keyStore, valueStore);
		  console.log("set done");
		} catch {
		  return "";
		}
	  };

	setShowLoading=()=>{
		this.setState({
			showLoading :true ,
			setShowLoading:true
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

	setLanguage=async ()=>{
		const languag = await this.getStorage('language');
		let l 
		if(languag=== 'th'){
			l = th.gasolineUsed
			title= l.title
			date= l.date
			vehicleID= l.carID
			showReport= l.showReport
			reportTitle= l.reportTitle
			closeReport= l.close
			loading = l.loading
		}else if(languag=== 'en'){
			l = en.gasolineUsed
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
		//this.setShowLoading()
	}

	async componentDidMount(){
		this.setLanguage()
		this.setLoading(true)
		let token =await this.getStorage( 'token');
		let lang = await this.getStorage('language')
		let host = await this.getStorage('api')
		let device = await this.getStorage( 'deviceID')
		
		dateTime = moment().format()
		this.setState({dateSelected : moment(dateTime).format('DD/MM/YYYY')} )
			
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
				}else if(lang=== '"en"' || lang=== 'en'){
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
			//}

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
		this.setState({dateSelected : moment(dateTime).format('DD/MM/YYYY')} )
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
		let lang = await Storage.get({key : 'language'})
			this.setStorage('device', '0')
			this.setStorage('deviceID', '0')
			
			if(lang.value === '"th"'|| lang.value === 'th'){
				selectPlaceHold = th.home.carList
				this.setStorage('carID',selectPlaceHold)
			}else if(lang.value === '"en"' || lang.value === 'en'){
				selectPlaceHold = en.home.carList
				this.setStorage('carID',selectPlaceHold)
			}
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
		let device_id = await this.getStorage('deviceID')
		let date = await this.getStorage('date')

		console.log("submit -> this.state.dateSelected", this.state.dateSelected)
		console.log("submit -> apiHost.value", apiHost)  
		console.log("submit -> device_id", this.state.selectValue)
		
		if(this.state.selectValue!== 0){
			axios.post(`${apiHost}/report/gasolone`,{
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
				if(res.data.length > 0){ 
				this.setState({
					list : res.data ,
					series: []
				},()=>{
					
					// options.xaxis.categories = [] 
					// options.colors = [] 
					// let catLength  
					// let colLength  
					// let red = '#f01d0e'
					// let yellow = '#fcec03'
					// let green = '#99ff24'
					// let blue = '#73bff5'
					// let seriesGreen = {
					// 	name: 'move',
					// 	type: 'area',
					// 	data: [[0,'1']]
					// } 
				 
					// let serie = {
					// 	name: 'stop',
					// 	type: 'area',
					// 	data: [[0,'1']]
					// }
					// let holeSeries: any[] =[] 
					// serie.data = []
					// let l 
					// for(let i=0 ; i < res.data.length-1 ;i++){
					// 	l = res.data[i]
					// 	catLength = options.xaxis.categories.length
					// 	//colLength = options.colors.length+1

					// 	if(res.data[i].color == "red"){
					// 		options.colors[i] = red
					// 		options.xaxis.categories[i] =  moment(res.data[i].time).add(7, 'hours').format() 
					// 		serie.data[i] = [  moment(res.data[i].time).add(7, 'hours').format() ,parseFloat(res.data[i].gasolone) ]
					// 		//series.name ='stop' 
					// 		holeSeries = [...holeSeries , ...[{name: 'stop',type: 'area',data:[serie.data[i]] }]]
							  
					// 	}else if(res.data[i].color == "#ffd433"){ 
					// 		options.colors[i] = yellow
					// 		options.xaxis.categories[i] =  moment(res.data[i].time).add(7, 'hours').format() 
					// 		serie.data[i] = [  moment(res.data[i].time).add(7, 'hours').format() ,parseFloat(res.data[i].gasolone) ]
					// 		//series.name ='idle'
					// 		holeSeries = [...holeSeries , ...[{name: 'idle',type: 'area',data:[serie.data[i]] }]]
					// 	}else if(res.data[i].color == "green"){ 
					// 		options.colors[i] = green
					// 		options.xaxis.categories[i] =  moment(res.data[i].time).add(7, 'hours').format() 
					// 		serie.data[i] = [  moment(res.data[i].time).add(7, 'hours').format() ,parseFloat(res.data[i].gasolone) ]
					// 		//series.name ='move'
					// 		holeSeries = [...holeSeries , ...[{name: 'move',type: 'area',data:[serie.data[i]] }]]
					// 	}
					// }
					// console.log('holeSeries ',holeSeries)
					// this.setState({
					// 	series : holeSeries
					// },()=>{
					// 	console.log('series' , this.state.series)
					// 	console.log('categories ' ,options.xaxis.categories)
					// 	console.log('colors ' ,options.colors)
					// })
					
				})
				

				let greenArr=[
					{
						color: "green",
						gasolone: "-30.56",
						time: "09:06"
					}
				]
				let yellowArr=[
					{
						color: "yellow",
						gasolone: "-30.56",
						time: "09:06"
					}
				]
				let redArr=[
					{
						color: "red",
						gasolone: "-30.56",
						time: "09:06"
					}
				]
				
				let seriesGreen = {
					name: 'move',
					type: 'area',
					data: [[0,'1']]
				}
				let seriesYellow = {
					name: 'idle',
					type: 'area',
					data: [[0,'1']]
				}
				let seriesRed = {
					name: 'stop',
					type: 'area',
					data: [[0,'1']]
				} 
				let seriesLine = {
					name: 'All',
					type: 'area',
					data: [[ 0, '1']]
				}

				greenArr =  this.state.list.filter((list)=>  list.color === 'green')
				console.log("submit -> greenArr", greenArr)

				yellowArr =  this.state.list.filter((list)=>  list.color === 'yellow' || list.color === '#ffd433')
				console.log("submit -> yellowArr", yellowArr)
				
				redArr  =  this.state.list.filter((list)=>  list.color === 'red')
				console.log("submit -> redArr", redArr)
				
				
				
				for(let i =0; i <= this.state.list.length-1 ; i++){
					options.xaxis.categories[i] = moment(this.state.list[i].time).add(7, 'hours').format()
					seriesLine.data[i] = [  moment(this.state.list[i].time).add(7, 'hours').format() , parseFloat(this.state.list[i].gasolone)  ]
				}
				console.log("submit -> seriesLine", seriesLine)
				
				if( greenArr.length > 0 ){
					for(let i=0 ; i <= greenArr.length-1 ; i++){
						seriesGreen.data[i] = [moment(greenArr[i].time).add(7, 'hours').format() , parseFloat(greenArr[i].gasolone) ]
					}
				}
				if( yellowArr.length > 0 ){
					for(let i=0 ; i <= yellowArr.length-1 ; i++){
						seriesYellow.data[i] = [  moment(yellowArr[i].time).add(7, 'hours').format() ,parseFloat(yellowArr[i].gasolone)  ]
                    }
				}
				if( redArr.length > 0 ){
					for(let i=0 ; i <= redArr.length-1 ; i++){
						seriesRed.data[i] = [  moment(redArr[i].time).add(7, 'hours').format() ,parseFloat(redArr[i].gasolone) ]
					}
				}
				let red = '#f01d0e'
				let yellow = '#fcec03'
				let green = '#99ff24'
				let blue = '#73bff5'
				options.colors=[yellow,red,green]

				series[0]= seriesYellow
				series[1]= seriesRed
				series[2]= seriesGreen
				//series[3]= seriesLine

				console.log('series ' ,series)

				this.setState({
					series: series
				},()=>console.log(this.state.series))
			
				
				this.showPopover()
			}else if(res.data.length < 1 ){
				this.setShowToast(true)
				setTimeout(()=>{
					this.setShowToast(false)
				},3000) 
			}
				this.setLoading(false)
			})

        }else{
           console.log("กรุณาเลือกรถ");
        }
	}
	  
	closePopover=()=>{
		this.setState({showPopover : false})
	  }


	goToMap =()=>{
		this.setState({
			redirect : true
		})
	}

	setLoading=(e:any)=>{
		this.setState({
		  showLoading : e 
		})
	}
	doRefresh =(event: CustomEvent)=> {
		console.log('กำลังโหลด');
	  
		setTimeout(() => {
		  console.log('โหลดสำเร็จ');
		  event.detail.complete();
		}, 2000);
	}

	setShowToast=(e:any)=>{
		this.setState({
			setShowToast : e
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
			<IonHeader className='nav-title' >
						<IonToolbar color='light' >
							<IonButtons>
								<IonBackButton color='primary' defaultHref='/allReport' text={title}></IonBackButton>
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
 
		 <IonRow style={{padding:'0px',marginTop:'1rem'}}>
		  <IonCol size="12" style={{padding:'0px'}}>
			<IonLabel style={{margin:"10px"}}>{date}</IonLabel><br/>
		  		<div className="dateBox">
                    <div style={{float:"left"}} className="dateLabel">
                        <IonLabel color='medium'><h6> {date} </h6></IonLabel>
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
			</IonCol>
		</IonRow>
		
		<div style={{width:'100vw', height:'1px',backgroundColor:'#f2f2f2',marginBottom:'1rem',marginTop:'1rem'}}></div>
		<IonRow style={{padding:'0px'}}>
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

		 <IonRow>
			 <IonCol size='12'>
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

		<IonPopover
				mode='ios'
				isOpen={this.state.showPopover}
				cssClass='popover-class'
				onDidDismiss={()=> this.closePopover()}
			>
				 <IonIcon icon={closeCircle} className='closePopover' color='primary' style={{fontSize:'2rem'}} onClick={() => this.closePopover()} />
				<div className='ion-text-center' style={{marginTop:'2rem',textAlign:'center' ,fontSize:'0.8em'}}>
					<IonLabel >{reportTitle}</IonLabel><br/>
					<IonLabel style={{fontSize:'.7em'}}> {vehicleID} {this.state.selectLabel} {date} {this.state.dateSelected}</IonLabel>
				</div>
				<div style={{margin:'1.7rem'}} >
					<Chart
						options={options}
						series={ this.state.series}
						type="area"
						width="350"
					/>
            	</div>
				
          </IonPopover>
           
		</IonContent>
		<IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={()=>this.setLoading(false)}
			message={loading} 
		/>
		<IonToast
			isOpen={this.state.setShowToast}
			onDidDismiss={() => this.setShowToast(false)}
			mode='ios'
			color='dark'
			message="ไม่พบข้อมูล"
			position="bottom"
			buttons={[
			{
				text: 'ตกลง', 
				handler: () => {
					console.log('ตกลง');
				}
			}
			]}
		/>
			
		</IonPage>
		)
	}
}
