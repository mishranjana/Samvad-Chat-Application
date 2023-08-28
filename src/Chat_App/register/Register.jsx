import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth, db, storage } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, Timestamp, where, query, getDocs, collection } from 'firebase/firestore'
import { useHistory } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import emailjs from '@emailjs/browser'
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Swal from 'sweetalert2'



const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [image, setImage] = useState(null)
  let otp_val = Math.floor(Math.random() * 10000)
  let emailbody = ` ${otp_val}`
  const [Otp, setotp] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [IsOtpverified, setIsOtpverified] = useState(false)
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required').test('email-exists', 'Email already exists', async (value) => {
      const q = query(collection(db, 'users'), where('email', '==', value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    }),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]+$/,
        'Password must contain at least one capital letter and be alphanumeric'
      ),
    otp: Yup.string().required('OTP is required').test('otp-verification', 'Please verify the OTP first', function () {

      return IsOtpverified;
    }),
    contact: Yup.string()
      .required('Contact number is required')
      .matches(/^[0-9]{10}$/, 'Contact number must be a 10-digit number'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      otp: '',
      imageUrl: '',
      contact: '',
      error: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (formik.errors.otp !== undefined && formik.errors.otp !== "") {
        return
      }
      setLoading(true)
      try {
        const { name, email, password, contact, otp, imageUrl } = values
        const result = await createUserWithEmailAndPassword(auth, email, password)
        let url
        const storageRef = ref(storage, `userImages/${result.user.uid}`)
        const userRef = doc(db, 'users', result.user.uid)
        const snap = await uploadBytes(storageRef, image)
        const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
        url = dlUrl

        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          imageUrl: url,
          contact: phoneNumber,
          password,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
        })
        formik.resetForm()
        setLoading(false)
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You can now log in .',
          allowOutsideClick: false,
        }).then(() => {
          // Redirect to the dashboard after a delay
          setTimeout(() => {
            history.push('/login')
          }, 500) // Delay in milliseconds (
        })
      } catch (err) {
        formik.setFieldValue('error', 'Failed to register')
      }
    },
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // const [image, setImage] = useState(null)
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    setImage(file)
  }


  const handleVerifyOtp = (e) => {
    e.preventDefault();

    const newString = Otp.replace(/\s+/g, '');
    console.log(newString);
    console.log(formik.values.otp);
    if (newString === formik.values.otp) {
      // Display success message
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: 'Email verified successfully',
      });
      setIsOtpverified(true)
    } else {
      // Display error message
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'error',
        title: 'Invalid OTP',
      });
    }
  };

  const sendOtp = (e) => {
    e.preventDefault()
    console.log(formik.errors.email)
    if (formik.errors.email !== undefined && formik.errors.email !== "") {
      return
    }
    emailjs
      .send('service_ramlrpa', 'template_1tyy3ae', params, 'z8IuuhKMtJAXxjDUW')
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text)
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })

        Toast.fire({
          icon: 'success',
          title: 'Otp Sent to entered email Succesfully !!!',
        })
        const otpverifyElement = document.getElementById('otpverify')
        if (otpverifyElement) {
          otpverifyElement.style.removeProperty('display')
        }
        setotp(params.emailbody)
      })
      .catch(function (error) {
        console.log('FAILED...', error)
      })
  }

  const params = {
    email: formik.values.email,
    emailbody: emailbody,
  }

  useEffect(() => {
    const phoneInputField = document.querySelector('#phone')
    const phoneInput = window.intlTelInput(phoneInputField, {
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
      allowDropdown: true,
      separateDialCode: true,
    })

    phoneInputField.addEventListener('countrychange', function () {
      const selectedCountryCode = phoneInput.getSelectedCountryData().dialCode
      const phoneNumberOriginal = phoneInput.getNumber()

      // Prepend the country code to the phone number
      const phoneNumberWithCountryCode = phoneNumberOriginal
      setPhoneNumber(phoneNumberWithCountryCode)
      console.log(phoneNumberWithCountryCode)
    })
  }, [])

  return (
    <>
     

      <div className='col-lg-4' id='reg'>
        <div className='card card-custom card-stretch-50  shadow '>
          <div className='card-headerr'>
            <h2 className='card-title'>
              <b>Register here</b>
            </h2>
            <div className='card-toolbar'></div>
          </div>
          <div className='card-body p-0'>
            <form onSubmit={formik.handleSubmit}>
              <div className='card-p'>
                <div className='mb-10'>
                  <label className='form-label'>
                    <b>Username</b>
                    <span className='required-field'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    placeholder='Enter username'
                    name='name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className='error'>{formik.errors.name}</div>
                  )}
                </div>

                <div className='mb-10'>
                  <label className='form-label'>
                    <b>Email</b>
                    <span className='required-field'>*</span>
                  </label>
                  <div className='input-group'>
                    <input
                      type='text'
                      className='form-control form-control-solid'
                      placeholder='name@example.com'
                      name='email'
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button className='btn btn-primary' type='button' onClick={sendOtp}>
                      Verify
                    </button>
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <div className='error'>{formik.errors.email}</div>
                  )}
                </div>

                <div className='mb-10' id='otpverify' style={{ display: 'none' }}>
                  <label className='form-label'>
                    <b>OTP</b>
                    <span className='required-field'>*</span>
                  </label>
                  <div className='input-group'>
                    <input
                      type='text'
                      className='form-control form-control-solid'
                      placeholder='Enter OTP'
                      name='otp'
                      value={formik.values.otp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <button className='btn btn-primary' type='button' onClick={handleVerifyOtp}>
                      Verify
                    </button>
                  </div>
                  {formik.touched.otp && formik.errors.otp && (
                    <div className='error'>{formik.errors.otp}</div>
                  )}
                </div>

                <div className='mb-10'>
                  <label className='form-label'>
                    <b>Contact number</b>
                    <span className='required-field'>*</span>
                  </label>
                  <br />
                  <input
                    id='phone'
                    type='tel'
                    className='form-control form-control-solid'
                    placeholder='Enter contact'
                    autocomplete='off'
                    name='contact'
                    style={{ width: '150%' }}
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault()
                      }
                    }}
                    inputMode='numeric'
                    maxLength={10}
                  />

                  {formik.touched.contact && formik.errors.contact && (
                    <div className='error'>{formik.errors.contact}</div>
                  )}
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

                <div className='mb-10'>
                  <label className='form-label'>
                    Password<span className='required-field'>*</span>
                  </label>
                  <div className='input-group'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className='form-control form-control-solid'
                      placeholder='Enter password'
                      name='password'
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <span className='input-group-text' onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <i className='fas fa-eye-slash'></i>
                      ) : (
                        <i className='fas fa-eye'></i>
                      )}
                    </span>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className='error'>{formik.errors.password}</div>
                  )}
                </div>

                <div className='login-btn'>
                  <button
                    type='submit'
                    id='kt_sign_up_submit'
                    className='btn btn-lg btn-primary w-100 mb-5'
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!loading && <span className='indicator-label'>Register</span>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className='text-center'>
                  <b>
                    If you are already a user? <Link to='/login'>Login</Link>
                  </b>
                </p>
              </div>
              {formik.values.error && <div className='error'>{formik.values.error}</div>}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
