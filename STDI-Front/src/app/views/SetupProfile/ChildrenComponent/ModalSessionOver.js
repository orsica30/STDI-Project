import React from "react";
import DangerousTwoToneIcon from "@mui/icons-material/DangerousTwoTone";
import { Modal, Fade, Box, Typography, LinearProgress } from "@mui/material";

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

const ModalSessionOver = ({ sessionOver, handleCloseSessionOver }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={sessionOver}
      onClose={handleCloseSessionOver}
      // closeAfterTransition
      // BackdropComponent={Backdrop}
      // BackdropProps={{
      //   timeout: 500,
      // }}
    >
      <Fade in={sessionOver}>
        <Box sx={styleModal}>
          <Typography
            sx={{
              textAlign: "center",
              mt: 30,
            }}
          >
            <DangerousTwoToneIcon color="error" sx={{ fontSize: 70 }} />
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{ mt: 1, textAlign: "center" }}
          >
            An error occurred :(
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
          <Typography
            variant="caption"
            display="block"
            sx={{ textAlign: "center" }}
            gutterBottom
          >
            shooting down...
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalSessionOver;
