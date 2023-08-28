import React, { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link ,useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import Swal from 'sweetalert2';

const initialValues = {
  email: 'admin@demo.com',
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
});

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const history = useHistory();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (values) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      setResetSent(true);
      Swal.fire({
        title: 'Email Sent',
        text: 'Email link sent to the provided email address.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        history.push('/login');
      });
    } catch (error) {
      console.log(error);
      formik.setFieldError(
        'email',
        <span style={{marginLeft: "-13px"}}>Email address does not exist</span>
      );
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className='col-lg-4' id='login-card'>
      <div className='card card-custom card-stretch-30  shadow '>
        <div className='card-headerr'>
          <h2 className='card-title'>
            <b></b>
          </h2>
          <div className='card-toolbar'></div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
          noValidate
          id='kt_login_password_reset_form'
        >
          <div className='text-center mb-10'>
            <h1 className='text-dark mb-3'>Forgot Password?</h1>
            <div className='text-gray-400 fw-bold fs-4'>Enter your email to reset your password.</div>
          </div>

          <div className='mb-10'>
            <label className='form-label'>
              <b style={{ marginLeft: '26px' }}>Email</b>
            </label>
            <input
              style={{
                width: '89%',
                marginLeft: '21px',
              }}
              type='email'
              autoComplete='off'
              className={clsx('form-control form-control-solid', {
                'is-invalid': formik.touched.email && formik.errors.email,
              })}
              placeholder='name@example.com'
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='invalid-feedback' style={{marginLeft: "130px"}}>{formik.errors.email}</div>
            )}
          </div>

          <div className='d-flex flex-wrap justify-content-center pb-lg-0' style={{ marginBottom: '41px' }}>
            <button
              type='submit'
              id='kt_password_reset_submit'
              className='btn btn-lg btn-primary fw-bolder me-4'
            >
              <span className='indicator-label'>Submit</span>
            </button>

            <Link to='/login'>
              <button
                type='button'
                id='kt_login_password_reset_form_cancel_button'
                className='btn btn-lg btn-light-primary fw-bolder'
              >
                Cancel
              </button>
            </Link>{' '}
          </div>
          <div>
            {/* forgot password page */}
          </div>
          <div>
            {/* forgot password page */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
