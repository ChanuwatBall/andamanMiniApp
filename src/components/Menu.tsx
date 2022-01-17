import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonToolbar,
  IonIcon,
  IonMenuToggle, IonAvatar
} from '@ionic/react';
import React from 'react';
import { RouteComponentProps, Redirect} from 'react-router-dom';
import { AppPage } from '../declarations';
import { logOut, home, map, fileTray, chatbubbles, settings, person , pin , document, square, build, compass } from 'ionicons/icons';
import en from '../en.json';
import th from '../th.json';
import '../pages/style.css'; 
import moment from 'moment';

 
interface MenuProps extends RouteComponentProps {
  appPages: AppPage[];
}


let lang = localStorage.getItem('_cap_language');
let l:any;

interface Page {
    title: string;
    path: any;
    icon: any;
}
    if(lang === '"th"' || lang === 'th' ){
      l = th.Menu
    }else if(lang === '"en"' || lang === 'en'){
      l = en.Menu
    }else(
      l = th.Menu
    )
    let  manualFile = 'https://www.andamantracking.com/file/'

var pages = [
  { title: l.home , path: '/home', icon: home , link: 'in'},
  { title: l.map, path: '/fullmap',icon: map , link: 'out'},
  {title:l.previousRoute, path:'/previous' , icon: compass  , link: 'in' },
  { title: l.report, path: '/allReport', icon: fileTray , link: 'in' },
  { title: 'เขตพิ้นที่', path: '/allReport', icon: square  , link: 'in'},
  // { title: l.yearPayment, path: '/yearPayment', icon: cash  },
  { title: l.contact, path: '/complain', icon: chatbubbles , link: 'in'},
  { title: l.manual, path: manualFile, icon: document , link: 'out' },
  // { title: l.news, path: '/news', icon: paper , color:'#ffcc00'},
  // { title: l.deviceSetting, path: '/deviceSetting', icon: options , color:'#3399ff'},
  { title: l.setting, path: '/setting', icon: settings , link: 'in' },
  // { title: l.maintenence, path: '/maintenance', icon: build , link: 'in' },
  // { title: l.notifications, path: '/appWarning', icon: alert , color:'#ffa31a'}
];


export default class Menu extends React.Component {

  state={
    firstName: 'User',
    lastName: 'Account',
    Welcome:'ยินดีต้อนรับ !!',
    redirect : false ,

    home: "หน้าแรก",
		map: "แผนที่",
		previousRoute:"เส้นทางย้อนหลัง",
    report: "รายงาน",
    geometry : "เขตพื้นที่",
		yearPayment: "แจ้งยอดชำระค่าบริการรายปี",
		contact: "ติดต่อเรา",
		manual: "คู่มือ",
		news: "ข่าวสาร",
		deviceSetting: "ตั้งค่าอุปกรณ์",
		setting: "ตั้งค่า",
		notifications: "การแจ้งเตือน",
    logout: "ออกจากระบบ",
    manualFile: 'https://www.andamantracking.com/file/' ,
    backgroundInTime: '../assets/images/bg-day-night-04.jpg'
  }

  getStorage = async (keyStore:any) => {
		try{
		  // let { value } = await Storage.get({ key: keyStore }); 
		  let value = localStorage.getItem(keyStore)
		  return value ;
		}catch{
		  return ''
		} 
	  };
	setStorage = async (keyStore:any , valueStore:any) => {
		try{
		  //await Storage.set({ key: keyStore , value: valueStore });
		  localStorage.setItem(keyStore , valueStore)
		  console.log('set done')
		}catch{
		  return ''
		} 
	  };

