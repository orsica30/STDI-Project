import React, { createContext, useState, useEffect } from "react";
import history from "./History";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [objLogin, setObjLogin] = useState({
    authenticated: false,
    user: "",
    token: "",
    email: "",
    existentProfile: false,
    serialNumber: "",
    username: "",
    galleryImages: [],
    galleryActive: false,
    customImage: [],
    profileData: [],
    sendNotifications: false,
    isLinked: false,
    usernameLinked: "",
  });

  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem("APP::DATA").then((value) => {
        if (value === null) {
          //Aquí protegemos las vistas que necesiten tener una sesión iniciada
          //si no hay variables de sesión, redirige al login
          // history.push("/login");
          if (
            window.location.pathname === "/dashboard" ||
            window.location.pathname === "/setup-profile" ||
            window.location.pathname === "/change-password"
          ) {
            history.push("/login");
          }
        } else {
          let objStorage = JSON.parse(value);
          if (JSON.parse(objStorage.authenticated) !== false) {
            const json = {
              authenticated: objStorage.authenticated,
              user: objStorage.user,
              token: objStorage.token,
              email: objStorage.email,
              existentProfile: objStorage.existentProfile,
              serialNumber: objStorage.serialNumber,
              username: objStorage.username,
              profileData: objStorage.profileData,
              galleryImages: objStorage.galleryImages,
              galleryActive: objStorage.galleryActive,
              sendNotifications: objStorage.sendNotifications,
              customImage: objStorage.customImage,
              isLinked: objStorage.isLinked,
              usernameLinked: objStorage.usernameLinked,
            };
            setObjLogin(json);
            axios.defaults.headers.common["x-token"] = objStorage.token;
            history.push("/dashboard");
          } else {
            history.push("/login");
          }
        }
      });
    })();
  }, []);

  useEffect(() => {
    if (JSON.parse(objLogin.authenticated) !== false) {
      var objJson = JSON.stringify(objLogin);
      AsyncStorage.setItem("APP::DATA", objJson);
    }
  }, [objLogin]);

  const loginContext = (obj) => {
    setObjLogin(obj);
  };

  const logoutContext = () => {
    const json = {
      authenticated: false,
      userName: "",
      token: "",
    };
    setObjLogin(json);
    AsyncStorage.clear();
    axios.defaults.headers.common["x-token"] = "";
    history.push("/login");
  };

  const setExistentProfile = (value) => {
    (async () => {
      await AsyncStorage.getItem("APP::DATA").then((value) => {
        if (value === null) {
        } else {
          let objStorage = JSON.parse(value);
          if (JSON.parse(objStorage.authenticated) === true) {
            const json = {
              authenticated: objStorage.authenticated,
              user: objStorage.user,
              token: objStorage.token,
              email: objStorage.email,
              existentProfile: value,
              serialNumber: objStorage.serialNumber,
              username: objStorage.username,
              profileData: objStorage.profileData,
              galleryImages: objStorage.galleryImages,
              galleryActive: objStorage.galleryActive,
              customImage: objStorage.customImage,
              sendNotifications: objStorage.sendNotifications,
              isLinked: objStorage.isLinked,
              usernameLinked: objStorage.usernameLinked,
            };
            setObjLogin(json);
          }
        }
      });
    })();
  };

  const setGPSNotificationsSelectedContext = (isChecked) => {
    (async () => {
      await AsyncStorage.getItem("APP::DATA").then((value) => {
        if (value === null) {
        } else {
          let objStorage = JSON.parse(value);
          if (JSON.parse(objStorage.authenticated) === true) {
            const json = {
              authenticated: objStorage.authenticated,
              user: objStorage.user,
              token: objStorage.token,
              email: objStorage.email,
              existentProfile: objStorage.existentProfile,
              serialNumber: objStorage.serialNumber,
              username: objStorage.username,
              profileData: objStorage.profileData,
              galleryImages: objStorage.galleryImages,
              galleryActive: objStorage.galleryActive,
              customImage: objStorage.customImage,
              sendNotifications: isChecked,
              isLinked: objStorage.isLinked,
              usernameLinked: objStorage.usernameLinked,
            };
            setObjLogin(json);
          }
        }
      });
    })();
  };

  const setLinkToExistentProfileContext = (
    isLinkedStatus,
    usernameLinkedStatus,
  ) => {
    (async () => {
      await AsyncStorage.getItem("APP::DATA").then((value) => {
        if (value === null) {
        } else {
          let objStorage = JSON.parse(value);
          if (JSON.parse(objStorage.authenticated) === true) {
            const json = {
              authenticated: objStorage.authenticated,
              user: objStorage.user,
              token: objStorage.token,
              email: objStorage.email,
              existentProfile: objStorage.existentProfile,
              serialNumber: objStorage.serialNumber,
              username: objStorage.username,
              galleryImages: objStorage.galleryImages,
              galleryActive: objStorage.galleryActive,
              customImage: objStorage.customImage,
              profileData: objStorage.profileData,
              sendNotifications: objStorage.sendNotifications,
              isLinked: isLinkedStatus,
              usernameLinked: usernameLinkedStatus,
            };
            setObjLogin(json);
          }
        }
      });
    })();
  };

  const setGalleryActiveContext = (
    galleryActiveStatus,
  ) => {
    (async () => {
      await AsyncStorage.getItem("APP::DATA").then((value) => {
        if (value === null) {
        } else {
          let objStorage = JSON.parse(value);
          if (JSON.parse(objStorage.authenticated) === true) {
            const json = {
              authenticated: objStorage.authenticated,
              user: objStorage.user,
              token: objStorage.token,
              email: objStorage.email,
              existentProfile: objStorage.existentProfile,
              serialNumber: objStorage.serialNumber,
              username: objStorage.username,
              profileData: objStorage.profileData,
              galleryImages: objStorage.galleryImages,
              galleryActive: galleryActiveStatus,
              customImage: objStorage.customImage,
              sendNotifications: objStorage.sendNotifications,
              isLinked: objStorage.isLinked,
              usernameLinked: objStorage.usernameLinked,
            };
            setObjLogin(json);
          }
        }
      });
    })();
  };

  const setGalleryImageContext = (
    galleryImages,
  ) => {
    (async () => {
      await AsyncStorage.getItem("APP::DATA").then((value) => {
        if (value === null) {
        } else {
          let objStorage = JSON.parse(value);
          if (JSON.parse(objStorage.authenticated) === true) {
            const json = {
              authenticated: objStorage.authenticated,
              user: objStorage.user,
              token: objStorage.token,
              email: objStorage.email,
              existentProfile: objStorage.existentProfile,
              serialNumber: objStorage.serialNumber,
              username: objStorage.username,
              profileData: objStorage.profileData,
              galleryImages: galleryImages,
              galleryActive: objStorage.galleryActive,
              customImage: objStorage.customImage,
              sendNotifications: objStorage.sendNotifications,
              isLinked: objStorage.isLinked,
              usernameLinked: objStorage.usernameLinked,
            };
            setObjLogin(json);
          }
        }
      });
    })();
  };

  const setCustomImageContext = (
    customImages,
  ) => {
    (async () => {
      await AsyncStorage.getItem("APP::DATA").then((value) => {
        if (value === null) {
        } else {
          let objStorage = JSON.parse(value);
          if (JSON.parse(objStorage.authenticated) === true) {
            const json = {
              authenticated: objStorage.authenticated,
              user: objStorage.user,
              token: objStorage.token,
              email: objStorage.email,
              existentProfile: objStorage.existentProfile,
              serialNumber: objStorage.serialNumber,
              username: objStorage.username,
              profileData: objStorage.profileData,
              galleryImages: objStorage.galleryImages,
              galleryActive: objStorage.galleryActive,
              customImage: customImages,
              sendNotifications: objStorage.sendNotifications,
              isLinked: objStorage.isLinked,
              usernameLinked: objStorage.usernameLinked,
            };
            setObjLogin(json);
          }
        }
      });
    })();
  };

  return (
    <AppContext.Provider
      value={{
        loginContext,
        logoutContext,
        objLogin,
        setExistentProfile,
        setGPSNotificationsSelectedContext,
        setLinkToExistentProfileContext,
        setGalleryActiveContext,
        setGalleryImageContext,        
        setCustomImageContext
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
