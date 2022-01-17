import React from "react";
import {
  IonRouterLink,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonModal,
  IonCol,
  IonRow,
  IonToast,
} from "@ionic/react";
import { Map, Marker, TileLayer, Polygon } from "react-leaflet";
import { Icon } from "leaflet";
import { icon, library } from "@fortawesome/fontawesome-svg-core";
import {
  faLayerGroup,
  faMapMarkerAlt,
  faLock,
  faLocationArrow,
  faPhoneAlt,
  faPlus,
  faMinus,
  faAngleLeft,
  faLockOpen,
  faEraser,
  faIcons,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  addCircle,
  checkmarkCircle,
  close,
  closeCircle,
  cloudDone,
} from "ionicons/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plugins } from "@capacitor/core";
import app from "../../app.config.json";
import th from "../../th.json";
import en from "../../en.json";
import api from "../../api.json";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-moving-rotated-marker";
import "./geometry.css";
import Axios from "axios";

library.add(
  faLayerGroup,
  faMapMarkerAlt,
  faLock,
  faLocationArrow,
  faPhoneAlt,
  faPlus,
  faMinus,
  faAngleLeft,
  faLockOpen,
  faLock,
  faEraser,
  faIcons,
  faUndoAlt
);
var moment = require("moment");
moment().format();

export const generalLayer = "../assets/images/normallayer.PNG";
export const sattleliteLayer = "../assets/images/sattlelitelayer.PNG";
export const longdoLayer = "../assets/images/longdolayer.PNG";
export const lanscapeLayer = "../assets/images/lanscapelayer.PNG";

export var circleMarker = new Icon({
  iconUrl: "../assets/icon/circle_marker.png",
  iconSize: [15, 15],
});

var position = [
  {
    lon: 99,
    lat: 14,
  },
];
var polygon = position;
let index = 0;
let geometryName, geometryType, pleaseAddGeometry, addGeometry;
let LayerNormal, LayerOpenstreet, LayerSattlelie, LayerLanscape;

export default class MapAddGeometry extends React.Component {
  mapRef = React.createRef();
  geometryName = React.createRef();
  state = {
    modalChooseIcon: false,
    activeList: null,
    setShowToast: false,
    zoom: 12,
    tile: "",
    attribution: "",
    hideLayer: "none",
    showUndoGeometry: "none",
    latgiude: "13.76393778520523",
    longitude: "100.59376001358034",
    mapHeight: "105vh",
    marker: [],
    markerLatgiude: "",
    markerLongitude: "",
    polygon: [],
    geometry: [],
    doubleClickZoom: true,
    nameGeometry: "",
    geometryName: "ชื่อเขตพื้นที่",
    geometryType: "หลาายเหลี่ยม",
    addGeometry: "เพิ่มเขตพื้นที่",
    LayerNormal: "ทั่วไป",
    LayerOpenstreet: "สีเทา",
    LayerSattlelie: "ดาวเทียม",
    LayerLanscape: "ภูมิประเทศ",
    upload: "wait", //wait //uploading //success //fail	,
    pleaseAddGeometry: "โปรดเพิ่มเขตพื้นที่",
    LongdomapEnable: true,
    OpenstreetmapEnable: true,
    SattleliteEnable: true,
    LanscapeEnable: true,
    iconMarker: 0,
    iconMarkerName: "",
    polygonColor: "#f5da42",
    polygonFillColor: "#f5da42",
    clickCount: 0,
    polygonColorList: [
      {
        img: "../assets/icon/color-01.png",
        color: "#f5da42",
        border: "#f5da42",
      },
      {
        img: "../assets/icon/color-02.png",
        color: "#ef6f6f",
        border: "#a84f4f",
      },
      {
        img: "../assets/icon/color-03.png",
        color: "#b7ef6f",
        border: "#719144",
      },
      {
        img: "../assets/icon/color-04.png",
        color: "#73efe3",
        border: "#458c83",
      },
      {
        img: "../assets/icon/color-05.png",
        color: "#7e75ef",
        border: "#4f4d99",
      },
      {
        img: "../assets/icon/color-06.png",
        color: "#ea7aed",
        border: "#97519b",
      },
    ],
    iconPlace: [
      {
        category_id: 1,
        category_name: "การเดินทาง, การติดต่อสื่อสาร",
        icon: [
          { id: 9, name: "PTT" },
          { id: 10, name: "PT" },
          { id: 15, name: "Spare part" },
          { id: 18, name: "Gas Station" },
          { id: 24, name: "BTS" },
          { id: 26, name: "Gas Station" },
          { id: 33, name: "Esso" },
          { id: 35, name: "Bangchak" },
          { id: 38, name: "Gas Station 2" },
          { id: 42, name: "MRT" },
          { id: 43, name: "Speed Camera" },
          { id: 44, name: "TG การบินไทย" },
          { id: 45, name: "TOT" },
          { id: 46, name: "Parking" },
          { id: 47, name: "Raiway" },
        ],
      },
      {
        category_id: 2,
        category_name: "ท่องเที่ยว บันเทิง กีฬา",
        icon: [
          { id: 6, name: "Temple" },
          { id: 48, name: "Sea" },
          { id: 49, name: "Waterfall" },
          { id: 50, name: "River" },
          { id: 51, name: "Mountain" },
          { id: 52, name: "Sport" },
          { id: 53, name: "Night Life" },
          { id: 54, name: "Bike Station" },
          { id: 55, name: "Golf" },
          { id: 56, name: "Spa" },
          { id: 57, name: "Hotel" },
          { id: 58, name: "Hotel 2" },
          { id: 59, name: "Dusit Hotel" },
          { id: 60, name: "Centra Hotel" },
          { id: 61, name: "Ticket" },
          { id: 62, name: "Mariott Hotel" },
          { id: 63, name: "Sofitel Hotel" },
          { id: 64, name: "Novotel Hotel" },
        ],
      },
    ],
  };

