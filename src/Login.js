import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

import {  Button, Grid } from "@material-ui/core";

import "firebase/auth";

import firebase from "firebase/app";
import CircularProgress from "@material-ui/core/CircularProgress";

function Login({ setAuth, setUserName, setencrypt }) {
  const [inputData, setinputData] = useState({
    email: "abckanani1@gmail.com",
    password: "Kds@9202",
    login: false,
    key: "Gudlo",
  });

  function changeHandler(e) {
    setinputData({ ...inputData, [e.target.name]: e.target.value });
  }

  function loginEventhandler() {
    setinputData({ ...inputData, login: true });

    if (inputData["key"] !== "") {
      firebase
        .auth()
        .signInWithEmailAndPassword(inputData["email"], inputData["password"])
        .then((data) => {
          setencrypt(inputData["key"]);
          setUserName(data.user.uid);
          setAuth(1);

          firebase.firestore().collection("/notifs").doc(data.user.uid).set({});
        })
        .catch((e) => {
          setAuth(2);

          setinputData({ ...inputData, login: false });
        });
    }
  }

  return (
    <Grid container spacing={3} style={{ margin: "auto" }}>
      <Grid item xs={10} style={{ margin: "auto" }}>
        <h1>Welcome To My News</h1>
      </Grid>

      <Grid item xs={10} style={{ margin: "auto" }}>
        <TextField
          id="standard-basic"
          label="Name"
          name="email"
          type="email"
          fullWidth
          value={inputData["email"]}
          onChange={(e) => changeHandler(e)}
        />
      </Grid>
      <Grid item xs={10} style={{ margin: "auto" }}>
        <TextField
          id="standard-basic"
          label="Keyword you want to search"
          name="password"
          value={inputData["password"]}
          style={{ margin: "auto" }}
          onChange={(e) => changeHandler(e)}
          fullWidth
        />
      </Grid>

      <Grid item xs={10} style={{ margin: "auto" }}>
        <TextField
          id="standard-basic"
          label="Key"
          name="key"
          fullWidth
          value={inputData["key"]}
          onChange={(e) => changeHandler(e)}
        />
      </Grid>

      <Grid item xs={10} style={{ margin: "auto" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={(e) => loginEventhandler()}
        >
          {inputData["login"] === true ? (
            <>
              <CircularProgress />
            </>
          ) : (
            "Go"
          )}
        </Button>
      </Grid>
    </Grid>
  );
}

export default Login;
