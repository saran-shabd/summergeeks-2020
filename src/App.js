import React from "react";
import { Grid } from "@material-ui/core";

// import components
import Checkin from "./components/Checkin";
import Checkout from "./components/Checkout";

function App() {
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justify="center"
      alignItems="center"
      style={{ height: "100vh", backgroundColor: "#E8E8E8" }}
    >
      <Checkin></Checkin>
      <Checkout></Checkout>
    </Grid>
  );
}

export default App;
