import React from "react";
import { Map, Marker, TileLayer, Polygon, Tooltip } from "react-leaflet";
import {
  IonIcon,
  IonModal,
  IonCol,
  IonRow,
  IonButton,
  IonToast,
  IonLabel,
} from "@ionic/react";
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
  faIcons,
} from "@fortawesome/free-solid-svg-icons";
import { closeCircle, checkmarkCircle, close, cloudDone } from "ionicons/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plugins } from "@capacitor/core";
import app from "../../app.config.json";
import axios from "axios";
import api from "../../api.json";
import en from "../../en.json";
import th from "../../th.json";
import "leaflet/dist/leaflet.css";
import "leaflet-moving-rotated-marker";
import "./geometry.css";

//import generalLayer from "../assets/icon/logo-green.png"
// import sattleliteLayer from "../assets/images/sattlelitelayer.PNG"

library.add(
  faLayerGroup,
  faMapMarkerAlt,
  faLock,
  faLocationArrow,
  faPhoneAlt,
  faPlus,
  faMinus,
  faIcons
);
const { Storage } = Plugins;
var moment = require("moment");
moment().format();

export const generalLayer = "../assets/images/normallayer.PNG";
export const sattleliteLayer = "../assets/images/sattlelitelayer.PNG";
export const longdoLayer = "../assets/images/longdolayer.PNG";
export const lanscapeLayer = "../assets/images/lanscapelayer.PNG";

export var iconClear = new Icon({
  iconUrl: "../assets/icon/clear-icon.png",
  iconSize: [20, 20],
});

let LayerNormal, LayerOpenstreet, LayerSattlelie, LayerLanscape, save;

