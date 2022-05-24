import React from 'react'
import RouteApp from './RouteApp';
import {Router} from "react-router-dom";
import history from '../components/History';

/*Componente nucleo de nuestra app*/
export const MainApp = () => {
    return (
        <Router history={history}>
        <RouteApp/>
        </Router>
    )
}