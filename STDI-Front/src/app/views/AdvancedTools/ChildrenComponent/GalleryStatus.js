import React, { useState, useContext } from "react";
import axios from "axios";
import {
  FormGroup,
  FormControlLabel,
  ListItem,
  ListItemText
} from "@mui/material";
import { AppContext } from "../../../../components/AppContext";
import Switch from "@mui/material/Switch";
import { useSnackbar } from "notistack";

const GalleryStatus = ({ setLoading }) => {
  const { objLogin, setGalleryActiveContext } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const [gallery, setGallery] = useState([]);
  const [galleryImages, setGalleryImages] = useState(objLogin.galleryImages);
  const [galleryActive, setGalleryActive] = useState(objLogin.galleryActive);

  //Función para cambiar el estado de varias variables en esta vista y en la sesión
  const activateGallery = (e) => {
    setGalleryActive(e.target.checked);
    setGalleryActiveContext(e.target.checked);
    setGalleryActivateOnDataBase(e.target.checked);
  };

  //Función para cambiar el estado de la galería en la base de datos
  const setGalleryActivateOnDataBase = (value) => {
    setLoading(true);
    const payload = {
      galleryActive: value,
    };

    axios
      .post("/users/activateGallery", payload)
      .then((res) => {
        setLoading(false);
        const { ok, msg } = res.data;
        if (!ok && msg === "Gallery not found.") {
          enqueueSnackbar(msg, {
            variant: "error",
            autoHideDuration: 3000,
          });
          setGalleryActive(false);
          setGalleryActiveContext(false);
        } else {
          enqueueSnackbar(msg, {
            variant: "success",
            autoHideDuration: 3000,
          });
          setGalleryActive(value);
          setGalleryActiveContext(value);
        }
      })
      .catch((error) => {
        setLoading(false);

          enqueueSnackbar("An error ocurred. Please try again!", {
            variant: "error",
            autoHideDuration: 3000,
          });
      });
  };
  return (
    <ListItem>
      <ListItemText
        primary="Gallery Status"
        secondary={galleryActive === true ? "Enabled" : "Disabled"}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              disabled={galleryImages === null}
              checked={galleryActive === true ? true : false}
              onChange={(e) => {
                activateGallery(e);
              }}
            />
          }
          label=""
        />
      </FormGroup>
    </ListItem>
  );
};

export default GalleryStatus;
