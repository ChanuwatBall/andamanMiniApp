import React from "react";
import { Map, Marker, TileLayer, Polyline, CircleMarker } from "react-leaflet";
import { Icon } from "leaflet";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLayerGroup,
  faMapMarkerAlt,
  faLock,
  faLocationArrow,
  faPhoneAlt,
  faPlus,
  faMinus,
  faPlay,
  faPause,
  faStop,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plugins } from "@capacitor/core";
import { Device } from "@capacitor/device";
import app from "../../app.config.json";
import axios from "axios";
import th from "../../th.json";
import en from "../../en.json";
import api from "../../api.json";
import "leaflet/dist/leaflet.css";
import "leaflet-moving-rotated-marker";
import "./previous-map.css";
import { IonLoading } from "@ionic/react";

library.add(
  faLayerGroup,
  faMapMarkerAlt,
  faLock,
  faLocationArrow,
  faPhoneAlt,
  faPlus,
  faMinus,
  faPlay,
  faPause,
  faStop,
  faExchangeAlt
);
const { Storage } = Plugins;
var moment = require("moment");
moment().format();

export const generalLayer = "../assets/images/normallayer.PNG";
export const sattleliteLayer = "../assets/images/sattlelitelayer.PNG";
export const longdoLayer = "../assets/images/longdolayer.PNG";
export const lanscapeLayer = "../assets/images/lanscapelayer.PNG";

export var startPoint = new Icon({
  iconUrl: "../assets/icon/pin-05.png",
  iconSize: [40, 40],
});
export var accessPoint = new Icon({
  iconUrl: "../assets/icon/pin-02.png",
  iconSize: [40, 40],
});

export var iconMove = new Icon({
  iconUrl: "../assets/icon/cars_green_360.png",
  iconSize: [40, 40],
});
export var iconIdle = new Icon({
  iconUrl: "../assets/icon/cars_yellow_360.png",
  iconSize: [40, 40],
});
export var iconStop = new Icon({
  iconUrl: "../assets/icon/cars_red_360.png",
  iconSize: [40, 40],
});
export var iconOffline = new Icon({
  iconUrl: "../assets/icon/cars_black_360.png",
  iconSize: [40, 40],
});

var polyline = [];
var coordinates = polyline;
var markerFilter = [
  {
    address: "Geofence  บขส ระนอง",
    driver_id: "",
    driver_message: "",
    event_stamp: "2020-09-04 03:36:05",
    heading: 0,
    id: 156522386,
    latitude: 9.95632,
    longitude: 98.63856,
    speed: 0,
    status: 23,
  },
];

let LayerNormal, LayerOpenstreet, LayerSattlelie, LayerLanscape;
let pastRouteOverview,
  distanceSum,
  maxSpeed,
  summaryTimes,
  startDate,
  endDate,
  mostTravelingTimes,
  speed,
  Time,
  place,
  driver,
  loading,
  noList,
  car_id;

export default class LeafletMap extends React.Component {
  mapRef = React.createRef();
  interval;

