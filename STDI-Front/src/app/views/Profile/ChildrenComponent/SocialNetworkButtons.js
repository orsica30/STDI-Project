import React, { useState } from "react";
import {
  Box,
  Grid,
  Container,
  Button,
  Modal,
  Fade,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
//Importación de íconos redes sociales
import YoutubeIcon from "../../../../assets/svg/youtube.svg";
import InstagramIcon from "../../../../assets/svg/instagram.svg";
import TwitterIcon from "../../../../assets/svg/twitter.svg";
import FacebookIcon from "../../../../assets/svg/facebook.svg";
import LinkedinIcon from "../../../../assets/svg/linkedin.svg";
import SnapchatIcon from "../../../../assets/svg/snapchat.svg";
import AppleMusicIcon from "../../../../assets/svg/apple-music.svg";
import CashappIcon from "../../../../assets/svg/cashapp.svg";
import SoundcloudIcon from "../../../../assets/svg/soundcloud.svg";
import SpotifyIcon from "../../../../assets/svg/spotify.svg";
import TiktokIcon from "../../../../assets/svg/tiktok.svg";
import VenmoIcon from "../../../../assets/svg/venmo.svg";
import PaypalIcon from "../../../../assets/svg/paypal.svg";
import MapPinIcon from "../../../../assets/svg/locationmap.svg";
import EmailIcon from "../../../../assets/svg/mail.svg";
import GmailIcon from "../../../../assets/svg/gmail.svg";
import PhoneIcon from "../../../../assets/svg/phone.svg";
import WhatsappIcon from "../../../../assets/svg/whatsapp.svg";
import TelegramIcon from "../../../../assets/svg/telegram.svg";
import GoFundMeIcon from "../../../../assets/svg/gofundme.svg";
import TwitchIcon from "../../../../assets/svg/twitch.svg";
import OnlyFansIcon from "../../../../assets/svg/onlyfans.svg";
import DiscordIcon from "../../../../assets/svg/discord.svg";
import HousePartyIcon from "../../../../assets/svg/houseparty.svg";
import SmsIcon from "../../../../assets/svg/sms.svg";
import WebsiteIcon from "../../../../assets/svg/website.svg";
import LinkIcon from "@mui/icons-material/Link";
import AbcIcon from "@mui/icons-material/Abc";
import ImageIcon from "@mui/icons-material/Image";

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

const SocialNetworkButtons = ({
  rows,
  customImage,
  styleModalCustomText,
  convertStringWithPlus,
  copyTextToClipboard,
  ItemSocialNetwork,
  ItemCustomButton,
  enqueueSnackbar,
}) => {
  //Hooks modal custom Image
  const [openModalCustomImage, setOpenModalCustomImage] = useState(false);
  const [modalCustomImageTitle, setModalCustomImagetitle] = useState("");
  const [modalCustomImagePhotos, setModalCustomImagePhotos] = useState([]);
  const handleCloseModalCustomImage = () => setOpenModalCustomImage(false);

  //Hooks modal customText
  const [openModalCustomText, setOpenModalCustomText] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  //función que maneja el open de modal custom image
  const handleOpenModalCustomImage = (text, imagesArray) => {
    setModalCustomImagetitle(text);
    setModalCustomImagePhotos(imagesArray);
    setOpenModalCustomImage(true);
  };

  //Función al seleccionar Custom Text abrir el modal
  //y pasarle al modal el título y el texto a desplegar
  const handleOpenModalCustomText = (title, body) => {
    setModalTitle(title);
    setModalBody(body);
    setOpenModalCustomText(true);
  };

  //Función cerrar Modal Custom Text
  const handleCloseModalCustomText = () => {
    setOpenModalCustomText(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} mr={2} ml={2}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
        >
          {rows.map((row, index) =>
            row.socialNetwork !== "CustomURL" &&
            row.socialNetwork !== "CustomText" &&
            row.socialNetwork !== "Embed Youtube Video" ? (
              <Grid item key={index} xs={4}>
                <ItemSocialNetwork>
                  <a
                    // sx={{
                    //   outline: "none !important",
                    //   boxShadow: "none",
                    // }}
                    target="_blank"
                    component="a"
                    href={
                      row.socialNetwork === "Instagram"
                        ? "https://www.instagram.com/" + row.profile
                        : row.socialNetwork === "Snapchat"
                        ? "https://www.snapchat.com/add/" + row.profile
                        : row.socialNetwork === "Whatsapp"
                        ? "https://wa.me/" + row.profile
                        : row.socialNetwork === "Youtube"
                        ? row.profile
                        : row.socialNetwork === "Facebook"
                        ? row.profile
                        : row.socialNetwork === "Soundcloud"
                        ? "https://www.soundcloud.com/add/" + row.profile
                        : row.socialNetwork === "Linkedin"
                        ? row.profile
                        : row.socialNetwork === "TikTok"
                        ? row.profile
                        : row.socialNetwork === "Twitter"
                        ? "https://www.twitter.com/" + row.profile
                        : row.socialNetwork === "Spotify"
                        ? "https://www.spotify.com/" + row.profile
                        : row.socialNetwork === "Apple Music"
                        ? "https://music.apple.com/" + row.profile
                        : row.socialNetwork === "Venmo"
                        ? "https://www.venmo.com/" + row.profile
                        : row.socialNetwork === "CashApp"
                        ? "https://cash.app/$" + row.profile
                        : row.socialNetwork === "Address"
                        ? "https://www.google.com/maps/search/" +
                          convertStringWithPlus(row.profile)
                        : row.socialNetwork === "Phone Number"
                        ? "tel:" + row.profile
                        : row.socialNetwork === "Email"
                        ? "mailto:" + row.profile
                        : row.socialNetwork === "SMS"
                        ? "sms:" + row.profile
                        : row.socialNetwork === "Paypal"
                        ? "https://paypal.com/" + row.profile
                        : row.socialNetwork === "Telegram"
                        ? "https://t.me/" + row.profile
                        : row.socialNetwork === "OnlyFans"
                        ? "https://onlyfans.com/" + row.profile
                        : row.socialNetwork === "GoFundMe"
                        ? row.profile
                        : row.socialNetwork === "Twitch"
                        ? "https://twitch.tv/" + row.profile
                        : row.socialNetwork === "Discord"
                        ? row.profile
                        : row.socialNetwork === "HouseParty"
                        ? "https://houseparty.com/add/" + row.profile
                        : row.profile
                    }
                  >
                    <img
                      src={
                        row.socialNetwork === "Instagram"
                          ? InstagramIcon
                          : row.socialNetwork === "Snapchat"
                          ? SnapchatIcon
                          : row.socialNetwork === "Whatsapp"
                          ? WhatsappIcon
                          : row.socialNetwork === "Youtube"
                          ? YoutubeIcon
                          : row.socialNetwork === "Facebook"
                          ? FacebookIcon
                          : row.socialNetwork === "Soundcloud"
                          ? SoundcloudIcon
                          : row.socialNetwork === "Linkedin"
                          ? LinkedinIcon
                          : row.socialNetwork === "TikTok"
                          ? TiktokIcon
                          : row.socialNetwork === "Twitter"
                          ? TwitterIcon
                          : row.socialNetwork === "Spotify"
                          ? SpotifyIcon
                          : row.socialNetwork === "Apple Music"
                          ? AppleMusicIcon
                          : row.socialNetwork === "Venmo"
                          ? VenmoIcon
                          : row.socialNetwork === "CashApp"
                          ? CashappIcon
                          : row.socialNetwork === "Address"
                          ? MapPinIcon
                          : row.socialNetwork === "Phone Number"
                          ? PhoneIcon
                          : row.socialNetwork === "Email"
                          ? EmailIcon
                          : row.socialNetwork === "SMS"
                          ? SmsIcon
                          : row.socialNetwork === "Paypal"
                          ? PaypalIcon
                          : row.socialNetwork === "Telegram"
                          ? TelegramIcon
                          : row.socialNetwork === "OnlyFans"
                          ? OnlyFansIcon
                          : row.socialNetwork === "GoFundMe"
                          ? GoFundMeIcon
                          : row.socialNetwork === "Twitch"
                          ? TwitchIcon
                          : row.socialNetwork === "Discord"
                          ? DiscordIcon
                          : row.socialNetwork === "HouseParty"
                          ? HousePartyIcon
                          : row.socialNetwork === "Website"
                          ? WebsiteIcon
                          : null
                      }
                      alt={row.socialNetwork}
                    />
                  </a>
                </ItemSocialNetwork>
              </Grid>
            ) : null
          )}
        </Grid>
      </Box>

      {/*Botón CUSTOM URL ---------------------------*/}
      <Box sx={{ flexGrow: 1 }} mt={3} mr={2} ml={2}>
        <Grid container spacing={0}>
          {rows.map((row, index) =>
            row.socialNetwork === "CustomURL" ? (
              <Grid item key={index} xs={12}>
                <ItemCustomButton>
                  <Button target="_blank" href={row.profile}>
                    <LinkIcon sx={{ mr: 2 }} /> {row.linkName}
                  </Button>
                </ItemCustomButton>
              </Grid>
            ) : null
          )}
        </Grid>
      </Box>

      {/*Botón CUSTOM IMAGE ---------------------------*/}
      {customImage ? (
        <Box sx={{ flexGrow: 1 }} mr={2} ml={2}>
          <Grid container spacing={0}>
            {customImage.map((element, index) => (
              <Grid item key={index} xs={12}>
                {element.customImageActive === true ? (
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
                ) : null}
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      {/*Botón CUSTOM TEXT ---------------------------*/}
      <Box sx={{ flexGrow: 1 }} mr={2} ml={2}>
        <Grid container spacing={0}>
          {rows.map((row, index) =>
            row.socialNetwork === "CustomText" ? (
              <Grid item key={index} xs={12}>
                <ItemCustomButton>
                  <Button
                    onClick={() =>
                      handleOpenModalCustomText(row.linkName, row.profile)
                    }
                  >
                    <AbcIcon sx={{ mr: 2 }} /> {row.linkName}
                  </Button>
                </ItemCustomButton>
              </Grid>
            ) : null
          )}
        </Grid>
      </Box>

      {/*Modal Custom Image */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModalCustomImage}
        onClose={handleCloseModalCustomImage}
      >
        <Fade in={openModalCustomImage}>
          <Box sx={styleModalCustomText}>
            {/* <Typography sx={{ textAlign: "center" }}>
          <InfoOutlinedIcon color="info" sx={{ fontSize: 70 }} />
        </Typography> */}
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

      {/*Modal Custom Text */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModalCustomText}
        onClose={handleCloseModalCustomText}
      >
        <Fade in={openModalCustomText}>
          <Box sx={styleModalCustomText}>
            {/* <Typography sx={{ textAlign: "center" }}>
              <InfoOutlinedIcon color="info" sx={{ fontSize: 70 }} />
            </Typography> */}
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ mt: 1, textAlign: "center" }}
            >
              {modalTitle}
            </Typography>
            <Typography
              id="modal-modal-description"
              variant="subtitle1"
              gutterBottom
              component="div"
              sx={{ mt: 2, textAlign: "center" }}
            >
              {modalBody}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  {" "}
                  <Button
                    sx={{ mr: 3 }}
                    variant="contained"
                    onClick={() => {
                      copyTextToClipboard(modalBody);
                      handleCloseModalCustomText();
                      //Notificación data copiada
                      enqueueSnackbar("Data was copied to clipboard!", {
                        variant: "success",
                        autoHideDuration: 2000,
                      });
                    }}
                  >
                    Copy Text
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCloseModalCustomText();
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

export default SocialNetworkButtons;
