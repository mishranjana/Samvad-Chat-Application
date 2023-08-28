import clsx from 'clsx'
import React, {FC, useState,useEffect} from 'react'
import {Dropdown} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, QuickLinks} from '../../../partials'
import PrfileIcon from '../../../../Chat_App/icons/PrfileIcon'
import Signout from '../../../../Chat_App/icons/Signout'
import {signOut} from 'firebase/auth'
import { doc,getDoc,updateDoc} from 'firebase/firestore'
import {auth, db,storage} from '../../../../Chat_App/firebase'
import { Link,useHistory } from 'react-router-dom'
import { ref, getDownloadURL, uploadBytes,deleteObject } from "firebase/storage";

const toolbarButtonMarginClass = 'ms-1 ms-lg-3'
const toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px'
const toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px'
const toolbarButtonIconSizeClass = 'svg-icon-1'

const Topbar: FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false)

  // const handleSignout= async()=>{
  //   await updateDoc(doc(db,'users', auth.currentUser.uid),{
  //     isOnline:false
  //   })
  //   await signOut()
  // }

  const [user, setUser] = useState({ imageUrl: "" });
  const history = useHistory();
  useEffect(() => {
    const fetchUserImage = async () => {
      const user = auth.currentUser;
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);// Replace "user-id" with the actual ID of the user document in Firestore
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        
        if (userData && userData.imageUrl) {
          const downloadURL = await getDownloadURL(ref(storage, userData.imageUrl));
          setUser({ imageUrl: downloadURL });
          
        }
      }
      } catch (error) {
        // Handle the error
        console.log(error);
      }
    };
  
    fetchUserImage();

  }, []);


 
  const handleSignOut = async () => {
    if(auth.currentUser){
    await updateDoc(doc(db,'users',auth.currentUser.uid),{
      isOnline:false
    });
    await signOut(auth);
    history.push("/login")
  };
}

  return user?(
    <div className='d-flex align-items-stretch flex-shrink-0'>
      <div className='topbar d-flex align-items-stretch flex-shrink-0'>
{/*       
        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        
          <div
            className={clsx(
              'btn btn-icon btn-active-light-primary position-relative',
              toolbarButtonHeightClass
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <KTSVG
              path='/media/icons/duotune/general/gen022.svg'
              className={toolbarButtonIconSizeClass}
            />
          </div>
          <HeaderNotificationsMenu />
       
        </div> */}

       
        <div
          className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
          id='kt_header_user_menu_toggle'
        >
         
          <div
            className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <div className='dropdown'>
              <img
                className={clsx('h-25px w-25px rounded dropdown-toggle ', {
                  active: dropdownVisible,
                })}
                src={user.imageUrl}
                alt='metronic'
                id='userProfile'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                data-bs-auto-close='outside'
              />

              <form className='dropdown-menu p-4'>
                <div className='mb-3'>
                  <b
                    style={{display: 'flex', alignItems: 'center', color: 'black', padding: '5px'}}
                  >

                    <PrfileIcon />
                    &nbsp;<Link to ="./profile"> My Profile</Link>
                  </b>
                  
                </div>
                <div className='mb-3' onClick={handleSignOut}>
                  <b
                    style={{display: 'flex', alignItems: 'center', color: 'black', padding: '5px'}}
                  >
                    <Signout /> &nbsp;Sign out
                  
                  </b>
                </div>
              </form>
            </div>
          </div>
          <HeaderUserMenu />
        
        </div>
       
      </div>
    </div>
  ):null
}

export {Topbar}
