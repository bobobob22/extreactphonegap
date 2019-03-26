import React, { Component } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import axios from "axios";
import { Redirect } from "react-router";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { ExtReact, Container, FormPanel, FileField } from "@sencha/ext-react";

import "./User.css";

class User extends Component {
  state = {
    camera: true,
    photo: "",
    predictions: [],
    user: [],
    redirect: false,
    loading: false
  };

  componentDidMount() {
    let id = this.props.match.params.id;

    axios
      .get(`https://extcamera-de846.firebaseio.com//users.json`)
      .then(result => {
        const messages = Object.values(result.data);
        const user = messages.filter(item => {
          return Object.keys(item).some(key => item[key].includes(id));
        });
        this.setState({ user: user });
      });
  }

  resizeImage(imageData) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement("img");
        img.src = e.target.result;

        const canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        // var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        dataurl = canvas.toDataURL(file.type);
      };
      reader.readAsDataURL(imageData);
    } else {
      alert("The File APIs are not fully supported in this browser.");
    }
  }

  convertURIToImageData(URI) {
    return new Promise(function(resolve, reject) {
      if (URI == null) return reject();
      let canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        image = new Image();
      image.addEventListener(
        "load",
        function(e) {
          e.preventDefault();
          e.stopPropagation();
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 250;
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        },
        false
      );
      image.src = URI;
    });
  }

  onTakePhoto(dataUri) {

    // console.log(dataUri);
    this.setState({ camera: false, photo: dataUri, loading: true });

    console.log(dataUri, "@");

    this.convertURIToImageData(dataUri).then(imageData => {
      mobilenet
        .load()
        .then(model => {
          return model.classify(imageData);
        })
        .then(predictions => {
          this.setState({ predictions: predictions, loading: false });
        });
    });
  }

  selectPhoto = e => {
    return false;
    e.preventDefault();
    let reader = new FileReader();

    reader.onload = e => {
      e.preventDefault();
      this.setState(
        {
          photo: reader.result,
          camera: false,
          loading: true
        },

        () => {
          this.convertURIToImageData(reader.result).then(imageData => {
            mobilenet
              .load()
              .then(model => {
                return model.classify(imageData);
              })
              .then(predictions => {

                this.setState({ predictions: predictions, loading: false });
         
              });
          });
        }
      );
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  showUserList = e => {
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }

    let user;
    if (this.state.user.length) {
      user = (
        <div className="camera-view">
          <p className="camera-user">
            User: {this.state.user[0].firstName} {this.state.user[0].lastName}
          </p>
          {/* <input
            className="camera-input"
            type="file"
            ref="photo2"
            onChange={this.selectPhoto}
            capture="camera"
            accept="image/*"
          /> */}

          {/* <ExtReact>
                <Container layout="center">
                    <FormPanel shadow>
                        <FileField
                            label="Select a File"
                            name="photo"
                            accept="image"
                            ref="photo"
                            onChange={this.selectPhoto}
                        />
                    </FormPanel>
                </Container>
            </ExtReact>  */}
            {/* } */}

           {this.state.camera ? (
            <>
              <Camera
                idealFacingMode={FACING_MODES.ENVIRONMENT}
                imageType={IMAGE_TYPES.JPG}
                isImageMirror={false}
                onTakePhoto={dataUri => {
                  this.onTakePhoto(dataUri);
                }}
              />
            </>
          ) : (
          <>
            <img
              ref="photoImage"
              className="photo-img"
              src={this.state.photo}
            />

            {this.state.loading ? (
            <div className="spinner">
              <div className="bounce1" />
              <div className="bounce2" />
              <div className="bounce3" />
            </div>
            ) : null}
            <ul className="prediction-list">
              {this.state.predictions.map(prediction => {
                return (
                  <li key={`prediction-${prediction.className}`}>
                    Predicted thing: {prediction.className}
                    <br />
                    Predicted percent {prediction.probability.toFixed(2)}
                  </li>
                );
              })}
            </ul>
          </>
          )
            }

          <div className="full-width text-center">
            <button className="link" onClick={this.showUserList}>
              Back to user list
            </button>
          </div>
        </div>
      );
      return user;
    } else {
      return <p>Loading user...</p>;
    }
  }
}

export default User;
