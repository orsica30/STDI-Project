import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
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
// import { TreeView, TreeItem } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { AppContext } from "../../../../components/AppContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import LinkIcon from "@mui/icons-material/Link";
import AbcIcon from "@mui/icons-material/Abc";
import ImageIcon from "@mui/icons-material/Image";

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
import QRCode from "qrcode.react";

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

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  overflow: "scroll", //para que funcione el scroll
  boxShadow: 24,
  p: 3,
  margin: "auto",
};

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

const ModalLivePreview = ({
  username,
  openLivePreview,
  setOpenLivePreview,
  handleCloseLivePreview,
  imgProfile,
  imgBanner,
  // imgBannerToUpload,
  // imgProfileToUpload,
  nameState,
  bioState,
  rows,
  convertStringWithPlus,
  copyTextToClipboard,
  copyToClipboard,
  enqueueSnackbar,
}) => {
  //Hook array variables de sesión
  const { objLogin } = useContext(AppContext);

  //Hooks modal customText
  const [openModalCustomText, setOpenModalCustomText] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  //Hook lazy loading (Skeleton)
  const [openSkeleton, setOpenSkeleton] = useState(false);

  //Hooks modal share Link
  const [openModalShareLink, setOpenModalShareLink] = useState(false);
  const handleCloseModalShareLink = () => setOpenModalShareLink(false);

  //Hooks modal custom Image
  const [openModalCustomImage, setOpenModalCustomImage] = useState(false);
  const [modalCustomImageTitle, setModalCustomImagetitle] = useState("");
  const [modalCustomImagePhotos, setModalCustomImagePhotos] = useState([]);
  const handleCloseModalCustomImage = () => setOpenModalCustomImage(false);

  useEffect(() => {
    setOpenSkeleton(true);
    // console.log(objLogin);
    setTimeout(function () {
      setOpenSkeleton(false);
    }, 3000);
  }, []);

  //Constante que guarda la url completa del perfil
  const usernameURL = "https://profile.stdicompany.com/" + username;

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

  //función que maneja el open de modal custom image
  const handleOpenModalCustomImage = (text, imagesArray) => {
    setModalCustomImagetitle(text);
    setModalCustomImagePhotos(imagesArray);
    setOpenModalCustomImage(true);
  };

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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openLivePreview}
        onClose={handleCloseLivePreview}
        // closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{
        //   timeout: 500,
        // }}
      >
        <Fade in={openLivePreview}>
          <Box sx={styleModal}>
            {openSkeleton ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={200}
              />
            ) : (
              <Box
                component="img"
                sx={{
                  height: 200,
                  width: 1,
                }}
                alt="banner image"
                src={imgBanner}
              />
            )}

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
              {openSkeleton ? (
                <Skeleton
                  animation="wave"
                  variant="circular"
                  sx={{
                    width: 100,
                    height: 100,
                  }}
                />
              ) : (
                <Avatar
                  alt="Remy Sharp"
                  src={imgProfile}
                  sx={{
                    width: 100,
                    height: 100,
                  }}
                />
              )}
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
              {nameState}
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
              <Box sx={{ flexGrow: 1 }} mr={2} ml={2}>
                <Grid container spacing={2} justifyContent="center">
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
                                ? "https://www.soundcloud.com/add/" +
                                  row.profile
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
              {objLogin.customImage ? (
                <Box sx={{ flexGrow: 1 }} mr={2} ml={2}>
                  <Grid container spacing={0}>
                    {objLogin.customImage.map((element, index) => (
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
                              handleOpenModalCustomText(
                                row.linkName,
                                row.profile
                              )
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

              {/*Carousel de imágenes ------------------------*/}
              {objLogin.galleryActive && objLogin.galleryImages ? (
                <Box
                  sx={{ flexGrow: 1, textAlign: "center" }}
                  mt={3}
                  mr={2}
                  ml={2}
                >
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
                        {objLogin.galleryImages.map((element, index) => (
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

              {/*Grid de Código QR y Botones Copy Link y Share Link --------------------*/}
              <Box
                sx={{ flexGrow: 1, textAlign: "center" }}
                mt={3}
                mr={2}
                ml={2}
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

              {/*Botón Cerrar Live Preview ------------------*/}
              <Typography
                sx={{
                  textAlign: "center",
                  mt: 10,
                }}
              >
                <Button
                  type="button"
                  fullWidth
                  color="info"
                  variant="contained"
                  sx={{ mt: 1, mb: 2 }}
                  onClick={() => setOpenLivePreview(false)}
                >
                  Close Live Preview
                </Button>
              </Typography>
            </Container>
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

      {/*Modal Share Link */}
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
    </>
  );
};

export default ModalLivePreview;