  componentDidUpdate() {
    //fixed gray tile
    this.mapRef.current.leafletElement.invalidateSize();
  }

  setShowToast = (e) => {
    this.setState({
      setShowToast: e,
    });
  };

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

  async componentDidMount() {
    let localLatitude = await this.getStorage("latitude");
    let localLongitude = await this.getStorage("longitude");
    let lang = await this.getStorage("language");
    let token = await this.getStorage("token");
    let apiHost = await this.getStorage("api");
    this.setLanguage();

    this.setState({
      latgiude: JSON.parse(localLatitude),
      longitude: JSON.parse(localLongitude),
      markerLatgiude: JSON.parse(localLatitude),
      markerLongitude: JSON.parse(localLongitude),
    });
    this.setState({
      tile:
        "https://ms.longdo.com/mmmap/img.php?zoom={z}&x={x}&y={y}&key=cc2cfcc6fd6e2673395" +
        "611b352382892&proj=epsg3857&HD=1",
      attribution: "© Longdo Map",
    });

    /*****************  Map Enable *********************/
    console.log("LeafletMap -> componentDidMount -> token ", api.authorization);
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
        console.log("LeafletMap -> componentDidMount -> res", res.data);
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
      .get(apiHost + "/iconlist", {
        headers: {
          language: lang,
          token: token,
          authenication: api.authorization,
          version: api.version,
        },
      })
      .then((res) => {
        console.log("icon list", res);
        this.setState({
          iconPlace: res.data.category,
        });
      });
  }

  componentWillUnmount() {
    polygon = null;
    this.unsubscribe();
    clearInterval(this.sliderInterval);
  }
  setActivePark = (e) => {
    this.setState({
      activeList: e,
    });
  };

  setLanguage = async () => {
    const languag = await this.getStorage("language");
    let l;

    if (languag === '"th"' || languag === "th") {
      l = th.addGeometry;
      geometryName = l.geometryName;
      geometryType = l.geometryType;
      addGeometry = l.addGeometry;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      pleaseAddGeometry = l.pleaseAddGeometry;
    } else if (languag === '"en"' || languag === "en") {
      l = en.addGeometry;
      geometryName = l.geometryName;
      geometryType = l.geometryType;
      addGeometry = l.addGeometry;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      pleaseAddGeometry = l.pleaseAddGeometry;
    }
  };

  componentWillUnmount() {
    this.setState({
      latgiude: "",
      longitude: "",
    });
  }

  setTileLongdoMap = async () => {
    try {
      await this.setState({
        tile:
          "https://longdomap.attg.cc/mmmap/img.php?zoom={z}&x={x}&y={y}&key=cc2cfcc6fd6e267" +
          "3395611b352382892&proj=epsg3857&HD=1",
        attribution: "© Longdo Map",
      });
    } catch {
      console.log("can not load tile");
    }
  };

