import React from "react";

import "firebase/database";
import { Box, Button, Grid } from "@material-ui/core";

export default class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userToCall: "",
      username: "",
      brightNess: false,
    };
  }

  onLoginClicked = async () => {
    await this.props.onLogin(this.state.username);
    this.setState({
      isLoggedIn: true,
    });
  };

  onStartCallClicked = () => {
    this.props.startCall(this.state.username, this.state.userToCall);
  };

  // renderVideos = () => {
  //   return (
  //     <div className={classnames("videos", { active: this.state.isLoggedIn })}>
  //       <div>
  //         <video
  //           ref={this.props.setLocalVideoRef}
  //           id="local"
  //           autoPlay
  //           playsInline
  //           muted
  //         ></video>
  //       </div>
  //       <div>
  //         <video
  //           ref={this.props.setRemoteVideoRef}
  //           id="remote"
  //           autoPlay
  //           playsInline
  //         ></video>
  //       </div>
  //     </div>
  //   );
  // };

  // renderForms = () => {
  //   return this.state.isLoggedIn ? (
  //     <div key="a" className="form">
  //       <label>Call to</label>
  //       <input
  //         value={this.state.userToCall}
  //         type="text"
  //         onChange={(e) => this.setState({ userToCall: e.target.value })}
  //       />
  //       <button
  //         onClick={this.onStartCallClicked}
  //         id="call-btn"
  //         className="btn btn-primary"
  //       >
  //         Call
  //       </button>
  //     </div>
  //   ) : (
  //     <div style={{ width: "100%" }}>
  //       <label>Type a name</label>
  //       <input
  //         name="username"
  //         value={this.state.username}
  //         type="text"
  //         onChange={(e) => this.setState({ username: e.target.value })}
  //       />

  //       <button
  //         onClick={this.onLoginClicked}
  //         id="login-btn"
  //         className="btn btn-primary"
  //       >
  //         Login
  //       </button>
  //     </div>
  //   );
  //   {
  //   }
  // };

  render() {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Box textAlign="center" padding="10px" >
            <Button
              variant="contained"
              fullWidth
              onClick={() => this.props.hangUp()}
            >
              Hang Up
            </Button>
          </Box>
        </Grid>

        <Grid
          item
          container
          style={{
            textAlign: "center",
            width: "100%",
            height: "50px",
            lineHeight: "45px",
          }}
          xs={12}
        >
          <Grid item xs={3}>
            <Box textAlign="center" paddingRight="10px" paddingLeft="10px">
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  this.setState({ brightNess: !this.state.brightNess });
                }}
              >
                light
              </Button>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box textAlign="center" paddingRight="10px">
              <Button
                variant="contained"
                fullWidth
                onClick={() => this.props.onVideoOff()}
              >
                on/Off
              </Button>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box textAlign="center" paddingRight="10px">
              <Button
                variant="contained"
                fullWidth
                onClick={() => this.props.onVideoChange()}
              >
                Camera
              </Button>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box textAlign="center" paddingRight="10px">
              <Button
                variant="contained"
                fullWidth
                onClick={() => this.props.onAudioOff()}
              >
                {this.props.audio ? "mute" : "unmute"}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <div className="relative">
          <video
            ref={this.props.setLocalVideoRef}
            id="local"
            autoPlay
            playsInline
            muted
          ></video>

          {this.state.brightNess ? <div className="brightNess"></div> : ""}
          <video
            ref={this.props.setRemoteVideoRef}
            id="remote"
            autoPlay
            playsInline
          ></video>
        </div>
      </Grid>
    );
  }
}
