import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Link,
  Grid,
  Box,
  IconButton,
  LinearProgress,
  Typography,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import history from "../../../components/History";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PasswordCheckList from "../../../components/PasswordCheckList";

//Constante con el formato de validación para cada campo-------------------------------------------
const validationSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  userName: yup.string("Enter your Username").required("Username is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  serialNumber: yup
    .number()
    .typeError("Must be just numbers.")
    .integer("The serial number can't include a decimal point.")
    .required("Serial number is required."),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.-])[A-Za-z\d@$!%*#?&.-]{8,}$/,
      "Must meet the requirements below"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirmation password is required"),
});

//Footer de Formulario createProfile--------------------------------------------------------
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    ></Typography>
  );
}

//Se crea el tema de plantilla preconfigurado por Material UI para obtener el diseño de CreateProfile------
const theme = createTheme();

//Inicio de componente-----------------------------------------------------------------------------------------
export const CreateProfile = () => {
  // useState para mostrar y ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // useState para mostrar y ocultar confirmar contraseña
  const [showCoPassword, setShowCoPassword] = useState(false);
  const handleClickShowCoPassword = () => setShowCoPassword(!showCoPassword);
  const handleMouseDownCoPassword = () => setShowCoPassword(!showCoPassword);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const action = (key) => (
    <>
      <IconButton
        variant="outlined"
        sx={{
          color: "white",
        }}
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );

  //Configurar los valores a evaluar por el formulario-----------------------------------------------------------

  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      email: "",
      serialNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema, //Se le pasa la costante de formato de cada campo--------------
    onSubmit: (values) => {
      //Si llega acá es porque pasó todas las validaciones, le enviamos los values
      //de cada campo en el formulario, se obtienen con el nombre de cada campo.
      createProfile(values);
    },
  });

  // Funcion que envia objeto de valores al console.---------------------------------------------------
  const createProfile = (values) => {
    setLoading(true);

    const { fullName, userName, email, serialNumber, password } = values;

    const payload = {
      name: fullName,
      username: userName,
      email: email,
      serialNumber: serialNumber,
      password: password,
    };

    axios
      .post(`/users/saveNewUser`, payload)
      .then((res) => {
        setLoading(false);

        const { ok, msg } = res.data;
        if (ok && msg === "User created succesfully.") {
          enqueueSnackbar(msg, {
            variant: "success",
            autoHideDuration: 3000,
            action,
          });
          history.push("/login");
        }
      })
      .catch((e) => {
        //catch es la respuesta de error en la promesa
        /*Sí los servicios están OFF, retornamos este mensaje*/
        if (e.response === undefined) {
          //Si hay error se detiene el progress bar
          setLoading(false);
          enqueueSnackbar("An error ocurred. Please try again!", {
            variant: "error",
            autoHideDuration: 3000,
            action,
          });
          return 1;
        }

        /*Si ocurre algo en el request, retoramos esto*/
        const { msg, ok } = e.response.data;

        if (msg === undefined || msg === null || msg === "") {
          setLoading(false);
          enqueueSnackbar("An error ocurred. Please try again!", {
            variant: "error",
            autoHideDuration: 3000,
            action,
          });
          return 1;
        }

        if (!ok) {
          setLoading(false);
          enqueueSnackbar(msg, {
            variant: "error",
            autoHideDuration: 3000,
            action,
          });
          return 1;
        }
      });
  };

  return (
    // Inicio de Tema proporcionado por template de Material UI
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Icono de candado en CreateProfile */}
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          {/* Titulo de CreateProfile */}
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          {/* Inicio de formulario */}

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
              {/*Campo FullName*/}
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  name="fullName"
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fullName && Boolean(formik.errors.fullName)
                  }
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
              </Grid>

              {/*Campo userName*/}
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  id="userName"
                  label="profile.stdicompany.com/username"
                  name="userName"
                  autoComplete="family-name"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.userName && Boolean(formik.errors.userName)
                  }
                  helperText={formik.touched.userName && formik.errors.userName}
                />
              </Grid>

              {/*Campo email*/}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              {/*Campo serial number*/}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="serialNumber"
                  label="Type the serial number"
                  name="serialNumber"
                  value={formik.values.serialNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.serialNumber &&
                    Boolean(formik.errors.serialNumber)
                  }
                  helperText={
                    formik.touched.serialNumber && formik.errors.serialNumber
                  }
                />
              </Grid>

              {/* Campo de password */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPassword(e.target.value);
                  }}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>

              {/* Campo de confirm password*/}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  id="confirmPassword"
                  sx={{ fontSize: "50" }}
                  type={showCoPassword ? "text" : "password"}
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowCoPassword}
                          onMouseDown={handleMouseDownCoPassword}
                        >
                          {showCoPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={formik.values.confirmPassword}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPasswordAgain(e.target.value);
                  }}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </Grid>

              <Grid item xs={12}>
                {password !== "" && (
                  <PasswordCheckList
                    password={password}
                    passwordAgain={passwordAgain}
                  />
                )}
              </Grid>

            </Grid>
            {/* Boton de registrarse */}
            {loading ? <LinearProgress sx={{ mt: 2 }} /> : <></>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            {/* Link de cuando se tiene una cuenta. */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  onClick={() => {
                    history.push("/login");
                  }}
                  variant="body2"
                  sx={{ cursor: "pointer" }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};
