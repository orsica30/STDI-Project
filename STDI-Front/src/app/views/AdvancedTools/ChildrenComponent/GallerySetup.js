import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
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
  Container,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  LinearProgress,
} from "@mui/material";
import history from "../../../../components/History";
import { Formik, useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { AppContext } from "../../../../components/AppContext";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import AddPhotoAlternateTwoToneIcon from "@mui/icons-material/AddPhotoAlternateTwoTone";
import CameraAltTwoToneIcon from "@mui/icons-material/CameraAltTwoTone";
import { ControlOutlined } from "@ant-design/icons";

const steps = [
  {
    label: "Read the instructions",
    description: `This option allows you to setup a brand new gallery with the images you choose for it. 
    Make sure you choose them in the right positions,
    so the gallery can show them in the order you want them to show.`,
  },
  {
    label: "Choose the number of images",
    description: "Please enter the number of images for your new gallery",
  },
  {
    label: "Select files",
    description: "Select files in order before every button",
  },
];

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
  overflow: "scroll", //para que funcione el scroll
};

const schema = Yup.object({
  numberOfImages: Yup.number().required("Number of images are required"),
});

const GallerySetup = () => {
  const { objLogin, setGalleryActiveContext, setGalleryImageContext } =
    useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const [gallery, setGallery] = useState([]);
  const [galleryActive, setGalleryActive] = useState(objLogin.galleryActive);
  const [galleryImages, setGalleryImages] = useState(objLogin.galleryImages);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //Hooks usados para saber el size de cada file seleccionado
  const [indexElement, setIndexElement] = useState("");

  const [size1, setSize1] = useState("0");
  const [size2, setSize2] = useState("0");
  const [size3, setSize3] = useState("0");
  const [size4, setSize4] = useState("0");
  const [size5, setSize5] = useState("0");

  const [filename1, setFilename1] = useState("No file selected");
  const [filename2, setFilename2] = useState("No file selected");
  const [filename3, setFilename3] = useState("No file selected");
  const [filename4, setFilename4] = useState("No file selected");
  const [filename5, setFilename5] = useState("No file selected");

  //Hook para renderizar la cantidad de inputs file
  const [amountInputsGallery, setAmountInputsGallery] = useState(0);
  const [arrayToMapInputs, setArrayToMapInputs] = useState([]);
  const [arrayInputsValues, setArrayInputsValues] = useState([]);
  const [arrayURLValues, setArrayURLValues] = useState([]);
  const [arraySizesValues, setArraySizesValues] = useState([]);

  const options = [1, 2, 3, 4, 5];

  //Hook para stepper, siempre comienza en 0
  const [activeStep, setActiveStep] = useState(0);

  //Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      numberOfImages: 1,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmitStepTwo(values);
    },
  });

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

  //Función para abrir el modal de configuración de galería
  const startGallerySetupSteps = () => {
    setOpenModal(true);

    //Cada vez que se inicie el modal, el paso siempre será el primero
    setActiveStep(0);
  };

  //Función para obtener el size de cada elemento adjunto
  const setNewSize = (item, value) => {
    const index = item + 1;
    if (index === 1) {
      setSize1(value / 1000000);
    } else if (index === 2) {
      setSize2(value / 1000000);
    } else if (index === 3) {
      setSize3(value / 1000000);
    } else if (index === 4) {
      setSize4(value / 1000000);
    } else {
      setSize5(value / 1000000);
    }
  };

  //Función para obtener el filename de cada elemento adjunto
  const setNewFilename = (item, value) => {
    const index = item + 1;
    if (index === 1) {
      setFilename1(value);
    } else if (index === 2) {
      setFilename2(value);
    } else if (index === 3) {
      setFilename3(value);
    } else if (index === 4) {
      setFilename4(value);
    } else {
      setFilename5(value);
    }
  };

  //Función para evaluar si el número elegido es mayor a 0, si es así ir al siguiente paso
  const onSubmitStepTwo = (values) => {
    const { numberOfImages } = values;

    if (numberOfImages > 0) {
      //Primero, seteamos el valor de inputs file a renderizar en la vista
      setAmountInputsGallery(numberOfImages);

      let inputs = [];
      let inputsValues = [];
      let urlValues = [];
      let sizesValues = [];
      for (let i = 0; i < numberOfImages; i++) {
        inputs.push(1);
        inputsValues.push(new File([""], "filename"));
        urlValues.push({ url: "" });
        sizesValues.push(0);
      }
      setArrayToMapInputs(inputs);
      setArrayInputsValues(inputsValues);
      setArrayURLValues(urlValues);
      setArraySizesValues(sizesValues);
      setGallery(inputsValues);

      //Vamos hacia el siguiente paso
      handleNext();
    }
  };

  //Esta función recorre el arreglo de imágenes buscando
  //archivos adjuntados que tengan formato de imágenes
  //así validamos que los archivos subidos sean solo imágenes
  const checkFilesFormat = (arrayInputsValues) => {
    for (var i = 0; i < arrayInputsValues.length; i++) {
      if (
        arrayInputsValues[i].type === "image/jpeg" ||
        arrayInputsValues[i].type === "image/jpg" ||
        arrayInputsValues[i].type === "image/png"
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const saveGallery = () => {
    setLoading(true);

    //Primero voy a validar si los formatos de los archivos están correctos
    //enviándole el arreglo de Files seleecionados a esta función
    const checkAttachedFiles = checkFilesFormat(arrayInputsValues);

    //Aquí valido que hayan sido seleccionado todos los archivos
    if (
      arrayInputsValues.some(
        (elem) => elem.length === 0 || elem.name === "filename"
      )
    ) {
      setLoading(false);
      enqueueSnackbar(
        "Some files to upload are missing, please tap in every button to upload all the files.",
        {
          variant: "error",
          autoHideDuration: 3000,
        }
      );

      //Aquí valido que el tamaño de las imágenes a subir no sobrepasen los 5MB.
    } else if (arrayInputsValues.some((elem) => elem.size >= 5000000)) {
      setLoading(false);
      enqueueSnackbar("Images should not exceed 5MB.", {
        variant: "error",
        autoHideDuration: 3000,
      });

      //Aquí valido que la función que revisa los formatos de los files hayan sido todos formato imagen
    } else if (!checkAttachedFiles) {
      setLoading(false);
      enqueueSnackbar("Files format must be .jpg, .jpeg y .png", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } else {
      setGalleryActive(true);
      setGalleryActiveContext(true);
      //aquí comparo si el usuario ya tiene una galería previamente registrada
      //si gallery viene como null, quiere decir que no hay registros y se procederá a usar el servicio saveNewGallery
      //por el contrario, si tiene ya registros, solo se deberá modificar el registro que ya tiene guardado.
      if (galleryImages !== null) {
        console.log(arrayURLValues);
        let formData2 = new FormData();
        formData2.append("galleryActive", true);
        for (var x = 0; x < arrayInputsValues.length; x++) {
          formData2.append("galleryImages", arrayInputsValues[x]);
          formData2.append("galleryURL", arrayURLValues[x].url);
        }

        axios
          .post("/users/updateGallery", formData2, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            setLoading(false);

            const { ok, msg, newData } = res.data;

            if (ok && msg === "Gallery updated succesfully.") {
              enqueueSnackbar(msg, {
                variant: "success",
                autoHideDuration: 3000,
              });

              setGalleryImages(newData.galleryImages);
              setGalleryImageContext(newData.galleryImages);
              handleCloseModal();
              history.push("/advanced-tools");
              // document.getElementById("attachedDocument").value = "";
              // setFilesLength(0);
            } else {
              enqueueSnackbar(msg, {
                variant: "error",
                autoHideDuration: 3000,
              });
            }
          })
          .catch((error) => {
            setLoading(false);
            enqueueSnackbar("An error occurred. Try again!", {
              variant: "error",
              autoHideDuration: 3000,
            });
          });
      } else {
        console.log(arrayURLValues);
        let formData = new FormData();
        formData.append("galleryActive", true);
        for (var x = 0; x < arrayInputsValues.length; x++) {
          formData.append("galleryImages", arrayInputsValues[x]);
          formData.append("galleryURL", arrayURLValues[x].url);
        }

        axios
          .post("/users/saveNewGallery", formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            setLoading(false);

            const { ok, msg, event } = res.data;

            if (ok && msg === "Gallery created succesfully.") {
              const { galleryImages } = event;

              handleCloseModal();
              setGalleryImages(galleryImages);
              setGalleryImageContext(galleryImages);

              enqueueSnackbar(msg, {
                variant: "success",
                autoHideDuration: 3000,
              });

              history.push("/advanced-tools");

              // document.getElementById("attachedDocument").value = "";
              // setFilesLength(0);
            } else {
              enqueueSnackbar(msg, {
                variant: "error",
                autoHideDuration: 3000,
              });
            }
          })
          .catch((error) => {
            enqueueSnackbar("An error occurred. Try again!", {
              variant: "error",
              autoHideDuration: 3000,
            });
          });
      }
    }
  };

  return (
    <>
      {/*Botón en listado*/}
      <ListItem>
        <ListItemText
          primary="Gallery Setup"
          secondary="Select your images and make a gallery for your profile"
        />
        <Button variant="outlined" onClick={() => startGallerySetupSteps()}>
          <TouchAppIcon />
        </Button>
      </ListItem>

      {/*Comienzo del modal*/}
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
              <AddPhotoAlternateTwoToneIcon
                color="info"
                sx={{ fontSize: 70 }}
              />
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ mt: 1, mb: 5, textAlign: "center" }}
            >
              Setup new gallery
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
                              {index === 0 ? null : index === 1 ? (
                                <>
                                  {/*Inicio del paso 2*/}
                                  {/* Formulario de username */}
                                  <form onSubmit={formik.handleSubmit}>
                                    {/* <TextField
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
                                    /> */}
                                    <FormControl fullWidth sx={{ mt: 3 }}>
                                      <InputLabel
                                        shrink
                                        id="demo-simple-select-label"
                                      >
                                        Number of Images
                                      </InputLabel>
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formik.values.numberOfImages}
                                        label="Number of Images"
                                        name="numberOfImages"
                                        onChange={formik.handleChange}
                                        error={
                                          formik.touched.numberOfImages &&
                                          Boolean(formik.errors.numberOfImages)
                                        }
                                      >
                                        {options.map((element, index) => (
                                          <MenuItem value={element} key={index}>
                                            {element}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>

                                    {/* Botón submit */}
                                    <Button
                                      type="submit"
                                      variant="contained"
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
                              ) : index === 2 ? (
                                <>
                                  {/*Inicio del paso 3*/}
                                  {arrayToMapInputs.map((elemento, index) => (
                                    <div key={index}>
                                      <TextField
                                        fullWidth
                                        type="text"
                                        placeholder="Url to open in another tab"
                                        label={"Position " + (index + 1)}
                                        name={"url" + index}
                                        onChange={(e) => {
                                          arrayURLValues[index].url =
                                            e.target.value;
                                          // console.log(arrayURLValues);
                                        }}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ mt: 3 }}
                                      />
                                      {/* Comienzo del campo upload Profile Photo */}
                                      <Grid container>
                                        <Grid item xs={3}>
                                          <Button
                                            fullWidth
                                            variant="outlined"
                                            component="label"
                                            size="large"
                                          >
                                            <CameraAltTwoToneIcon />
                                            <input
                                              type="file"
                                              hidden
                                              onChange={(e) => {
                                                //arrayInputsValues[index] = e.target.files[0];
                                                if (e.target.files.length > 0) {
                                                  //Si hay un archivo entonces guardamos todo el objeto File
                                                  arrayInputsValues[index] =
                                                    e.target.files[0];

                                                  //Guadamos el tamaño del archivo
                                                  arraySizesValues[index] =
                                                    e.target.files[0].size;

                                                  // setSize(e.target.files[0].size);
                                                  // setIndexElement(index);

                                                  setNewSize(
                                                    index,
                                                    e.target.files[0].size
                                                  );

                                                  setNewFilename(
                                                    index,
                                                    e.target.files[0].name
                                                  );
                                                } else {
                                                  arrayInputsValues[index] =
                                                    new File([""], "filename");
                                                }
                                              }}
                                              name={"attachedDocument" + index}
                                              className="mb-2"
                                            />
                                          </Button>
                                        </Grid>
                                        <Grid item xs={9} sx={{ pl: 2 }}>
                                          <Typography variant="caption">
                                            Size:
                                            {index === 0
                                              ? size1
                                              : index === 1
                                              ? size2
                                              : index === 2
                                              ? size3
                                              : index === 3
                                              ? size4
                                              : size5}
                                            &nbsp;MB.
                                          </Typography>
                                          <br />
                                          <div
                                            style={{
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              width: "100%",
                                            }}
                                          >
                                            <Typography
                                              noWrap
                                              variant="caption"
                                            >
                                              Name:
                                              {index === 0
                                                ? filename1
                                                : index === 1
                                                ? filename2
                                                : index === 2
                                                ? filename3
                                                : index === 3
                                                ? filename4
                                                : filename5}
                                            </Typography>
                                          </div>
                                        </Grid>
                                      </Grid>
                                    </div>
                                  ))}

                                  {/* Barra de Loading si loading es true*/}
                                  {loading ? (
                                    <LinearProgress sx={{ mt: 2 }} />
                                  ) : null}

                                  {/* Botón submit */}
                                  <Button
                                    onClick={() => saveGallery()}
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ mt: 2, mr: 1 }}
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
                                    Back to step 2
                                  </Button>
                                </>
                              ) : null}
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

            <Grid sx={{ mt: 2, mb: 5, textAlign: "center" }}>
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

export default GallerySetup;
