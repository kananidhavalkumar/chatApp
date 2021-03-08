import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import auth from "./Firebase";
import { Grid } from "@material-ui/core";
import ChatRoom1 from "./ChatRoom1";
import Login from "./Login";
import "firebase/storage";
import VideoChatContainer from "./VideoChatContainer";


firebase.initializeApp(auth);

const firestore = firebase.firestore();

const storage = firebase.storage();

var username = "";
function App() {
  const [UserName, setUserName] = useState();
  const [auth, setauth] = useState(0);
  const [loading, setloading] = useState(false);
  const [videoChat, setvideoChat] = useState(false);
  const [encrypt, setencrypt] = useState();
  username = UserName;

  return (
    <Grid container>
      {auth == 0 ? (
        <Login
          setAuth={setauth}
          setUserName={setUserName}
          setencrypt={setencrypt}
        ></Login>
      ) : auth == 1 ? (
        videoChat ? (
          <VideoChatContainer
          key={videoChat}
            database={firestore}
            username={UserName}
            encrypt={encrypt}
            setvideoChat = {setvideoChat}
          ></VideoChatContainer>
        ) : (
          <ChatRoom1
          setvideoChat = {setvideoChat}
            firestore={firestore}
            username={UserName}
            encrypt={encrypt}
            storage={storage}
          ></ChatRoom1>
        )
      ) : (
        window.location.replace("http://sandesh.com/")
      )}
      {/* {auth == 0 ? (
        <Login
          setAuth={setauth}
          setUserName={setUserName}
          setencrypt={setencrypt}
        ></Login>
      ) : auth == 1 && !videoChat? (
        <ChatRoom1
          firestore={firestore}
          username={UserName}
          encrypt={encrypt}
          storage={storage}
        ></ChatRoom1>
      ) : (
        window.location.replace("http://sandesh.com/")
      )} */}


    </Grid>
  );
}

export default App;
