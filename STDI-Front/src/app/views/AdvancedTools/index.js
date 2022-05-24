import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import {
  Container,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  LinearProgress,
  CircularProgress,
  Backdrop,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { AppContext } from "../../../components/AppContext";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import { useSnackbar } from "notistack";

//Importación de componentes hijos
import GpsNotifications from "./ChildrenComponent/GpsNotifications";
import ConnectAcount from "./ChildrenComponent/ConnectAcount";
import GalleryStatus from "./ChildrenComponent/GalleryStatus";
import GalleryImages from "./ChildrenComponent/GalleryImages";
import GallerySetup from "./ChildrenComponent/GallerySetup";
import CustomImageList from "./ChildrenComponent/CustomImageList";
import CustomImageSetup from "./ChildrenComponent/CustomImageSetup";

const theme = createTheme();

export const AdvancedTools = () => {
  const { objLogin, setGPSNotificationsSelectedContext } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  
  // useState para abrir modal de customImage
  const [openCustomImageSetup, setOpenCustomImageSetup] = useState(false)
  const handleCloseCustomImageSetup = () => setOpenCustomImageSetup(false);

  // useState para abrir modal de saveCustomImage
  const [openSaveCustomImage, setOpenSaveCustomImage] = useState(false)
  const handleCloseSaveCustomImage = () => setOpenSaveCustomImage(false);

  // Hook usado para guardar las imagenes de los customImage
  const [customImageToRender, setCustomImageToRender] = useState([]);
  

  //uso este servicio para validar que haya token en la petición
  //Con esto evitamos que si se cae el token o el objLogin o se recarga la página pueda funcionar el front
  // useEffect(() => {
  //   axios
  //     .get("/users/getProfileUserData")
  //     .then((res) => {
  //       const { ok } = res.data;
  //       console.log('This session is over');

  //       // if (!ok) {
  //       //   Swal.fire({
  //       //     title: "This session is over",
  //       //     text: "Please login again",
  //       //     icon: "error",
  //       //     confirmButtonText: "OK",
  //       //   }).then((result) => {
  //       //     history.push("/");
  //       //   });
  //       // }
  //     })
  //     .catch((error) => {
  //       // Swal.fire({
  //       //   title: "This session is over",
  //       //   text: "Please login again",
  //       //   icon: "error",
  //       //   confirmButtonText: "OK",
  //       // }).then((result) => {
  //       //   history.push("/");
  //       // });
  //       console.log('Errooorr');
  //     });
  // }, []);

  useEffect(() => {
    // setCustomImage(objLogin.customImage);
    setCustomImageToRender(objLogin.customImage);
  }, [])

  return (
    <>
      {/*Barra de tareas */}
      <Navbar />

      {/*En caso de que se esté consumiendo algún servicio se activa este loading en página completa*/}
      {loading ? (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <Container>
            <Grid container>
              <Grid item xs={12} textAlign="center">
                {/* <CircularProgress color="inherit" sx={{ mt: 2 }} /> */}
                <LinearProgress color="info" sx={{ mt: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ textAlign: "center" }}
                  gutterBottom
                >
                  Saving your changes...
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Backdrop>
      ) : null}

      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 9,
              display: "flex",
              flexDirection: "column",
              //   alignItems: "center",
            }}
          >
            
            <Alert variant="outlined" severity="info">
              In this area you can add more advanced tools such as customizing
              your profile buttons, adding a photo gallery, and sub functions
              that will be explained when activating each function.
            </Alert>
          </Box>
          <Box
            sx={{
              marginTop: 3,
              //   display: "flex",
              //   flexDirection: "column",
              //   alignItems: "center",
            }}
          >
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {/* Componente hijo para activar o desactivar las notificacions de geolocalización */}
              <GpsNotifications setLoading={setLoading} />

              <Divider component="li" />

              {/* Componente hijo para activar o desactivar la conexión a otro perfil */}
              <ConnectAcount />

              <Divider component="li" />

              {/*Componente hijo para activar o desactivar la galería */}
              <GalleryStatus setLoading={setLoading} />

              {/*Componente hijo para activar o desactivar la galería */}
              <GalleryImages />

              {/*Componente hijo para configurar nueva galería */}
              <GallerySetup />

              <Divider component="li" />

              
              {/* Revisar */}
            <CustomImageList 
                openCustomImageSetup={openCustomImageSetup}              
                handleCloseCustomImageSetup={handleCloseCustomImageSetup}
                customImageToRender={customImageToRender} 
                setCustomImageToRender={setCustomImageToRender}
                setOpenCustomImageSetup={setOpenCustomImageSetup}                
              />
              {/* Seleccionar imagenes */}
              <CustomImageSetup 
                openSaveCustomImage={openSaveCustomImage}              
                handleCloseSaveCustomImage={handleCloseSaveCustomImage}
                setCustomImageToRender={setCustomImageToRender}
                setOpenSaveCustomImage={setOpenSaveCustomImage}
              />
            </List>
            

            {/* <FormControlLabel
                disabled
                control={<Switch />}
                label="Disabled"
              /> */}
          </Box>
          {/* Modals */}
        </Container>
      </ThemeProvider>
    </>
  );
};
