import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../../../components/AppContext";
import {
  FormGroup,
  FormControlLabel,
  ListItem,
  ListItemText,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { useSnackbar } from "notistack";

const GpsNotifications = ({setLoading}) => {
  const { objLogin, setGPSNotificationsSelectedContext } =
    useContext(AppContext);

  const [sendNotifications, setSendNotifications] = useState(
    objLogin.sendNotifications
  );

  const { enqueueSnackbar } = useSnackbar();

  //Consumo de servicio para guardar en la base de datos la desactivación 
  //o activación del envío de notificaciones
  const changeGPSNotificationsStatus = (isChecked) => {
    setLoading(true);

    const payloadGPSNotifications = {
      username: objLogin.username,
      sendNotifications: isChecked,
    };

    axios
      .post("/users/activateGPSNotifications", payloadGPSNotifications)
      .then((res) => {
        const { ok, msg } = res.data;

        setLoading(false);

        if (
          ok &&
          msg === "Profile has been updated succesfully." &&
          isChecked
        ) {
          enqueueSnackbar("Gps Notifications Enabled", {
            variant: "success",
            autoHideDuration: 3000,
          });
        } else {
          enqueueSnackbar("Gps Notifications Disabled", {
            variant: "warning",
            autoHideDuration: 3000,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        setSendNotifications(false);
        enqueueSnackbar("An error ocurred. Please try again!", {
          variant: "error",
          autoHideDuration: 3000,
        });
      });
  };

  const sendEmailNotifications = (e) => {
    //Se cambia el estado del switch (activo o inactivo/ true or false)
    setSendNotifications(e.target.checked);

    //Se cambia el estado de la variable de sesión
    setGPSNotificationsSelectedContext(e.target.checked);

    //Se consume el servicio para guardar el cambio en la base de datos
    changeGPSNotificationsStatus(e.target.checked);
  };
  return (
    <ListItem>
      <ListItemText
        primary="GPS Notifications"
        secondary={sendNotifications === true ? "Enabled" : "Disabled"}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={sendNotifications === true ? true : false}
              onChange={(e) => {
                sendEmailNotifications(e);
              }}
            />
          }
          label=""
        />
      </FormGroup>
    </ListItem>
  );
};

export default GpsNotifications;
