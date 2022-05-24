import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
// import Footer from "../../../components/Footer";
import helpers from "../../../components/Helpers";
import { AppContext } from "../../../components/AppContext";
// import history from "../../../components/History";
import { Divider, Chip, Grid, Button, LinearProgress } from "@mui/material";
// import img_avatar from "../../../assets/images/avatar.jpg";
// import banner from "../../../assets/images/banner.png";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSnackbar } from "notistack";
// import { styled } from "@mui/material/styles";
// import { maxWidth } from "@mui/system";

//Imágenes por default si el cliente no tiene imágenes guardadas
import userImage from "../../../assets/images/default-user-image.png";
import bannerImage from "../../../assets/images/default-user-banner.jpg";
import FormData from "form-data";

// Icons
// import { PhotoCamera } from "@mui/icons-material";

// import { Carousel } from 'antd';

//Importaciones de Componentes Hijos
import Row from "./ChildrenComponent/Row.js";
import NoDynamicForm from "./ChildrenComponent/NoDynamicForm";
import ModalLivePreview from "./ChildrenComponent/ModalLivePreview";
import ModalSessionOver from "./ChildrenComponent/ModalSessionOver";
import ModalWelcomeFirstSetup from "./ChildrenComponent/ModalWelcomeFirstSetup";
import ModalConfirmClearData from "./ChildrenComponent/ModalConfirmClearData";

// Tema para input's
const theme = createTheme();

const {
  convertStringWithPlus,
  copyToClipboard,
  copyTextToClipboard,
  // shareLink,
} = helpers;

//Estilo modal cierre de sesión
const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

