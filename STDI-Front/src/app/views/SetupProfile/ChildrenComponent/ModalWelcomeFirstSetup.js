import React from "react";
import { Modal, Fade, Box, Typography, Grid, Button } from "@mui/material";
import GroupAddTwoToneIcon from "@mui/icons-material/GroupAddTwoTone";

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

const ModalWelcomeFirstSetup = ({ welcome, handleCloseWelcome }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={welcome}
      onClose={handleCloseWelcome}
      // closeAfterTransition
      // BackdropComponent={Backdrop}
      // BackdropProps={{
      //   timeout: 500,
      // }}
    >
      <Fade in={welcome}>
        <Box sx={styleModal}>
          <Typography
            sx={{
              textAlign: "center",
              mt: 25,
            }}
          >
            <GroupAddTwoToneIcon color="info" sx={{ fontSize: 70 }} />
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{ mt: 1, textAlign: "center" }}
          >
            Hi, welcome to FF Profile!
          </Typography>
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1, textAlign: "center" }}
            gutterBottom
          >
            Here you can setup your name, bio, social networks and many more
            featurettes, enjoy the FF Experience ;)
          </Typography>
          <Grid sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => {
                handleCloseWelcome();
              }}
            >
              Go to setup
            </Button>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalWelcomeFirstSetup;
