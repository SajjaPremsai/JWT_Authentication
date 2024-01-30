import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import "../Login/Login.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

export default function Login() {

    const [username , setusername] = useState("")
    const [password, setpassword] = useState("")
    const navigation = useNavigate()

  function HandleSubmit(e) {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    axios.post("http://localhost:3001/login", {
      username: username,
      password: password
    })
      .then((res) => {
        if(res.data.verification){
          navigation("/dashboard")
        }
        setusername("");
        setpassword("");
      })
      .catch((err) => {
        console.log(err);
      });
  }


  return (
<div className='container'>
          <div className='con-1'>
              <h1 className='header'>Login</h1>
              <form className='form' onSubmit={HandleSubmit}>
                  <div className='mb-3'>
                      <label className='form-label'>Username </label>
                      <input type='text' className='form-control' value={username} onChange={(e)=>{
                        setusername(e.target.value)
                      }}/>
                  </div>
                  <div className='mb-3'>
                      <label className='form-label'>Password </label>
                      <input type='password' className='form-control' value={password} onChange={(e)=>{
                        setpassword(e.target.value)
                      }} />
                  </div>
                  <div className='mb-3 btns'>
                      <button className='btn btn-primary btns-1' style={{ width: 200 }} type='submit'>SignIn</button>
                      <Link className='btn btn-secondary btns-2' to="/register" style={{ width: 200 }}>Signup</Link>
                  </div>
              </form>
          </div>
</div>
  )
}
