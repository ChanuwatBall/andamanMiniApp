import React from "react";
import { Map, Marker, Popup, TileLayer, Tooltip, Polygon } from "react-leaflet";
import {
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonCol,
  IonInput,
} from "@ionic/react";
import { Icon, LatLngBounds } from "leaflet";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLayerGroup,
  faMapMarkerAlt,
  faLock,
  faLocationArrow,
  faPhoneAlt,
  faPlus,
  faMinus,
  faPlug,
  faDrawPolygon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plugins } from "@capacitor/core";
import app from "../../app.config.json";
import axios from "axios";
import api from "../../api.json";
import th from "../../th.json";
import en from "../../en.json";
import "leaflet/dist/leaflet.css";
import "leaflet-moving-rotated-marker";
import "./full-map.css";
import { closeCircle, searchOutline, ellipse } from "ionicons/icons";
import MarkerClusterGroup from "react-leaflet-markercluster";

library.add(
  faLayerGroup,
  faMapMarkerAlt,
  faLock,
  faLocationArrow,
  faPhoneAlt,
  faPlus,
  faMinus,
  faPlug,
  faDrawPolygon
);
const { Storage } = Plugins;
var moment = require("moment");
moment().format();

export const generalLayer = "../assets/images/normallayer.PNG";
export const sattleliteLayer = "../assets/images/sattlelitelayer.PNG";
export const longdoLayer = "../assets/images/longdolayer.PNG";
export const lanscapeLayer = "../assets/images/lanscapelayer.PNG";

export var iconMove = new Icon({
  iconUrl: "../assets/icon/status_move.png",
  iconSize: [50, 50],
});
export var iconIdle = new Icon({
  iconUrl: "../assets/icon/status_idle.png",
  iconSize: [50, 50],
});
export var iconStop = new Icon({
  iconUrl: "../assets/icon/status_stop.png",
  iconSize: [50, 50],
});
export var iconOffline = new Icon({
  iconUrl: "../assets/icon/status_offline.png",
  iconSize: [50, 50],
});
let GSM, GPS, Speed, Voltage, place, status, driver, charge;
let LayerNormal,
  LayerOpenstreet,
  LayerSattlelie,
  LayerLanscape,
  DoorClose,
  DoorOpen,
  DoorSensor;
export default class LeafletMap extends React.Component {
  mapRef = React.createRef();
  state = {
    deviceID: 0,
    activeList: null,
    openFromList: false,
    zoom: 6,
    tile: "",
    attribution: "",
    tile2: "",
    attribution2: "",
    roadnet: [{ tile: "", attribution: "" }],
    hideLayer: "none",
    latgiude: "13.747388924343081",
    longitude: "460.5022430419922",
    mapHeight: "100vh",
    detailsBoxHide: "none",
    tooltipDisplay: "none",
    showPopover: false,
    List: [
      {
        device_id: 0,
        canCutEngin: false,
        name: "",
        event_id: 0,
        latitude: 0,
        longitude: 0,
        expiration_date: "",
        lastEvent: "",
        address: "",
        event_stamp: 0,
        fuel_liters: "",
        heading: 0,
        satellites: "",
        speed: "",
        status: "",
        status_time: "",
        temperature: "",
        show: false,
        fld_signalStrength: "",
        fld_engineLoad: "",
        fld_sensorHigh: "0",
        fld_driverID: "",
        fld_driverMessage: "",
        phone_number: "",
        modal: 0,
        status_name: "",
        online: 0,
        status_engin: null,
        mile: 0,
        closeOpenSensor: 0,
      },
    ],
    list: [
      {
        device_id: 0,
        canCutEngin: false,
        name: "",
        event_id: 0,
        latitude: 0,
        longitude: 0,
        expiration_date: "",
        lastEvent: "",
        address: "",
        event_stamp: 0,
        fuel_liters: "",
        heading: 0,
        satellites: "",
        speed: "",
        status: "",
        status_time: "",
        temperature: "",
        fld_signalStrength: "",
        fld_engineLoad: "",
        fld_sensorHigh: "0",
        fld_driverID: "",
        fld_driverMessage: "",
        phone_number: "",
        modal: 0,
        show: false,
        status_name: "",
        online: 0,
        status_engin: null,
        mile: 0,
        closeOpenSensor: 0,
      },
    ],
    carInGeo: [
      {
        device_id: 2389,
        name: "70-1388",
        status_name: "จอดนิ่ง",
        status: 23,
        online: 1,
        time: "xxxx",
        enterTime: "yyyy",
      },
      {
        device_id: 3462,
        name: "70-1350",
        status_name: "เคลื่อนที่",
        status: 7,
        time: "xxxx",
        enterTime: "yyyy",
      },
    ],
    geoId: 0,
    geoIcon: [
      {
        geoId: 0,
        icon: 29,
        canDelete: false,
        name: "",
        position: [{ lat: 0, lon: 0 }],
      },
    ],
    keepGeoIcon: [],
    keepGeo: [],
    Geometry: [
      { lon: 98.295604480831, lat: 8.2086072796338 },
      { lon: 98.30023933801, lat: 8.2111558115165 },
    ],
    // iconPlace : [
    // 	{  id: 92 ,  name: 'NGV' , lat :7.996021086161204,lon: 98.32283020019533 },
    // 	{  id: 100 ,  name: 'FLAG', lat: 8.075910290523446,lon: 98.3540725708008  },
    // 	{  id: 94 ,  name: 'REST' , lat: 8.112973141422426,lon: 98.3269500732422 },
    // 	{  id: 95 ,  name: 'OFFICE' ,lat:8.070836049673336,lon: 98.42033386230469  },
    // 	{  id: 96 ,  name: 'TMB' , lat:8.236985834325848,lon: 98.32763671875001 },
    // 	{  id: 97 ,  name: 'TEMPLE' , lat:8.26314307588701, lon:98.29879760742189 },
    // 	{  id: 98 ,  name: 'OFFICE2' , lat:8.319528503202765, lon: 98.294677734375 },
    // ],
    LongdomapEnable: true,
    OpenstreetmapEnable: true,
    SattleliteEnable: true,
    LanscapeEnable: true,
    place: "ตำแหน่ง",
    GSM: "GSM",
    GPS: "GPS",
    Gasolone: "น้ำมัน",
    Speed: "ความเร็ว",
    Charge: "ชาร์ตไฟ",
    Voltage: "แรงดันไฟ",
    Temp: "อุหภูมิ",
    Time: "เวลา",
    status: "สถานะ",
    Driver: "คนขับ",
    LayerNormal: "ทั่วไป",
    LayerOpenstreet: "สีเทา",
    LayerSattlelie: "ดาวเทียม",
    LayerLanscape: "ภูมิประเทศ",
    DoorSensor: "เซนเซอร์ประตู",
    DoorOpen: "เปิด",
    DoorClose: "ปิด",
    keyword: "",
  };