export default class LeafletMap extends React.Component {
  mapRef = React.createRef();
  state = {
    activeList: null,
    modalChooseIcon: false,
    showToastErr: false,
    zoom: 15,
    tile: "",
    attribution: "",
    hideLayer: "none",
    editDone: "none",
    latgiude: "",
    longitude: "",
    mapHeight: "100vh",
    detailsBoxHide: "none",
    showSaveBtn: "none",
    save: "บันทึก",
    position: [
      { lon: 98.344609487932, lat: 7.9911841467675 },
      { lon: 98.345073510087, lat: 7.991351485024 },
    ],

    LongdomapEnable: true,
    OpenstreetmapEnable: true,
    SattleliteEnable: true,
    LanscapeEnable: true,
    LayerNormal: "ทั่วไป",
    LayerOpenstreet: "สีเทา",
    LayerSattlelie: "ดาวเทียม",
    LayerLanscape: "ภูมิประเทศ",
    geoName: "",
    iconMarker: 0,
    newIconMarker: 0,
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

  componentDidUpdate() {
    //fixed gray tile
    this.mapRef.current.leafletElement.invalidateSize();
  }

  showToastErr = (e) => {
    this.setState({
      showToastErr: e,
    });
  };

  setLanguage = async () => {
    let language = await this.getStorage("language");
    if (language === "th" || language === '"th"') {
      let l = th.addGeometry;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      save = l.save;
    } else if (language === "en" || language === '"en"') {
      let l = en.addGeometry;
      LayerNormal = l.LayerNormal;
      LayerOpenstreet = l.LayerOpenstreet;
      LayerSattlelie = l.LayerSattlelie;
      LayerLanscape = l.LayerLanscape;
      save = l.save;
    }
  };

  async componentDidMount() {
    this.setLanguage();
    let localLatitude = await this.getStorage("latitude");
    let localLongitude = await this.getStorage("longitude");
    let lang = await this.getStorage("language");
    let token = await this.getStorage("token");
    let apiHost = await this.getStorage("api");
    let geoName = await this.getStorage("geoName");
    let iconID = await this.getStorage("iconId");
    let position = await this.getStorage("position");
    this.setState(
      {
        latgiude: JSON.parse(localLatitude),
        longitude: JSON.parse(localLongitude),
        geoName: JSON.parse(geoName),
      },
      () => {
        console.log("geoName ", this.state.geoName);
      }
    );

    if (iconID === null || iconID === undefined || iconID === "null") {
      this.setState({
        newIconMarker: 0,
        iconMarker: 0,
      });
    } else {
      this.setState({
        newIconMarker: JSON.parse(iconID),
        iconMarker: JSON.parse(iconID),
      });

      console.log("JSON.parse(iconID)  ", JSON.parse(iconID));
    }

    if (position === "null" || position === "undefined" || position === "") {
      this.setState({
        latgiude: JSON.parse(localLatitude),
        longitude: JSON.parse(localLongitude),
        position: [],
      });
    } else {
      this.setState(
        {
          position: JSON.parse(position),
          latgiude: JSON.parse(localLatitude),
          longitude: JSON.parse(localLongitude),
        },
        () => {
          if (
            this.state.position[0].lat !== null &&
            this.state.position[0].lon !== null
          ) {
            this.setState({
              latgiude: JSON.stringify(this.state.position[0].lat),
              longitude: JSON.stringify(this.state.position[0].lon),
            });
          } else {
            this.setState({
              latgiude: JSON.parse(localLatitude),
              longitude: JSON.parse(localLongitude),
            });
          }
        }
      );
    }

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
      })
      .catch((err) => {
        console.log("err => line 201 => ", err);
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
        console.log("LeafletMap -> componentDidMount -> res", res);
        if (res.data.length > 0) {
          this.setState({
            LongdomapEnable: res.data[0].status,
            OpenstreetmapEnable: res.data[1].status,
            SattleliteEnable: res.data[2].status,
            LanscapeEnable: res.data[3].status,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    /********************************** */
  }
  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.sliderInterval);
  }
  setActivePark = (e) => {
    this.setState({
      activeList: e,
    });
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

  modalChooseIcon = (e) => {
    this.setState({
      modalChooseIcon: e,
    });
  };
  setPolygonIcon = (id) => {
    console.log(id);
    if (
      this.state.position !== [] &&
      this.state.position.length > 0 &&
      this.state.position !== null &&
      this.state.position !== undefined
    ) {
      this.setState(
        {
          newIconMarker: id,
        },
        () => {
          if (this.state.iconMarker !== this.state.newIconMarker) {
            this.setState({
              showSaveBtn: "block",
              editDone: "none",
            });
          } else {
            this.setState({
              showSaveBtn: "none",
            });
          }
        }
      );
    } else {
      this.setShowToast(true);
      console.log("โปรดเพิ่มเขตพื้นที่");
    }
  };

  saveEdit = async () => {
    let lang = await this.getStorage("language");
    let token = await this.getStorage("token");
    let apiHost = await this.getStorage("api");
    let iconID = await this.getStorage("iconId");
    let geoID = await this.getStorage("geoId");

    axios
      .post(
        apiHost + "/editegeometry",
        {
          iconId: this.state.newIconMarker,
          geoId: geoID,
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
        console.log(res.data);
        if (res.data.result === true) {
          console.log("edit success");
          this.setState({
            editDone: "block",
            iconMarker: this.state.newIconMarker,
          });
          this.setStorage("iconId", JSON.stringify(this.state.iconMarker));
        } else if (res.data.result === false) {
          console.log("edit fail");
          this.showToastErr(true);
        }
      })
      .catch((err) => {
        console.log("err ", err);
        this.showToastErr(true);
      });
  };

  render() {
    let s = this.state;
    if (LayerNormal === undefined) {
      LayerNormal = s.LayerNormal;
      LayerOpenstreet = s.LayerOpenstreet;
      LayerSattlelie = s.LayerSattlelie;
      LayerLanscape = s.LayerLanscape;
    }
    return (
      <div>
        <Map
          ref={this.mapRef}
          center={[this.state.latgiude, this.state.longitude]}
          position={[this.state.position[0]]}
          zoom={this.state.zoom}
          zoomControl={false}
          style={{ height: this.state.mapHeight, width: "100%" }}
        >
          <TileLayer
            attribution={this.state.attribution}
            url={this.state.tile}
          />

          <Polygon
            positions={this.state.position}
            color="#134985"
            fillColor="#134985"
            opacity={0.3}
          ></Polygon>
          {this.state.newIconMarker === this.state.iconMarker ? (
            <div>
              {this.state.position.length > 0 ? (
                <Marker
                  position={this.state.position[0]}
                  style={{ zIndex: 9999 }}
                  icon={
                    new Icon({
                      iconUrl:
                        "../assets/icon-place/map-icon-" +
                        this.state.iconMarker +
                        ".png",
                      iconSize: [40, 40],
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
                    <small>{this.state.geoName} </small>
                  </Tooltip>
                </Marker>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div>
              {this.state.position.length > 0 ? (
                <Marker
                  position={this.state.position[0]}
                  style={{ zIndex: 9999 }}
                  icon={
                    new Icon({
                      iconUrl:
                        "../assets/icon-place/map-icon-" +
                        this.state.newIconMarker +
                        ".png",
                      iconSize: [40, 40],
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
                    <small>{this.state.geoName} </small>
                  </Tooltip>
                </Marker>
              ) : (
                <div></div>
              )}
            </div>
          )}

          <button className="button-layer-group-geometry">
            <FontAwesomeIcon
              icon="layer-group"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => this.setLayer()}
            />
          </button>
          <button className="button-zoom-in-geometry">
            <FontAwesomeIcon
              icon="plus"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => this.setState({ zoom: this.state.zoom + 1 })}
            />
          </button>
          <button className="button-zoom-out-geometry">
            <FontAwesomeIcon
              icon="minus"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => this.setState({ zoom: this.state.zoom - 1 })}
            />
          </button>
          <button className="button-choose-icons-geometry">
            <FontAwesomeIcon
              icon="icons"
              style={{ fontSize: "1.3em", color: app.color }}
              onClick={() => {
                this.modalChooseIcon(true);
              }}
            />{" "}
          </button>

          <div
            className="save-edit-geometry"
            style={{ display: this.state.showSaveBtn }}
          >
            <IonButton
              expand="block"
              shape="round"
              onClick={() => {
                this.saveEdit();
              }}
            >
              <IonIcon
                icon={cloudDone}
                color="light"
                style={{ display: this.state.editDone }}
              />
              &nbsp;&nbsp;
              <IonLabel>{save}</IonLabel>
            </IonButton>
          </div>

          <div
            className="layers-box-geometry p-5"
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
              padding: "1rem",
              width: "100%",
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
          <div style={{ padding: "1rem", paddingTop: "2rem" }}>
            <IonRow>
              {this.state.newIconMarker === this.state.iconMarker ? (
                <IonCol size="3">
                  <div
                    size="3"
                    className="set-center select-icon w-100"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={
                        "../assets/icon-place/map-icon-" +
                        this.state.iconMarker +
                        ".png"
                      }
                      onClick={() => {
                        this.setPolygonIcon(this.state.iconMarker);
                      }}
                    />{" "}
                    <br />
                    <small style={{ color: "#666" }}> Current </small>
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
                </IonCol>
              ) : (
                <IonCol size="3">
                  <div
                    size="3"
                    className="set-center w-100"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={
                        "../assets/icon-place/map-icon-" +
                        this.state.iconMarker +
                        ".png"
                      }
                      onClick={() => {
                        this.setPolygonIcon(this.state.iconMarker);
                      }}
                    />{" "}
                    <br />
                    <small style={{ color: "#666" }}> Current </small>
                  </div>
                </IonCol>
              )}
            </IonRow>

            {this.state.iconPlace.map((iconPlace) => (
              <IonRow
                key={iconPlace.category_id}
                style={{ marginBottom: "1rem" }}
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
                      this.setPolygonIcon(icon.id);
                    }}
                  >
                    {this.state.newIconMarker === this.state.iconMarker ? (
                      <div className="w-100">
                        {this.state.iconMarker === icon.id ? (
                          <div
                            className="set-center select-icon w-100"
                            id={icon.id}
                            style={{ position: "relative" }}
                          >
                            <img
                              src={
                                "../assets/icon-place/map-icon-" +
                                icon.id +
                                ".png"
                              }
                            />{" "}
                            <br />
                            <small
                              style={{ color: "#666" }}
                              className="ion-text-center"
                            >
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
                          <div className="set-center w-100" id={icon.id}>
                            <img
                              src={
                                "../assets/icon-place/map-icon-" +
                                icon.id +
                                ".png"
                              }
                            />{" "}
                            <br />
                            <small
                              style={{ color: "#666" }}
                              className="ion-text-center"
                            >
                              {" "}
                              {icon.name}{" "}
                            </small>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-100">
                        {this.state.newIconMarker === icon.id ? (
                          <div
                            className="set-center select-icon w-100"
                            id={icon.id}
                            style={{ position: "relative" }}
                          >
                            <img
                              src={
                                "../assets/icon-place/map-icon-" +
                                icon.id +
                                ".png"
                              }
                            />{" "}
                            <br />
                            <small
                              style={{ color: "#666" }}
                              className="ion-text-center"
                            >
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
                          <div className="set-center w-100" id={icon.id}>
                            <img
                              src={
                                "../assets/icon-place/map-icon-" +
                                icon.id +
                                ".png"
                              }
                            />{" "}
                            <br />
                            <small
                              style={{ color: "#666" }}
                              className="ion-text-center"
                            >
                              {" "}
                              {icon.name}{" "}
                            </small>
                          </div>
                        )}
                      </div>
                    )}
                  </IonCol>
                ))}
              </IonRow>
            ))}
          </div>
        </IonModal>
        <IonToast
          isOpen={this.state.showToastErr}
          onDidDismiss={() => this.showToastErr(false)}
          message="Your settings have been saved."
          color="danger"
          duration={4000}
          buttons={[
            {
              icon: close,
              role: "cancel",
              handler: () => {
                console.log("close clicked");
              },
            },
          ]}
        />
      </div>
    );
  }
}
