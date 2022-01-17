/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React  from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AppPage } from './declarations';

import Menu from './components/Menu';
import Home from './pages/Home';
import List from './pages/List';
import Login from  './pages/Login';
import Map from './pages/map';
import report from './pages/report';
import setting from './pages/setting';
import complain from './pages/complain';
import previousPath from './pages/previousPath';
import fullMap from './pages/fullMap';
import changePassword from './pages/changPassword';
import profile from './pages/profile'
import allReport from './pages/allReport'
import yearPayment from './pages/yearPayment';
import deviceSetting from './pages/deviceSetting';
import pieChart from './pages/pieChart';
import lineChart from './pages/lineChart';
import manual from './pages/manual';
import appWarning from './pages/appWarning'
import news from './pages/news';
import Locate from './components/Locate';
import ListCar from './components/listCar';
import {AlertPopover} from './components/alertPopover' ;
import CardCar from './components/cardCar';
import ProgressbarCount from './components/progressCount';
import ExpireDateWarning from './components/expireWarning';
import IconSelect from './components/iconSelect';
import MonthlyPieChart from './pages/monthlyPieChart';
import OverSpeed from './pages/overSpeed';
import NotificationSetting from './pages/notificationSetting'
import TempLineChart from './pages/tempLineChart'
import DrivingMoreFourHr from './pages/drivingMoreFourHr'
import Geometry from './pages/geometry'
import AddGeometry from './pages/addGeometry'
import PathRouting from './pages/pathRouting'
import CloseOpenSensor from './pages/reportCloseOpen'
import Regiter from './pages/Register'
import Maintenance from './pages/Maintenence'
import GasUsedChart from './pages/gasUsedLineChart'
import NotificationsReport from './pages/notificationsReport'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


/* Theme variables */
import './theme/variables.css';

 
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
    
        <Menu/>
        <IonRouterOutlet id="main">
          <Route path='/register' component={Regiter} exact={true} />
          <Route path="/home" component={Home} exact={true} />
          <Route path="/home/list" component={List} exact={true} />
          <Route path="/Login" component={Login} exact={true} />
          <Route path="/report" component={report} exact={true} />
          <Route path="/setting" component={setting} exact={true} />
          <Route path="/complain" component={complain} exact={true} />
          <Route path="/previous" component={previousPath} exact={true} />
          <Route path="/fullmap" component={fullMap} exact={true} />
          <Route path="/changePassword" component={changePassword} exact={true} />
          <Route path="/allReport" component={allReport} exact={true} />
          <Route path="/geometry" component={Geometry} exact={true} />
          <Route path="/addGeometry" component={AddGeometry} exact={true} />
          <Route path="/profile" component={profile} exact={true} />
          <Route path='/yearPayment' component={yearPayment} exact={true} />
          <Route path='/deviceSetting' component={deviceSetting} exact={true} />
          <Route path='/pieChart' component={pieChart} exact={true} />
          <Route path='/lineChart' component={lineChart} exact={true} />
          <Route path='/tempLineChart' component={TempLineChart} exact={true} />
          <Route path='/manual' component={manual} exact={true} />
          <Route path='/appWarning' component={appWarning} exact={true} />
          <Route path='/news' component={news} exact={true} />
          <Route path='/locate' component={Locate} exact={true} />
          <Route path='/listCar' component={ListCar} exact={true} />
          <Route path='/alertPop' component={AlertPopover} exact={true} />
          <Route path='/cardcar' component={CardCar} exact={true} />
          <Route path='/progresscount' component={ProgressbarCount} exact={true} />
          <Route path='/expireWarning' component={ExpireDateWarning} exact={true} />
          <Route path='/iconSelect' component={IconSelect} exact={true} />
          <Route path='/monthlyPieChart' component={MonthlyPieChart} exact={true} />
          <Route path='/overSpeed' component={OverSpeed} exact={true} />
          <Route path='/drivingMoreFourHr' component={DrivingMoreFourHr} exact={true} />
          <Route path='/notifications' component={NotificationSetting} exact={true} />
          <Route path='/pathrouting' component={PathRouting} exact={true} />
          <Route path='/closeopensensor' component={CloseOpenSensor} exact={true} /> 
          <Route path="/map" component={Map}  exact={true} />
          <Route path="/maintenance" component={Maintenance} exact={true} />
          <Route path="/gasUsedChart" component={GasUsedChart} exact={true} />
          <Route path="/notificationsReport" component={NotificationsReport} exact={true} />

          <Route path="/" render={() => <Redirect to="/register"/> } exact={true} />
        </IonRouterOutlet>
 
    </IonReactRouter>
  </IonApp>
);

export default App;
