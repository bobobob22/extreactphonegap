import React, { Component } from "react";
import { Redirect } from "react-router";
import { Button, FormPanel, TextField } from "@sencha/ext-react";
import axios from "axios";
import "./AddUser.css";
import { withRouter } from "react-router-dom";

class AddUser extends Component {
  state = {
    users: [],
    userForm: {
      firstName: "First Name",
      lastName: "Last name"
    },
    redirect: false
  };

  onFieldChange = Ext.Function.createBuffered(() => {
    const user = {};

    for (let name in this.refs) {
      user[name] = this.refs[name].cmp.getValue();
    }
    this.setState({ userForm: user });
  });

  onSubmit = e => {
    const userForm = {
      ...this.state.userForm
    };

    axios
      .post("https://extcamera-de846.firebaseio.com/users.json", userForm)
      .then(response => {
        this.setState({ redirect: true });
        this.setState(prevState => ({
          users: [...prevState.users, userForm],
          redirect: true
        }));
      });
  };

  backToUser = () => {
    this.props.history.push("/");
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }

    return (
      <>
        <FormPanel title="User" ref={form => (this.form = form)}>
          <TextField
            ref="firstName"
            label={this.state.userForm.firstName}
            onChange={this.onFieldChange}
          />
          <TextField
            ref="lastName"
            label={this.state.userForm.lastName}
            onChange={this.onFieldChange}
          />
          <Button text="Add user" handler={this.onSubmit} />
          <Button text="User list" handler={this.backToUser} />
        </FormPanel>
      </>
    );
  }
}

export default withRouter(AddUser);
