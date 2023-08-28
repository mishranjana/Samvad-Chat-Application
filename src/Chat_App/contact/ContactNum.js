import React from 'react'

const ContactNum = ({user}) => {
  return (
    <div>
      <div className='d-flex flex-stack py-4'>
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-45px symbol-circle'>
            <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'>
              <img
                src={user?.imageUrl}
                alt='avatar'
                className='avatar'
                width='50px'
                height='50px'
                style={{borderRadius: '50%'}}
              />
            </span>
          </div>

          <div className='ms-5'>
            <a href='#' className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'>
              {user.contact}
            </a>
            <div className='fw-bold text-gray-400'>{user.name}</div>
          </div>
        </div>

        <div className='d-flex flex-column align-items-end ms-2'>
          <span className='text-muted fs-7 mb-1'></span>
        </div>
      </div>

      <div className='separator separator-dashed d-none'></div>
    </div>
  )
}

export default ContactNum
