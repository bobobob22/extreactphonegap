import React, { Component } from "react";
import { Container, TitleBar, Button, Sheet, Panel } from "@sencha/ext-modern";

import { Switch, Route, withRouter } from "react-router-dom";
import AddUser from "./AddUser/AddUser";
import User from "./User/User";
import UserList from "./UserList/UserList";

import Navigation from './Navigation';



// import NavMenu from "./NavMenu";
const REACT_VERSION = require("react").version;

/**
 * The main application view and routes
 */
class Layout extends Component {
  title = "Sencha ExtReact 6.7 Modern Boilerplate - React v" + REACT_VERSION;

  state = {
    showAppMenu: false
  };

  // toggleAppMenu = () => {
  //     this.setState({ showAppMenu: !this.state.showAppMenu });
  // }

  // onHideAppMenu = () => {
  //     this.setState({ showAppMenu: false });
  // }

  // navigate = path => {
  //   this.setState({ showAppMenu: false });
  //   this.props.history.push(path);
  // };

  render() {
    const { showAppMenu } = this.state;
    const { location } = this.props;

    const navMenuDefaults = {
      onItemClick: this.navigate,
      selection: location.pathname
    };

    return (
      <Container fullscreen layout="fit">
        <Switch>
          <Route path="/" component={UserList} exact />
          <Route path="/adduser" component={AddUser} />
          <Route path="/user/:id" component={User} />
        </Switch>
      </Container>
    );
  }
}

export default withRouter(Layout);