  setTileSattlelite = async () => {
    try {
      await this.setState({
        tile:
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/til" +
          "e/{z}/{y}/{x}",
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmap" +
          "ping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
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
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contr' +
          "ibutors",
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
          '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="Cycl' +
          'OSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.o' +
          'penstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
    } catch {
      console.log("can not load tile");
    }
  };

  setLayer = () => {
    if (this.state.hideLayer === "none") {
      this.setState({
        hideLayer: "block",
      });
    } else if (this.state.hideLayer === "block") {
      this.setState({
        hideLayer: "none",
      });
    }
  };

  handleClick = (e) => {
    console.log("this.state.clickCount ", this.state.clickCount);
    if (this.state.clickCount < 2) {
      this.setState(
        {
          clickCount: this.state.clickCount + 1,
        },
        () => {
          setTimeout(() => {
            this.setState({
              clickCount: 0,
            });
          }, 3000);
        }
      );
    } else if (this.state.clickCount === 2) {
      console.log("e ", e);
      var init = this.state.polygon.length;
      var index = this.state.marker.length;
      var geoindex = this.state.geometry.length;
      var nextGeoindex = geoindex + 1;

      let polygons = [...this.state.polygon];
      let mark = [...this.state.marker];
      let geometry = [...this.state.geometry];

      geometry[geoindex] = e.latlng.lat;
      geometry[nextGeoindex] = e.latlng.lng;

      polygons[init] = {
        lon: e.latlng.lng,
        lat: e.latlng.lat,
      };
      mark[index] = [e.latlng.lat, e.latlng.lng];
      this.setState(
        {
          polygon: polygons,
          marker: mark,
          geometry: geometry,
        },
        () => {
          console.log(" polygon.length ", this.state.polygon.length);
          if (this.state.polygon.length > 0) {
            this.setState({
              doubleClickZoom: false,
              showUndoGeometry: "block",
            });
          }
          if (this.state.polygon.length >= 3) {
            this.setPolygonIcon(0, "");
          }
        }
      );
      console.log("MapAddGeometry -> handleClick -> marker", this.state.marker);
    } else if (this.state.clickCount > 2) {
      setTimeout(() => {
        this.setState({
          clickCount: 0,
        });
      }, 3000);
    }
  };

  getMapPoints = (polygon) => {
    if (polygon.length >= 2) {
      return polygon;
    } else {
      return [
        [0, 0],
        [0, 0],
      ];
    }
  };

  addMarker = (marker) => {
    console.log(marker);
    if (marker.length >= 1) return marker;
    else
      return [
        [0, 0],
        [0, 0],
      ];
  };

  doubleTapZoom = () => {
    this.setState({
      doubleClickZoom: !this.state.doubleClickZoom,
    });
  };

  submit = async () => {
    this.setState({
      upload: "uploading",
    });
    if (
      this.state.nameGeometry === "" ||
      this.state.nameGeometry === null ||
      this.state.geometry === [] ||
      this.state.geometry.length === 0
    ) {
      this.setState({
        upload: "wait",
      });
    } else {
      console.log("condition pass");
      let geometry = await JSON.stringify(this.state.geometry);
      this.postGeometry(geometry);
    }
  };

  postGeometry = async (geo) => {
    let lang = localStorage.getItem("language");
    let token = localStorage.getItem("token");
    let apiHost = localStorage.getItem("api");
    let userId = localStorage.getItem("userId");
    axios
      .post(
        apiHost + "/addgeometry",
        {
          userId: userId,
          locationName: this.state.nameGeometry,
          geometry: geo,
          iconId: JSON.stringify(this.state.iconMarker),
        },
        {
          headers: {
            language: lang,
            token: token,
            authenication: api.authorization,
            version: api.version,
          },
        }
      )
      .then((res) => {
        console.log("res ", res);
        if (res.status === 200) {
          this.setState({
            polygon: [],
            marker: [],
            geometry: [],
            upload: "success",
          });
        } else {
          this.setState({
            upload: "fail",
          });
        }
      });
  };

  modalChooseIcon = (e) => {
    this.setState({
      modalChooseIcon: e,
    });
  };

  setPolygonIcon = (id, name) => {
    if (
      this.state.polygon !== [] &&
      this.state.polygon.length > 0 &&
      this.state.polygon !== null &&
      this.state.polygon !== undefined
    ) {
      this.setState({
        iconMarker: id,
        iconMarkerName: name,
      });
    } else {
      this.setShowToast(true);
      console.log("โปรดเพิ่มเขตพื้นที่");
    }
  };

  setPolygonColor = (border, fill) => {
    this.setState(
      {
        polygonColor: border,
        polygonFillColor: fill,
      },
      () => {
        this.modalChooseIcon(false);
      }
    );
  };
  undoGeometry = () => {
    console.log(this.state.polygon);
    console.log(this.state.marker);
    let lastPolygon = this.state.polygon;
    let lastMarker = this.state.marker;
    let geometry = this.state.geometry;

    let lastIndex = this.state.polygon.length - 1;
    let lastMarkerIndex = this.state.marker.length - 1;

    /**********/
    var geoindex = this.state.geometry.length - 1;
    var indexGeocBefore = geoindex - 1;

    lastPolygon.splice(lastIndex, 1);
    lastMarker.splice(lastMarkerIndex, 1);
    geometry.splice(geoindex, 1);
    geometry.splice(indexGeocBefore, 1);

    this.setState(
      {
        polygon: lastPolygon,
        marker: lastMarker,
        geometry: geometry,
      },
      () => {
        console.log("polygon ", this.state.polygon);
        console.log("geometry ", this.state.geometry);
        if (this.state.polygon.length === 0 && this.state.marker.length === 0) {
          this.setState({
            showUndoGeometry: "none",
          });
        }
      }
    );
  };

  render() {
    this.setLanguage();
    let s = this.state;
    if (geometryName === undefined) {
      let l = this.state;
      geometryName = l.geometryName;
      geometryType = l.geometryType;
      addGeometry = l.addGeometry;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      pleaseAddGeometry = l.pleaseAddGeometry;
    }

    return (
      <div>
        <div className="box-add-detail">
          <div className="row center-row-content">
            <div className="col-1 ">
              <IonRouterLink
                routerDirection="back"
                className="back-arrow set-center"
                target="_self"
                href="/geometry"
                color="dark"
                style={{ color: "#666", fontSize: "1.5em" }}
                onClick={() => {
                  polygon = [];
                }}
              >
                <FontAwesomeIcon icon="angle-left" />
              </IonRouterLink>
            </div>
            <div className="col-11">
              <div className="dateBox">
                <IonInput
                  ref={this.geometryName}
                  disabled={false}
                  value={this.state.nameGeometry}
                  placeholder={geometryName}
                  onIonChange={(e) => {
                    this.setState({ nameGeometry: e.detail.value });
                  }}
                  color="medium"
                ></IonInput>
              </div>
              <div className="dateBox">
                <IonInput
                  placeholder="ชนิด"
                  value={geometryType}
                  disabled
                  color="medium"
                ></IonInput>
              </div>
            </div>
          </div>
        </div>
        <IonButton
          type="button"
          className="button-add-geometry"
          color="primary"
          mode="ios"
          expand="block"
          onClick={(e) => {
            this.submit();
          }}
        >
          {this.state.upload === "wait" ? (
            <IonIcon icon={addCircle} />
          ) : this.state.upload === "uploading" ? (
            <IonSpinner name="crescent" />
          ) : this.state.upload === "success" ? (
            <IonIcon icon={cloudDone} />
          ) : this.state.upload === "fail" ? (
            <IonIcon icon={closeCircle} />
          ) : (
            <IonIcon icon={addCircle} />
          )}
          <IonLabel> &nbsp; {addGeometry} </IonLabel>
        </IonButton>
        <button className="button-layer-group-add-geometry">
          <FontAwesomeIcon
            icon="layer-group"
            style={{
              fontSize: "1.3em",
              color: "#666",
            }}
            onClick={() => this.setLayer()}
          />{" "}
        </button>
        <button className="button-zoom-in-add-geometry">
          <FontAwesomeIcon
            icon="plus"
            style={{ fontSize: "1.3em", color: app.color }}
            onClick={() => this.setState({ zoom: this.state.zoom + 1 })}
          />
        </button>
        <button className="button-zoom-out-add-geometry">
          <FontAwesomeIcon
            icon="minus"
            style={{ fontSize: "1.3em", color: app.color }}
            onClick={() => this.setState({ zoom: this.state.zoom - 1 })}
          />{" "}
        </button>
        <button className="button-choose-icons">
          <FontAwesomeIcon
            icon="icons"
            style={{ fontSize: "1.3em", color: app.color }}
            onClick={() => {
              this.modalChooseIcon(true);
            }}
          />{" "}
        </button>
        <button
          className="button-lock-add-geometry"
          onClick={() => {
            this.doubleTapZoom();
          }}
        >
          {" "}
          {this.state.doubleClickZoom === true ? (
            <FontAwesomeIcon
              icon="lock-open"
              style={{ fontSize: "1.3em", color: app.color }}
            />
          ) : (
            <FontAwesomeIcon
              icon="lock"
              style={{ fontSize: "1.3em", color: app.color }}
            />
          )}{" "}
        </button>
        <button
          className="button-remove-marker-geometry"
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              polygon: [],
              marker: [],
              geometry: [],
              iconMarker: 0,
              showUndoGeometry: "none",
            });
          }}
        >
          <FontAwesomeIcon icon="eraser" style={{ fontSize: "1.3em" }} />
        </button>

