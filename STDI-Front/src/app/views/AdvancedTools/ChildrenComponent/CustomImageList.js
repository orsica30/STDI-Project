import {
  Modal,
  Fade,
  Box,
  Typography,
  Grid,
  styled,
  Paper,
  Button,
  Alert,
  IconButton,
  ListItem,
  ListItemText,
  Backdrop,
  Container,
  LinearProgress
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../../../components/AppContext";
import ImageIcon from "@mui/icons-material/Image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useSnackbar } from "notistack";

const styleModal = {
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

const ItemCustomButton = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const responsiveCarouselImageProfile = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    paritialVisibilityGutter: 60,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    paritialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 10,
  },
};

const CustomImageList = ({
  openCustomImageSetup,
  handleCloseCustomImageSetup,
  customImageToRender,
  setCustomImageToRender,
  setOpenCustomImageSetup,
}) => {
  // const [customImage, setCustomImage] = useState([]);

  //Hooks modal custom Image
  const [openModalCustomImage, setOpenModalCustomImage] = useState(false);
  const [modalCustomImageTitle, setModalCustomImagetitle] = useState("");
  const [modalCustomImagePhotos, setModalCustomImagePhotos] = useState([]);
  const handleCloseModalCustomImage = () => setOpenModalCustomImage(false);
  const [loading, setLoading] = useState(false)

  //función que maneja el open de modal custom image
  const handleOpenModalCustomImage = (text, imagesArray) => {
    setModalCustomImagetitle(text);
    setModalCustomImagePhotos(imagesArray);
    setOpenModalCustomImage(true);
  };

  const { objLogin, setCustomImageContext } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const payload = {
    username: objLogin.username /*Puede ser el usuario o el nro de serial*/,
  };

  // useEffect(() => {
  //   // setCustomImage(objLogin.customImage);
  //   setCustomImageToRender(objLogin.customImage);
  // }, []);

  //Método para eliminar un custom button
  const deleteCustomImageButton = (id) => {
    setLoading(true);

    const payload = {
      idCustomImage: id,
    };

    axios
      .post("/users/deleteCustomImageButton", payload)
      .then((res) => {
        setLoading(false);
        const { ok, msg, customImage } = res.data;
        if (ok && msg === "Custom Image Button was removed succesfully") {
          enqueueSnackbar(msg, {
            variant: "success",
            autoHideDuration: 3000,
          });

          //Esta función guarda en el AppContext los botones restantes
          //resultado de eliminar el custom Image Button previamente seleccionado
          setCustomImageContext(customImage);
          setCustomImageToRender(customImage);
        } else {
          enqueueSnackbar("An error occurred, please try again.", {
            variant: "error",
            autoHideDuration: 3000,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("An error occurred, please try again.", {
          variant: "error",
          autoHideDuration: 3000,
        });
      });
  };

  return (
    <>
      {/*En caso de que se esté consumiendo algún servicio se activa este loading en página completa*/}
      {loading ? (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1000,
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
      <ListItem>
        <ListItemText
          primary="Custom Images"
          secondary="Checkout your custom images button"
        />
        <Button
          variant="outlined"
          disabled={objLogin.customImage === null || objLogin.customImage === []}
          onClick={() => {
            setCustomImageToRender(objLogin.customImage);
            setOpenCustomImageSetup(true);
          }}
        >
          <ViewListIcon />
        </Button>
      </ListItem>
      {/* Aqui comienza el modal */}
      <Modal
        open={openCustomImageSetup}
        onClose={handleCloseCustomImageSetup}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Fade in={openCustomImageSetup}>
          <Box sx={styleModal}>
            <Typography
              textAlign="center"
              id="transition-modal-title"
              variant="h5"
              component="h2"
            >
              Your list of custom images
            </Typography>

            <Alert severity="info" sx={{ mt: 3 }}>
              Tap in your custom image buttons to see whats images are in each
              carousel.
            </Alert>

            {/*Botón CUSTOM IMAGE ---------------------------*/}
            {customImageToRender ? (
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  {customImageToRender.map((element, index) => (
                    <Grid item key={index} xs={12}>
                      {element.customImageActive === true ? (
                        <Grid container marginTop={2}>
                          <Grid xs={11}>
                            <ItemCustomButton>
                              <Button
                                onClick={() =>
                                  handleOpenModalCustomImage(
                                    element.customImageButtonName,
                                    element.arrayWithImagesURL
                                  )
                                }
                              >
                                <ImageIcon color="info" sx={{ mr: 2 }} />{" "}
                                {element.customImageButtonName}
                              </Button>
                            </ItemCustomButton>
                          </Grid>
                          <Grid xs={1} alignSelf="center">
                            <IconButton aria-label="delete">
                              <DeleteIcon
                                onClick={() =>
                                  deleteCustomImageButton(
                                    element.idCustomImageButton
                                  )
                                }
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ) : null}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : null}
            <Grid marginTop={3} display="flex" justifyContent="flex-end">
              <Button onClick={() => setOpenCustomImageSetup(false)}>
                Close
              </Button>
            </Grid>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModalCustomImage}
        onClose={handleCloseModalCustomImage}
      >
        <Fade in={openModalCustomImage}>
          <Box sx={styleModalCustomText}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ mt: 1, mb: 3, textAlign: "center" }}
            >
              {modalCustomImageTitle}
            </Typography>
            <Carousel
              ssr
              arrows
              itemClass="image-item"
              responsive={responsiveCarouselImageProfile}
              infinite={false}
              autoPlay={false}
              shouldResetAutoplay={false}
            >
              {modalCustomImagePhotos.map((element, index) => (
                <Button
                  key={index}
                  onClick={() =>
                    window
                      .open(
                        `${process.env.REACT_APP_API_URL}/render/image/${element.image}`,
                        "_blank"
                      )
                      .focus()
                  }
                >
                  <Box
                    component="img"
                    sx={{
                      // height: 250,
                      width: "100%",
                    }}
                    alt="banner image"
                    src={`${process.env.REACT_APP_API_URL}/render/image/${element.image}`}
                  />
                </Button>
              ))}
            </Carousel>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCloseModalCustomImage();
                    }}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CustomImageList;
