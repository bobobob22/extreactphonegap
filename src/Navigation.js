import React from 'react';
import {NavLink} from "react-router-dom";
import { Switch, Route, withRouter } from "react-router-dom";

const Navigation = props => (
    <nav>
        <ul>
            <li>
                <NavLink to="/" >User Lists</NavLink>
                <NavLink to="/user" >Add user</NavLink>
            </li>
        </ul>
    </nav>
 );

 export default Navigation;