  setLang=async ()=>{
    let lang =await this.getStorage('language')  
   //var lang = await Storage.get({key: 'language'})
    let l
    if(lang === 'th'){
      l = th.Menu
    }else  if(lang === 'en'){
      l = en.Menu
    }
    if(lang === '"th"' || lang === 'th' ){
      l = th.Menu
      this.setState({
        Welcome : l.welcome
      })
    }else if(lang === '"en"' || lang === 'en'){
      l = en.Menu
      this.setState({
        Welcome : l.welcome
      })
    }else{ 
      this.setState({
        Welcome : this.state.Welcome
      })
    }

      pages = [
        { title: this.state.home , path: '/home', icon: home , link: 'in' },
        { title: this.state.map, path: '/fullmap', icon: map , link: 'out' },
        { title:this.state.previousRoute, path:'/previous' , icon: compass , link: 'in'},
        { title: this.state.report, path: '/allReport', icon: fileTray , link: 'in'},
        { title: this.state.geometry, path: '/geometry', icon: square , link: 'in'},
        // { title: this.state.yearPayment, path: '/yearPayment', icon: cash },
        { title: this.state.contact, path: '/complain', icon: chatbubbles , link: 'in'},
        { title: this.state.manual, path: manualFile, icon: document , link: 'out' }, 
        // { title: this.state.news, path: '/news', icon: paper , color:'#ffcc00'},
        // { title: this.state.deviceSetting, path: '/deviceSetting', icon: options , color:'#3399ff'},
        { title: this.state.setting, path: '/setting', icon: settings , link: 'in'},
        { title: 'Maintenance', path: '/maintenance', icon: build , link: 'in' },
        // { title: this.state.notifications, path: '/appWarning', icon: alert , color:'#ffa31a'}
      ];
  }

  async componentDidMount(){
   this.setLang()
    const firstName= await this.getStorage('first_name')
    const lastName = await this.getStorage('last_name')
    if (firstName !== null || firstName !== undefined || firstName !== '' || firstName !== 'null'){
      this.setState({
        firstName: firstName,
        lastName: lastName
      })
    }else if(firstName === null || firstName ===undefined || firstName === ''|| firstName === 'null'){
      this.setState({
        firstName: this.state.firstName,
        lastName: this.state.lastName
      })
    } 

    let timeNow = moment().format('HH:mm:ss')
    console.log("componentDidMount -> timeNow", timeNow)

    if(timeNow > '06:30:00' &&timeNow < '10:00:00' ){
      this.setState({
        Hello: 'สวัสดีตอนเช้า' ,
        backgroundInTime:  "../assets/images/bg-day-night-03.jpg"
      })
    }else if(timeNow > '10:00:00' &&timeNow < '12:00:00' ){
      this.setState({
        Hello: 'สวัสดีตอนเช้า' ,
        backgroundInTime:  "../assets/images/bg-day-night-04.jpg"
      })
    } else if(timeNow > '12:00:00' && timeNow < '13:00:00'){
      this.setState({
        Hello: 'สวัสดีตอนเที่ยง',
        backgroundInTime:  "../assets/images/bg-day-night-04.jpg"
      })
    }else if(timeNow > '13:00:00' && timeNow < '16:00:00' ){
      this.setState({
        Hello: 'สวัสดีตอนบ่าย',
        backgroundInTime:  "../assets/images/bg-day-night-04.jpg"
      })
    }else if(timeNow > '16:00:00' && timeNow < '18:00:00' ){
      this.setState({
        Hello: 'สวัสดีตอนเย็น',
        backgroundInTime:  "../assets/images/bg-day-night-05.jpg"
      })
    }else if(timeNow > '18:00:00'  ){
      this.setState({
        Hello: 'สวัสดีตอนค่ำ',
        backgroundInTime:  "../assets/images/bg-day-night-06.jpg"
      })
    }
  }

  logout=()=>{
    this.setState({
      redirect : true
    })
    this.setStorage('token','')
    this.setStorage('deviceID','0')
    this.refreshPage()
  }

  
  refreshPage(){ 
    window.location.reload(); 
  }

  clearToken=()=>{
    this.setState({
      redirect:true
    },()=>this.refreshPage())

    this.setStorage('token','')
    this.setStorage('deviceID' ,'0')
  }

