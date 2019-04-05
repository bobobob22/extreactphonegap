import React, { Component } from "react";
import { Grid, Column, Label } from "@sencha/ext-react";
import "./UserList.css";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

class UserList extends Component {
  state = {
    redirect: false,
    data: [],
    userName: "",
    preloading: true
  };

  componentDidMount() {
    setTimeout(() => {
      axios
      .get(`https://extcamera-de846.firebaseio.com//users.json`)
      .then(result => {
        const messages = Object.values(result.data);
        this.setState({
          data: messages,
        });
      });
      this.setState({ preloading: false })
    }, 2500);
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

    return (
      <>
        {this.state.preloading ? (
          <div className="loading">Loading...</div>
        ) : (
          <Grid 
            store={data} 
            onItemTap={this.addPhoto}
            >
            <Column text="First Name" dataIndex="firstName" flex="4" />
            <Column text="Last Name" dataIndex="lastName" flex="4" />
            <Link to="/adduser" className="link">
              Add new user
            </Link>
          </Grid>
        )}
      </>
    );
  }
}

export default UserList;
