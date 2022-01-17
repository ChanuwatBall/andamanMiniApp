/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
import {
	IonButtons,
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
		IonBackButton,
        IonTitle,
        IonLoading,
		IonMenuButton
	} from '@ionic/react';
import React from 'react';
import './style.css';
import en from '../en.json';
import th from '../th.json';
import { Plugins } from "@capacitor/core";
import { faCheckSquare, faCoffee , faCar, faBus, faTruck, faShip, faLocationArrow} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';

library.add( faCheckSquare, faCoffee ,faCar ,faBus , faTruck ,faShip , faLocationArrow)
const { Storage } = Plugins;
let title:any;
export default class manual extends React.Component{

    state= {
		showLoading: true ,
		setShowLoading:true,
		title: "คู่มือ"
	}

	getStorage = async (keyStore:any) => {
		try{ 
		  let value = localStorage.getItem(keyStore)
		  return value ;
		}catch{
		  return ''
		} 
	  };

    setCloseLoading=()=>{
		this.setState({
		  showLoading :false ,
		  setShowLoading:false
		})
    }
    setLanguage = async ()=>{
		const languag  =await this.getStorage('language'); 
		let l
		if (languag === '"th"'){
			l = th.manual
			title = l.title 
		} else if(languag === '"en"'){
			l = en.manual
			title = l.title 
		}
		
	}
	render(){
			this.setLanguage()
			if(title === undefined){
				title = this.state.title 
			}
		return(
			<IonPage>
			 	<IonHeader className='nav-title' >
								<IonToolbar color='light'>
										<IonButtons slot="start">
											<IonBackButton color='light' defaultHref="/home" />
												</IonButtons>
													<IonTitle className="ion-text-center" color='primary' ><strong>{title}</strong></IonTitle>
												<IonButtons slot="end">
											<IonMenuButton  color='light' />
									</IonButtons>
								</IonToolbar>
				</IonHeader>
			<IonContent>
						<div style={{width:'100vw' , height:'100vh', padding:'10px'}}>
								{/* <h4>{title}</h4> */}
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                </p> <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam 
                                    voluptas laborum beatae cum! Optio modi unde animi ipsam perferendis 
                                    numquam exercitationem soluta architecto adipisci hic sequi doloremque 
                                    odio, sed eos.
                                </p>
						</div>
			</IonContent>
            <IonLoading
			mode='ios'
			isOpen={this.state.showLoading}
			onDidDismiss={this.setCloseLoading}
			message={'Loading....'}
			duration={100}
		    />
		</IonPage>

		)
	}
}
