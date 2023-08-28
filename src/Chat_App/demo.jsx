import React, {useState} from 'react'
import {Link} from 'react-router-dom'
const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const [image, setImage] = useState(null)
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    setImage(file)
  }

  return (
    <div>
      {/* This is Register page
      <Link to='/dashboard' >Dashboard</Link> */}
      <div className='col-lg-4' id='login-card'>
        <div className='card card-custom card-stretch-50  shadow mb-15'>
          <div className='card-header'>
            <h2 className='card-title'> Sign-up </h2>
            <div className='card-toolbar'></div>
          </div>
          <div className='card-body p-0'>
            <div className='card-p'>
              <div className='mb-10'>
                <label className='form-label'>Username</label>
                <input
                  type='text'
                  className='form-control form-control-solid'
                  mailto:placeholder='name@example.com'
                />
              </div>

              <div className='mb-10'>
                <label className='form-label'>Email</label>
                <input
                  type='text'
                  className='form-control form-control-solid'
                  mailto:placeholder='name@example.com'
                />
              </div>
              <div className='mb-10'>
                <label className='form-label'>Password</label>
                <div className='input-group'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className='form-control form-control-solid'
                    placeholder='Password'
                  />
                  <button
                    className='btn btn-outline-secondary'
                    type='button'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <i className='bi bi-eye-slash'></i>
                    ) : (
                      <i className='bi bi-eye'></i>
                    )}
                  </button>
                </div>
              </div>

              <div className='mb-10'>
                <label className='form-label'>Upload Picture</label>
                <input
                  type='file'
                  accept='image/*'
                  className='form-control form-control-solid'
                  onChange={handleImageUpload}
                />
              </div>

              <div className='login-btn'>
                <button className='btn btn-dark'>
                  <i className='bi bi-box-arrow-in-right'></i>
                  Signup
                </button>
              </div>
            </div>
            <img
              className='w-100 card-rounded-bottom'
              alt=''
              src='assets/media/svg/illustrations/bg-4.svg'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