  componentDidUpdate() {
    //fixed gray tile
    this.mapRef.current.leafletElement.invalidateSize();
  }

  getStorage = async (keyStore) => {
    try {
      let value = localStorage.getItem(keyStore);
      return value;
    } catch {
      return "";
    }
  };
  setStorage = async (keyStore, valueStore) => {
    try {
      localStorage.setItem(keyStore, valueStore);
      console.log("set done");
    } catch {
      return "";
    }
  };

  setLanguage = async () => {
    let language = await this.getStorage("language");
    if (language === "th" || language === '"th"') {
      let l = th.fullMap;
      place = l.place;
      GSM = l.GSM;
      GPS = l.GPS;
      Speed = l.Speed;
      Voltage = l.Voltage;
      status = l.Status;
      driver = l.Driver;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      charge = l.Charge;
      DoorClose = l.DoorClose;
      DoorOpen = l.DoorOpen;
      DoorSensor = l.DoorSensor;
    } else if (language === "en" || language === '"en"') {
      let l = en.fullMap;
      place = l.place;
      GSM = l.GSM;
      GPS = l.GPS;
      Speed = l.Speed;
      Voltage = l.Voltage;
      status = l.Status;
      driver = l.Driver;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      charge = l.Charge;
      DoorClose = l.DoorClose;
      DoorOpen = l.DoorOpen;
      DoorSensor = l.DoorSensor;
    }
  };

  getPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        if (latitude !== null || longitude !== null) {
          this.setState({
            latgiude: latitude,
            longitude: longitude,
          });
          this.setStorage("latitude", JSON.stringify(latitude));
          this.setStorage("longitude", JSON.stringify(longitude));
        }
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }

  async componentDidMount() {
    this.setLanguage();
    let lang = await this.getStorage("language");
    let token = await this.getStorage("token");
    let apiHost = await this.getStorage("api");
    let localLatitude = await this.getStorage("latitude");
    let localLongitude = await this.getStorage("longitude");
    let zoom = await this.getStorage("zoom");
    let openFromList = await this.getStorage("openFromList");
    let deviceID = await this.getStorage("deviceID");

    this.setState({
      List: this.state.List.filter((List) => List.device_id !== 0),
      openFromList: JSON.parse(openFromList),
      deviceID: JSON.parse(deviceID),
      geoIcon: [],
      Geometry: [],
    });

    if (
      JSON.parse(localLatitude) === null ||
      JSON.parse(localLatitude) === "null" ||
      JSON.parse(localLongitude) === null ||
      JSON.parse(localLongitude) === "null"
    ) {
      this.setState(
        {
          latgiude: "13.747388924343081",
          longitude: "460.5022430419922",
        },
        () => {
          this.getPosition();
        }
      );
    } else {
      this.setState({
        latgiude: JSON.parse(localLatitude),
        longitude: JSON.parse(localLongitude),
      });
    }

    console.log(this.state.latgiude, this.state.longitude);

    try {
      await this.setState({
        tile: "https://longdomap.attg.cc/mmmap/img.php?zoom={z}&x={x}&y={y}&key=cc2cfcc6fd6e2673395611b352382892&proj=epsg3857&HD=1",
        attribution: "© Longdo Map",
      });

      //http://roadnet2.doh.go.th/geoserver/gwc/service/wms
    } catch {
      console.log("can not load longdo tile");
      await this.setState({
        tile: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
    }
    if (zoom === "" || zoom === undefined || zoom === null) {
      this.setState({
        zoom: 6,
      });
      this.removeIconPlace(6);
    } else {
      this.setState(
        {
          zoom: parseInt(zoom),
        },
        () => {
          this.removeIconPlace(this.state.zoom);
        }
      );
    }

    /*****************  Map Enable *********************/
    console.log(api.authorization);
    axios
      .get(apiHost + "/mapenbled", {
        headers: {
          language: lang,
          token: token,
          authenication: api.authorization,
          version: api.version,
        },
      })
      .then((res) => {
        this.setState({
          LongdomapEnable: res.data[0].status,
          OpenstreetmapEnable: res.data[1].status,
          SattleliteEnable: res.data[2].status,
          LanscapeEnable: res.data[3].status,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    /********************************** */

    axios
      .get(apiHost + "/home", {
        headers: {
          language: lang,
          token: token,
          authorization: api.authorization,
          version: api.version,
        },
      })
      .then((res) => {
        console.log("map -> res", res.data);
        if (res.data !== "" || res.data !== null || res.data !== undefined) {
          let carList = [];
          this.setState(
            {
              list: res.data,
            },
            () => {
              carList = this.state.list.filter(
                (list) =>
                  list.device_id !== null &&
                  list.event_id !== null &&
                  list.latitude !== null &&
                  list.longitude !== null
              );
              console.log(
                "LeafletMap -> componentDidMount -> carList",
                carList
              );
              this.setState({
                List: carList,
              });

              if (this.state.openFromList === true) {
                console.log("openFromList > ", this.state.openFromList);
                this.setState(
                  {
                    setActivePark: this.state.list.filter(
                      (list) => list.device_id === this.state.deviceID
                    ),
                  },
                  () => {
                    console.log("setActivePark ", this.state.setActivePark);
                    this.setActivePark(this.state.setActivePark[0]);
                    this.setState({
                      detailsBoxHide: !this.state.detailsBoxHide,
                    });
                  }
                );
              }
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ List: null });
      });
    this.fetchData();

    this.sliderInterval = setInterval(() => {
      axios
        .get(apiHost + "/home", {
          headers: {
            language: lang,
            token: token,
            authorization: api.authorization,
            version: api.version,
          },
        })
        .then((res) => {
          if (res.data !== "" || res.data !== null || res.data !== undefined) {
            let carList = [];
            this.setState({
              List: [],
            });
            this.setState(
              {
                list: res.data,
              },
              () => {
                let carList = [];
                carList = this.state.list.filter(
                  (list) =>
                    list.device_id !== null &&
                    list.event_id !== null &&
                    list.latitude !== null &&
                    list.longitude !== null
                );
                console.log(
                  "LeafletMap -> componentDidMount -> carList",
                  carList
                );
                this.setState({
                  List: carList,
                });
                if (this.state.openFromList === true) {
                  console.log("openFromList > ", this.state.openFromList);
                  this.setState(
                    {
                      setActivePark: this.state.list.filter(
                        (list) => list.device_id === this.state.deviceID
                      ),
                    },
                    () => {
                      // console.log(
                      //   "setActivePark ",
                      //   this.state.setActivePark[0].heading
                      // );
                      this.setActivePark(this.state.setActivePark[0]);
                      this.setState({
                        detailsBoxHide: !this.state.detailsBoxHide,
                      });
                    }
                  );
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ List: null });
        });
    }, 60000);
  }

  showPopover = (e) => {
    this.setState({
      showPopover: e,
    });
  };

  componentWillUnmount() {
    //this.unsubscribe();
    this.setStorage({ key: "openFromList", value: JSON.stringify(false) });
    clearInterval(this.sliderInterval);
    this.setState({
      latgiude: "",
      longitude: "",
    });
  }

  setActivePark = (e) => {
    this.setState({
      activeList: e,
    });
  };

  setTileLongdoMap = async () => {
    try {
      await this.setState({
        tile: "https://longdomap.attg.cc/mmmap/img.php?zoom={z}&x={x}&y={y}&key=cc2cfcc6fd6e2673395611b352382892&proj=epsg3857&HD=1",
        attribution: "© Longdo Map",
      });
    } catch {
      console.log("can not load tile");
    }
  };

  setTileSattlelite = async () => {
    try {
      await this.setState({
        tile: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      });
    } catch {
      console.log("can not load tile");
    }
  };

  setTileOpenStreetMap = async () => {
    try {
      await this.setState({
        tile: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
    } catch {
      console.log("can not load tile");
    }
  };

  setTileLanscape = async () => {
    try {
      await this.setState({
        tile: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
        attribution:
          '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
    } catch {
      console.log("can not load tile");
    }
  };

  setLayer = () => {
    if (this.state.hideLayer === "none") {
      this.setState({ hideLayer: "block" });
    } else if (this.state.hideLayer === "block") {
      this.setState({ hideLayer: "none" });
    }
  };

  latToCoord = (lat) => {
    // let re= x * 60
    // let re2 = re * 60
    // let result = re2 + 20.736

    let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    y = (y * 20037508.34) / 180;

    //var y = ((-1 * lat) + 90) * (height / 180);
    return JSON.stringify(y);
  };
  lonToCoord = (lon) => {
    // let re= y * 60
    // let re2 = re * 60
    // let result = re2 + 5.745

    let x = (lon * 20037508.34) / 180;

    //var x = (lon + 180) * (width / 360);
    return JSON.stringify(x);
  };

  roadNet = async (zoom, e) => {
    if (zoom >= 16) {
      //let roadnetLength = e.target._zoomBoundLayers[23]._tiles

      let bound = e.target.getBounds();
      let size = e.target._size;
      console.log(
        this.lonToCoord(bound._northEast.lng),
        this.latToCoord(bound._northEast.lat)
      );
      let myTile =
        "http://roadnet2.doh.go.th/geoserver/gwc/service/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&SRS=EPSG:3857&BBOX=" +
        this.lonToCoord(bound._northEast.lng) +
        "," +
        this.latToCoord(bound._northEast.lat) +
        "," +
        this.lonToCoord(bound._southWest.lng) +
        "," +
        this.latToCoord(bound._southWest.lat) +
        "&WIDTH=" +
        size.x +
        "&HEIGHT=" +
        size.y +
        "&LAYERS=roadnet2:section_km&STYLES=&TRANSPARENT=true&TILED=true&FORMAT=image/png&EXCEPTIONS=BLANK";
      //let myTile = 'http://roadnet2.doh.go.th/geoserver/gwc/service/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&SRS=EPSG:3857&BBOX=11202610.865475297,1526294.5807983798,11212394.8050958,1536078.5204188824&WIDTH=256&HEIGHT=256&LAYERS=roadnet2:section_km&STYLES=&TRANSPARENT=true&TILED=true&FORMAT=image/png&EXCEPTIONS=BLANK'
      //console.log(myTile)

      // await this.setState({
      // 	tile2  : myTile,
      // 	attribution2: '© roadnet2',
      // })

      //console.log('e.target._pixelOrigin.Point ',e.target._pixelOrigin.Point)
      // await this.setState({
      // 	tile2  : 'http://roadnet2.doh.go.th/geoserver/gwc/service/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&SRS=EPSG:3857&BBOX='+ e.target._pixelOrigin.Point.x+','+e.target._pixelOrigin.Point.y+'&WIDTH='+e.target._size.Point.x+'&HEIGHT='+e.target._size.Point.y+'&LAYERS=roadnet2:section_km&STYLES=&TRANSPARENT=true&TILED=true&FORMAT=image/png&EXCEPTIONS=BLANK',
      // 	attribution2: '© roadnet2',
      // })
    } else {
      await this.setState({
        tile2: "",
        attribution2: "© roadnet2",
      });
    }
  };
  fetchData = async () => {
    let lang = await this.getStorage("language");
    let token = await this.getStorage("token");
    let apiHost = await this.getStorage("api");

    axios
      .get(apiHost + "/geometry", {
        headers: {
          language: lang,
          token: token,
          authenication: api.authorization,
          version: api.version,
        },
      })
      .then((res) => {
        console.log("geometry -> res", res);
        this.setState({
          geoIcon: res.data,
          keepGeoIcon: res.data,
          keepGeo: res.data,
        });
      });
  };

  removeIconPlace = async (zoom) => {
    console.log("zoom ", zoom);
    if (zoom < 8) {
      this.setState({
        geoIcon: [],
      });
    } else if (zoom === 8) {
      // this.setState({
      // 	geoIcon : this.state.keepGeoIcon
      // })
      this.fetchData();
    }
    if (zoom === 11) {
      this.setState({
        tooltipDisplay: "block",
      });
      console.log("zoom more 13");
    } else if (zoom === 10) {
      this.setState({
        tooltipDisplay: "none",
      });
      console.log("zoom less then 13");
    }
  };

  searchGeometry = (e) => {
    console.log(e);
    this.setState(
      {
        keyword: e,
      },
      () => {
        if (this.state.keyword.length >= 1) {
          this.setState({
            keepGeo: this.state.keepGeo.filter(
              (geo) => geo.name.toUpperCase().indexOf(e.toUpperCase()) > -1
            ),
          });
        } else {
          this.setState({
            keepGeo: this.state.keepGeoIcon,
          });
        }
      }
    );
  };

  selectGeometry = (position, id) => {
    console.log("position ", position);
    this.setState({
      geoId: id,
      latgiude: position[0].lat,
      longitude: position[0].lon,
      zoom: 14,
      Geometry: position,
    });
  };

  closeGeometryList = () => {
    this.setState({
      Geometry: [],
      geoId: 0,
      showPopover: false,
    });
  };

  render() {
    let s = this.state;
    if (place === undefined || place === null) {
      place = s.place;
      GSM = s.GSM;
      GPS = s.GPS;
      Speed = s.Speed;
      Voltage = s.Voltage;
      status = s.status;
      driver = s.Driver;
      LayerNormal = s.LayerNormal;
      LayerOpenstreet = s.LayerOpenstreet;
      LayerSattlelie = s.LayerSattlelie;
      LayerLanscape = s.LayerLanscape;
      charge = s.Charge;
      DoorClose = s.DoorClose;
      DoorOpen = s.DoorOpen;
      DoorSensor = s.DoorSensor;
    }
    return (
      <div>
        <Map
          ref={this.mapRef}
          center={[this.state.latgiude, this.state.longitude]}
          position={[this.state.latgiude, this.state.longitude]}
          zoom={this.state.zoom}
          zoomControl={false}
          onZoom={(e) => {
            this.setState({ zoom: e.target._zoom }, () => {
              this.removeIconPlace(this.state.zoom);
            });
            this.roadNet(e.target._zoom, e);
          }}
          style={{ height: this.state.mapHeight, width: "100%" }}
          onClick={(e) => {
            console.log(
              this.latToCoord(e.latlng.lat),
              this.lonToCoord(e.latlng.lng)
            );
          }}
        >
          <TileLayer
            attribution={this.state.attribution}
            url={this.state.tile}
          />
          {this.state.tile2 !== "" ? (
            <TileLayer
              attribution={this.state.attribution2}
              url={this.state.tile2}
            />
          ) : (
            <></>
          )}
          <MarkerClusterGroup>
            {this.state.List.map((List) => {
              if (List.online === 0) {
                return (
                  <Marker
                    key={List.device_id}
                    position={[List.latitude, List.longitude]}
                    rotationOrigin="center"
                    rotationAngle={List.heading}
                    onClick={(e) => {
                      this.setActivePark(List);
                      this.setState({
                        detailsBoxHide: "block",
                        longitude: List.longitude,
                        latitude: List.latitude,
                      });
                    }}
                    icon={iconOffline}
                  >
                    {List.show === false ||
                    List.show === undefined ||
                    List.show === null ? (
                      <></>
                    ) : (
                      <Tooltip
                        direction="bottom"
                        offset={[0, 20]}
                        opacity={1}
                        permanent
                        style={{ display: this.state.tooltipDisplay }}
                      >
                        <small>{List.name}</small>
                      </Tooltip>
                    )}
                  </Marker>
                );
              } else if (List.status === 23) {
                return (
                  <Marker
                    key={List.device_id}
                    position={[List.latitude, List.longitude]}
                    rotationOrigin="center"
                    rotationAngle={List.heading}
                    onClick={(e) => {
                      this.setActivePark(List);
                      console.log(List);
                      this.setState({
                        detailsBoxHide: "block",
                        longitude: List.longitude,
                        latitude: List.latitude,
                      });
                    }}
                    style={{ display: this.state.tooltipDisplay }}
                    icon={iconStop}
                  >
                    {List.show === false ||
                    List.show === undefined ||
                    List.show === null ? (
                      <></>
                    ) : (
                      <Tooltip
                        direction="bottom"
                        offset={[0, 20]}
                        opacity={1}
                        permanent
                      >
                        <small>{List.name}</small>
                      </Tooltip>
                    )}
                  </Marker>
                );
              } else if (List.status === 7) {
                return (
                  <Marker
                    key={List.device_id}
                    position={[List.latitude, List.longitude]}
                    rotationOrigin="center"
                    rotationAngle={List.heading}
                    onClick={(e) => {
                      this.setActivePark(List);
                      this.setState({
                        detailsBoxHide: "block",
                        longitude: List.longitude,
                        latitude: List.latitude,
                      });
                    }}
                    icon={iconMove}
                    style={{ display: this.state.tooltipDisplay }}
                  >
                    {List.show === false ||
                    List.show === undefined ||
                    List.show === null ? (
                      <></>
                    ) : (
                      <Tooltip
                        direction="bottom"
                        offset={[0, 20]}
                        opacity={1}
                        permanent
                      >
                        <small>{List.name}</small>
                      </Tooltip>
                    )}
                  </Marker>
                );
              } else if (List.status === 24) {
                return (
                  <Marker
                    key={List.device_id}
                    position={[List.latitude, List.longitude]}
                    rotationOrigin="center"
                    rotationAngle={List.heading}
                    onClick={(e) => {
                      this.setActivePark(List);
                      this.setState({
                        detailsBoxHide: "block",
                        longitude: List.longitude,
                        latitude: List.latitude,
                      });
                    }}
                    icon={iconIdle}
                  >
                    {List.show === false ||
                    List.show === undefined ||
                    List.show === null ? (
                      <></>
                    ) : (
                      <Tooltip
                        direction="bottom"
                        offset={[0, 20]}
                        opacity={1}
                        permanent
                        style={{ display: this.state.tooltipDisplay }}
                      >
                        <small>{List.name}</small>
                      </Tooltip>
                    )}
                  </Marker>
                );
              } else {
                return (
                  <Marker
                    key={List.device_id}
                    position={[List.latitude, List.longitude]}
                    rotationOrigin="center"
                    rotationAngle={List.heading}
                    onClick={(e) => {
                      this.setActivePark(List);
                      this.setState({
                        detailsBoxHide: "block",
                        longitude: List.longitude,
                        latitude: List.latitude,
                      });
                    }}
                    icon={iconOffline}
                  />
                );
              }
            })}
            {this.state.geoIcon !== null &&
            this.state.geoIcon !== undefined &&
            this.state.geoIcon !== [] ? (
              <div>
                {this.state.geoIcon.map((geoIcon) => (
                  <div key={geoIcon.geoId}>
                    {geoIcon.icon == null || geoIcon.icon === undefined ? (
                      <Marker
                        position={[
                          geoIcon.position[0].lat,
                          geoIcon.position[0].lon,
                        ]}
                        rotationOrigin="center"
                        icon={
                          new Icon({
                            iconUrl: "../assets/icon-place/map-icon-0.png",
                            iconSize: [30, 30],
                          })
                        }
                      >
                        <Tooltip
                          direction="bottom"
                          className="marker-place-name"
                          offset={[-8, -2]}
                          opacity={1}
                          permanent
                        >
                          <small style={{ display: this.state.tooltipDisplay }}>
                            {geoIcon.name}
                          </small>
                        </Tooltip>
                      </Marker>
                    ) : (
                      <Marker
                        position={[
                          geoIcon.position[0].lat,
                          geoIcon.position[0].lon,
                        ]}
                        rotationOrigin="center"
                        icon={
                          new Icon({
                            iconUrl:
                              "../assets/icon-place/map-icon-" +
                              geoIcon.icon +
                              ".png",
                            iconSize: [30, 30],
                          })
                        }
                      >
                        <Tooltip
                          direction="bottom"
                          className="marker-place-name"
                          offset={[-8, -2]}
                          opacity={1}
                          permanent
                        >
                          <small style={{ display: this.state.tooltipDisplay }}>
                            {geoIcon.name}
                          </small>
                        </Tooltip>
                      </Marker>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </MarkerClusterGroup>
          {this.state.activeList && (
            <Popup
              position={[
                this.state.activeList.latitude,
                this.state.activeList.longitude,
              ]}
              onClose={() => {
                this.setActivePark(null);
                this.setState({
                  mapHeight: "100vh",
                  detailsBoxHide: "none",
                  hideLayer: "none",
                });
              }}
            >
              <div>
                <strong>{this.state.activeList.name}</strong>
                {this.state.activeList.online === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#666666",
                      margin: "0px",
                    }}
                  >
                    {this.state.activeList.status_name}
                  </p>
                ) : this.state.activeList.status === 7 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#77f224",
                      margin: "0px",
                    }}
                  >
                    {this.state.activeList.status_name}
                  </p>
                ) : this.state.activeList.status === 23 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#e63720",
                      margin: "0px",
                    }}
                  >
                    {this.state.activeList.status_name}
                  </p>
                ) : this.state.activeList.status === 24 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#e9f725",
                      margin: "0px",
                    }}
                  >
                    {this.state.activeList.status_name}
                  </p>
                ) : (
                  <p style={{ textAlign: "center", color: "#666666" }}>
                    {this.state.activeList.status_name}
                  </p>
                )}
              </div>
            </Popup>
          )}
          {/* <Polygon positions={[
					{ lon: 99, lat: 14 },
					{ lon: 100, lat: 13 },
					{ lon: 102, lat: 13 },
					{ lon: 103, lat: 14 }
				]} color="blue" /> */}
          {this.state.Geometry.length > 1 ? (
            <Polygon
              positions={this.state.Geometry}
              color="#134985"
              fillColor="#134985"
              opacity={0.3}
            ></Polygon>
          ) : (
            <></>
          )}

          <button className="button-layer-group-full">
            <FontAwesomeIcon
              icon="layer-group"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => this.setLayer()}
            />
          </button>
          <button className="button-polygon-list">
            <FontAwesomeIcon
              icon="draw-polygon"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => this.showPopover(!this.state.showPopover)}
            />
          </button>
          <button className="button-zoom-in-full">
            <FontAwesomeIcon
              icon="plus"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => this.setState({ zoom: this.state.zoom + 1 })}
            />
          </button>
          <button className="button-zoom-out-full">
            <FontAwesomeIcon
              icon="minus"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => this.setState({ zoom: this.state.zoom - 1 })}
            />
          </button>

          <div
            className="layers-box-full p-5"
            style={{ display: this.state.hideLayer }}
          >
            <div className="layers-box-content">
              {s.LongdomapEnable === false ? (
                <div></div>
              ) : (
                <div
                  className="layers-box-content-left"
                  onClick={() => this.setTileLongdoMap()}
                >
                  <img src={longdoLayer} alt="img-layer" />
                  <br />
                  {LayerNormal}
                </div>
              )}
              {s.OpenstreetmapEnable === false ? (
                <div></div>
              ) : (
                <div
                  className="layers-box-content-left"
                  onClick={() => this.setTileOpenStreetMap()}
                >
                  <img src={generalLayer} alt="img-layer" />
                  <br />
                  {LayerOpenstreet}
                </div>
              )}
              {s.SattleliteEnable === false ? (
                <div></div>
              ) : (
                <div
                  className="layers-box-content-left"
                  onClick={() => this.setTileSattlelite()}
                >
                  <img src={sattleliteLayer} alt="img-layer" />
                  <br />
                  {LayerSattlelie}
                </div>
              )}
              {s.LanscapeEnable === false ? (
                <div></div>
              ) : (
                <div
                  className="layers-box-content-left"
                  onClick={() => this.setTileLanscape()}
                >
                  <img src={lanscapeLayer} alt="img-layer" />
                  <br />
                  {LayerLanscape}
                </div>
              )}
            </div>
          </div>
        </Map>
        {this.state.showPopover === true ? (
          <div className="geometry-popover">
            <IonRow style={{ justifyContent: "flex-end" }}>
              <IonCol size="2" className="set-center">
                <IonIcon
                  icon={closeCircle}
                  onClick={() => {
                    this.closeGeometryList();
                  }}
                />
              </IonCol>
              <IonCol size="12">
                <div className="search-popover">
                  <IonRow>
                    <IonCol size="2" className="set-center">
                      <IonIcon icon={searchOutline} />
                    </IonCol>
                    <IonCol size="10">
                      <IonInput
                        value={this.state.keyword}
                        placeholder="ค้นหาเขตพื้นที่"
                        onIonChange={(e) => {
                          this.searchGeometry(e.detail.value);
                        }}
                      />
                    </IonCol>
                  </IonRow>
                </div>
              </IonCol>
            </IonRow>

            {this.state.keepGeo !== null ||
            this.state.keepGeo !== undefined ||
            this.state.keepGeo !== [] ? (
              <IonList style={{ backgroundColor: "transparent" }}>
                {this.state.keepGeo.map((geo) => (
                  <div
                    key={geo.geoId}
                    onClick={() => {
                      this.selectGeometry(geo.position, geo.geoId);
                    }}
                  >
                    <IonRow
                      style={{
                        padding: ".5rem",
                        borderTop: "1px solid #ccc",
                      }}
                    >
                      <IonCol size="10">
                        <IonLabel>{geo.name}</IonLabel>
                      </IonCol>
                      <IonCol size="2" className="set-center">
                        <FontAwesomeIcon icon="draw-polygon" />
                      </IonCol>
                    </IonRow>
                    {geo.geoId === this.state.geoId ? (
                      <div style={{ width: "100%" }}>
                        {this.state.carInGeo.map((car) => (
                          <IonRow
                            key={car.device_id}
                            style={{ justifyContent: "flex-end" }}
                          >
                            <IonCol size="1" className="set-center">
                              {car.online === 0 ? (
                                <IonIcon icon={ellipse} color="medium" />
                              ) : car.status === 7 && car.online === 1 ? (
                                <IonIcon icon={ellipse} color="success" />
                              ) : car.status === 23 && car.online === 1 ? (
                                <IonIcon icon={ellipse} color="danger" />
                              ) : car.status === 24 && car.online === 1 ? (
                                <IonIcon icon={ellipse} color="warning" />
                              ) : (
                                <IonIcon icon={ellipse} color="medium" />
                              )}
                            </IonCol>
                            <IonCol size="10">
                              <strong> {car.name} </strong> <br />
                              <small>เวลาเข้าพื้นที่ {car.enterTime}</small>
                            </IonCol>
                          </IonRow>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </IonList>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}

        {this.state.activeList && (
          <div
            className="details-box-full"
            style={{ display: this.state.detailsBoxHide, fontSize: "9pt" }}
          >
            <div className="row center-content">
              <div className="col-2">
                <div className="center-line"></div>
              </div>
            </div>
            <div className="row">
              <h4 style={{ marginLeft: "1rem" }}>
                {this.state.activeList.name}
              </h4>
              <div className="row">
                <div className="col-1 center-content">
                  <FontAwesomeIcon
                    icon="map-marker-alt"
                    style={{ fontSize: "1em", color: app.color }}
                  />
                </div>
                <div className="col-11">
                  <span>{this.state.activeList.address}</span>
                  <br />
                  &nbsp;วันที่{" "}
                  {moment(this.state.activeList.event_stamp).format(
                    "DD/MM/YYYY"
                  )}{" "}
                  เวลา{" "}
                  {moment(this.state.activeList.event_stamp).format("HH:mm:ss")}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-6 pl">
                <p style={{ marginBottom: "0px" }}>
                  <b>{status} :</b> {this.state.activeList.status_name}
                </p>
              </div>
              <div className="col-6 pl">
                <p style={{ marginBottom: "0px" }}>
                  <b>{GSM} : </b>{" "}
                  <label>{this.state.activeList.fld_signalStrength}</label>
                  <b>&nbsp; {GPS} : </b>{" "}
                  <label>{this.state.activeList.satellites}</label>
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-6 pl">
                <p style={{ margin: "0px" }}>
                  <b> {Speed} :</b> {this.state.activeList.speed}
                </p>
              </div>
              <div className="col-6 pl">
                {this.state.activeList.fld_sensorHigh === "1" ? (
                  <p style={{ margin: "0px" }}>
                    <b> {charge} :</b>{" "}
                    <FontAwesomeIcon icon="plug" style={{ color: "#10dc60" }} />{" "}
                  </p>
                ) : (
                  <p style={{ margin: "0px" }}>
                    <b> {charge} :</b>{" "}
                    <FontAwesomeIcon icon="plug" style={{ color: "#f04141" }} />{" "}
                  </p>
                )}
              </div>
            </div>

            <div className="row">
              {this.state.activeList.fld_engineLoad === "" ||
              this.state.activeList.fld_engineLoad === "-" ||
              this.state.activeList.fld_engineLoad === null ? (
                <div className="col-6 pl"></div>
              ) : (
                <div className="col-6 pl">
                  <p style={{ margin: "0px" }}>
                    <b>{Voltage} :</b> {this.state.activeList.fld_engineLoad}
                  </p>
                </div>
              )}
              {this.state.activeList.fld_driverID === "" ||
              this.state.activeList.fld_driverID === null ||
              this.state.activeList.fld_driverID === undefined ? (
                <div></div>
              ) : (
                <div className="col-6 pl">
                  <p style={{ margin: "0px" }}>
                    <b>{driver} : </b>
                  </p>
                  <p style={{ margin: "0px" }}>
                    {this.state.activeList.fld_driverID} <br />{" "}
                    {this.state.activeList.fld_driverMessage}{" "}
                  </p>
                </div>
              )}
            </div>

            <div className="row">
              {this.state.activeList.closeOpenSensor === 0 ||
              this.state.activeList.closeOpenSensor === "0" ? (
                <div className="col-6 pl">
                  <p style={{ margin: "0px" }}>
                    <b>{DoorSensor} : </b> {DoorClose}
                  </p>
                  {/* <FontAwesomeIcon icon='door-closed' style={{color:'#f04141'}} /> */}
                </div>
              ) : this.state.activeList.closeOpenSensor === 1 ||
                this.state.activeList.closeOpenSensor === "1" ? (
                <div className="col-6 pl">
                  <p style={{ margin: "0px" }}>
                    <b>{DoorSensor} : </b> {DoorOpen}
                  </p>
                  {/* <FontAwesomeIcon icon='door-closed' style={{color:'#10dc60'}} /> */}
                </div>
              ) : (
                <div></div>
              )}
            </div>

            <div className="row mb center-content">
              <div className="col-12 mb">
                <div className="center-slim-line"></div>
              </div>
            </div>

            <div className="row center-row-content">
              {this.state.activeList.canCutEngin !== false ? (
                <div className="col-2 center-content">
                  <button className="bottom-icon">
                    {this.state.activeList.status_engin === 1 ? (
                      <FontAwesomeIcon
                        icon="lock"
                        style={{ fontSize: "1.2em", color: app.color }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon="lock"
                        style={{ fontSize: "1.2em", color: "#e3092a" }}
                      />
                    )}
                  </button>
                </div>
              ) : (
                <div></div>
              )}

              <div className="col-2 center-content">
                <button
                  className="bottom-icon"
                  style={{ backgroundColor: app.color }}
                >
                  <a
                    href={
                      "https://www.google.com/maps/dir/?api=1&destination=" +
                      this.state.activeList.latitude +
                      "," +
                      this.state.activeList.longitude
                    }
                  >
                    <FontAwesomeIcon
                      icon="location-arrow"
                      style={{ fontSize: "1.2em", color: "#fcfdfe" }}
                    />
                  </a>
                </button>
              </div>
              {this.state.activeList.phone_number === null ||
              this.state.activeList.phone_number === "" ||
              this.state.activeList.phone_number === "-" ? (
                <div></div>
              ) : (
                <div className="col-2 center-content">
                  <a href={"tel:" + this.state.activeList.phone_number}>
                    <button
                      className="bottom-icon"
                      style={{ backgroundColor: app.color }}
                    >
                      <FontAwesomeIcon
                        icon="phone-alt"
                        style={{ fontSize: "1.2em", color: "#fcfdfe" }}
                      />
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
