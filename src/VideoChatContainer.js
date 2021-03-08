import React from "react";
import SimpleCrypto from "simple-crypto-js";
import {
  createOffer,
  initiateConnection,
  startCall,
  sendAnswer,
  addCandidate,
  initiateLocalStream,
  listenToConnectionEvents,
} from "./modules/RTCModule";

import {
  doOffer,
  doAnswer,
  doLogin,
  doCandidate,
  doLeaveNotif,
} from "./modules/FirebaseModule";
import "webrtc-adapter";
import VideoChat from "./VideoChat";
import { firestore } from "firebase";

class VideoChatContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      database: null,
      connectedUser: null,
      localStream: null,
      localConnection: null,
      to: null,
    };
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
  }

  componentDidMount = async () => {
    // getting local video stream
   
    const localStream = await initiateLocalStream();
    this.localVideoRef.srcObject = localStream;
    
    const localConnection = await initiateConnection();

    this.props.database
      .collection("/users")
      .doc(this.props.username)
      .get()
      .then((doc) => {
        this.setState({
          database: this.props.database,
          localStream,
          localConnection,
          to: doc.data().userName,
        });
      });

  
    await this.props.database
      .collection("/notifs")
      .doc(this.props.username)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().offer) {
          
          listenToConnectionEvents(
            localConnection,
            this.props.username,
            doc.data().from,
            this.props.database,
            this.remoteVideoRef,
            doCandidate
          );

          sendAnswer(
            localConnection,
            localStream,
            { offer: doc.data().offer, from: doc.data().from },
            doAnswer,
            this.props.database,
            this.props.username
          );
        } else {
          this.props.database
            .collection("/users")
            .doc(this.props.username)
            .get()
            .then((doc) => {
              this.setState({ to: doc.data().userName });
              const { localConnection, database, localStream } = this.state;
              listenToConnectionEvents(
                localConnection,
                this.props.username,
                doc.data().userName,
                database,
                this.remoteVideoRef,
                doCandidate
              );
              // create an offer
              createOffer(
                localConnection,
                localStream,
                doc.data().userName,
                doOffer,
                database,
                this.props.username
              );
              
             const simpleCrypto = new SimpleCrypto(this.props.encrypt);
              this.props.database.collection("messages").add({
                image:false,
                text:  simpleCrypto.encrypt("i want to call you please click on video button"),
                createdAt: new Date(),
                username: this.props.username,
              });

            })
            .catch((e) => console.log(e));

         
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    this.props.database
      .collection("/notifs")
      .doc(this.props.username)
      .onSnapshot((doc) => {
        doc.exists && this.handleUpdate(doc.data(), this.props.username);
      });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.database !== nextState.database) {
      return false;
    }
    if (this.state.localStream !== nextState.localStream) {
      return false;
    }
    if (this.state.localConnection !== nextState.localConnection) {
      return false;
    }

    return true;
  }

  onVideoOff = () => {
  
    var localvideoRef = this.state.localStream;

    localvideoRef.getVideoTracks()[0].enabled = !localvideoRef.getVideoTracks()[0]
      .enabled;
    this.setState({
      localStream: localvideoRef,
    });
  };
  onAudioOff = () => {
    var localvideoRef = this.state.localStream;
  
    localvideoRef.getAudioTracks()[0].enabled = !localvideoRef.getAudioTracks()[0]
      .enabled;
    this.setState({
      localStream: localvideoRef,
    });
  };
  // onCameraChange=()=>{

  //   this.setState({
  //     localStream:

  //   })
  // }

  startCall = async (username, userToCall) => {
    const { localConnection, database, localStream } = this.state;
    listenToConnectionEvents(
      localConnection,
      username,
      userToCall,
      database,
      this.remoteVideoRef,
      doCandidate
    );
    // create an offer
    createOffer(
      localConnection,
      localStream,
      userToCall,
      doOffer,
      database,
      username
    );
  };

  onLogin = async (username) => {
    return await doLogin(username, this.state.database, this.handleUpdate);
  };

  setLocalVideoRef = (ref) => {
    this.localVideoRef = ref;
  };

  setRemoteVideoRef = (ref) => {
    this.remoteVideoRef = ref;
  };

  hangupEvent = () => {
    this.state.connectedUser = null;
    // this.state.localConnection.close();

    this.state.localStream.getTracks().forEach(function (track) {
      track.stop();
    });
    this.state.localConnection.onicecandidate = null;
    this.state.localConnection.onaddstream = null;
    this.props.database.collection("/notifs").doc(this.props.username).set({});
    this.setState({
      database: null,
      connectedUser: null,
      localStream: null,
      localConnection: null,
    });
    this.props.setvideoChat(false);
  };
  hangUp = () => {
    doLeaveNotif(this.state.to, this.props.database, this.props.username);
    this.state.connectedUser = null;
    //this.state.localConnection.close();
    this.state.localStream.getTracks().forEach(function (track) {
      track.stop();
    });
    this.state.localConnection.onicecandidate = null;
    this.state.localConnection.onaddstream = null;
    this.props.database.collection("/notifs").doc(this.props.username).set({});
    this.setState({
      database: null,
      connectedUser: null,
      localStream: null,
      localConnection: null,
    });
    this.props.setvideoChat(false);
  };

  handleUpdate = (notif, username) => {
    const { localConnection, database, localStream } = this.state;

    if (notif && localConnection) {
      switch (notif.type) {
        case "offer":
          this.setState({
            connectedUser: notif.from,
          });

          listenToConnectionEvents(
            localConnection,
            username,
            notif.from,
            database,
            this.remoteVideoRef,
            doCandidate
          );

          sendAnswer(
            localConnection,
            localStream,
            notif,
            doAnswer,
            database,
            username
          );
          break;
        case "answer":
          this.setState({
            connectedUser: notif.from,
          });
          startCall(localConnection, notif);
          break;
        case "candidate":
          addCandidate(localConnection, notif);
          break;

        case "leave":
          this.hangupEvent();
          break;

        default:
          break;
      }
    } else {
    }
  };

  render() {
    return (
      <VideoChat
        startCall={this.startCall}
        hangUp={this.hangUp}
        onLogin={this.onLogin}
        audio={
          this.state.localStream
            ? this.state.localStream.getAudioTracks()[0].enabled
            : true
        }
        setLocalVideoRef={this.setLocalVideoRef}
        setRemoteVideoRef={this.setRemoteVideoRef}
        connectedUser={this.state.connectedUser}
        onAudioOff={this.onAudioOff}
      />
    );
  }
}

export default VideoChatContainer;
