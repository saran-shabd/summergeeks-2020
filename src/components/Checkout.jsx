import React, { Component } from "react";
import {
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  Snackbar,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

class Checkout extends Component {
  state = {
    // loading spinner flag
    loading: false,
    // visitor details
    visitor_phone: "",
    // snackbar flags
    error: "",
    is_error: false
  };

  onCheckOut = () => {
    this.setState({ loading: true });

    const { visitor_phone } = this.state;

    // check for invalid fields
    if (
      null === visitor_phone ||
      "" === visitor_phone ||
      undefined === visitor_phone
    ) {
      return this.setState({
        is_error: true,
        error: "All fields are required",
        loading: false
      });
    }

    // make HTTP call to the server
    axios
      .post(`${process.env.REACT_APP_API_URL}/entry/check_out/`, {
        phone_number: visitor_phone
      })
      .then(() => {
        // Visitor checked out successfully
        this.setState({
          is_error: true,
          error: "Visitor checked out"
        });
      })
      .catch(error => {
        if (400 === error.response.status) {
          // invalid parameters passed
          this.setState({
            is_error: true,
            error: "Invalid phone number format"
          });
        } else if (404 === error.response.status) {
          // checked in visitor with given phone number not found
          this.setState({
            is_error: true,
            error: "No visitor with given number has checked in"
          });
        } else if (500 === error.response.status) {
          // internal server error
          this.setState({
            is_error: true,
            error: "Internal server error, please try again later"
          });
        } else {
          // something unknown went wrong
          console.log(error);
          this.setState({
            is_error: true,
            error: "Something went wrong, please try again later"
          });
        }
      })
      .finally(() => this.setState({ loading: false }));
  };

  render() {
    return (
      <Grid item lg={4} xs={10} md={4}>
        <Paper
          elevation={5}
          style={{ fontFamily: "Roboto", padding: 40, margin: 10 }}
        >
          <center>
            <h1>CHECK OUT</h1>
          </center>
          <br></br>
          <center>
            <h2>
              <i>Visitor</i>
            </h2>
          </center>
          <TextField
            required
            fullWidth
            label="Phone Number"
            margin="normal"
            value={this.state.visitor_phone}
            onChange={e => this.setState({ visitor_phone: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              )
            }}
          ></TextField>
          <br></br>
          <br></br>
          <br></br>
          <center>
            {!this.state.loading && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={this.onCheckOut}
              >
                Check Out
              </Button>
            )}
            {this.state.loading && (
              <CircularProgress color="secondary"></CircularProgress>
            )}
          </center>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            key={`${"top"},${"center"}`}
            open={this.state.is_error}
            onClose={() => this.setState({ is_error: false })}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{this.state.error}</span>}
            action={[
              <IconButton onClick={() => this.setState({ is_error: false })}>
                <CloseIcon color="secondary"></CloseIcon>
              </IconButton>
            ]}
          />
        </Paper>
      </Grid>
    );
  }
}

export default Checkout;
