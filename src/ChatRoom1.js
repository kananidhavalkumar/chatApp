import { Box, Button, Grid, TextField } from "@material-ui/core";

import React, {  useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import SimpleCrypto from "simple-crypto-js";
import MessagesList from "./MessagesList";

function ChatRoom1({ firestore, username, encrypt,storage , setvideoChat}) {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: "id" });
  
  const simpleCrypto = new SimpleCrypto(encrypt);


  async function deleteCollection(db, collectionPath) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy("__name__");

    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
    });
  }

  useEffect(() => {
    
    const container1 = document.getElementById('chatId')
   
    container1.scrollTop =container1.scrollHeight

  }, [messages])
  async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }


 function deleteFolderContents(path) {
    const ref = storage.ref(path);
    ref.listAll()
      .then(dir => {
   
        dir.items.forEach(fileRef => {
         
         deleteFile(ref.fullPath, fileRef.name);
        });
       
      })
      .catch(error => {
        console.log(error);
      });
  }

  function deleteFile(pathToFile, fileName) {
    const ref =storage.ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete()
  }


  const handleClear = () => {
    

    deleteFolderContents("/images")
    deleteCollection(firestore, "messages");
  };

  async function onSend(e, txt,image) {

    e.preventDefault();
    await messagesRef.add({
      image,
      text: simpleCrypto.encrypt(txt),
      createdAt: new Date(),
      username: username,
    });
  }

  const handleFireBaseUpload = (e,imageAsFile) => {
    e.preventDefault()

  // async magic goes here...
  if(imageAsFile === '') {
    console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
  }
  const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
  //initiates the firebase side uploading 
  uploadTask.on('state_changed', 
  (snapShot) => {
    //takes a snap shot of the process as it is happening
    console.log(snapShot)
  }, (err) => {
    //catches the errors
    console.log(err)
  }, () => {
    // gets the functions from storage refences the image storage in firebase by the children
    // gets the download url then sets the image from firebase as the value for the imgUrl key:
    storage.ref('images').child(imageAsFile.name).getDownloadURL()
     .then(fireBaseUrl => {
       onSend(e,fireBaseUrl,true)
     })
  })
  }



  return (  
    <Grid container>
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
       
        <Grid item xs={4}>
          <Box textAlign="center" paddingRight="10px">
            <Button variant="outlined" fullWidth onClick={()=>setvideoChat(true)}>
              VC
            </Button>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box textAlign="center">
            <Button variant="outlined" fullWidth onClick={handleClear}>
            {encrypt}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          overflowY: "scroll",
          height: "calc( 100vh - 130px )",
          width: "100vw",
        }}
        id="chatId"
      >
        <MessagesList
          messages={messages}
          username={username}
          simpleCrypto={simpleCrypto}
        />
      </Grid>
      <ChatRoomInput onSend={onSend} handleFireBaseUpload={handleFireBaseUpload} />
    </Grid>
  );
}

export default React.memo(ChatRoom1);

function ChatRoomInput({ onSend ,handleFireBaseUpload}) {
  const [message, setMessage] = useState("");
  const [imageAsFile, setimageAsFile] = useState("");
  // const [isImage, setIsImage] = useState(false);



  return (
    <Grid container style={{ bottom: "0vh", height: "80px" }}>
      <Grid
        item
        xs={2}
        style={{
          textAlign: "center",
          width: "100%",
          // height: "50px",
          // lineHeight: "70px",
        }}
      >
        <Box textAlign="center" paddingRight="10px" width="100%">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            onChange={(e) => {
              const image = e.target.files[0];
              setimageAsFile(image);
             
            }}
            type="file"
          />
          <label htmlFor="raised-button-file">
            <Button variant="raised" component="span">
            image
            </Button>
          </label>
        </Box>


        <Box textAlign="center"  border="1px"  width="100%">
         
            <Button variant="raised" component="span" 
         onClick={e=>{setimageAsFile("")}}>
           Reset
            </Button>
          
        </Box>
      </Grid>



      <Grid item xs={7}>
        <Box component="div" style={{ padding: "10px" }}>
          <TextField
            id="standard-basic"
            label="Say Something"
            variant="outlined"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            fullWidth
          />
        </Box>
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          textAlign: "center",
          width: "100%",
          height: "50px",
          lineHeight: "70px",
        }}
      >
        <Box textAlign="center" paddingRight="10px">
          <Button
            variant="outlined"
            fullWidth
            style={{ lineHeight: "43px" }}
            
            onClick={async(e) => {
              if (message !== "") 
             // handleFireBaseUpload(e,imageAsFile)
              onSend(e, message,false);
             
              setMessage("");

              if(imageAsFile!=="")

                handleFireBaseUpload(e,imageAsFile)
                setimageAsFile("")
              
            }}
          >
           { imageAsFile?"image":"send"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
