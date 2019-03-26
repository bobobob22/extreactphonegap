import React, { Component } from "react";
import { Container } from "@sencha/ext-modern";
import { Redirect } from 'react-router'
import { ExtReact, Button, FormPanel, TextField } from "@sencha/ext-react";
import axios from 'axios';
import './AddUser.css'

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
    this.setState({userForm: user});

  });


  onSubmit = e => {

    const userForm = {
      ...this.state.userForm
    };

    axios.post('https://extcamera-de846.firebaseio.com//users.json', userForm)
        .then(response =>{
            this.setState(prevState => ({
                users: [...prevState.users, userForm],
                redirect: true
              }));
        })

  };

  render() {

    if (this.state.redirect) {
        return <Redirect push to="/" />;
    }
      
    return (
      <>
        {!this.state.submitted ? (
          <Container padding="20" >
            <ExtReact>
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
              </FormPanel>
            </ExtReact>
          </Container>
        ) : null }
      </>
    );
  }
}

export default AddUser;
