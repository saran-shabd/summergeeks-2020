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

class Checkin extends Component {
  state = {
    // loading spinner flag
    loading: false,
    // host details
    host_name: "",
    host_email: "",
    host_phone: "",
    host_address: "",
    // visitor details
    visitor_name: "",
    visitor_email: "",
    visitor_phone: "",
    // snackbar flags
    error: "",
    is_error: false
  };

  onCheckIn = () => {
    this.setState({ loading: true });

    const {
      host_name,
      host_email,
      host_phone,
      host_address,
      visitor_name,
      visitor_email,
      visitor_phone
    } = this.state;

    // check for invalid fields
    if (
      null === host_name ||
      "" === host_name ||
      undefined === host_email ||
      null === host_email ||
      "" === host_email ||
      undefined === host_email ||
      null === host_phone ||
      "" === host_phone ||
      undefined === host_phone ||
      null === host_address ||
      "" === host_address ||
      undefined === host_address ||
      null === visitor_name ||
      "" === visitor_name ||
      undefined === visitor_name ||
      null === visitor_email ||
      "" === visitor_email ||
      undefined === visitor_email ||
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
      .post(`${process.env.REACT_APP_API_URL}/entry/check_in/`, {
        host: {
          name: host_name,
          email: host_email,
          phone_number: host_phone,
          address: host_address
        },
        visitor: {
          name: visitor_name,
          email: visitor_email,
          phone_number: visitor_phone
        }
      })
      .then(() => {
        // visitor checked in successfully
        this.setState({
          is_error: true,
          error: "Visitor checked in"
        });
        this.clearFields();
      })
      .catch(error => {
        console.log(error);
        if (400 === error.response.status) {
          if (
            undefined !== error.response.data &&
            "visitor/phone_number" === error.response.data["duplicate"]
          ) {
            // duplicate visitor phone number
            this.setState({
              is_error: true,
              error: "Visitor with given phone number already checked in"
            });
          } else {
            // invalid parameters passed
            this.setState({
              is_error: true,
              error: "Either email or phone number formats are invalid"
            });
          }
        } else if (500 === error.response.status) {
          // internal server error
          this.setState({
            is_error: true,
            error: "Internal server error, please try again later"
          });
        } else {
          // something known went wrong
          console.log(error);
          this.setState({
            is_error: true,
            error: "Something went wrong, please try again later"
          });
        }
      })
      // stop the loading spinner
      .finally(() => this.setState({ loading: false }));
  };

  clearFields = () => {
    this.setState({
      // host details
      host_name: "",
      host_email: "",
      host_phone: "",
      host_address: "",
      // visitor details
      visitor_name: "",
      visitor_email: "",
      visitor_phone: ""
    });
  };

  render() {
    return (
      <Grid item lg={4} xs={10} md={4}>
        <Paper
          elevation={5}
          style={{ fontFamily: "Roboto", padding: 40, margin: 10 }}
        >
          <center>
            <h1>CHECK IN</h1>
          </center>
          <br></br>

          {/* HOST */}
          <center>
            <h2>
              <i>Host</i>
            </h2>
          </center>
          <TextField
            required
            fullWidth
            label="Name"
            margin="normal"
            value={this.state.host_name}
            onChange={e => this.setState({ host_name: e.target.value })}
          ></TextField>
          <br></br>
          <TextField
            required
            fullWidth
            label="Email"
            margin="normal"
            value={this.state.host_email}
            onChange={e => this.setState({ host_email: e.target.value })}
          ></TextField>
          <br></br>
          <TextField
            required
            fullWidth
            label="Phone Number"
            margin="normal"
            value={this.state.host_phone}
            onChange={e => this.setState({ host_phone: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              )
            }}
          ></TextField>
          <br></br>
          <TextField
            required
            fullWidth
            label="Address"
            margin="normal"
            value={this.state.host_address}
            onChange={e => this.setState({ host_address: e.target.value })}
          ></TextField>
          <br></br>
          <br></br>

          {/* VISITOR */}
          <center>
            <h2>
              <i>Visitor</i>
            </h2>
          </center>
          <TextField
            required
            fullWidth
            label="Name"
            margin="normal"
            value={this.state.visitor_name}
            onChange={e => this.setState({ visitor_name: e.target.value })}
          ></TextField>
          <br></br>
          <TextField
            required
            fullWidth
            label="Email"
            margin="normal"
            value={this.state.visitor_email}
            onChange={e => this.setState({ visitor_email: e.target.value })}
          ></TextField>
          <br></br>
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
                color="primary"
                fullWidth
                onClick={this.onCheckIn}
              >
                Check in
              </Button>
            )}
            {this.state.loading && <CircularProgress></CircularProgress>}
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

export default Checkin;
