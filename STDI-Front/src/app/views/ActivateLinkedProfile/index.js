import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import history from "../../../components/History";
import {
  LinearProgress,
  Container,
  Backdrop,
  Grid,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AnnouncementTwoToneIcon from "@mui/icons-material/AnnouncementTwoTone";

//Se crea el tema de plantilla preconfigurado por Material UI para obtener el diseño del Login-----------------
const theme = createTheme();

export const ActivateLinkedProfile = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { pathname } = location;
  const username = pathname.replace("/activateLinkedProfile/", "");
  const payloadToActivateLinkedProfile = {
    usernameToActivateLink: username,
  };

  //Función para cerrar la pestaña activa
  const closeTab = () => {
    setTimeout(function () {
      window.close();
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .post("users/activateLinkingProfile", payloadToActivateLinkedProfile)
      .then((res) => {
        setLoading(false);
        const { ok, msg } = res.data;

        if (ok && msg === "Linked profile enabled succesfully") {
          enqueueSnackbar(msg, {
            variant: "success",
            autoHideDuration: 3000,
          });

          closeTab();
        } else {
          enqueueSnackbar(msg, {
            variant: "error",
            autoHideDuration: 3000,
          });

          closeTab();
        }
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("An error occured. Try again!", {
          variant: "error",
          autoHideDuration: 3000,
        });
        closeTab();
      });
  }, []);
  return (
    <>
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
                  Activating connection to requested user...
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Backdrop>
      ) : (
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ mt: 25 }}>
            <Grid item xs={12} textAlign="center">
              <Typography>
                <AnnouncementTwoToneIcon color="info" sx={{ fontSize: 70 }} />
              </Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ mt: 1, textAlign: "center" }}
              >
                Tab will be closed in a few seconds
              </Typography>
              <LinearProgress sx={{ mt: 2 }} />
              <Typography
                variant="caption"
                display="block"
                sx={{ textAlign: "center" }}
                gutterBottom
              >
                Closing tab...
              </Typography>
            </Grid>
          </Grid>
        </ThemeProvider>
      )}
    </>
  );
};
