import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  LinearProgress,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Backdrop,
  CircularProgress,
  Paper,
  Box,
  Grid,
  Typography,
  Snackbar,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import history from "../../../components/History";
import { useFormik } from "formik";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { AppContext } from "../../../components/AppContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

//Constante con el formato de validación para cada campo-----------------------------------------------------
const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

//Footer de Formulario Login----------------------------------------------------------------------------------
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

//Se crea el tema de plantilla preconfigurado por Material UI para obtener el diseño del Login-----------------
const theme = createTheme();

//Inicio de componente-----------------------------------------------------------------------------------------
export const Login = () => {
  // useState para mostrar y ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // Valores iniciales
  const { loginContext } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Variable que guarda la opción Cerrar de los Snackbars
  const action = (key) => (
    <>
      <IconButton
        variant="outlined"
        sx={{
          color: "white",
          // border: "1px solid white",
          // p: 0,
          // width: 5,
          // "&:hover": {
          //   border: "1px solid white",
          //   background: "white",
          //   color: "red",
          // },
        }}
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );

  //Setear los valores a evaluar por el formulario-------------------------------------------------------------
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema, //Se le pasa la costante de formato de cada campo
    onSubmit: (values) => {
      //Si llega acá es porque pasó todas las validaciones, le enviamos los values
      //de cada campo en el formulario, se obtienen con el nombre de cada campo
      //para este caso particular: values.email y values.password
      signIn(values);
    },
  });

  //Función de reconocimiento de combinación correcta email - password
  const signIn = (values) => {
    //Le indicamos a la app el comienzo del progress bar
    setLoading(true);

    //Desestructuramos values y
    //guardamos como constantes los valores introducidos en formulario
    const { email, password } = values;

    //Guardamos en payload el body en formato json para pasarle al servicio login
    const payload = {
      email: email,
      password: password,
    };

    //Consumimos el servicio login a través de axios
    axios
      .post(`/auth/login/`, payload)
      .then((res) => {
        //Se desestructura la respuesta del servicio
        const { ok, msg, token, name, userid } = res.data;

        //Capturamos el token y lo dejamos en la cabecera
        axios.defaults.headers.common["x-token"] = res.data.token;

        if (ok && msg === "login") {
          axios.get(`/users/getProfileUserData`).then((res2) => {
            const {
              ok,
              msg,
              serialNumber,
              username,
              email,
              data,
              gallery,
              customImage,
            } = res2.data;

            //Detener el progress bar
            setLoading(false);

            //Objeto json que guarda variables de sesión en el AppContext
            const json = {
              authenticated: true,
              user: name,
              token: token,
              email: email,
              existentProfile:
                ok === true &&
                msg === "User is registered but doesn't have any profile saved."
                  ? false
                  : true,
              serialNumber: serialNumber,
              username: username,
              profileData: data,
              galleryImages:
                gallery && gallery.galleryImages ? gallery.galleryImages : null,
              galleryActive:
                gallery && gallery.galleryActive ? gallery.galleryActive : null,
              customImage: customImage ? customImage : null,
              sendNotifications: data ? data.sendNotifications : false,
              isLinked: data ? data.isLinked : false,
              usernameLinked: data ? data.usernameLinked : ""
            };
            loginContext(json);

            //Mensaje de login exitoso
            enqueueSnackbar("Login succesfull", {
              variant: "success",
              autoHideDuration: 2000,
              action,
            });

            //Redireccionamiento a vista dashboard
            history.push("/dashboard");
          });
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
    <>
      {/*Inicio de Tema proporcionado por template de Material UI */}
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />

          {/* Grilla en donde se muestran las imágenes random */}
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://source.unsplash.com/random)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Grilla en donde se muestra el formulario */}
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              {/* <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            > */}

              {/* Inicio de formulario */}
              <form onSubmit={formik.handleSubmit}>
                {/* Campo Email */}
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                {/* Campo Password */}
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
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
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />

                {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}

                {/*Loading progress bar */}
                {loading ? <LinearProgress sx={{ mt: 2 }} /> : <></>}

                {/* Botón submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>

                {/* Grilla nueva en donde se muestran opciones de crear profile y cambio de contraseña */}
                <Grid container>
                  <Grid item xs>
                    <Link
                      variant="body2"
                      onClick={() => {
                        history.push("/forgot-password");
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      onClick={() => history.push("/create-profile")}
                      variant="body2"
                      sx={{ cursor: "pointer" }}
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </form>
              {/* Final del Formulario */}
              {/* </Box> */}
            </Box>
          </Grid>
          {/* Final de Grilla de opciones de crear profile y cambio de contraseña */}
        </Grid>
        {/* Final de Grilla principal del formulario */}
      </ThemeProvider>
    </>
  );
};
