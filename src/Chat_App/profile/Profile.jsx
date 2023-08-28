import React, { useEffect, useState } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db, auth, storage } from '../firebase'
import './profile.scss'
import Img from '../dashboard/image1.jpeg'
import { Link, useHistory } from 'react-router-dom'
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { getDoc, updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { Button } from 'react-bootstrap-v5'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
const Profile = () => {
  const [user, setUser] = useState(null)
  const [img, setImg] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const [isHovered, setIsHovered] = useState(false)
  const history = useHistory()

  const [show, setShow] = useState(false);
  const [formattedContact, setFormattedContact] = useState('');



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const currentUser = () => {
    if (auth.currentUser) {
      getDoc(doc(db, 'users', auth.currentUser.uid)).then((docSnap) => {
        if (docSnap.exists) {
          const userData = docSnap.data();
          const { name, email, imageUrl, contact, createdAt } = userData; // Extract specific properties
          setUser({ name, email, imageUrl, contact, createdAt }); // Set the extracted properties as separate values
          console.log(userData);
        }
      });

    }
  }
const handlePhoneNumberChange = (valid, value, countryData, formattedNumber) => {
    const contactWithCountryCode = `+${countryData.dialCode}${value}`;
    setContact(value);
    setFormattedContact(contactWithCountryCode);
  };

  useEffect(() => {

    if (auth.currentUser) {
      currentUser();
    }


    else {
      history.push("/login")
    }
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(storage, `userImages/${new Date().getTime()}-${user.uid}`)

        try {
          if (user.imageUrl) {
            await deleteObject(ref(storage, user.imageUrl))
          }
          const snap = await uploadBytes(imgRef, img)
          console.log(snap.ref.fullPath) //image path
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath))

          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            imageUrl: url,
            imageUrlPath: snap.ref.fullPath,
          })
          setImg('')
        } catch (err) {
          console.log(err.message)
        }
      }
      uploadImg()
    }
  }, [img]) // put ,[img] after }, .....uncommenting the image code for upload image







  const handleSaveChanges = async () => {
    console.log('Formatted Contact:', formattedContact);

    try {
      if (name || contact) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          name: name || user.name,
          contact: formattedContact || user.contact,
        })
      }
      currentUser();

      setShow(false)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })

      Toast.fire({
        icon: 'success',
        title: 'Profile updatd succesfully!',
      })
      // history.push('/dashboard')
    } catch (err) {
      console.error(err)
    }
  };


  const handleDeleteImage = async () => {
    try {
      const result = await Swal.fire({
        title: 'Delete Avatar?',
        text: 'Are you sure you want to delete your avatar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })

      if (result.isConfirmed) {
        await deleteObject(ref(storage, user.imageUrl))

        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          imageUrl: '',
          imageUrlPath: '',
        })

        history.push('/dashboard')
      }
    } catch (err) {
      console.log(err.message)
    }
  }





  return user ? (
    <div className='card card-custom' id='profile'>
      <div className='card-header'>
        <h2 className='card-title'>Profile</h2>
        <div className='card-toolbar'>
          <div className='profile-btn'>
            <button
              className='btn btn-sm btn-primary'
              type='submit'
              style={{ alignItems: 'center', marginLeft: '-13%' }}
              // onClick={handleSaveChanges}
              onClick={handleShow}
            >
              <b>Edit</b>
            </button>
          </div>
          <Link to='/dashboard'>
            <button type='button' className='btn btn-sm btn-danger'>
              Cancel
            </button>
          </Link>
        </div>
      </div>


      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" >
              <Form.Label>User-Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={user.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Contact</Form.Label>

              <br />
              <IntlTelInput
                style={{ width: "100%" }}
                containerClassName="intl-tel-input"
                inputClassName="form-control"
                placeholder={user.contact}
                value={contact}
                onPhoneNumberChange={handlePhoneNumberChange}
                preferredCountries={['in']}
              />

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>





      <div className='card-body' style={{ height: '286px' }}>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div
                className={`profile-image-container ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src={user.imageUrl || Img}
                  alt='avatar'
                  height='200px'
                  width='200px'
                  className='avatar-image'
                />
                {isHovered && (

                  <>
                    <label htmlFor='image-upload' className='camera-icon'>
                      <i className='fas fa-camera fa-lg' style={{ marginLeft: '-142px' }}></i>

                    </label>
                    <input
                      id='image-upload'
                      style={{ display: 'none' }}
                      type='file'
                      accept='image/*'
                      onChange={(e) => setImg(e.target.files[0])}
                    />

                    {user.imageUrl && (
                      <span className='delete-icon' onClick={handleDeleteImage}>
                        <i className='fas fa-trash-alt fa-lg' style={{ marginLeft: '-105px' }}></i>
                      </span>
                    )}
                  </>


                )}
              </div>
            </div>
            <div className='col'>

              <h5>
                Name: {user.name}

              </h5>

              <h5>Email: {user.email}</h5>

              <h5>Contact: {user.contact}</h5>


              <hr />
              <p>Joined On: {user.createdAt && user.createdAt.toDate().toDateString()}</p>
            </div>
          </div>
          <div id='details'></div>
        </div>
      </div>
    </div>
  ) : null
}

export default Profile
