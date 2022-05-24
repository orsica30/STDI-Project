import React from "react";
import { Modal, Fade, Box, Typography, Button, Grid } from "@mui/material";

//Íconos
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import TwitterIcon from "../../../../assets/svg/twitter.svg";
import FacebookIcon from "../../../../assets/svg/facebook.svg";
import EmailIcon from "../../../../assets/svg/mail.svg";
import GmailIcon from "../../../../assets/svg/gmail.svg";
import WhatsappIcon from "../../../../assets/svg/whatsapp.svg";
import TelegramIcon from "../../../../assets/svg/telegram.svg";

//Librería Carousel
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

//Cantidad de íconos a mostrar según tamaño de dispositivo
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 4,
    paritialVisibilityGutter: 10,
  },
};

//Botones customizados de carousel
const ButtonGroup = ({ next, previous, ...rest }) => {
  const {
    carouselState: { currentSlide, totalItems, slidesToShow },
  } = rest;

  return (
    <div className="carousel-button-group" style={{ marginTop: "-15px" }}>
      {currentSlide === 0 ? null : (
        <button
          aria-label="Go to previous slide"
          className={
            currentSlide === 0
              ? "disable"
              : "react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
          }
          onClick={() => previous()}
        ></button>
      )}
      {currentSlide !== totalItems - slidesToShow ? (
        <button
          aria-label="Go to next slide"
          className={
            currentSlide === totalItems - slidesToShow
              ? "disable"
              : "react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
          }
          onClick={() => next()}
        ></button>
      ) : null}
    </div>
  );
};

const ModalShareLink = ({
  styleModalCustomText,
  handleCloseModalShareLink,
  openModalShareLink,
  usernameURL,
}) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModalShareLink}
      onClose={handleCloseModalShareLink}
    >
      <Fade in={openModalShareLink}>
        <Box sx={styleModalCustomText}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{ mt: 1, textAlign: "center" }}
          >
            <ShareTwoToneIcon color="info" sx={{ fontSize: 20, mr: 1 }} />
            Share Link
          </Typography>
          <Typography
            id="modal-modal-description"
            variant="subtitle1"
            gutterBottom
            component="div"
            sx={{ mt: 3, textAlign: "center" }}
          >
            <Carousel
              ssr
              arrows={false}
              // deviceType={deviceType}
              // centerMode={true}
              itemClass="image-item"
              responsive={responsive}
              infinite={false}
              autoPlay={false}
              shouldResetAutoplay={false}
              renderButtonGroupOutside={true}
              customButtonGroup={<ButtonGroup />}
            >
              {/* Botón Whatsapp */}
              <Button
                target="_blank"
                href={
                  "https://api.whatsapp.com/send/?phone&text=" +
                  usernameURL +
                  "&app_absent=0"
                }
                data-action="share/whatsapp/share"
              >
                <img width="50" height="50" src={WhatsappIcon} />
              </Button>
              {/* Botón Facebook */}
              <Button
                target="_blank"
                href={"https://www.facebook.com/sharer.php?u='" + usernameURL}
              >
                <img width="50" height="50" src={FacebookIcon} />
              </Button>
              {/* Botón Twitter */}
              <Button
                target="_blank"
                href={"https://twitter.com/intent/tweet?url='" + usernameURL}
              >
                <img width="50" height="50" src={TwitterIcon} />
              </Button>
              {/* Botón Telegram */}
              <Button
                target="_blank"
                href={"https://telegram.me/share/url?url='" + usernameURL}
              >
                <img width="50" height="50" src={TelegramIcon} />
              </Button>

              {/* Botón Mail */}
              <Button
                target="_blank"
                href={
                  "mailto:?subject=Watch my brand new FF Profile&body=Check out this site '" +
                  usernameURL
                }
                title="Share by Email"
              >
                <img width="50" height="50" src={EmailIcon} />
              </Button>

              {/* Botón Gmail */}
              <Button
                target="_blank"
                href={
                  "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=Watch my brand new FF Profile&body=Check out this site " +
                  usernameURL +
                  "&ui=2&tf=1&pli=1"
                }
                title="Share by Gmail"
              >
                <img width="50" height="50" src={GmailIcon} />
              </Button>
            </Carousel>
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleCloseModalShareLink();
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
  );
};

export default ModalShareLink;