        <button
          className="button-undo-geometry"
          style={{ display: this.state.showUndoGeometry }}
          onClick={() => {
            this.undoGeometry();
          }}
        >
          <FontAwesomeIcon icon="undo-alt" style={{ fontSize: "1.3em" }} />
        </button>

        <div
          className="layers-box-add-geometry p-5"
          style={{ display: this.state.hideLayer }}
        >
          <div className="layers-box-content-geometry">
            {" "}
            {s.LongdomapEnable === false ? (
              <div> </div>
            ) : (
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileLongdoMap()}
              >
                <img src={longdoLayer} alt="img-layer" /> <br /> {LayerNormal}{" "}
              </div>
            )}{" "}
            {s.OpenstreetmapEnable === false ? (
              <div> </div>
            ) : (
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileOpenStreetMap()}
              >
                <img src={generalLayer} alt="img-layer" /> <br />{" "}
                {LayerOpenstreet}{" "}
              </div>
            )}{" "}
            {s.SattleliteEnable === false ? (
              <div> </div>
            ) : (
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileSattlelite()}
              >
                <img src={sattleliteLayer} alt="img-layer" /> <br />{" "}
                {LayerSattlelie}{" "}
              </div>
            )}{" "}
            {s.LanscapeEnable === false ? (
              <div> </div>
            ) : (
              <div
                className="layers-box-content-left"
                onClick={() => this.setTileLanscape()}
              >
                <img src={lanscapeLayer} alt="img-layer" /> <br />{" "}
                {LayerLanscape}
              </div>
            )}
          </div>
        </div>

        <Map
          ref={this.mapRef}
          center={[this.state.latgiude, this.state.longitude]}
          position={[this.state.latgiude, this.state.longitude]}
          zoom={this.state.zoom}
          zoomControl={false}
          onzoomend={() => {
            this.setState({
              zoom: this.mapRef.current.leafletElement.getZoom(),
            });
          }}
          onClick={(e) => {
            this.handleClick(e);
            this.setState({ hideLayer: "none" });
          }}
          doubleClickZoom={this.state.doubleClickZoom}
          style={{ height: this.state.mapHeight, width: "100%" }}
        >
          <TileLayer
            attribution={this.state.attribution}
            url={this.state.tile}
          />
          {this.state.marker.map((marker, index) => {
            if (this.state.marker.length > 0) {
              return (
                <Marker
                  key={index}
                  position={[marker[0], marker[1]]}
                  icon={circleMarker}
                />
              );
            }
          })}
          <Polygon
            positions={this.getMapPoints(this.state.polygon)}
            color={this.state.polygonColor}
            fillColor={this.state.polygonFillColor}
            opacity={0.9}
          />
          {this.state.polygon.length >= 3 ? (
            <Marker
              position={this.state.polygon[0]}
              style={{ zIndex: 9999 }}
              onClick={() => {
                this.modalChooseIcon(true);
              }}
              icon={
                new Icon({
                  iconUrl:
                    "../assets/icon-place/map-icon-" +
                    this.state.iconMarker +
                    ".png",
                  iconSize: [40, 40],
                })
              }
            />
          ) : (
            <div></div>
          )}
        </Map>

        <IonModal
          isOpen={this.state.modalChooseIcon}
          onDidDismiss={() => {
            this.modalChooseIcon(false);
          }}
          cssClass="modal-choose-icon"
        >
          <div
            style={{
              position: "fixed",
              zIndex: 999,
              backgroundColor: "rgba(255,255,255,.1)",
              width: "100%",
              padding: "1rem",
            }}
          >
            <IonRow style={{ justifyContent: "flex-end" }}>
              <IonCol
                size="2"
                className="set-center"
                onClick={() => {
                  this.modalChooseIcon(false);
                }}
              >
                <IonIcon
                  icon={closeCircle}
                  color="medium"
                  style={{ fontSize: "1.2em" }}
                  onClick={() => {
                    this.modalChooseIcon(false);
                  }}
                />
              </IonCol>
            </IonRow>
          </div>
          <div style={{ padding: "1rem", paddingTop: "1.2em" }}>
            {/* <IonRow style = {{	justifyContent: 'flex-end'	}} >
							<IonCol 
								size = '2'
								className = 'set-center'
								onClick = {() => {	this.modalChooseIcon(false)	}} >
								<IonIcon icon = {closeCircle}color = 'medium'onClick = {() => {	this.modalChooseIcon(false)}}/> 
							</IonCol> 
						</IonRow> */}
            <IonRow>
              {this.state.iconMarker === 0 ? (
                <IonCol
                  size="3"
                  className="set-center select-icon"
                  style={{ position: "relative" }}
                >
                  <img
                    src={"../assets/icon-place/map-icon-" + 0 + ".png"}
                    onClick={() => {
                      this.setPolygonIcon(0, "");
                    }}
                  />{" "}
                  <br />
                  <small style={{ color: "#666" }}> Default </small>
                  <IonIcon
                    icon={checkmarkCircle}
                    color="success"
                    style={{
                      position: "absolute",
                      right: ".2rem",
                      top: ".2rem",
                    }}
                  />
                </IonCol>
              ) : (
                <IonCol
                  size="3"
                  className="set-center "
                  onClick={() => {
                    this.setPolygonIcon(0, "");
                  }}
                >
                  <img src={"../assets/icon-place/map-icon-" + 0 + ".png"} />{" "}
                  <br />
                  <small style={{ color: "#666" }}> Default </small>
                </IonCol>
              )}
            </IonRow>
            <IonRow></IonRow>

            {this.state.iconPlace.map((iconPlace) => (
              <IonRow
                key={iconPlace.category_id}
                style={{ marginBottom: "1rem", backgroundColor: "#fff" }}
              >
                <IonCol size="12">
                  <strong style={{ color: "#666" }}>
                    {iconPlace.category_name}
                  </strong>
                </IonCol>
                {iconPlace.icon.map((icon) => (
                  <IonCol
                    size="3"
                    className="set-center"
                    key={icon.id}
                    onClick={() => {
                      this.setPolygonIcon(icon.id, icon.name);
                    }}
                  >
                    {this.state.iconMarker === icon.id ? (
                      <div
                        size="3"
                        className="set-center select-icon"
                        style={{ width: "100%", position: "relative" }}
                      >
                        <img
                          src={
                            "../assets/icon-place/map-icon-" + icon.id + ".png"
                          }
                        />{" "}
                        <br />
                        <small style={{ color: "#666", textAlign: "center" }}>
                          {" "}
                          {icon.name}{" "}
                        </small>
                        <IonIcon
                          icon={checkmarkCircle}
                          color="success"
                          style={{
                            position: "absolute",
                            right: ".2rem",
                            top: ".2rem",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        size="3"
                        className="set-center"
                        style={{ width: "100%" }}
                      >
                        <img
                          src={
                            "../assets/icon-place/map-icon-" + icon.id + ".png"
                          }
                        />{" "}
                        <br />
                        <small style={{ color: "#666", textAlign: "center" }}>
                          {" "}
                          {icon.name}{" "}
                        </small>
                      </div>
                    )}
                  </IonCol>
                ))}
              </IonRow>
            ))}
          </div>
        </IonModal>
        <IonToast
          isOpen={this.state.setShowToast}
          onDidDismiss={() => this.setShowToast(false)}
          message={pleaseAddGeometry}
          color="primary"
          buttons={[
            {
              text: "",
              role: "cancel",
              icon: close,
              handler: () => {
                this.setShowToast(false);
              },
            },
          ]}
          duration={2000}
        />
      </div>
    );
  }
}
