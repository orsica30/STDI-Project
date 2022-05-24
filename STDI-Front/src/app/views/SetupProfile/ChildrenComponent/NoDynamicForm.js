import React, { useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Alert,
  Input,
  Button,
  Container,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Divider
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CameraAltTwoToneIcon from "@mui/icons-material/CameraAltTwoTone";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useSnackbar } from "notistack";

const NoDynamicForm = ({
  nameState,
  bioState,
  handleNameChange,
  handleBioChange,
  setImgProfile,
  setImgBanner,
  imgProfileToUpload,
  setImgProfileToUpload,
  imgBannerToUpload,
  setImgBannerToUpload,
  setImgProfileSize,
  setImgBannerSize,
  handleOnAdd,
  reader,
  reader2,
}) => {
  const [socialMediaName, setSocialMediaName] = useState("");
  const [socialMediaState, setSocialMediaState] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const socialNetworks = [
    "Instagram",
    "Whatsapp",
    "Snapchat",
    "Youtube",
    "Facebook",
    "Soundcloud",
    "Linkedin",
    "Telegram",
    "TikTok",
    "Twitter",
    "Spotify",
    "Apple Music",
    "Venmo",
    "CashApp",
    "Phone Number",
    "Paypal",
    "GoFundMe",
    "Twitch",
    "Discord",
    "HouseParty",
    "OnlyFans",
    "Address",
    "Email",
    "SMS",
    "Website",
    "CustomURL",
    "CustomText",
    "Embed Youtube Video",
  ];

  return (
    <Container component="main" maxWidth="xs">
      {/* Input: Full name */}
      <Grid marginBottom={1}>
        <Alert variant="outlined" severity="info">
          * is for mandatory inputs.
        </Alert>
      </Grid>
      <Grid>
        {/* <Grid marginBottom={-2}>
    <Typography variant="overline">Profile Full Name</Typography>
    </Grid> */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="fullname"
          label="Full Name"
          name="fullName"
          autoComplete="fullname"
          value={nameState}
          onChange={handleNameChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      {/* Input: Profile photo / Banner photo */}
      <Grid container justifyContent="space-around">
        <Grid>
          <Grid textAlign="center">
            <Typography variant="overline">Profile Photo</Typography>
          </Grid>

          {/* Comienzo del campo upload Profile Photo */}
          <Button variant="outlined" component="label">
            Upload File &nbsp;&nbsp;
            <CameraAltTwoToneIcon />
            <input
              type="file"
              hidden
              onChange={(e) => {
                console.log(e.target.files);
                if (e.target.files.length > 0) {
                  if (
                    e.target.files[0].type === "image/jpeg" ||
                    e.target.files[0].type === "image/jpg" ||
                    e.target.files[0].type === "image/png" ||
                    e.target.files[0].type === "image/gif"
                  ) {
                    /*Acá seteamos el perfil para enviarlo por formData (no en base64) */
                    if (e.target.files[0].size >= 5000000) {
                      enqueueSnackbar("Images should not exceed 5MB", {
                        variant: "error",
                        autoHideDuration: 2000,
                      });
                    } else {
                      setImgProfileToUpload(e.target.files[0]);
                      setImgProfileSize(e.target.files[0].size);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  } else {
                    enqueueSnackbar(
                      "Format supported: JPG, JPEG, PNG and GIF.",
                      {
                        variant: "error",
                        autoHideDuration: 2000,
                      }
                    );
                  }
                } else {
                  setImgProfile("");
                  setImgProfileToUpload("");
                }
              }}
            />
          </Button>
          <Grid textAlign="center">
            <Typography
              variant="overline"
              color={imgProfileToUpload === "" ? "InactiveCaptionText" : ""}
            >
              {imgProfileToUpload === "" ? "No file selected" : "File selected"}
            </Typography>
          </Grid>
        </Grid>

        <Grid>
          <Grid textAlign="center">
            <Typography variant="overline" marginBottom={4}>
              Banner Photo
            </Typography>
          </Grid>
          {/* Comienzo del campo upload Banner Photo */}
          <Button variant="outlined" component="label">
            Upload File &nbsp;&nbsp;
            <CameraAltTwoToneIcon />
            <input
              type="file"
              hidden
              onChange={(e) => {
                console.log(e.target.files);
                if (e.target.files.length > 0) {
                  if (
                    e.target.files[0].type === "image/jpeg" ||
                    e.target.files[0].type === "image/jpg" ||
                    e.target.files[0].type === "image/png" ||
                    e.target.files[0].type === "image/gif"
                  ) {
                    /*Acá seteamos el perfil para enviarlo por formData (no en base64) */
                    if (e.target.files[0].size >= 5000000) {
                      enqueueSnackbar("Images should not exceed 5MB", {
                        variant: "error",
                        autoHideDuration: 2000,
                      });
                    } else {
                      setImgBannerToUpload(e.target.files[0]);
                      setImgBannerSize(e.target.files[0].size);
                      reader2.readAsDataURL(e.target.files[0]);
                    }
                  } else {
                    enqueueSnackbar(
                      "Format supported: JPG, JPEG, PNG and GIF.",
                      {
                        variant: "error",
                        autoHideDuration: 2000,
                        // action,
                      }
                    );
                  }
                } else {
                  setImgBanner("");
                  setImgBannerToUpload("");
                }
              }}
            />
          </Button>
          <Grid textAlign="center">
            <Typography
              variant="overline"
              color={imgBannerToUpload === "" ? "InactiveCaptionText" : ""}
            >
              {imgBannerToUpload === "" ? "No file selected" : "File selected"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Input: Profile bio */}
      <Grid marginTop={1}>
        <TextField
          id="standard-multiline-static"
          label="Bio"
          name="bio"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={bioState}
          onChange={handleBioChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      {/* Input: Social Networks */}
      <Grid container>
        <Grid item xs={10} marginTop={3}>
          <FormControl fullWidth>
            <InputLabel shrink id="demo-simple-select-label">
              Social Media
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={socialMediaName}
              label="Social Media"
              onChange={(e) => {
                setSocialMediaState(e);
                setSocialMediaName(e.target.value);
              }}
              input={
                <OutlinedInput
                  notched
                  // labelWidth={labelWidth}
                  // name="age"
                  // id="outlined-age-always-notched"
                  label="Social Media"
                />
              }
            >
              {socialNetworks.map((element,index) => (
                <MenuItem value={element} key={index}>{element}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} marginTop={3} sx={{ textAlign: "right" }}>
          <IconButton color="primary" onClick={() => handleOnAdd(socialMediaState)}>
            <AddBoxOutlinedIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NoDynamicForm;
