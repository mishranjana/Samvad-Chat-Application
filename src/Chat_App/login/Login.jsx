// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './login.scss';
// import { useHistory } from 'react-router-dom';
// import { auth, db } from '../firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { setDoc, doc, updateDoc } from 'firebase/firestore';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { fetchSignInMethodsForEmail } from 'firebase/auth';
// import Swal from 'sweetalert2';

// const Login = () => {
//   const history = useHistory();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleTogglePassword = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   const handleSubmit = async (values, { setFieldError }) => {
//     try {
//       const { email, password } = values;

//       // Check if the email exists
//       const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//       if (signInMethods.length === 0) {
//         setFieldError('email', 'Email address is not registered');
//         return;
//       }

//       setIsLoading(true);

//       // Sign in with email and password
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       await updateDoc(doc(db, 'users', result.user.uid), {
//         isOnline: true,
//       });

//       // Redirect to dashboard
//       history.push('/dashboard');
//     } catch (err) {
//       console.error(err);
//       setFieldError('password', 'Incorrect password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <br />
//       <div className='col-lg-4' id='login-card'>
//         <div className='card card-custom card-stretch-30 shadow'>
//           <div className='card-headerr'>
//             <h2 className='card-title'>
//               <b>Login</b>
//             </h2>
//             <div className='card-toolbar'></div>
//           </div>
//           <div className='card-body p-0'>
//             <Formik
//               initialValues={{ email: '', password: '' }}
//               validationSchema={Yup.object({
//                 email: Yup.string().email('Invalid email address').required('Email is required'),
//                 password: Yup.string().required('Password is required'),
//               })}
//               onSubmit={handleSubmit}
//             >
//               {({ isSubmitting }) => (
//                 <Form>
//                   <div className='card-p'>
//                     <div className='mb-10'>
//                       <label className='form-label'>
//                         <b>Email</b>
//                       </label>
//                       <Field
//                         type='email'
//                         className='form-control form-control-solid'
//                         placeholder='name@example.com'
//                         name='email'
//                         autoComplete='off'
//                       />
//                       <ErrorMessage name='email' component='div' className='error-message' />
//                     </div>

//                     <div className='mb-10'>
//                       <label className='form-label'>Password</label>
//                       <div className='input-group'>
//                         <Field
//                           type={showPassword ? 'text' : 'password'}
//                           className='form-control form-control-solid'
//                           placeholder='Password'
//                           name='password'
//                         />
//                         <button
//                           className='btn btn-outline-secondary'
//                           style={{ background: 'aliceblue' }}
//                           type='button'
//                           onClick={handleTogglePassword}
//                         >
//                           <i className={`bi bi-eye${showPassword ? '' : '-slash'}`}></i>
//                         </button>
//                       </div>
//                       <ErrorMessage name='password' component='div' className='error-message' />
//                     </div>
//                     <div>
//                       <p className='text-center'>
//                         <b>
//                           <Link to='/forgot-password'>Forgot password?</Link>
//                         </b>
//                       </p>
//                     </div>

//                     <div className='login-btn'>
//                       <button className='btn btn-primary custom-width' type='submit' disabled={isSubmitting}>
//                         {isLoading ? 'Loading...' : 'Login'}
//                       </button>
//                     </div>
//                   </div>
//                   <div className='register-link-container'>
//                     <p className='text-center'>
//                       <b>
//                         Not a member yet?{' '}
//                         <Link to='/register' className='register-link'>
//                           Register
//                         </Link>
//                       </b>
//                     </p>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.scss';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import Swal from 'sweetalert2';

const Login = () => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const { email, password } = values;

      // Check if the email exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        setFieldError('email', 'Email address is not registered');
        return;
      }

      setIsLoading(true);

      // Sign in with email and password
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, 'users', result.user.uid), {
        isOnline: true,
      });

      // Redirect to dashboard
      history.push('/dashboard');
    } catch (err) {
      console.error(err);
      setFieldError('password', 'Incorrect password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <br />
      <div className='col-lg-4' id='login-card'>
        <div className='card card-custom card-stretch-30 shadow'>
          <div className='card-headerr'>
            <h2 className='card-title'>
              <b>Login</b>
            </h2>
            <div className='card-toolbar'></div>
          </div>
          <div className='card-body p-0'>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={Yup.object({
                email: Yup.string().email('Invalid email address').required('Email is required'),
                password: Yup.string().required('Password is required'),
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className='card-p'>
                    <div className='mb-10'>
                      <label className='form-label'>
                        <b>Email</b> <span className='required-field'>*</span>
                      </label>
                      <Field
                        type='email'
                        className='form-control form-control-solid'
                        placeholder='name@example.com'
                        name='email'
                        autoComplete='off'
                      />
                      <ErrorMessage name='email' component='div' className='error-message' />
                    </div>

                    <div className='mb-10'>
                      <label className='form-label'>
                        <b>Password</b> <span className='required-field'>*</span>
                      </label>
                      <div className='input-group'>
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          className='form-control form-control-solid'
                          placeholder='Password'
                          name='password'
                        />
                        <button
                          className='btn btn-outline-secondary'
                          style={{ background: 'aliceblue' }}
                          type='button'
                          onClick={handleTogglePassword}
                        >
                          <i className={`bi bi-eye${showPassword ? '' : '-slash'}`}></i>
                        </button>
                      </div>
                      <ErrorMessage name='password' component='div' className='error-message' />
                    </div>
                    <div>
                      <p className='text-center'>
                        <b>
                          <Link to='/forgot-password'>Forgot password?</Link>
                        </b>
                      </p>
                    </div>

                    <div className='login-btn'>
                      <button className='btn btn-primary custom-width' type='submit' disabled={isSubmitting}>
                        {isLoading ? 'Loading...' : 'Login'}
                      </button>
                    </div>
                  </div>
                  <div className='register-link-container'>
                    <p className='text-center'>
                      <b>
                        Not a member yet?{' '}
                        <Link to='/register' className='register-link'>
                          Register
                        </Link>
                      </b>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