  state = {
    activeList: null,
    showLoading: false,
    zoom: 6,
    tile: "",
    attribution: "",
    hideLayer: "none",
    latgiude: "",
    longitude: "",
    mapHeight: "105vh",
    detailsBoxHide: "none",
    speedBoxRight: "-20rem",
    btnPlayClick: "#fcfdfe",
    btnPauseClick: "#fcfdfe",
    btnStopClick: "#fcfdfe",
    route: {
      count: 634,
      datetime_start: "2020-09-03 17:00:00",
      datetime_stop: "2020-09-04 16:59:00",
      distance_all: "291.30",
      length: 688,
      list: [
        {
          address: "Geofence  บขส ระนอง",
          driver_id: "",
          driver_message: "",
          event_stamp: "2020-09-04 03:36:05",
          heading: 0,
          id: 156522386,
          latitude: 9.95632,
          longitude: 98.63856,
          speed: 0,
          status: 23,
        },
      ],
      longdo: null,
      speed_max: 87,
      status: [],
      time_all: "01:14:32",
      time_max: "00:33:09",
    },
    tiles: [
      {
        name: "longdo",
        tile: "http://103.7.57.31/mmmap/tile.php?zoom={z}&x={x}&y={y}&key=21c3566e9a2d130494be2a47b9c113c9&proj=epsg3857&HD=1",
        imgUrl: "http://portal.attg.cc/app-img/andamantracking/longdolayer.PNG",
      },
      {
        name: "openstreet",
        tile: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        imgUrl: "http://portal.attg.cc/app-img/andamantracking/normallayer.PNG",
      },
      {
        name: "sattlelite",
        tile: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        imgUrl:
          "http://portal.attg.cc/app-img/andamantracking/sattlelitelayer.PNG	",
      },
    ],
    hideDetails: "-15vh",
    speedText: "1x",

    markerRotate: 180,
    markerPalyLat: "",
    markerPlayLon: "",
    markerPlayIcon: iconOffline,
    markerCount: 0,
    markerSpeed: 600,
    markerDetailSpeed: 0,
    markerDetailTime: "",
    markerDetailPlace: "",
    markerDetailDriver: "",
    markerDetailDriverID: "",
    LayerNormal: "ทั่วไป",
    LayerOpenstreet: "สีเทา",
    LayerSattlelie: "ดาวเทียม",
    LayerLanscape: "ภูมิประเทศ",
    pastRouteOverview: "ภาพรวม",
    distanceSum: "ระยะทางรวม",
    maxSpeed: "ความเร็วสูงสุด",
    summaryTimes: "ระยะเวลารวม",
    startDate: "วันที่เริ่ม",
    endDate: "วันที่สิ้นสุด",
    mostTravelingTimes: "ช่วงเวลาที่เดินทางมากที่สุด",
    speed: "ความเร็ว",
    Time: "เวลา",
    place: "สถานที่",
    driver: "คนขับ",
    loading: "กำลังโหลด...",
    noList: "ไม่พบเส้นทางย้อนหลัง",
    os: "anroid",
    car_id: "ทะเบียนรถ",
    caID: "",
  };

