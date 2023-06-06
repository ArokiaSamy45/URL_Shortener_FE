import React, { Component } from "react";
import dotenv from 'dotenv';
dotenv.config();



export default class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { email } = this.state;
        console.log(email);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Error: " + res.status);
            }
            return res.json();
          })
          .then((data)=>{
            console.log(data, "userRegister");
            if(data.status === "Email sent"){
              alert("Email sent successfully");
              window.location.href = '/sign-in'; 
            }
            else if(data.status === "User not found") {
                alert("User not found");
            }
          })
      };
      
        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <h3>Forgot Password</h3>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input type="email"
                        className="form-control"
                        placeholder="Enter your email address"
                        onChange={(e) => this.setState({email: e.target.value})} />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                    <p className="forgot-password text-right">
                        <a href="/sign-in">Sign In</a>
                    </p>
                </form>
            );
        }
    }