export const SetupProfile = () => {
  //Obtenemos variables de sesión
  const { objLogin, logoutContext, setExistentProfile } =
    useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const [nameState, setNameState] = useState("");
  const [bioState, setBioState] = useState("");
  const [loadingProfileData, setLoadingProfileData] = useState(true); //Animación cargando datos de perfil
  const handleCloseLoading = () => setLoadingProfileData(false);
  const [sessionOver, setSessionOver] = useState(false);
  const handleCloseSessionOver = () => setSessionOver(false);
  const [profileData, setProfileData] = useState([]); //Este de momento no se usa
  const [customImage, setCustomImage] = useState([]);
  const [isLinked, setIsLinked] = useState(false);
  const [usernameLinked, setUsernameLinked] = useState("");

  //Declaro el estado del arreglo inicial que va a guardar las RRSS seleccionadas
  const [rows, setRows] = useState([]);

  //Con estas variables valido el tamaño de las imágenes
  const [imgProfileSize, setImgProfileSize] = useState(0);
  const [imgBannerSize, setImgBannerSize] = useState(0);

  /*Con estos estados manejamos cuando adjuntamos una imagen la convertimos en base64 para pintarlas
   *en la vista. También cuando el servicio(getProfileUserData) se encarga de mostrar
   *la ruta de la imagen*/
  const [imgProfile, setImgProfile] = useState("");
  const [imgBanner, setImgBanner] = useState("");
  const [gallery, setGallery] = useState({});

  // const [sendNotifications, setSendNotifications] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [show, setShow] = useState(false);
  const target = useRef(null);

  //para enviar al módulo de changePassword
  const [name, setName] = useState("");
  const [username, setUsername] = useState(objLogin.username);
  const [serialNumber, setSerialNumber] = useState("");
  const [email, setEmail] = useState("");

  /*Estas variables la usamos para manejar los estados de la foto y el perfil que vamos a subir.
  No van en formato64. El mismo javascrip se encarga de mandarlos en binario para que sean leídas en
  el backend.*/
  const [imgProfileToUpload, setImgProfileToUpload] = useState("");
  const [imgBannerToUpload, setImgBannerToUpload] = useState("");

  //constante para abrir y cerrar modal live preview
  const [openLivePreview, setOpenLivePreview] = useState(false);
  const handleCloseLivePreview = () => setOpenLivePreview(false);

  //constante para abrir y cerrar modal bienvenida
  const [welcome, setWelcome] = useState(false);
  const handleCloseWelcome = () => setWelcome(false);

  //constante para abrir y cerrar modal confirmar clear Data
  const [confirmModalClearData, setConfirmModalClearData] = useState(false);
  const handleCloseConfirmModalClearData = () =>
    setConfirmModalClearData(false);

  useEffect(() => {
    if (!objLogin.existentProfile) {
      setWelcome(true);
      setImgProfile(userImage);
      setImgBanner(bannerImage);
    } else {
      const { galleryActive, galleryImages } = objLogin;
      setNameState(objLogin.profileData.profileFullName);
      setBioState(objLogin.profileData.profileBio);
      setProfileData(objLogin.profileData.socialMedia);
      setIsLinked(objLogin.profileData.isLinked);
      setUsernameLinked(objLogin.profileData.usernameLinked);
      setGallery({ galleryActive, galleryImages });
      setCustomImage(objLogin.customImage);

      /*De no estar guardada la ruta de la imagen, mostramos un icono en fondo gris*/
      if (objLogin.profileData.base64ProfilePhoto === "") {
        setImgProfile(userImage);
      } else {
        /*Sí el registro viene con algo, lo pintamos con la key de s3 de amazon*/
        setImgProfile(
          `${process.env.REACT_APP_API_URL}/render/image/${objLogin.profileData.base64ProfilePhoto}`
        );
      }

      /*Aplicamos la misma validación, verificamos que haya sido guarda la ruta del banner en S3.*/
      if (objLogin.profileData.base64BannerPhoto === "") {
        setImgBanner(bannerImage);
      } else {
        /*Sí ya hay una key, pintamos el banner adjuntado y guardado en DB*/
        setImgBanner(
          `${process.env.REACT_APP_API_URL}/render/image/${objLogin.profileData.base64BannerPhoto}`
        );
      }

      //Aquí guardo si es que el profile tiene alguna red social
      setRows(objLogin.profileData.socialMedia);

      //Guardo data para enviar al change password
      setName(objLogin.user);
      setEmail(objLogin.email);
      setSerialNumber(objLogin.serialNumber);
    }
  }, []);

  //Esta función va a guardar cada vez que se cambie algo en los campos de RRSS
  const handleOnChange = (index, name, value) => {
    const copyRows = [...rows];
    copyRows[index] = {
      ...copyRows[index],
      [name]: value,
    };
    setRows(copyRows);
  };

  //Función que guarda una fila nueva cada vez que se seleccione una opción nueva de RRSS
  const handleOnAdd = (e) => {
    //Aquí valido que si eligen choose your media no se agregue nada
    if (e.target.value !== "") {
      //el campo CustomURL va a guardar otro dato -> el nombre del link
      //Entonces dependiendo de la red social elegida digo si va a guardar ese dato extra o no
      if (e.target.value === "CustomURL" || e.target.value === "CustomText") {
        setRows(
          rows.concat({
            socialNetwork: e.target.value,
            profile: "",
            linkName: "",
          })
        );
      } else {
        setRows(
          rows.concat({
            socialNetwork: e.target.value,
            profile: "",
          })
        );
      }
    }
  };

  //Función que elimina una fila determinada.
  const handleOnRemove = (index) => {
    const copyRows = [...rows];
    copyRows.splice(index, 1);
    setRows(copyRows);
  };

  const handleNameChange = (e) => {
    setNameState(e.target.value);
  };

  const handleBioChange = (e) => {
    setBioState(e.target.value);
  };

  //Función que convierte imágenes a base64
  const reader = new FileReader();
  reader.onloadend = () => {
    // use a regex to remove data url part
    const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

    setImgProfile(`data:image/jpeg;base64,${base64String}`);
  };

  const reader2 = new FileReader();
  reader2.onloadend = () => {
    // use a regex to remove data url part
    const base64String2 = reader2.result
      .replace("data:", "")
      .replace(/^.+,/, "");

    setImgBanner(`data:image/jpeg;base64,${base64String2}`);
  };

  //Función que borra todas las rrss del perfil
  const clearData = () => {
    setRows([]);
    setNameState("");
    setBioState("");
    setImgProfile(userImage);
    setImgBanner(bannerImage);
    setImgProfileToUpload("");
    setImgBannerToUpload("");

    //Notificación data borrada exitosamente
    enqueueSnackbar("Data was cleared succesfully!", {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  //Esta función valida que no hayan redes sociales en blanco
  const noBlankSpaces = () => {
    return rows.some(function (el) {
      return el.profile === "";
    });
  };

  //Función submit para guardar/modificar el profile según se requiera
  const onSubmit = () => {
    setDisabledButton(true);

    //Guardamos el payload con los valores que el backend necesita
    // const payload = {
    //   profileFullName: nameState,
    //   base64ProfilePhoto: imgProfileToUpload,
    //   base64BannerPhoto: imgBannerToUpload,
    //   profileBio: bioState,
    //   socialMedia: rows,
    //   sendNotifications: objLogin.sendNotifications,
    //   isLinked: objLogin.isLinked,
    //   usernameLinked: objLogin.usernameLinked,
    // };

    //Revisamos que no hayan espacios en blanco en los campos de RRSS
    const checkFields = noBlankSpaces();

    /*Debemos mandar el arreglo de objetos de redes sociales
     * como un string y en el backend, lo convertimos a JSON con JSON.parse()*/
    const rowsSocialMedia = JSON.stringify(rows);

    let formData = new FormData();
    formData.append("profileFullName", nameState);
    formData.append("base64ProfilePhoto", imgProfileToUpload);
    formData.append("base64BannerPhoto", imgBannerToUpload);
    formData.append("profileBio", bioState);
    formData.append("socialMedia", rowsSocialMedia);
    formData.append("sendNotifications", objLogin.sendNotifications);
    formData.append("isLinked", objLogin.isLinked);
    formData.append("usernameLinked", objLogin.usernameLinked);

    if (checkFields === true) {
      setDisabledButton(false);

      //Enviar mensaje de error
      enqueueSnackbar("Can't save a social network without profile", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else if (nameState === "") {
      setDisabledButton(false);

      //Enviar mensaje de error
      enqueueSnackbar("Profile Fullname is required", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else if (!objLogin.existentProfile) {
      //Si existentProfile es false, quiere decir que no existe un perfil guardado para este usuario
      //Eso quiere decir que le pega al servicio de saveProfileUserData
      axios
        .post("/users/saveProfileUserData", formData)
        .then((res) => {
          const { ok, msg } = res.data;

          if (ok === true) {
            setDisabledButton(false);
            //Activar al usuario para que pueda modificar luego de la primera inserción en la BBDD
            setExistentProfile(true);

            //Enviar mensaje de éxito
            enqueueSnackbar("Profile saved succesfully", {
              variant: "success",
              autoHideDuration: 2000,
            });
          } else {
            setDisabledButton(false);

            //Enviar mensaje de error
            enqueueSnackbar("An error occurred. Please try again!", {
              variant: "error",
              autoHideDuration: 2000,
            });
          }
        })
        .catch((error) => {
          const { msg } = error.response.data;
          setDisabledButton(false);

          //Enviar mensaje de error
          enqueueSnackbar(
            msg ? msg : "Please close this session and login again.",
            {
              variant: "error",
              autoHideDuration: 2000,
            }
          );
        });
    } else {
      //Si existentProfile es true, quiere decir que no existe un perfil guardado para este usuario
      //Eso quiere decir que le pega al servicio de updateProfileUserData
      axios
        .post("/users/updateProfileUserData", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          const { ok, msg } = res.data;

          if (ok === true) {
            setDisabledButton(false);

            //Enviar mensaje de éxito
            enqueueSnackbar("Changes have been updated!", {
              variant: "success",
              autoHideDuration: 2000,
            });
          } else {
            setDisabledButton(false);

            //Enviar mensaje de error
            enqueueSnackbar("An error occurred. Please try again!", {
              variant: "error",
              autoHideDuration: 2000,
            });
          }
        })
        .catch((error) => {
          const { msg } = error.response.data;
          setDisabledButton(false);

          //Enviar mensaje de error
          enqueueSnackbar(
            msg ? msg : "Please close this session and login again.",
            {
              variant: "error",
              autoHideDuration: 2000,
            }
          );
        });
    }
  };
  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        {/* Body 2 */}
        <div style={{ backgroundColor: "#fff", width: "100%" }}>
          <Grid container>
            {/* Body 1.1 */}
            <Grid item xs={12} marginTop={8}>
              {/* Inicio de formulario para editar información. */}
              <NoDynamicForm
                nameState={nameState}
                bioState={bioState}
                handleNameChange={handleNameChange}
                handleBioChange={handleBioChange}
                imgProfile={imgProfile}
                setImgProfile={setImgProfile}
                imgBanner={imgBanner}
                setImgBanner={setImgBanner}
                imgProfileToUpload={imgProfileToUpload}
                setImgProfileToUpload={setImgProfileToUpload}
                imgBannerToUpload={imgBannerToUpload}
                setImgBannerToUpload={setImgBannerToUpload}
                setImgProfileSize={setImgProfileSize}
                setImgBannerSize={setImgBannerSize}
                handleOnAdd={handleOnAdd}
                reader={reader}
                reader2={reader2}
              />
              {/* Social media selector */}
              <Grid>
                {rows.length > 0 ? (
                  <Divider sx={{ marginY: 3 }}>
                    <Chip color="info" label="Social Network Options" />
                  </Divider>
                ) : null}
                {rows.map((row, index) => (
                  <Row
                    {...row}
                    onChange={(name, value) => {
                      handleOnChange(index, name, value);
                    }}
                    onRemove={() => handleOnRemove(index)}
                    key={index}
                    view={1}
                  />
                ))}
              </Grid>
              {/* </ThemeProvider> */}
            </Grid>

            {/* Body 1.2 - Buttons */}
            <Grid item xs={12} marginTop={3} marginBottom={1}>
              {/*Loading progress bar */}
              {disabledButton ? <LinearProgress sx={{ mb: 3 }} /> : <></>}

              <Button
                onClick={() => onSubmit()}
                disabled={disabledButton}
                fullWidth
                variant="contained"
              >
                Save changes
              </Button>
            </Grid>
            <Grid item xs={5.5}>
              <Button
                // type="submit"
                fullWidth
                color="success"
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                onClick={() => setOpenLivePreview(true)}
              >
                {/* <RemoveRedEyeTwoToneIcon sx={{ fontSize: 15 }} /> */}
                Live Preview
              </Button>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={5.5}>
              <Button
                type="submit"
                fullWidth
                color="inherit"
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                onClick={() => setConfirmModalClearData(true)}
              >
                Clear Data
              </Button>
            </Grid>
          </Grid>
        </div>

        {/*Modal de Live Preview de Profile */}
        <ModalLivePreview
          username={username}
          openLivePreview={openLivePreview}
          setOpenLivePreview={setOpenLivePreview}
          handleCloseLivePreview={handleCloseLivePreview}
          imgProfile={imgProfile}
          imgBanner={imgBanner}
          // imgBannerToUpload={imgBannerToUpload}
          // imgProfileToUpload={imgProfileToUpload}
          nameState={nameState}
          bioState={bioState}
          rows={rows}
          convertStringWithPlus={convertStringWithPlus}
          copyTextToClipboard={copyTextToClipboard}
          copyToClipboard={copyToClipboard}
          enqueueSnackbar={enqueueSnackbar}
        />

        {/*Modal de Session Over */}
        <ModalSessionOver
          sessionOver={sessionOver}
          handleCloseSessionOver={handleCloseSessionOver}
        />

        {/*Modal Inicio de Sesión Primer Perfil */}
        <ModalWelcomeFirstSetup
          welcome={welcome}
          handleCloseWelcome={handleCloseWelcome}
        />

        {/*Modal Inicio de Sesión Primer Perfil */}
        <ModalConfirmClearData
          confirmModalClearData={confirmModalClearData}
          handleCloseConfirmModalClearData={handleCloseConfirmModalClearData}
          clearData={clearData}
        />
      </ThemeProvider>
    </>
  );
};
