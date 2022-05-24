import React from "react";
import { Modal, Fade, Box, Typography, Button, Grid } from "@mui/material";
import DangerousTwoToneIcon from "@mui/icons-material/DangerousTwoTone";

//Estilo modal Error
const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  overflow: "scroll", //para que funcione el scroll
  boxShadow: 24,
  p: 3,
  margin: "auto",
};

const ModalError = ({ openModalError, errorMessage, history }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModalError}
      // onClose={handleCloseModalError}
      disableEscapeKeyDown={true}
    >
      <Fade in={openModalError}>
        <Box sx={styleModal}>
          <Typography sx={{ textAlign: "center", marginTop: 20 }}>
            <DangerousTwoToneIcon color="error" sx={{ fontSize: 70 }} />
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{ mt: 1, textAlign: "center" }}
          >
            Error
          </Typography>
          <Typography
            id="modal-modal-description"
            variant="subtitle1"
            gutterBottom
            component="div"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {errorMessage !== ""
              ? errorMessage
              : "We're sorry, something went wrong. Please try again!"}
          </Typography>

          {errorMessage === "User does not exist." ? (
            <>
              <Typography
                id="modal-modal-body"
                variant="subtitle2"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                This may happen for the folowing reasons:
              </Typography>
              <Typography
                id="modal-modal-body"
                variant="subtitle2"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                * user may not be registered.
              </Typography>
              <Typography
                id="modal-modal-body"
                variant="subtitle2"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                * you miss some character in url link.
              </Typography>
            </>
          ) : errorMessage === "Error 404. User Profile wasn't found." ? (
            <>
              <Typography
                id="modal-modal-body"
                variant="subtitle2"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                This may happen for the folowing reasons:
              </Typography>
              <Typography
                id="modal-modal-body"
                variant="subtitle2"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                * user is registered but without first profile setup.
              </Typography>
            </>
          ) : errorMessage === "User is not active" ? (
            <>
              <Typography
                id="modal-modal-body"
                variant="subtitle2"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                This may happen for the folowing reasons:
              </Typography>
              <Typography
                id="modal-modal-body"
                variant="subtitle2"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                * user is disabled for some reason.
              </Typography>
              <Typography
                id="modal-modal-body"
                variant="subtitle1"
                component="div"
                sx={{ mt: 1, textAlign: "center" }}
              >
                 Contact with this website admin.
              </Typography>
            </>
          ) : null}
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2} sx={{ textAlign: "center" }}>
              <Grid item xs={12}>
                {" "}
                <Button
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    document.location.reload();
                  }}
                >
                  Reload
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Go to login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalError;
