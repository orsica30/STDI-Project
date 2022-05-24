import React, { useState, useContext } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  Box,
  Grid,
  Fade,
  Alert,
} from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import { AppContext } from "../../../../components/AppContext";

//Librería Carousel
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

//Estilo modal CustomText
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

const GalleryImages = () => {
  const { objLogin } = useContext(AppContext);
  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState(objLogin.galleryImages);

  //Función que maneja los clicks del carousel
  //Si tiene url entonces redirije en pestaña nueva
  //Si no tiene url no pasa nada cuando hacen click
  const handleCarouselClick = (url) => {
    if (url === "" || url === undefined || url === false) {
      return false;
    } else {
      window.open(url, "_blank").focus();
    }
  };

  const handleCloseModalGallery = () => setOpenModalGallery(false);
  return (
    <>
      <ListItem>
        <ListItemText
          primary="Gallery Images"
          secondary="Checkout your gallery images"
        />
        <Button variant="outlined" disabled={galleryImages === null} onClick={() => setOpenModalGallery(true)}>
          <CollectionsIcon />
        </Button>
      </ListItem>

      {/*Modal Custom Image */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModalGallery}
        onClose={handleCloseModalGallery}
      >
        <Fade in={openModalGallery}>
          <Box sx={styleModal}>
            {/* <Typography sx={{ textAlign: "center" }}>
      <InfoOutlinedIcon color="info" sx={{ fontSize: 70 }} />
    </Typography> */}
            <Alert severity="info" sx={{ mb: 3 }}>
              These are the images on your last saved gallery.
            </Alert>
            <Carousel
              ssr
              arrows
              itemClass="image-item"
              responsive={responsiveCarouselImageProfile}
              infinite={false}
              autoPlay={false}
              shouldResetAutoplay={false}
            >
              {galleryImages !== null
                ? galleryImages.map((element, index) => (
                    <Button
                      key={index}
                      onClick={() => handleCarouselClick(element.url)}
                    >
                      <Box
                        component="img"
                        sx={{
                          height: 200,
                          width: 1,
                        }}
                        alt="banner image"
                        src={`${process.env.REACT_APP_API_URL}/render/image/${element.image}`}
                      />
                    </Button>
                  ))
                : null}
            </Carousel>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCloseModalGallery();
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

export default GalleryImages;
