import React from "react";
import { Modal, Fade, Box, Typography, Grid, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

//Estilo modal ventana de confirmación
const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    borderRadius: "2px",
    boxShadow: 24,
    p: 3,
  };

const ModalConfirmClearData = ({
  confirmModalClearData,
  handleCloseConfirmModalClearData,
  clearData,
}) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={confirmModalClearData}
      onClose={handleCloseConfirmModalClearData}
      // closeAfterTransition
      // BackdropComponent={Backdrop}
      // BackdropProps={{
      //   timeout: 500,
      // }}
    >
      <Fade in={confirmModalClearData}>
        <Box sx={styleModal}>
        <Typography sx={{ textAlign: "center" }}>
              <InfoOutlinedIcon color="info" sx={{ fontSize: 70 }} />
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ mt: 1, textAlign: "center" }}
            >
              Info
            </Typography>
            <Typography
              id="modal-modal-description"
              variant="subtitle1"
              gutterBottom
              component="div"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Wanna clear all data provided?
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  {" "}
                  <Button
                    variant="contained"
                    onClick={() => {
                      clearData();
                      handleCloseConfirmModalClearData();
                    }}
                  >
                    Yes
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCloseConfirmModalClearData();
                    }}
                  >
                    No
                  </Button>
                </Grid>
              </Grid>
            </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalConfirmClearData;