  clearValue=async ()=>{
    this.setStorage('deviceID' ,'0')
    let lang = await this.getStorage('language')
			this.setStorage('device', '0')
      this.setStorage('deviceID', '0')
      this.setStorage('startTime',  '')
		  this.setStorage('accessTime',  '')
			
			if(lang === '"th"'|| lang === 'th'){
				let selectPlaceHold = th.home.carList
				this.setStorage('carID',selectPlaceHold)
			}else if(lang === '"en"' || lang === 'en'){
        let	selectPlaceHold = en.home.carList
				this.setStorage('carID',selectPlaceHold)
			}
  }

  getUsername=async ()=>{
    var firstName= await this.getStorage('first_name')
    var lastName = await this.getStorage('last_name')
    var language  = await this.getStorage('language')
    this.setLang()
    this.setState({
      firstName: firstName,
      lastName: lastName
    }) 
    
    let l
    if(language === '"th"' || language === 'th' ){
      l = th.Menu
      this.setState({ Welcome : l.welcome })
    }else if(language === '"en"' || language === 'en'){
      l = en.Menu
      this.setState({ Welcome : l.welcome})
    }else{
      l = this.state
      this.setState({ Welcome : l.Welcome })
    }
  }


  render(){
      if(this.state.redirect === true){
        return <Redirect to='/Login' />
      }
    
    return(
        <IonMenu contentId="main" type="overlay" side="end" swipeGesture={false} onIonWillOpen={()=>this.getUsername()} >
          <IonHeader  className='nav-title' mode='ios'>  
              <div  className='menu-item'   style={{backgroundImage:"url('"+this.state.backgroundInTime+"')",backgroundSize:'cover',backgroundPosition:'center center'}}>
                <div  className='menu-item-icon'>
                    <img src="../assets/icon/logo.svg" alt='' className='iconMenu'/>
                </div> 
                <div className='menu-item-account'>
                  <IonLabel color='dark'><strong>{this.state.firstName}</strong> </IonLabel>
                  <p style={{fontSize:'.7em',lineHeight:'1px',color:'#134985',letterSpacing:'1px'}}>{this.state.Welcome}</p>
                </div>
              </div>
              
            
            {/* </IonToolbar> */}
          </IonHeader>
          <IonContent color='#fff'>
            <IonList style={{backgroundColor:'#fff'}} > 
              {pages.map((pages, index) => {
                return ( 
                  <IonMenuToggle key={index} autoHide={false} > 
                  {pages.link === 'out' ?
                   <IonItem  color='#fff' lines='none' onClick={()=>this.clearValue()}  href={pages.path}  mode="md" style={{fontSize:'.8em'}}> 
                      <IonIcon  style={{fontSize:'1.5em'}} color='primary' slot="start" icon={pages.icon} mode="md" /> 
                      <IonLabel color='medium' >{pages.title}</IonLabel> 
                  </IonItem> : 
                  window.location.pathname === pages.path && pages.link === 'in'?
                  <IonItem  color='primary' lines='none' onClick={()=>this.clearValue()} routerDirection='forward' type='button' target="_self" routerLink={pages.path}  mode="md" style={{fontSize:'.8em'}}> 
                        <IonIcon  style={{fontSize:'1.5em'}} color='light' slot="start" icon={pages.icon} mode="md" /> 
                        <IonLabel color='light'>{pages.title}</IonLabel> 
                  </IonItem> :
                  <IonItem  color='#fff' lines='none' onClick={()=>this.clearValue()} routerDirection='forward' type='button' target="_self" routerLink={pages.path}  mode="md" style={{fontSize:'.8em'}}> 
                        <IonIcon  style={{fontSize:'1.5em'}} color='primary' slot="start" icon={pages.icon} mode="md" /> 
                        <IonLabel color='medium'>{pages.title}</IonLabel> 
                  </IonItem> 
                }
                </IonMenuToggle> 
                );
              })} 
              <IonMenuToggle>
                <IonItem color='#fff'  lines='none' onClick={()=>this.clearToken()} style={{fontSize:'.8em'}} > 
                    <IonIcon  style={{fontSize:'1.5em'}}  color='primary' slot="start" icon={logOut}  /> 
                    <IonLabel color='medium'>{l.logout}</IonLabel> 
                </IonItem> 
              </IonMenuToggle>
            </IonList>
          </IonContent>
        </IonMenu>
    )
  }
}
