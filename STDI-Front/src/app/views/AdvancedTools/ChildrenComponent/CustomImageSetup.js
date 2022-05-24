import {
  Modal,
  Fade,
  Box,
  Typography,
  Grid,
  styled,
  Paper,
  Button,
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Container,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  Alert,
  ListItem,
  ListItemText,
  LinearProgress
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Formik, useFormik } from "formik";
import { AppContext } from "../../../../components/AppContext";
import ImageIcon from "@mui/icons-material/Image";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import CameraAltTwoToneIcon from "@mui/icons-material/CameraAltTwoTone";
import { useSnackbar } from "notistack";
import history from "../../../../components/History";

const steps = [
  {
    label: "Read the instructions",
    description: `This option allows you to choose the number of images that you'll show on your
    profile as custom image button when you click on it.`,
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

const CustomImageSetup = ({
  openSaveCustomImage,
  handleCloseSaveCustomImage,
  setCustomImageToRender,
  setOpenSaveCustomImage,
}) => {
  // const [saveCustomImageButton, setSaveCustomImageButton] = useState(false);
  const [customImageButtonName, setCustomImageButtonName] = useState("");
  // const [customImagesToRenderInModal, setCustomImagesToRenderInModal] =
  //   useState([]);
  const [amountInputsGallery, setAmountInputsGallery] = useState(0);
  const [arrayToMapInputs, setArrayToMapInputs] = useState([]);
  const [arrayInputsValues, setArrayInputsValues] = useState([]);
  const [customImage, setCustomImage] = useState([]);
  const [showModalAmountInputs, setShowModalAmountInputs] = useState(false);
  const [selecter, setSelecter] = React.useState("");
  const [arraySizesValues, setArraySizesValues] = useState([]);
  const [loading, setLoading] = useState(false);

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

  //Hook para stepper, siempre comienza en 0
  const [activeStep, setActiveStep] = useState(0);

  const [testing, setTesting] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const { objLogin, setCustomImageContext } = useContext(AppContext);

  //Variables para modal que muestra el input text y los inputs files
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Variables para modal que muestra la cantidad a seleccionar de archivos
  const handleCloseModalAmountInputs = () => setShowModalAmountInputs(false);
  const showModalInputs = () => setShowModalAmountInputs(true);

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

  const onSubmitStepTwo = (values) => {
    const { numberOfImages } = values;

    if (numberOfImages > 0) {
      //Primero, seteamos el valor de inputs file a renderizar en la vista

      //Vamos hacia el siguiente paso
      handleNext();
    }
  };

  const handleChange = (event) => {
    setSelecter(event.target.value);
  };

  const schemaModalAmount = Yup.object({
    imagesNumber: Yup.number().required("Number of images are required"),
  });

  const checkFilesFormat = (arrayInputsValues) => {
    //Esta función recorre el arreglo de imágenes buscando
    //archivos adjuntados que tengan formato de imágenes
    //así validamos que los archivos subidos sean solo imágenes
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

  const formik = useFormik({
    initialValues: {
      imagesNumber: 1,
    },
    validationSchema: schemaModalAmount,
    onSubmit: (values) => {
      RenderInputsCustomImage(values);
    },
  });

  const RenderInputsCustomImage = (values) => {
    //Calculamos el valor del arreglo según el primer select
    const amount = values.imagesNumber;
    console.log(amount);

    if (amount > 0) {
      setAmountInputsGallery(amount);

      let inputs = [];
      let inputsValues = [];
      let sizesValues = [];
      for (let i = 0; i < amount; i++) {
        inputs.push(1);
        inputsValues.push(new File([""], "filename"));
        sizesValues.push(0);
      }
      setArrayToMapInputs(inputs);
      setArrayInputsValues(inputsValues);
      setCustomImage(inputsValues);
      setArraySizesValues(sizesValues);
      setTesting(sizesValues);
    }

    //Luego mostramos el segundo modal con la cantidad de inputs
    handleNext();
  };

  const saveCustomImage = () => {
    setLoading(true);
    //Primero voy a validar si los formatos de los archivos están correctos
    //enviándole el arreglo de Files seleecionados a esta función
    const checkAttachedFiles = checkFilesFormat(arrayInputsValues);

    // console.log(checkAttachedFiles);

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
      enqueueSnackbar("Images should not exceed 5MB", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } else if (!checkAttachedFiles) {
      setLoading(false);
      enqueueSnackbar("Files format must be .jpg, .jpeg y .png", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } else if (customImageButtonName === "") {
      setLoading(false);
      enqueueSnackbar("Custom Image Button must have a name", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } else {
      let formData = new FormData();
      formData.append("customImageActive", true);
      formData.append("customImageButtonName", customImageButtonName);
      for (var x = 0; x < customImage.length; x++) {
        formData.append("customImage", customImage[x]);
      }
      axios
        .post("/users/saveNewCustomImage", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          setLoading(false);

          const { ok, msg, customImage } = res.data;
          if (ok && msg === "Custom Image created succesfully.") {
            enqueueSnackbar(msg, {
              variant: "success",
              autoHideDuration: 3000,
            });

            handleClose();
            //Esta función guarda en el AppContext los botones restantes

            setCustomImageContext(customImage);
            setCustomImageToRender(customImage);
            handleCloseSaveCustomImage();
            history.push("/advanced-tools");
          } else {
            enqueueSnackbar("An error occurred, try again.", {
              variant: "error",
              autoHideDuration: 3000,
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar("An error occurred, try again.", {
            variant: "error",
            autoHideDuration: 3000,
          });
        });
    }
  };

  const startCustomImageSetup = () => {
    // Pasamos a true el hook para que abra el modal
    setOpenSaveCustomImage(true);

    // Cada vez que se inicia se reinician los pasos
    setActiveStep(0);
  };

  return (
    <>
      <ListItem>
        <ListItemText
          primary="Custom Image Setup"
          secondary="Make a brand new custom image button"
        />
        <Button
          variant="outlined"
          onClick={() => {
            startCustomImageSetup();
          }}
        >
          <TouchAppIcon />
        </Button>
      </ListItem>

      {/* Inicio de modal */}
      <Modal
        open={openSaveCustomImage}
        onClose={handleCloseSaveCustomImage}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Fade in={openSaveCustomImage}>
          <Box sx={styleModal}>
            <Typography
              sx={{
                textAlign: "center",
                mt: 5,
              }}
            >
              <PlaylistAddIcon color="info" sx={{ fontSize: 70 }} />
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ mt: 1, mb: 5, textAlign: "center" }}
            >
              Setup custom image button
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
                                  <form
                                    // onSubmit={RenderInputsCustomImage}
                                    onSubmit={formik.handleSubmit}
                                  >
                                    <FormControl
                                      fullWidth
                                      sx={{ marginTop: 2 }}
                                    >
                                      <InputLabel id="demo-simple-select-label">
                                        Number of Images
                                      </InputLabel>

                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="imagesNumber"
                                        // value={selecter}
                                        label="Number of Images"
                                        // onChange={handleChange}
                                        value={formik.values.imagesNumber}
                                        onChange={formik.handleChange}
                                        error={
                                          formik.touched.imagesNumber &&
                                          Boolean(formik.errors.imagesNumber)
                                        }
                                        d
                                      >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                      </Select>

                                      <Grid container marginTop={2}>
                                        <Grid item xs={6}>
                                          {/* Botón submit */}
                                          <Button
                                            type="submit"
                                            variant="contained"
                                          >
                                            {index === steps.length - 1
                                              ? "Submit"
                                              : "Continue"}
                                          </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                          {/* Botón ir al paso anterior */}
                                          <Button
                                            // disabled={loading}
                                            onClick={handleBack}
                                          >
                                            Back to step 1
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </FormControl>
                                  </form>
                                </>
                              ) : index === 2 ? (
                                <>
                                  <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="customImageButtonName"
                                    label="Custom button name"
                                    autoComplete="custom Image Button Name"
                                    name="customImageButtonName"
                                    onChange={(e) => {
                                      setCustomImageButtonName(e.target.value);
                                    }}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                  {arrayToMapInputs.map((elemento, index) => (
                                    <Grid key={index}>
                                      <Typography
                                        sx={{ marginTop: 2, marginBottom: 1 }}
                                      >
                                        Position {index + 1}
                                      </Typography>

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
                                                console.log(e);
                                                arrayInputsValues[index] =
                                                  e.target.files[0];
                                                if (e.target.files.length > 0) {
                                                  //Si hay un archivo entonces guardamos todo el objeto File
                                                  arrayInputsValues[index] =
                                                    e.target.files[0];

                                                  //Guardamos el tamaño del archivo
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
                                    </Grid>
                                  ))}

                                  {/* Barra de Loading si loading es true*/}
                                  {loading ? (
                                    <LinearProgress sx={{ mt: 2 }} />
                                  ) : null}

                                  <Grid container marginTop={2}>
                                    <Grid marginRight={1}>
                                      <Button
                                        disabled={loading}
                                        onClick={() => saveCustomImage()}
                                        variant="contained"
                                      >
                                        Save
                                      </Button>
                                    </Grid>

                                    <Grid>
                                      <Button
                                        disabled={loading}
                                        onClick={handleBack}
                                      >
                                        Back to step 2
                                      </Button>
                                    </Grid>
                                  </Grid>
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
                  handleCloseSaveCustomImage();
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

export default CustomImageSetup;
