import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/Navigation/NavBar/SignIn";
import Register from "./components/Navigation/NavBar/Register";

import "./App.css";

//React-Particle-js properties
const particleVariables = {
  particles: {
    number: {
      value: 30,
      density: { enable: true, value_area: 200 },
    },
  },
};

//Initialize Clarifai app used for Face-Detection API
const app = new Clarifai.App({ apiKey: "17dab57c049e4b10b15108bbaff9a9f4" });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: " ",
      imageUrl: "",
      box: {},
      route: "signIn",
      isSignedIn: false,
    };
  }

  //Function calculates the face detected in an image and render borders to the face
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  //Displays the borders to the face on the image
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  //Collects input of the url entered
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  //Calls the API to display image and collect data from Clarifai API
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((error) => console.log(error));
  };

  //Function for changing routes
  onRouteChange = (route) => {
    if (route === "signOut") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particleVariables} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signIn" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
