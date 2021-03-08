import { Box, Button, Grid } from "@material-ui/core";
import React from "react";

function VideoChatFinal() {
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
            <Button variant="contained" fullWidth>
              Video
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box textAlign="center" paddingRight="10px">
            <Button variant="contained" fullWidth>
              Video
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box textAlign="center" paddingRight="10px">
            <Button variant="contained" fullWidth>
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
      <div className="relative">This div element has position: relative;
  {/* <div className="absolute">This div element has position: absolute;</div> */}
</div>
      {/* <Grid
        item
        xs={12}
        style={{
          overflowY: "scroll",
          height: "calc( 100vh - 130px )",
          width: "100vw",
        }}
        id="chatId"
      >
       
      </Grid>
     */}
      
    </Grid>
  );
}

export default VideoChatFinal;
