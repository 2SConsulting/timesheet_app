import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import swal from 'sweetalert';
import $ from 'jquery'

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      password: "",
      loading: false
    };

    this.updateUserId = this.updateUserId.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  updateUserId(event) {
    this.setState({
      userId: event.target.value
    });
  }

  updatePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleLogin = event => {
    if (!this.state.userId) {
      swal("Invalid UserId", "Please try again", "error");
      return;
    } else if (this.state.password != 'password') {
      swal("Incorrect Password", "Please try again", "error");
      return;
    }
    this.setState({loading: true});
    let data = {
      emp_id: this.state.userId
    }
    $.post('https://8iugvy02b4.execute-api.eu-central-1.amazonaws.com/stage_userlogin',
      JSON.stringify(data),
      (function(data) {
        if (data.statusCode == 200) {
          this.props.loggedIn(data.body[0]);
        }
        this.setState({loading: false})
    }).bind(this),
      "json");

    //this.setState({loading: true})
    event.preventDefault();
  }

  forgotPassword() {
    swal('Password', 'The password is "password"', 'info')
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-9 col-sm-12 login-left">
            <p className='login-title'>Consulting Business Management Platform</p>
          </div>
          <div className="col-md-3 col-sm-12 login-right">
            <p className='login-subtitle'>Integrated Health Solutions</p>
          </div>
        </div>
        <div style={{marginTop: 40}} className="content left-spacing">
          <form className="form-horizontal">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <section className="flex-center">
                    <label className="control-label width-100 left-align hmargin-10">Username</label>
                      <div className="width-200 height-30 section">
                          <input type="text" placeholder="700019" className="form-control" value={this.state.userId} onChange={this.updateUserId} />
                			</div>
                  </section>
                </div>

                <div className="form-group">
                  <section className="flex-center">
                    <label className="control-label width-100 left-align hmargin-10">Password</label>
                      <div className="width-200 height-30 section">
                          <input type="password" placeholder="password" className="form-control" value={this.state.password} onChange={this.updatePassword} />
                			</div>
                  </section>
                </div>
              </div>
            </div>
          </form>
          <div style={{marginLeft: 215}}>
            {
              this.state.loading ?
                <button key="loading" type="button" className="btn-loading btn btn-rectangle btn-wd btn-info">
                  <span className="btn-label">
                  </span> Login
                </button>
            : this.state.userId && this.state.password ?
                <button key="active" type="button" onClick={this.handleLogin} className="btn-active btn btn-rectangle btn-wd btn-info">
                  <span className="btn-label">
                  </span> Login
                </button>
            :
                <button key="disabled" type="button" className="btn-disabled btn btn-rectangle btn-wd">
                  <span className="btn-label">
                  </span> Login
                </button>
            }
          </div>
          <p onClick={this.forgotPassword} style={{cursor: 'pointer', marginTop: 10, marginLeft: 215, fontSize: 12, color: 'grey'}} >Forgot password?</p>
        </div>
      </div>
    );
  }
}
