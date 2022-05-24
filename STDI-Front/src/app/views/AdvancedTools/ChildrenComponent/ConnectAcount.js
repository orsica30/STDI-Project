import React, { useState, useContext } from "react";
import axios from "axios";
import {
  FormGroup,
  FormControlLabel,
  ListItem,
  ListItemText,
  Modal,
  Fade,
  Box,
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Container,
  Alert,
  TextField,
  LinearProgress,
} from "@mui/material";
import { Formik, useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { AppContext } from "../../../../components/AppContext";
import Switch from "@mui/material/Switch";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

const steps = [
  {
    label: "Read the instructions",
    description: `Here you can connect your profile to another existent profile. 
    All you have to do is fill the user you want to connect in step 2. 
    Then, the account owner will receive an email notification 
    where he/she needs to click to verify and confirm this action.`,
  },
  {
    label: "Fill the username",
    description: "Fill the required field.",
  },
];

const schema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(6, "Username must have at least 6 characters"),
});

const ConnectAcount = () => {
  const { objLogin, setLinkToExistentProfileContext } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmitLinkingProfile(values);
    },
  });

  const [isLinked, setIsLinked] = useState(objLogin.isLinked);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //Hook para stepper, siempre comienza en 0
  const [activeStep, setActiveStep] = useState(0);

  //Función para cambiar el paso hacia el siguiente
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  //Función para cambiar el paso hacia el anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //Función para resetear los pasos
  const handleReset = () => {
    setActiveStep(0);
  };

  //Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const startModalSteps = (e) => {
    //Se cambia el estado del switch (activo o inactivo/ true or false)
    setIsLinked(e.target.checked);

    //Abrimos el modal si el switch es true
    if (e.target.checked) {
      setOpenModal(e.target.checked);
    } else {
    //Si el switch es false entonces apagamos la conexión
      const payloadLinkingProfile = {
        username: objLogin.username,
        isLinked: false, //enviamos este como true para que funcione la conexión entre perfiles
        usernameLinked: "",
      };

      axios
        .post("/users/linkingProfile", payloadLinkingProfile)
        .then((res) => {
          // console.log(res.data);

          const { ok, msg } = res.data;
          if (ok) {
            //Se cambia el estado de la variable de sesión
            setLinkToExistentProfileContext(false, "");

            enqueueSnackbar(msg, {
              variant: "success",
              autoHideDuration: 3000,
            });
          } else {
            enqueueSnackbar(msg, {
              variant: "error",
              autoHideDuration: 3000,
            });
          }
        })
        .catch((error) => {
          //Apagamos el loading
          setLoading(false);

          enqueueSnackbar("An error ocurred. Please try again!", {
            variant: "error",
            autoHideDuration: 3000,
          });
        });
    }

    //Iniciamos el paso siempre en 0,
    //esto es debido a que una vez lo termine
    //queda en último paso, entonces cada vez se ejecute esta función
    //El paso inicial siempre será el primero
    setActiveStep(0);
  };

  const onSubmitLinkingProfile = (values) => {
    setLoading(true);

    const payloadLinkingProfile = {
      username: objLogin.username,
      isLinked: true, //enviamos este como true para que funcione la conexión entre perfiles
      usernameLinked: values.username,
    };

    axios
      .post("/users/linkingProfile", payloadLinkingProfile)
      .then((res) => {
        // console.log(res.data);

        const { ok, msg } = res.data;
        if (ok) {
          //Apagamos el loading
          setLoading(false);

          //Se cambia el estado de la variable de sesión
          setLinkToExistentProfileContext(false, values.username);

          //Cerramos el modal
          handleCloseModal();

          enqueueSnackbar("Petition sent to " + values.username, {
            variant: "success",
            autoHideDuration: 3000,
          });
        } else {
          //Apagamos el loading
          setLoading(false);

          setIsLinked(false);

          enqueueSnackbar(msg, {
            variant: "error",
            autoHideDuration: 3000,
          });
        }
      })
      .catch((error) => {
        //Apagamos el loading
        setLoading(false);

        //Cerramos el modal
        handleCloseModal();

        enqueueSnackbar("An error ocurred. Please try again!", {
          variant: "error",
          autoHideDuration: 3000,
        });
      });
  };

  return (
    <>
      <ListItem>
        <ListItemText
          primary="Connect Account"
          secondary={!isLinked ? "Disabled" : "Enabled"}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isLinked === true ? true : false}
                onChange={(e) => {
                  startModalSteps(e);
                }}
              />
            }
            label=""
          />
        </FormGroup>
      </ListItem>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        // closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{
        //   timeout: 500,
        // }}
      >
        <Fade in={openModal}>
          <Box sx={styleModal}>
            <Typography
              sx={{
                textAlign: "center",
                mt: 5,
              }}
            >
              <ConnectWithoutContactIcon color="info" sx={{ fontSize: 70 }} />
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ mt: 1, mb: 5, textAlign: "center" }}
            >
              Connect to existent profile
            </Typography>
            <Container>
              <Grid container>
                <Grid item xs={12}>
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          optional={
                            index === 2 ? (
                              <Typography variant="caption">
                                Last step
                              </Typography>
                            ) : null
                          }
                        >
                          {step.label}
                        </StepLabel>
                        <StepContent>
                          <Alert severity="info">{step.description}</Alert>
                          <Box sx={{ mb: 2 }}>
                            <div>
                              {/* A continuación, dependiendo del paso voy cambiando el cuerpo del paso */}
                              {index === 0 ? null : (
                                <>
                                  {/* Formulario de username */}
                                  <form onSubmit={formik.handleSubmit}>
                                    <TextField
                                      margin="normal"
                                      fullWidth
                                      id="currentPassword"
                                      label="Username"
                                      name="username"
                                      value={formik.values.username}
                                      onChange={formik.handleChange}
                                      error={
                                        formik.touched.username &&
                                        Boolean(formik.errors.username)
                                      }
                                      helperText={
                                        formik.touched.username &&
                                        formik.errors.username
                                      }
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />

                                    {/* Barra de Loading si loading es true*/}
                                    {loading ? <LinearProgress /> : null}

                                    {/* Botón submit */}
                                    <Button
                                      type="submit"
                                      variant="contained"
                                      disabled={loading}
                                      sx={{ mt: 1, mr: 1 }}
                                    >
                                      {index === steps.length - 1
                                        ? "Submit"
                                        : "Continue"}
                                    </Button>

                                    {/* Botón ir al paso anterior */}
                                    <Button
                                      disabled={loading}
                                      onClick={handleBack}
                                      sx={{ mt: 1, mr: 1 }}
                                    >
                                      Back to step 1
                                    </Button>
                                  </form>
                                </>
                              )}
                              {index === 0 ? (
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  {/* {index === steps.length - 1
                                    ? "Submit"
                                    : "Continue"} */}
                                  Continue
                                </Button>
                              ) : null}
                            </div>
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              </Grid>
            </Container>

            <Grid sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="outlined"
                disabled={loading}
                onClick={() => {
                  handleCloseModal();
                }}
              >
                Get back
              </Button>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ConnectAcount;
