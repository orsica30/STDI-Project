import React from "react";
import "../assets/scss/main.scss";
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import { SnackbarProvider } from "notistack";

//Aquí importamos módulo que permite guardar las variables de sesión en la aplicación
import AppProvider from "../components/AppContext";

/*Views*/
import { Login } from "./views/Login/index";
import { CreateProfile } from "./views/CreateProfile/index";
import { Error404 } from "./views/Error404";
import { Dashboard } from "./views/Dashboard/index";
import { ForgotPassword } from "./views/ForgotPassword";
import { SetupProfile } from "./views/SetupProfile";
import { ChangePassword } from "./views/ChangePassword";
import { Profile } from "./views/Profile";
import { AdvancedTools } from "./views/AdvancedTools";
import { ActivateLinkedProfile } from "./views/ActivateLinkedProfile";

// import { Help } from "./views/Help";
// import { AdvancedTools } from "./views/AdvancedTools/index";
// import { ForgotPassword } from "./views/ForgotPassword/index";

/*Componente para el manejo de rutas de la app*/
const RouteApp = () => {
  return (
    <>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <AppProvider>
          <Switch>
            {/* Inicio de componentes que no necesitan sesión para iniciar*/}
            <Route exact path="/login" component={() => <Login />} />

            <Route
              exact
              path="/create-profile"
              component={() => <CreateProfile />}
            />

            <Route
              exact
              path="/forgot-password"
              component={() => <ForgotPassword />}
            />

            {/* Inicio de componentes que necesitan sesión para iniciar*/}

            <Route exact path="/dashboard" component={() => <Dashboard />} />

            <Route
              exact
              path="/setup-profile"
              component={() => <SetupProfile />}
            />

            <Route
              exact
              path="/change-password"
              component={() => <ChangePassword />}
            />

            <Route
              exact
              path="/advanced-tools"
              component={() => <AdvancedTools />}
            />
            {/* <Route exact path="/help" component={() => <Help />} /> */}

            {/*Con esto obtenemos el user del stdcompany/username y redireccionamos al login porque es una "/"" sola*/}

            <Route
              exact
              path="/activateLinkedProfile/:params"
              component={(params) => <ActivateLinkedProfile {...params} />}
            />

            <Route
              exact
              path="/:params"
              component={(params) => <Profile {...params} />}
            />
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route path="*" component={() => <Error404 />} />
          </Switch>
        </AppProvider>
      </SnackbarProvider>
    </>
  );
};
export default withRouter(RouteApp);
