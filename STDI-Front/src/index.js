import React from 'react';
import ReactDOM from 'react-dom';
import {MainApp} from './app/MainApp';
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = baseURL;

/*Incializador de nuestra app*/
ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById('root')
);