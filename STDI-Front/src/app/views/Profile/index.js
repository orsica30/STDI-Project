import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import history from "../../../components/History";
import { styled } from "@mui/material/styles";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Grid,
  Paper,
  Container,
  Skeleton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import QRCode from "qrcode.react";
import helpers from "../../../components/Helpers";
import Footer from "../../../components/Footer";

//Íconos
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";

//Imágenes por default si el cliente no tiene imágenes guardadas
import userImage from "../../../assets/images/default-user-image.png";
import bannerImage from "../../../assets/images/default-user-banner.jpg";

//Componentes hijos
import ModalError from "./ChildrenComponent/ModalError";
import SocialNetworkButtons from "./ChildrenComponent/SocialNetworkButtons";
import Gallery from "./ChildrenComponent/Gallery";
import ModalShareLink from "./ChildrenComponent/ModalShareLink";

//Estilo modal CustomText
const styleModalCustomText = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: "2px",
  boxShadow: 24,
  p: 3,
};

const ItemSocialNetwork = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ItemCustomButton = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const { convertStringWithPlus, copyTextToClipboard, copyToClipboard } = helpers;

export const Profile = ({ location }) => {
  const { pathname } = location;
  const username = pathname.replace("/", "");

  const { enqueueSnackbar } = useSnackbar();

  // Valores iniciales
  const [loadingProfileData, setLoadingProfileData] = useState(true); //Animación cargando datos de perfil
  const [profileDataOK, setProfileDataOk] = useState(true);
  const [nameState, setNameState] = useState("");
  const [bioState, setBioState] = useState("");
  const handleCloseLoading = () => setLoadingProfileData(false);
  const [sessionOver, setSessionOver] = useState(false);
  const handleCloseSessionOver = () => setSessionOver(false);
  const [profileData, setProfileData] = useState([]); //Este de momento no se usa
  const [customImage, setCustomImage] = useState([]);
  const [isLinked, setIsLinked] = useState(false);
  const [usernameLinked, setUsernameLinked] = useState("");
  const [profileActive, setProfileActive] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(false);

  //Declaro el estado del arreglo inicial que va a guardar las RRSS seleccionadas
  const [rows, setRows] = useState([]);

  /*Con estos estados manejamos cuando adjuntamos una imagen la convertimos en base64 para pintarlas
   *en la vista. También cuando el servicio(getProfileUserData) se encarga de mostrar
   *la ruta de la imagen*/
  const [imgProfile, setImgProfile] = useState("");
  const [imgBanner, setImgBanner] = useState("");
  const [gallery, setGallery] = useState(null);

  //Hooks modal error al cargar
  const [openModalError, setOpenModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseModalError = () => setOpenModalError(false);

  //Hooks modal share Link
  const [openModalShareLink, setOpenModalShareLink] = useState(false);
  const handleCloseModalShareLink = () => setOpenModalShareLink(false);

  const payload = {
    username: username /*Puede ser el usuario o el nro de serial*/,
  };

  useEffect(() => {
    axios
      .post("/users/usernameData", payload)
      .then((res) => {
        
        const { ok, msg, data, email, gallery, customImage, active, username } =
          res.data; 

        if (ok && msg === "Username Profile Data found.") {
          setLoadingProfileData(false);
          setProfileDataOk(true);
          setNameState(data.profileFullName);
          setBioState(data.profileBio);
          setProfileData(data.socialMedia);
          setGallery(gallery);
          setIsLinked(data.isLinked);
          setUsernameLinked(data.usernameLinked);
          setCustomImage(customImage);
          setProfileActive(active);
          setSendNotifications(data.sendNotifications);
          console.log("Send notifications en api inicial", data.sendNotifications);
          setErrorMessage("");

          //Hacemos un if para ver si galería existe
          // ya que puede venir en null si el uusario no tiene galería guardada
          // if(gallery === null){
          //   console.log
          //   setGallery(null);
          // }else{
          //   const { galleryActive, galleryImages } = gallery;
          //   setGallery({ galleryActive, galleryImages });
          // }

          /*De no estar guardada la ruta de la imagen, mostramos un icono en fondo gris*/
          if (data.base64ProfilePhoto === "") {
            setImgProfile(userImage);
          } else {
            /*Sí el registro viene con algo, lo pintamos con la key de s3 de amazon*/
            setImgProfile(
              `${process.env.REACT_APP_API_URL}/render/image/${data.base64ProfilePhoto}`
            );
          }

          /*Aplicamos la misma validación, verificamos que haya sido guarda la ruta del banner en S3.*/
          if (data.base64BannerPhoto === "") {
            setImgBanner(bannerImage);
          } else {
            /*Sí ya hay una key, pintamos el banner adjuntado y guardado en DB*/
            setImgBanner(
              `${process.env.REACT_APP_API_URL}/render/image/${data.base64BannerPhoto}`
            );
          }

          //Aquí guardo si es que el profile tiene alguna red social
          setRows(data.socialMedia);

          //Ejecutamos la función que envía el correo si sendNotificacions es true
          //Envío el valor a ver si se va a enviar correo o no
          if (data.sendNotifications) {
            //Si el valor que recibe es true entonces enviamos el correo
            navigator.geolocation.getCurrentPosition(function (position) {
              // console.log("Latitude is :", position.coords.latitude);
              // console.log("Longitude is :", position.coords.longitude);
      
              const payloadToSendNotifications = {
                to: email,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
      
              // console.log(payloadToSendNotifications);
      
              axios
                .post("email/sendNotification", payloadToSendNotifications)
                .then((res) => {
                  if (res.data.ok === true) {
                    enqueueSnackbar("Notification was sent!", {
                      variant: "success",
                      autoHideDuration: 2000,
                    });
                  } else {
                    enqueueSnackbar("Notification was not sent. Try again!", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });
                  }
                })
                .catch((error) => {
                  enqueueSnackbar("An error occurred.", {
                    variant: "error",
                    autoHideDuration: 2000,
                  });
                });
            });
          }

          //Guardo data para enviar al change password
          //   setName(objLogin.user);
          //   setEmail(objLogin.email);
          //   setSerialNumber(objLogin.serialNumber);
        } else {
          // console.log("Estoy llegando acá");
          setOpenModalError(true);
        }
      })
      .catch((e) => {
        setLoadingProfileData(false);

        //Si da error o el usuario no tiene perfil guardado
        //Le cargamos por defecto imagen de perfil y banner gris
        setImgProfile(userImage);
        setImgBanner(bannerImage);

        if (e.response === undefined) {
          setProfileDataOk(false);
          setOpenModalError(true);
          return false;
        }
        const { msg, ok } = e.response.data;
        if (!ok && msg === "User does not exist.") {
          setProfileDataOk(false);
          setErrorMessage(msg);
          setOpenModalError(true);
          return false;
        }

        if (!ok && msg === "Error 404. User Profile wasn't found.") {
            setProfileDataOk(false);
            setErrorMessage(msg);
            setOpenModalError(true);
            return false;
          }

          if (!ok && msg === "User is not active") {
            setProfileDataOk(false);
            setErrorMessage(msg);
            setProfileActive(false);
            setOpenModalError(true);
            return false;
          }
      });
  }, []);

  return (
    <>
      {loadingProfileData ? ( //Cargando Inicial
        <>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={200}
          />

          <Stack
            direction="row"
            spacing={2}
            marginY={2}
            justifyContent="center"
            sx={{
              marginTop: "-60px",
              // "&::before": {
              //   marginTop: "5px",
              //   position: "absolute",
              //   fontSize: "10px",
              //   content: '"Loading..."',
              // },
            }}
          >
            <Skeleton
              animation="wave"
              variant="circular"
              sx={{
                width: 120,
                height: 120,
              }}
            />
          </Stack>

          {/*Aquí vienen las RRSS */}
          <Container sx={{ mt: 3 }}>
            <Box sx={{ flexGrow: 1 }} mr={2} ml={2}>
              <Grid item xs={12}>
                <Skeleton variant="text" />
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Skeleton variant="rectangular" height={50} />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Skeleton variant="rectangular" height={70} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="rectangular" height={70} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="rectangular" height={70} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ mt: 3, mb: 3 }}>
                <Skeleton variant="rectangular" height={70} />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Skeleton variant="rectangular" height={90} />
                </Grid>
                <Grid item xs={6}>
                  <Skeleton variant="rectangular" height={90} />
                </Grid>
              </Grid>
            </Box>
          </Container>
        </>
      ) : !loadingProfileData && profileDataOK && profileActive ? ( 
        //Mostrar perfil cumpliendo con condiciones
        //loadingProfileData apagado
        //profileDataOK si es que cargó bien la data del servicio
        //profileActive que el perfil se encuentre activo
        <>
          <Box
            component="img"
            sx={{
              height: 200,
              width: 1,
            }}
            alt="banner image"
            src={imgBanner}
          />
          <Stack
            direction="row"
            spacing={2}
            marginY={2}
            justifyContent="center"
            sx={{
              marginTop: "-60px",
              // "&::before": {
              //   marginTop: "5px",
              //   position: "absolute",
              //   fontSize: "10px",
              //   content: '"Loading..."',
              // },
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src={imgProfile}
              sx={{
                width: 120,
                height: 120,
              }}
            />
          </Stack>

          <Typography
            variant="overline"
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
              fontWeight: "bold",
            }}
          >
            {errorMessage === "Error 404. User Profile wasn't found."  ?  "test" : nameState}
          </Typography>

          <Typography
            variant="overline"
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
              whiteSpace: "pre-wrap",
            }}
          >
            {bioState}
          </Typography>

          {/*EMBED YOUTUBE VIDEO*/}
          {rows.map((row, index) =>
            row.socialNetwork === "Embed Youtube Video" ? (
              <Container sx={{ mt: 3 }}>
                <Box sx={{ flexGrow: 1 }} mr={2} ml={2}>
                  <iframe
                    width="100%"
                    height="200"
                    src={"https://www.youtube.com/embed/" + row.profile}
                  ></iframe>
                </Box>
              </Container>
            ) : null
          )}

          {/*Botones Redes Sociales*/}
          <Container sx={{ mt: 3 }}>
            <SocialNetworkButtons
              rows={rows}
              customImage={customImage}
              styleModalCustomText={styleModalCustomText}
              convertStringWithPlus={convertStringWithPlus}
              copyTextToClipboard={copyTextToClipboard}
              ItemSocialNetwork={ItemSocialNetwork}
              ItemCustomButton={ItemCustomButton}
              enqueueSnackbar={enqueueSnackbar}
            />

            {/* Galería de imágenes */}
            <Gallery gallery={gallery} />

            <Box
              sx={{ flexGrow: 1, textAlign: "center" }}
              mt={3}
              mr={2}
              ml={2}
              mb={3}
            >
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <QRCode
                    id="QR"
                    value={"https://profile.stdicompany.com/" + username}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={() => {
                      copyToClipboard(username);
                      //Notificación data copiada
                      enqueueSnackbar("Data was copied to clipboard!", {
                        variant: "success",
                        autoHideDuration: 2000,
                      });
                    }}
                  >
                    <ContentCopyTwoToneIcon
                      color="info"
                      sx={{ fontSize: 20, mr: 1 }}
                    />{" "}
                    Copy Link
                  </Button>
                  <Button onClick={() => setOpenModalShareLink(true)}>
                    <ShareTwoToneIcon
                      color="info"
                      sx={{ fontSize: 20, mr: 1 }}
                    />{" "}
                    Share Link
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
          <Footer />
        </>
      ) : !profileActive ? (
        <Grid>
          <Typography>User is not active</Typography>
        </Grid>
      ) : (
        <Grid>
          <Typography>Error 404</Typography>
        </Grid>
      )}

      

      {/*Modal Error*/}
      <ModalError
        openModalError={openModalError}
        errorMessage={errorMessage}
        history={history}
      />

      {/*Modal Share Link */}
      <ModalShareLink
        styleModalCustomText={styleModalCustomText}
        handleCloseModalShareLink={handleCloseModalShareLink}
        openModalShareLink={openModalShareLink}
        usernameURL={"https://profile.stdicompany.com/" + username}
      />
    </>
  );
};