  componentDidUpdate() {
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
      let l = th.previousRoute;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      pastRouteOverview = l.pastRouteOverview;
      distanceSum = l.distanceSum;
      maxSpeed = l.maxSpeed;
      summaryTimes = l.summaryTimes;
      startDate = l.startDate;
      endDate = l.endDate;
      mostTravelingTimes = l.mostTravelingTimes;
      speed = l.speed;
      Time = l.Time;
      place = l.place;
      driver = l.driver;
      loading = l.loading;
      noList = l.noList;
      car_id = l.carID;
    } else if (language === "en" || language === '"en"') {
      let l = en.previousRoute;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      pastRouteOverview = l.pastRouteOverview;
      distanceSum = l.distanceSum;
      maxSpeed = l.maxSpeed;
      summaryTimes = l.summaryTimes;
      startDate = l.startDate;
      endDate = l.endDate;
      mostTravelingTimes = l.mostTravelingTimes;
      speed = l.speed;
      Time = l.Time;
      place = l.place;
      driver = l.driver;
      loading = l.loading;
      noList = l.noList;
      car_id = l.carID;
    } else {
      let l = this.state;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      pastRouteOverview = l.pastRouteOverview;
      distanceSum = l.distanceSum;
      maxSpeed = l.maxSpeed;
      summaryTimes = l.summaryTimes;
      startDate = l.startDate;
      endDate = l.endDate;
      mostTravelingTimes = l.mostTravelingTimes;
      speed = l.speed;
      Time = l.Time;
      place = l.place;
      driver = l.driver;
      loading = l.loading;
      noList = l.noList;
      car_id = l.carID;
    }
  };

  async componentDidMount() {
    this.setLanguage();

    let lang = await this.getStorage("language");
    let token = await this.getStorage("token");
    let apiHost = await this.getStorage("api");
    let localLatitude = await this.getStorage("latitude");
    let localLongitude = await this.getStorage("longitude");
    let deviceID = await this.getStorage("deviceID");
    let carID = await this.getStorage("carID");

    var date = await this.getStorage("date");
    var startTime = await this.getStorage("startTime");

    var dateEND = await this.getStorage("dateEnd");
    var accessTime = await this.getStorage("accessTime");
    console.log("date select: ", startTime);

    var info = await Device.getInfo();
    if (info.operatingSystem === "ios") {
      this.setState({
        os: info.operatingSystem,
        hideDetails: "1.2rem",
      });
    }
    console.log("carID ", carID);

    this.setState({
      latgiude: JSON.parse(localLatitude),
      longitude: JSON.parse(localLongitude),
      carID: carID,
    });

    try {
      await this.setState({
        //tile : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        //tile : "https://ms.longdo.com/mmmap/img.php?zoom={z}&x={x}&y={y}&key=cc2cfcc6fd6e2673395611b352382892&proj=epsg3857&HD=1",
        tile: "https://longdomap.attg.cc/mmmap/img.php?zoom={z}&x={x}&y={y}&key=cc2cfcc6fd6e2673395611b352382892&proj=epsg3857&HD=1",
        attribution: "© Longdo Map",
      });
    } catch {
      console.log("can not load longdo tile");
      await this.setState({
        tile: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
    }

    let device = parseInt(deviceID);
    let dateRoute = moment(date).format("DD/MM/YYYY");
    let dateEnd = moment(dateEND).format("DD/MM/YYYY");
    console.log("startTime", startTime);
    console.log("accessTime", accessTime);

    if (startTime === null || startTime === undefined || startTime === "") {
      startTime = moment().format("DD/MM/YY") + " 00:00:00";
    }
    if (accessTime === null || accessTime === undefined || accessTime === "") {
      accessTime = " 23:59:59";
    }

    let access =
      moment(dateEND).format("YYYY-MM-DD") +
      " " +
      moment(accessTime).format("HH:mm:ss");
    console.log("access", access);

    let start =
      moment(date).format("YYYY-MM-DD") +
      " " +
      moment(startTime).format("HH:mm:ss");
    console.log("start", start);
    console.log(
      " date " + dateRoute,
      " start " + start,
      " end" + access,
      " dateEnd " + dateEnd
    );
    axios
      .post(
        apiHost + "/report/usage",
        {
          deviceId: device,
          date: dateRoute,
          start: start,
          end: access,
          dateEnd: dateEnd,
        },
        {
          headers: {
            authenication: api.authorization,
            language: lang,
            token: token,
            version: api.version,
          },
        }
      )
      .then((res) => {
        this.setShowLoading(true);
        console.log(res);
        this.setState({
          route: res.data,
          zoom: 8,
          markerPalyLat: res.data.list[0].latitude,
          markerPlayLon: res.data.list[0].longitude,
          markerRotate: res.data.list[0].heading,
          latgiude: res.data.list[0].latitude,
          longitude: res.data.list[0].longitude,
          markerDetailSpeed: res.data.list[this.state.markerCount].speed,
          markerDetailTime: res.data.list[this.state.markerCount].event_stamp,
          markerDetailPlace: res.data.list[this.state.markerCount].address,
          markerDetailDriver:
            res.data.list[this.state.markerCount].driver_message,
          markerDetailDriverID:
            res.data.list[this.state.markerCount].driver_message,
        });

        console.log("routes length -> ", this.state.route.count);
        markerFilter[0] = this.state.route.list[this.state.markerCount];
        setTimeout(() => {
          if (this.state.route.list.length >= 1) {
            for (let i = 0; i < this.state.route.list.length; i++) {
              coordinates[i] = [
                this.state.route.list[i].latitude,
                this.state.route.list[i].longitude,
              ];
            }

            if (markerFilter[0].online === 0) {
              this.setState({
                markerPlayIcon: iconOffline,
              });
            } else if (markerFilter[0].status === 7) {
              this.setState({
                markerPlayIcon: iconMove,
              });
            } else if (markerFilter[0].status === 23) {
              this.setState({
                markerPlayIcon: iconStop,
              });
            } else if (markerFilter[0].status === 24) {
              this.setState({
                markerPlayIcon: iconIdle,
              });
            }

            if (coordinates.length > 0) {
              this.setState({
                latitude: coordinates[0][0],
                longitude: coordinates[0][1],
              });
            } else {
              this.setState({
                latgiude: JSON.parse(localLatitude.value),
                longitude: JSON.parse(localLongitude.value),
              });
            }
          } else {
            this.setState({
              latgiude: JSON.parse(localLatitude.value),
              longitude: JSON.parse(localLongitude.value),
              //hideDetails:'-20rem',
            });
          }
          let outerBounds = [
            coordinates[0],
            coordinates[coordinates.length - 1],
          ];
          this.mapRef.current.leafletElement.fitBounds(outerBounds);

          setTimeout(() => {
            this.setShowLoading(false);
          }, 1000);
        }, 1500);
      })
      .catch((err) => {
        console.log("LeafletMap -> componentDidMount -> err", err);
        setTimeout(() => {
          this.setShowLoading(false);
        }, 15000);
      });
  }

  setActivePark = (e) => {
    this.setState({
      activeList: e,
    });
  };

  setShowLoading = (e) => {
    this.setState({
      setShowLoading: e,
    });
  };

  componentWillUnmount() {
    this.setState({
      latgiude: "",
      longitude: "",
      route: {},
      latgiude: 0,
      longitude: 0,
    });
    coordinates = [];
    markerFilter = [];
    var time = moment().format("YYYY-MM-DD");

    this.setStorage("startTime", time + " 00:00:00");
    this.setStorage("accessTime", time + " 23:59:59");

    this.setStorage("date", moment().format("YYYY-MM-DD"));
    this.setStorage("dateEnd", moment().format("YYYY-MM-DD"));

    clearInterval(this.interval);
  }

  setHideShowDetail = async () => {
    if (
      this.state.hideDetails === "1.2rem" ||
      this.state.hideDetails === "1.5rem"
    ) {
      this.setState({
        hideDetails: "-15vh",
      });
    } else {
      this.setState(
        {
          hideDetails: "1.2rem",
        },
        () => {
          if (this.state.os === "ios") {
            this.setState({
              hideDetails: "1.5rem",
            });
          }
        }
      );
    }
  };

  playMarker = () => {
    if (coordinates.length < 0) {
      this.setState({
        btnPlayClick: "#e1e4e8",
        btnPauseClick: "#fcfdfe",
        btnStopClick: "#fcfdfe",
      });
    } else if (coordinates.length > 0) {
      this.setState(
        {
          btnPlayClick: "#e1e4e8",
          btnPauseClick: "#fcfdfe",
          btnStopClick: "#fcfdfe",
          hideDetails: "1.5vh",
        },
        () => {
          if (this.state.os === "ios") {
            this.setState({
              hideDetails: "1.2rem",
            });
          }
        }
      );
      if (this.state.route.count > 0) {
        this.interval = setInterval(() => {
          this.setState(
            {
              markerCount: this.state.markerCount + 1,
            },
            () => {
              console.log(
                this.state.markerCount + " >=" + this.state.route.count
              );
              if (this.state.markerCount >= this.state.route.count) {
                clearInterval(this.interval);
                this.stopMarker();
              } else if (this.state.markerCount < this.state.route.count) {
                markerFilter = this.state.route.list.filter(
                  (list) =>
                    list.id === this.state.route.list[this.state.markerCount].id
                );
                console.log("568: markerFilter ", markerFilter);
                this.setState({
                  markerPalyLat:
                    this.state.route.list[this.state.markerCount].latitude,
                  markerPlayLon:
                    this.state.route.list[this.state.markerCount].longitude,
                  markerDetailSpeed:
                    this.state.route.list[this.state.markerCount].speed,
                  markerDetailTime:
                    this.state.route.list[this.state.markerCount].event_stamp,
                  markerDetailPlace:
                    this.state.route.list[this.state.markerCount].address,
                  markerDetailDriver:
                    this.state.route.list[this.state.markerCount]
                      .driver_message,
                  markerDetailDriverID:
                    this.state.route.list[this.state.markerCount]
                      .driver_message,
                });

                console.log("markerFilter[" + this.state.markerCount + "]");

                if (markerFilter[0].status === 7) {
                  markerFilter[0].heading =
                    this.state.route.list[this.state.markerCount].heading;
                } else {
                  markerFilter[0].heading = this.state.route.list[0].heading;
                }

                if (markerFilter[0].online === 0) {
                  this.setState({
                    markerPlayIcon: iconOffline,
                  });
                } else if (markerFilter[0].status === 7) {
                  this.setState({
                    markerPlayIcon: iconMove,
                  });
                } else if (markerFilter[0].status === 23) {
                  this.setState({
                    markerPlayIcon: iconStop,
                  });
                } else if (markerFilter[0].status === 24) {
                  this.setState({
                    markerPlayIcon: iconIdle,
                  });
                }
              }
            }
          );
        }, this.state.markerSpeed);
      } else if (this.state.route.list.length <= 0) {
        console.log("No data");
      }
    }
  };

  pauseMarker = () => {
    this.setState({
      btnPlayClick: "#fcfdfe",
      btnPauseClick: "#e1e4e8",
      btnStopClick: "#fcfdfe",
    });
    clearInterval(this.interval);
  };

  stopMarker = () => {
    clearInterval(this.interval);
    this.setState(
      {
        markerCount: 0,
        hideDetails: "-15vh",
        btnPlayClick: "#fcfdfe",
        btnPauseClick: "#fcfdfe",
        btnStopClick: "#e1e4e8",
      },
      () => {
        if (this.state.os === "ios") {
          this.setState({
            hideDetails: "1.2rem",
          });
        }
      }
    );

    markerFilter = [this.state.route.list[0]];
    console.log("652: ", this.state.route.list[0]);
    //		markerFilter = this.state.route.list.filter((list) => list.id === this.state.route.list[0].id )
    if (markerFilter[0].online === 0) {
      this.setState({
        markerPlayIcon: iconOffline,
      });
    } else if (markerFilter[0].status === 7) {
      this.setState({
        markerPlayIcon: iconMove,
      });
    } else if (markerFilter[0].status === 23) {
      this.setState({
        markerPlayIcon: iconStop,
      });
    } else if (markerFilter[0].status === 24) {
      this.setState({
        markerPlayIcon: iconIdle,
      });
    }

    console.log("Marker stopped");
  };

  speedDelTwoX = () => {
    clearInterval(this.interval);
    this.setState(
      {
        markerSpeed: 1000,
        speedText: "-2x",
      },
      () => console.log("speed lower -> ", this.state.markerSpeed)
    );

    if (this.state.markerCount > 0) {
      setTimeout(() => {
        this.playMarker();
      }, 200);
    }
  };

  speedDelOneX = () => {
    clearInterval(this.interval);
    this.setState(
      {
        markerSpeed: 800,
        speedText: "-1x",
      },
      () => console.log("speed lower -> ", this.state.markerSpeed)
    );

    if (this.state.markerCount > 0) {
      setTimeout(() => {
        this.playMarker();
      }, 200);
    }
  };

  speedOneX = () => {
    clearInterval(this.interval);
    this.setState(
      {
        markerSpeed: 600,
        speedText: "1x",
      },
      () => console.log("speed lower -> ", this.state.markerSpeed)
    );

    if (this.state.markerCount > 0) {
      setTimeout(() => {
        this.playMarker();
      }, 200);
    }
  };
  speedTwoX = () => {
    clearInterval(this.interval);
    this.setState(
      {
        markerSpeed: 400,
        speedText: "2x",
      },
      () => {
        console.log("speed lower -> ", this.state.markerSpeed);
        if (this.state.markerCount > 0) {
          setTimeout(() => {
            this.playMarker();
          }, 200);
        }
      }
    );
  };
  speedThreeX = () => {
    clearInterval(this.interval);
    this.setState(
      {
        markerSpeed: 200,
        speedText: "3x",
      },
      () => {
        console.log("speed lower -> ", this.state.markerSpeed);
        if (this.state.markerCount > 0) {
          setTimeout(() => {
            this.playMarker();
          }, 200);
        }
      }
    );
  };
  speedFourX = () => {
    clearInterval(this.interval);
    this.setState(
      {
        markerSpeed: 100,
        speedText: "4x",
      },
      () => {
        console.log("speed lower -> ", this.state.markerSpeed);
        if (this.state.markerCount > 0) {
          setTimeout(() => {
            this.playMarker();
          }, 200);
        }
      }
    );
  };

  setTileLongdoMap = async () => {
    //tim.mobile //21c3566e9a2d130494be2a47b9c113c9
    //key=cc2cfcc6fd6e2673395611b352382892
    //http://103.7.57.31/mmmap/tile.php
    //http://ms.longdo.com/mmmap/tile.php?zoom=15&x=25540&y=6944&mode=icons&key=cc2cfcc6fd6e2673395611b352382892&map=epsg3857&HD=1
    //https://ms.longdo.com/mmmap/tile.php?key=cc2cfcc6fd6e2673395611b352382892/{z}/{y}/{x}
    //http://ms.longdo.com/mmmap/tile.php?zoom={this.state.zoom}&x={x}&y={y}&key=cc2cfcc6fd6e2673395611b352382892&proj=epsg3857&HD=1
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

  setSpeedboxRight = () => {
    if (this.state.speedBoxRight !== "3rem") {
      this.setState({
        speedBoxRight: "3rem",
      });
    } else {
      this.setState({
        speedBoxRight: "-20rem",
      });
    }
  };

  setLayer = () => {
    if (this.state.hideLayer !== "block") {
      this.setState({ hideLayer: "block" });
    } else {
      this.setState({ hideLayer: "none" });
    }
  };

  render() {
    return (
      <div>
        <Map
          ref={this.mapRef}
          center={[this.state.latgiude, this.state.longitude]}
          position={[this.state.latgiude, this.state.longitude]}
          zoom={this.state.zoom}
          onzoomend={() => {
            this.setState(
              { zoom: this.mapRef.current.leafletElement.getZoom() },
              () => {
                console.log(this.state.zoom);
              }
            );
          }}
          zoomControl={false}
          style={{ height: this.state.mapHeight, width: "100%" }}
        >
          <TileLayer
            attribution={this.state.attribution}
            url={this.state.tile}
          />

          <Polyline color={app.color} positions={[coordinates]}></Polyline>
          {coordinates[0] !== undefined ? (
            <Marker position={coordinates[0]} icon={startPoint} />
          ) : (
            <div> </div>
          )}

          {this.state.route.count > 1 ? (
            <Marker
              position={[
                this.state.route.list[this.state.route.list.length - 1]
                  .latitude,
                this.state.route.list[this.state.route.list.length - 1]
                  .longitude,
              ]}
              icon={accessPoint}
            />
          ) : (
            <div></div>
          )}

          {this.state.route.count > 1 ? (
            <div>
              {markerFilter.map((markerFilter) => (
                <Marker
                  key={markerFilter.id}
                  position={[markerFilter.latitude, markerFilter.longitude]}
                  rotationOrigin="center"
                  rotationAngle={markerFilter.heading}
                  icon={this.state.markerPlayIcon}
                />
              ))}

              {markerFilter.map((markerFilter) => (
                <div key={markerFilter.id}>
                  <CircleMarker
                    center={[markerFilter.latitude, markerFilter.longitude]}
                    color="RGBA(rgba(22, 160, 244, 0.9)"
                    fillColor="#31beb6"
                    opacity={0.1}
                    radius={70}
                  />
                  <CircleMarker
                    center={[markerFilter.latitude, markerFilter.longitude]}
                    color="RGBA(rgba(22, 160, 244, 0.9)"
                    fillColor="#31beb6"
                    opacity={0.7}
                    radius={50}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div></div>
          )}

          <button
            className="button-layer-group"
            onClick={() => this.setLayer()}
          >
            <FontAwesomeIcon
              icon="layer-group"
              style={{ fontSize: "1em", color: "#666" }}
            />
          </button>
          <button
            className="button-play"
            style={{ backgroundColor: this.state.btnPlayClick }}
            onClick={() => {
              this.playMarker();
            }}
          >
            <FontAwesomeIcon
              icon="play"
              style={{ fontSize: "1em", color: app.color }}
            />
          </button>
          <button
            className="button-pause"
            style={{ backgroundColor: this.state.btnPauseClick }}
            onClick={() => {
              this.pauseMarker();
            }}
          >
            <FontAwesomeIcon
              icon="pause"
              style={{ fontSize: "1em", color: app.color }}
            />
          </button>
          <button
            className="button-stop"
            style={{ backgroundColor: this.state.btnStopClick }}
            onClick={() => {
              this.stopMarker();
            }}
          >
            <FontAwesomeIcon
              icon="stop"
              style={{ fontSize: "1em", color: app.color }}
            />
          </button>

          <button
            className="button-speed"
            onClick={() => this.setSpeedboxRight()}
          >
            <label>{this.state.speedText}</label>
          </button>

          <button
            className="button-zoom-in"
            onClick={() => this.setState({ zoom: this.state.zoom + 1 })}
          >
            <FontAwesomeIcon
              icon="plus"
              style={{ fontSize: "1.3em", color: app.color }}
            />
          </button>
          <button
            className="button-zoom-out"
            onClick={() => this.setState({ zoom: this.state.zoom - 1 })}
          >
            <FontAwesomeIcon
              icon="minus"
              style={{ fontSize: "1.3em", color: app.color }}
            />
          </button>

          <div
            className="speed-box"
            style={{ right: this.state.speedBoxRight }}
          >
            <div
              className="col-2 center-content"
              onClick={() => {
                this.speedDelTwoX();
                this.setSpeedboxRight();
              }}
            >
              {" "}
              -2x{" "}
            </div>
            <div
              className="col-2 center-content"
              onClick={() => {
                this.speedDelOneX();
                this.setSpeedboxRight();
              }}
            >
              {" "}
              -1x{" "}
            </div>
            <div
              className="col-2 center-content"
              onClick={() => {
                this.speedOneX();
                this.setSpeedboxRight();
              }}
            >
              {" "}
              1x{" "}
            </div>
            <div
              className="col-2 center-content"
              onClick={() => {
                this.speedTwoX();
                this.setSpeedboxRight();
              }}
            >
              {" "}
              2x{" "}
            </div>
            <div
              className="col-2 center-content"
              onClick={() => {
                this.speedThreeX();
                this.setSpeedboxRight();
              }}
            >
              {" "}
              3x{" "}
            </div>
            <div
              className="col-2 center-content"
              onClick={() => {
                this.speedFourX();
                this.setSpeedboxRight();
              }}
            >
              {" "}
              4x{" "}
            </div>
          </div>

          <div
            className="layers-box p-5"
            style={{ display: this.state.hideLayer }}
          >
            <div className="layers-box-content">
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileLongdoMap()}
              >
                <img src={longdoLayer} alt="img-layer" />
                <br />
                {LayerNormal}
              </div>
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileOpenStreetMap()}
              >
                <img src={generalLayer} alt="img-layer" />
                <br />
                {LayerOpenstreet}
              </div>
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileSattlelite()}
              >
                <img src={sattleliteLayer} alt="img-layer" />
                <br />
                {LayerSattlelie}
              </div>
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileLanscape()}
              >
                <img src={lanscapeLayer} alt="img-layer" />
                <br />
                {LayerLanscape}
              </div>
            </div>
          </div>
          {this.state.route.count > 1 ? (
            <div
              className="details-box"
              style={{ bottom: this.state.hideDetails }}
            >
              {coordinates.length >= 1 ? (
                <div>
                  <div
                    className="row center-content"
                    onClick={() => this.setHideShowDetail()}
                  >
                    <div className="col-6">
                      <div className="center-line"></div>
                    </div>
                  </div>
                  <div className="row  mt" style={{ marginBottom: ".5rem" }}>
                    <div className="col-11 p-3">
                      <strong>
                        {car_id} : {this.state.carID}
                      </strong>
                    </div>
                    <div
                      className="col-1 ion-text-center p-3"
                      onClick={() => this.setHideShowDetail()}
                    >
                      <FontAwesomeIcon
                        icon="exchange-alt"
                        style={{
                          fontSize: "1.3em",
                          color: app.color,
                          transform: "rotate(90deg)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="row  mt">
                    <div className="col-6 p-3">
                      {startDate}{" "}
                      <span>
                        {moment(this.state.route.datetime_start).format(
                          "HH:mm DD/MM"
                        )}
                      </span>
                    </div>
                    <div className="col-6 p-3">
                      {endDate}{" "}
                      <span>
                        {moment(this.state.route.datetime_stop).format(
                          "HH:mm DD/MM"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="row mt">
                    <div className="col-6 p-3">
                      {distanceSum} <span>{this.state.route.distance_all}</span>
                    </div>
                    <div className="col-6 p-3">
                      {maxSpeed} <span>{this.state.route.speed_max} Km</span>
                    </div>
                  </div>
                  <div className="row mt">
                    <div className="col-6 p-3">
                      {mostTravelingTimes}{" "}
                      <span>{this.state.route.time_max}</span>
                    </div>
                    <div className="col-6 p-3">
                      {summaryTimes} <span>{this.state.route.time_all}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div className="row center-content">
                    <div className="col-6">
                      <div className="center-line"></div>
                    </div>
                  </div>
                  <div className="row center-content">
                    <div className="col-12">
                      <h4>{noList}</h4>
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-12">
                  <h3>{pastRouteOverview}</h3>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <strong> {speed} </strong>
                </div>
                <div className="col-7">
                  <label>{this.state.markerDetailSpeed}</label>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <strong> {Time} </strong>
                </div>
                <div className="col-7">
                  <label>
                    {moment(this.state.markerDetailTime).format(
                      "DD/M/YYYY HH:mm:ss"
                    )}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <strong> {place} </strong>
                </div>
                <div className="col-7">
                  <label>{this.state.markerDetailPlace}</label>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <strong> {driver} </strong>
                </div>
                <div className="col-7">
                  <label>{this.state.markerDetailDriverID}</label>
                  <label>{this.state.markerDetailDriver}</label>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </Map>
        <IonLoading
          isOpen={this.state.showLoading}
          onDidDismiss={() => this.setShowLoading(false)}
          message={loading}
        />
      </div>
    );
  }
}
