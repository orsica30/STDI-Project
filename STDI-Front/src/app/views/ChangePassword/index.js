import React, { useContext, useState } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockResetIcon from "@mui/icons-material/LockReset";
import history from "../../../components/History";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "notistack";
import Navbar from "../../../components/Navbar";
import { AppContext } from "../../../components/AppContext";
import PasswordChecklist from "react-password-checklist";
import PasswordCheckList from "../../../components/PasswordCheckList";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { InputAdornment } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LinearProgress from "@mui/material/LinearProgress";
// import Footer from "../../../components/Footer";

const theme = createTheme();

const schema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.-])[A-Za-z\d@$!%*#?&.-]{8,}$/,
      "Must meet the requirements below"
    ),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

export const ChangePassword = () => {
  // useState para mostrar y ocultar contraseña actual
  const [showCuPassword, setCuShowPassword] = useState(false);
  const handleClickShowCuPassword = () => setCuShowPassword(!showCuPassword);
  const handleMouseDownCuPassword = () => setCuShowPassword(!showCuPassword);

  // useState para mostrar y ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // useState para mostrar y ocultar confirmar contraseña
  const [showCoPassword, setShowCoPassword] = useState(false);
  const handleClickShowCoPassword = () => setShowCoPassword(!showCoPassword);
  const handleMouseDownCoPassword = () => setShowCoPassword(!showCoPassword);

  // useState para checklist
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  // useState para notifications.
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false)

  const { objLogin } = useContext(AppContext);
  const { user, username, email, serialNumber } = objLogin;

  // Función de snackbar
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

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      changePass(values);
    },
  });

  const changePass = (event) => {
    setLoading(true);
    const payload = {
      name: user,
      username: username,
      email: email,
      serialNumber: serialNumber,
      password: event.currentPassword,
      newPassword: event.newPassword,
      confirmNewPassword: event.confirmNewPassword,
    };

    axios
      .post("/auth/changePassword", payload)
      .then((res) => {
        setLoading(false)
        if (res.data.ok === false) {
          enqueueSnackbar(res.data.msg, {
            variant: "error",
            autoHideDuration: 3000,
            action,
          });
        } else {
          enqueueSnackbar("Changes made successfully", {
            variant: "success",
            autoHideDuration: 3000,
            action,
          });
          setLoading(false)          
        }
      })
      .catch(function () {
        enqueueSnackbar("Error, try again.", {
          variant: "success",
          autoHideDuration: 3000,
          action,
        });        
        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />

      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 17,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Icono de change password */}
            <Avatar
              sx={{ m: 1, bgcolor: "primary.main", height: 50, width: 50 }}
            >
              <LockResetIcon fontSize="large" />
            </Avatar>
            {/* Tipografía de forgot password */}
            <Typography component="h1" variant="h5">
              Change Password
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              {/* Formulario de current password */}

              <TextField
                margin="normal"
                fullWidth
                id="currentPassword"
                label="Current password"
                name="currentPassword"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.currentPassword &&
                  Boolean(formik.errors.currentPassword)
                }
                helperText={
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                }
                InputLabelProps={{
                  shrink: true,
                }}
                type={showCuPassword ? "text" : "password"}
                InputProps={{
                  // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowCuPassword}
                        onMouseDown={handleMouseDownCuPassword}
                      >
                        {showCuPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                fullWidth
                id="newPassword"
                label="New password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={(e) => {
                  formik.handleChange(e);
                  setPassword(e.target.value);
                }}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
                InputLabelProps={{
                  shrink: true,
                }}
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
              />

              <TextField
                margin="normal"
                fullWidth
                id="confirmNewPassword"
                label="Confirm new password"
                name="confirmNewPassword"
                value={formik.values.confirmNewPassword}
                onChange={(e) => {
                  formik.handleChange(e);
                  setPasswordAgain(e.target.value);
                }}
                error={
                  formik.touched.confirmNewPassword &&
                  Boolean(formik.errors.confirmNewPassword)
                }
                helperText={
                  formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword
                }
                InputLabelProps={{
                  shrink: true,
                }}
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
              />

              {password !== "" && (
                <PasswordCheckList
                  password={password}
                  passwordAgain={passwordAgain}
                />
              )}

              {
                loading && 
                // setTimeout(() => {
                //   <LinearProgress sx={{ width: '100%', marginTop: 3 }}/>
                  
                // }, 3000)
                <LinearProgress sx={{ width: '100%', marginTop: 3 }}/>
              }

              

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Change password
              </Button>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};
