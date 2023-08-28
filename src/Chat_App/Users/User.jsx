import React, { useEffect, useState } from 'react';
import { onSnapshot, doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import './message.css';
import Img from './image1.jpeg';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const User = ({ user, selectUser, user1, chat }) => {

  const [timeDifference, setTimeDifference] = useState(null)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const user2 = user?.uid;
  const [data, setData] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0); 
  const [seenByUser1, setSeenByUser1] = useState(false); // Track if the message has been seen by user1

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
      setData(doc.data());
      setSeenByUser1(doc.data()?.seenByUser1); // Update the seenByUser1 state based on the document data
      if (doc.data()?.from !== user1 && doc.data()?.unread) {
        Swal.fire({
          title: `You received a new message from ${user.name}`,
          position: 'top',
          showConfirmButton: false,
          timer: 5000,
          //showCloseButton: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          didOpen: () => {
            const titleElement = Swal.getTitle();
            if (titleElement) {
              titleElement.style.fontSize = '13px'; // Set the desired font size
            }
          }
        });
        setNewMessageCount((prevCount) => prevCount + 1);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (data) {
      if (data?.unread) {
        const createdAt = data?.createdAt.toDate();
        const currentTime = new Date();
        const timeDifference = (currentTime - createdAt) / 60000;
        setTimeDifference(timeDifference)
      }


    }
  }, [data])

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    getDoc(doc(db, 'lastMsg', id))
      .then((docSnap) => {
        const data = docSnap.data();
        console.log(data)



        const interval = 1
        console.log("timeDifference", timeDifference)
        if (timeDifference === null) return
        if (timeDifference >= interval) {
          // here api implementation
          console.log("new unread message in not timeout")

        }
        else {

          const remainingTime = Math.max(0.01, interval - timeDifference) *60 *1000;



          setTimeout(() => {
            if (data.unread) {
              console.log(data.to)
              // const usersRef = collection(db, 'users');
              const userId = data.to;
              const userRef = doc(db, "users", userId);
              getUser(userRef)
                .then((dataNew) => {
                  const params = {
                    email: dataNew.email,
                    to_user:dataNew.name,
                  };
                  sendEmail(params)
                })
                .catch((error) => {
                  // Handle any errors that occur during the fetch
                  console.error(error);
                });
 

              console.log("new unread message in timeout", remainingTime)
            }
          }, remainingTime)
        }

      })


  }, [timeDifference])


  const getUser = async (userRef) => {
    try {
      const docSnapshot = await getDoc(userRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        return userData;
      } else {
        console.log("User does not exist");
        return null; // or throw an error if desired
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error(error);
      return null; // or throw an error if desired
    }
  };




  const handleClick = () => {
    setNewMessageCount(0); // Reset new message count to 0 when the user is selected
    selectUser(user);
  };


  const sendEmail = (params) => {
   emailjs.send('service_p6n9e88', 'template_c2cl7dm', params, 'lTXFaiBqFkSvBdSGH')
      .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
  };

  return (
    <div>
      <div
        className={`d-flex flex-stack py-3 ${chat.name === user.name && 'selected_user'}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-45px symbol-circle'>
            <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'>
              <img
                src={user?.imageUrl || Img}
                alt='avatar'
                className='avatar'
                width='50px'
                height='50px'
                style={{ borderRadius: '50%' }}
              />
            </span>
          </div>
          <span
            className={`user_status ${user.isOnline ? "badge badge-success badge-circle w-10px h-10px me-1" : "badge badge-danger badge-circle w-10px h-10px me-1"}`}
            style={{
              marginBottom: '-8%',
              marginLeft: '7%',
              position: 'absolute',
              zIndex: 1,

            }}></span>
          <div className='ms-5'>
            <a href='#' className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'>
              {user.name}
            </a>
            {data && (
              <div className='fw-bold text-gray-400' id='truncate'>
                {data.from === user1 ? 'Me: ' : null}
                {data.text}
              </div>
            )}
          </div>
        </div>
        <div className='d-flex flex-column align-items-end ms-2'>
          {newMessageCount > 0 && (
            <span className='badge badge-sm badge-circle badge-light-success'>
              {newMessageCount}
            </span>
          )}
        </div>
      </div>
      <div className='separator separator-dashed d-none'></div>
    </div>
  );
};

export default User;
