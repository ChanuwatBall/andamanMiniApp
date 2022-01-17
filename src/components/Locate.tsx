import * as React from "react";
import { GeolocatedProps, geolocated } from "react-geolocated";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

class Locate extends React.Component<GeolocatedProps> {

	latitude: any
	longitude: any
	interval:any

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

	componentDidMount(){
		this.longitude = this.props.coords && this.props.coords.longitude
		this.latitude = this.props.coords && this.props.coords.latitude
		if(this.longitude !== null || 	this.latitude !== null){
			console.log("Locate -> componentDidMount -> this.longitude", this.longitude)
			this.setStorage('latitude', this.latitude)
			this.setStorage('longitude',this.longitude)
		}else if(this.longitude === null || 	this.latitude === null){
			this.interval = setInterval(()=>{
				if(this.longitude !== null || 	this.latitude !== null){
					this.setStorage('latitude', this.latitude)
					this.setStorage('longitude',this.longitude)
					
				}
			},2000)
		}else{
			clearInterval(this.interval)
		}
	}

			componentWillUnmount(){
				clearInterval(this.interval)
			}
			
		render(): JSX.Element {
				return (
					<div>
					</div>
				);
		}
}
 
export default geolocated()(Locate);