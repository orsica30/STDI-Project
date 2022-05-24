import React, { useState } from "react";
import {
  Grid,
  TextField,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import BackspaceTwoToneIcon from "@mui/icons-material/BackspaceTwoTone";

const Row = ({
  onChange,
  onRemove,
  view,
  profile,
  socialNetwork,
  linkName,
  convertStringWithPlus,
}) => {
  return (
    <>
      <Container>
        {view === 1 ? (
          <Grid marginTop={3}>
            {socialNetwork !== "CustomURL" && socialNetwork !== "CustomText" ? (
              <TextField
                id="standard-multiline-static"
                label={socialNetwork}
                placeholder={
                  socialNetwork === "Instagram"
                    ? "Instagram username"
                    : socialNetwork === "Snapchat"
                    ? "Snapchat username"
                    : socialNetwork === "Whatsapp"
                    ? "Country code and phone number"
                    : socialNetwork === "Youtube"
                    ? "Type the full link"
                    : socialNetwork === "Facebook"
                    ? "Type the full link"
                    : socialNetwork === "Soundcloud"
                    ? "Souncloud username"
                    : socialNetwork === "Linkedin"
                    ? "Type the full link"
                    : socialNetwork === "TikTok"
                    ? "Type the full link"
                    : socialNetwork === "Twitter"
                    ? "Twitter username"
                    : socialNetwork === "Spotify"
                    ? "Spotify username"
                    : socialNetwork === "Apple Music"
                    ? "Apple Music username"
                    : socialNetwork === "Venmo"
                    ? "Venmo username"
                    : socialNetwork === "CashApp"
                    ? "Cashapp username"
                    : socialNetwork === "Address"
                    ? "Type the full address"
                    : socialNetwork === "Phone Number"
                    ? "Country code and phone number"
                    : socialNetwork === "Email"
                    ? "Type the email address"
                    : socialNetwork === "SMS"
                    ? "Country code and phone number"
                    : socialNetwork === "Paypal"
                    ? "Paypal username"
                    : socialNetwork === "OnlyFans"
                    ? "OnlyFans username"
                    : socialNetwork === "GoFundMe"
                    ? "Type the full link"
                    : socialNetwork === "Telegram"
                    ? "Telegram username"
                    : socialNetwork === "Twitch"
                    ? "Twitch username"
                    : socialNetwork === "Discord"
                    ? "Type the full link"
                    : socialNetwork === "HouseParty"
                    ? "HouseParty username"
                    : socialNetwork === "Embed Youtube Video"
                    ? "Type Embed Youtube ID"
                    : "Type the full link"
                }
                name="profile"
                value={profile}
                onChange={(e) => onChange("profile", e.target.value)}
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        // aria-label="toggle password visibility"
                        onClick={onRemove}
                        edge="end"
                      >
                        <BackspaceTwoToneIcon color="info" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : socialNetwork === "CustomURL" ? (
              <>
                <TextField
                  id="standard-multiline-static"
                  label={"Custom URL Link Description"}
                  placeholder={"Type your link's description"}
                  name="linkName"
                  value={linkName}
                  onChange={(e) => onChange("linkName", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  sx={{ marginTop: 1 }}
                  id="standard-multiline-static"
                  label={"Custom URL Link"}
                  placeholder={"Type the full link"}
                  name="profile"
                  value={profile}
                  onChange={(e) => onChange("profile", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          // aria-label="toggle password visibility"
                          onClick={onRemove}
                          edge="end"
                        >
                          <BackspaceTwoToneIcon color="info" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </>
            ) : (
              <>
                <TextField
                  id="standard-multiline-static"
                  label={"Custom Text Description"}
                  placeholder={"Type your text description"}
                  name="linkName"
                  value={linkName}
                  onChange={(e) => onChange("linkName", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  sx={{ marginTop: 1 }}
                  id="standard-multiline-static"
                  label={"Custom Text"}
                  placeholder={"Type your text"}
                  name="profile"
                  value={profile}
                  onChange={(e) => onChange("profile", e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          // aria-label="toggle password visibility"
                          onClick={onRemove}
                          edge="end"
                        >
                          <BackspaceTwoToneIcon color="info" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </>
            )}
          </Grid>
        ) : view === 2 &&
          socialNetwork !== "CustomURL" &&
          socialNetwork !== "Embed Youtube Video" &&
          socialNetwork !== "CustomText" ? (
          <Grid></Grid>
        ) : null}
      </Container>
    </>
  );
};

export default Row;
