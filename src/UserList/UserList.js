import React, { Component } from "react";

import {
  ExtReact,
  List,
  Button,
  Container,
  FormPanel,
  Grid,
  Column,
  Label
} from "@sencha/ext-react";
import "./UserList.css";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

class UserList extends Component {
  state = {
    redirect: false,
    isLoading: true,
    data: [],
    userName: ""
  };

  componentDidMount() {
    axios
      .get(`https://extcamera-de846.firebaseio.com//users.json`)
      .then(result => {
        const messages = Object.values(result.data);
        this.setState({
          data: messages,
          isLoading: false
        });
      });
  }

  addPhoto = (grid, index, target) => {
    this.setState({
      redirect: true,
      userName: target._record.data.firstName
    });
  };

  render() {
    let user = this.state.userName;
    if (this.state.redirect) {
      return <Redirect push to={"/user/" + user} />;
    }

    const { isLoading, data } = this.state;

    if (isLoading) {
      return <Label html="Loading"/>;
    }

    return (
        <Grid store={data} onItemTap={this.addPhoto}>
          <Column text="First Name" dataIndex="firstName" flex="1" />
          <Column text="Last Name" dataIndex="lastName" flex="1" />
          <Link to="/adduser" className="link">
            Add new user
          </Link>
        </Grid>
    );
  }
}





export default UserList;
