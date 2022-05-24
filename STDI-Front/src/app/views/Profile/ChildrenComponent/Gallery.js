import React from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Button,
  Grid,
  Container,
} from "@mui/material";

//Librería Carousel
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

const Gallery = ({ gallery }) => {
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
  return (
    <>
      {gallery && gallery.galleryActive? (
        <Box sx={{ flexGrow: 1, textAlign: "center" }} mt={3} mr={2} ml={2}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Carousel
                ssr
                arrows
                itemClass="image-item"
                responsive={responsiveCarouselImageProfile}
                infinite={false}
                autoPlay={false}
                shouldResetAutoplay={false}
              >
                {gallery.galleryImages.map((element, index) => (
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
                ))}
              </Carousel>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </>
  );
};

export default Gallery;
