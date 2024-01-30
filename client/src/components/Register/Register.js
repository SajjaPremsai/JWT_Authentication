import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from 'react-router-dom'
import axios from "axios"

export default function Register() {
  const [fullname , setfullname] = useState("")
  const [email, setemail] = useState("")
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [confirmpassword, setconfirmpassword] = useState("")

  const styles = confirmpassword === password ? { borderColor: "green" } : { borderColor: 'red' }

  function HandleSubmit(e) {
    e.preventDefault();

    axios.post("http://localhost:3001/register", {
      Fullname : fullname,
      username: username,
      password: password,
      email : email
    })
      .then((res) => {
        console.log(res.data);
        setfullname("");
        setemail("");
        setconfirmpassword("");
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
        <h1 className='header'>Register</h1>
        <form className='form' onSubmit={HandleSubmit}>
          <div className='mb-3'>
            <label className='form-label'>FullName </label>
            <input type='text' className='form-control' value={fullname} onChange={(e) => {
              setfullname(e.target.value)
            }} required />
          </div>
          <div className='mb-3'>
            <label className='form-label'>Email </label>
            <input type='email' className='form-control' value={email} onChange={(e) => {
              setemail(e.target.value)
            }} required/>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Username </label>
            <input type='text' className='form-control' value={username} onChange={(e) => {
              setusername(e.target.value)
            }} required/>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Password </label>
            <input type='password' className='form-control' value={password} onChange={(e) => {
              setpassword(e.target.value)
            }} required/>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Confirm Password </label>
            <input type='password' className='form-control' value={confirmpassword} 
            style={styles}
            onChange={(e) => {
              setconfirmpassword(e.target.value)
              }} required/>
          </div>
          <div className='mb-3 btns'>
            <button className='btn btn-primary btns-1' style={{ width: 200 }} type='submit'>Register</button>
            <Link className='btn btn-secondary btns-2' to="/" style={{ width: 200 }}>SignIn</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
