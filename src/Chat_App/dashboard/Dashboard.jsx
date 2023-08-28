import React, { useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { HeaderWrapper } from '../../_metronic/layout/components/header/HeaderWrapper'
import './dashboard.css'
import './dashboard.scss'
import Send from '../icons/Send'
import Chat from '../icons/Chat'
import Contact from '../icons/Contact'
import { auth, db, storage } from '../firebase'
import first from '../icons/first.png'
import second from '../icons/second.webp'
import third from '../icons/third.png'
import { Dropdown } from 'react-bootstrap-v5'
import { useDropzone } from 'react-dropzone'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import User from '../Users/User'
import ContactNum from '../contact/ContactNum'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Message from '../Users/Message'
import Default from './image1.jpeg'
import { BsEmojiSmile, BsMic } from 'react-icons/bs'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { BsTranslate } from 'react-icons/bs'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [chat, setChat] = useState('')
  const [text, setText] = useState('')
  const [img, setImg] = useState('')
  const [msgs, setMsgs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [isUnRead, setIsUnRead] = useState(false)
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState('en'); // Default translation language


  const onDrop = useCallback((acceptedFiles) => {
    handleUpload(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const history = useHistory()
  const user1 = auth.currentUser?.uid

  useEffect(() => {
    const id = user1 > chat.uid ? `${user1 + chat.uid}` : `${chat.uid + user1}`
    const userData = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
      console.log('test', doc.data())
      setIsUnRead(!doc.data()?.unread)

    })
  }, [chat])

  useEffect(() => {
    if (user1) {
      const usersRef = collection(db, 'users')

      const q = query(usersRef, where('uid', 'not-in', [user1]))
      const unsub = onSnapshot(q, (querySnapshot) => {
        let users = []
        querySnapshot.forEach((doc) => {
          users.push(doc.data())
        })
        setUsers(users)
      })
      return () => unsub()
    } else {
      history.push('/login')
    }
  }, [])
  console.log('users list', users)

  const selectUser = async (user) => {
    setChat(user)
    console.log(user)
    const user2 = user.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    const msgsRef = collection(db, 'messages', id, 'chat')
    const q = query(msgsRef, orderBy('createdAt', 'asc'))

    onSnapshot(q, (querySnapshot) => {
      let msgs = []
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data())
      })
      setMsgs(msgs)
    })

    const docSnap = await getDoc(doc(db, 'lastMsg', id))
    if (docSnap.data()?.from !== user1) {
      await updateDoc(doc(db, 'lastMsg', id), {
        unread: false,
        readAt: Timestamp.fromDate(new Date()),
      })
    }

  }
  console.log('here is the messages between two user', msgs)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user2 = chat.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
    let url
    if (img) {
      const imgRef = ref(storage, `images/${new Date().getTime()}- ${img.name}`)
      const snap = await uploadBytes(imgRef, img)
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
      url = dlUrl
    }

    await addDoc(collection(db, 'messages', id, 'chat'), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
    })

    await setDoc(doc(db, 'lastMsg', id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
      unread: true,
    })

    setText('')
    setImg('')
    const selectedImageDiv = document.getElementById('selectedImage')
    selectedImageDiv.style.display = 'none'
  }

  // const [scrollRef]= useRef()
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const commands = [{ command: 'stop', callback: ({ stopTranscript }) => stopTranscript() }]
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition(commands)

  useEffect(() => {
    if (transcript) {
      setText(transcript)
    }
  }, [transcript])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

  const addEmoji = (e) => {
    const sym = e.unified.split('_')
    const codeArray = []
    sym.forEach((el) => codeArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codeArray)
    setText(text + emoji)
  }

  function handleUpload(file) {
    const uploadedImage = document.getElementById('uploadedImage')
    const selectedImageDiv = document.getElementById('selectedImage')

    if (file) {
      const reader = new FileReader()

      reader.onload = function (e) {
        uploadedImage.src = reader.result

        const crossIcon = document.createElement('i')
        crossIcon.classList.add('fas', 'fa-times', 'crossIcon')
        crossIcon.onclick = removeImage
        selectedImageDiv.style.display = 'block'
        const imageContainer = document.querySelector('.imageContainer')
        uploadedImage.style.maxWidth = '100px'
        uploadedImage.style.border = '1px solid grey'
        imageContainer.appendChild(crossIcon)
      }

      reader.readAsDataURL(file)
      setImg(file)
    }
  }

  function removeImage() {
    const selectedImageDiv = document.getElementById('selectedImage')
    selectedImageDiv.style.display = 'none'
  }

  const apiKey = 'AIzaSyDwsqW3gbcNnpRg6SkkkAB-gaHhd1jmcOw';
  const targetLanguage = 'hi'; // Target language code (e.g., 'fr' for French)

  const translateMessage = async (message, targetLanguage) => {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const requestBody = {
      q: message,
      target: targetLanguage,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.data && data.data.translations) {
        return data.data.translations[0].translatedText;
      } else {
        console.error('Translation error: Unexpected response format', data);
        return message; // Return the original message if translation fails
      }
    } catch (error) {
      console.error('Translation error:', error);
      return message; // Return the original message if translation fails
    }
  };

  const handleTranslateAllMessages = async () => {
    const translatedMsgs = await Promise.all(
      msgs.map(async (msg) => {
        const translatedText = await translateMessage(msg.text, selectedTranslationLanguage);
        return {
          ...msg,
          text: translatedText,
        };
      })
    );
    setMsgs(translatedMsgs);
  };




  return (


    <div id='dash'>
      {/* {showAlert && (
    <div className="alert alert-warning">You have unread messages!</div>
  )} */}
      <HeaderWrapper />
      <br />
      <div className='chat'>
        <div className='col-lg-4'>
          <div className='card card-custom card-stretch custom-height shadow mb-2'>
            <div className='card-header' style={{ border: 'none' }}>
              <input
                onChange={handleSearch}
                type='search'
                className='form-control form-control-solid'
                style={{ height: '43px', marginTop: '18px' }}
                placeholder='Search by username'
              />
            </div>
            <div className='card-body'>
              <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-4x mb-5 fs-6'>
                <li className='nav-item flex-fill'>
                  <a
                    className='nav-link active'
                    data-bs-toggle='tab'
                    href='#kt_tab_pane_4'
                    style={{ display: 'flex' }}
                  >
                    <Chat />
                    &nbsp; Chat
                  </a>
                </li>
                <li className='nav-item flex-fill'>
                  <a
                    className='nav-link'
                    data-bs-toggle='tab'
                    href='#kt_tab_pane_5'
                    style={{ display: 'flex' }}
                  >
                    <Contact />
                    &nbsp; Contact
                  </a>
                </li>
              </ul>

              <div className='tab-content' id='myTabContent'>
                <div className='tab-pane fade show active' id='kt_tab_pane_4' role='tabpanel'>
                  {filteredUsers.map((user) => (
                    <User
                      key={user.uid}
                      user={user}
                      selectUser={selectUser}
                      user1={user1}
                      chat={chat}
                    />
                  ))}
                </div>

                <div
                  className='tab-pane fade'
                  id='kt_tab_pane_5'
                  role='tabpanel'
                  style={{ overflow: 'scroll' }}
                >
                  {users.map((user) => (
                    <ContactNum key={user.uid} user={user} />
                  ))}
                </div>
              </div>
            </div>
            <div className='card-footer'>Samvada</div>
          </div>
        </div>

        <div className='col-lg-7' style={{ width: '65%' }}>
          <div className='card card-custom card-stretch custom-height shadow mb-2'>
            {chat ? (
              <>
                <div className='card-header'>
                  <div>
                    <h3 className='card-title mt-4'>{chat.name}</h3>

                    {chat.isOnline ? (
                      <div class='mb-0 lh-1'>
                        <span class='badge badge-success badge-circle w-10px h-10px me-1'></span>
                        <span class='fs-7 fw-bold text-gray-400'>Active</span>
                      </div>
                    ) : (
                      <div class='mb-0 lh-1'>
                        <span class='badge badge-danger badge-circle w-10px h-10px me-1'></span>
                        <span class='fs-7 fw-bold text-gray-400'>Offline</span>
                      </div>
                    )}
                  </div>
                  <div className='card-toolbar'>
                    <Dropdown>
                      <Dropdown.Toggle variant='outline-light'>
                        <span className='badge badge-circle badge-dark' style={{ cursor: 'pointer' }}>
                          <b>i</b>
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <img
                            src={chat.imageUrl || Default}
                            alt='avatar'
                            className='avatar'
                            width='50px'
                            height='50px'
                          />
                        </Dropdown.Item>
                        <Dropdown.Item>{chat.name}</Dropdown.Item>
                        <Dropdown.Item>{chat.email}</Dropdown.Item>
                        <Dropdown.Item>{chat.contact}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='messages'>
                    {msgs.length
                      ? msgs.map((msg, i) => <Message key={i} msg={msg} user1={user1} />)
                      : null}
                    {isUnRead && (
                      <>
                        <div style={{ height: '20px', aspectRatio: '1/1', borderRadius: '50%' }}>
                          <img
                            src={chat?.imageUrl}
                            alt='Seen'
                            className='avatar'
                            style={{
                              height: '100%', width: '100%', objectFit: 'contain',
                              borderRadius: '50%'
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className='card-footer'>
                  <form style={{ marginLeft: '-24px' }} onSubmit={handleSubmit}>
                    <div id='selectedImage'>
                      <div className='imageContainer'>
                        <img id='uploadedImage' src='' alt='' />
                      </div>
                    </div>
                    <div id='input'>

                      <label htmlFor='uploadImg' {...getRootProps()}>
                        <Send />
                      </label>

                      <input {...getInputProps()} style={{ display: 'none' }} />

                      <BsMic
                        size={20}
                        onClick={
                          SpeechRecognition.startListening || SpeechRecognition.stopListening
                        }
                      />

                      <div className='inputField'>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='Type something'
                          style={{ width: '703px', marginTop: '19px' }}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />

                        <span
                          onClick={() => setShowEmoji(!showEmoji)}
                          className='cursor-pointer hover:text-slate-300'
                        >
                          <BsEmojiSmile
                            size={20}
                            style={{ marginLeft: '94%', marginTop: '-9%', height: '34px' }}
                          />
                        </span>

                        {showEmoji && (
                          <div
                            className=' bottom-[100%] right-2'
                            style={{ position: 'absolute', zIndex: '9', bottom: '16%' }}
                          >
                            <Picker
                              data={data}
                              emojiSize={20}
                              emojiButtonSize={40}
                              onEmojiSelect={addEmoji}
                              maxFrequentRows={0}
                              perLine={10}
                            />
                          </div>
                        )}
                      </div>

                      <div className='icons' style={{ marginLeft: '10px' }}>
                        <button className='btn btn-primary'>SEND</button>
                      </div>
                    </div>




                  </form>
                  <div>
                    <Dropdown>
                      <Dropdown.Toggle variant='outline-light'>
                        Translate to: {selectedTranslationLanguage.toUpperCase()}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedTranslationLanguage('en')}>English</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedTranslationLanguage('es')}>Spanish</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedTranslationLanguage('fr')}>French</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedTranslationLanguage('hi')}>Hindi</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <button className='btn btn-primary' onClick={handleTranslateAllMessages}>
                      Translate All Messages</button>
                    {/* <div>
                      <BsTranslate size={20}
                        onClick={handleTranslateAllMessages}
                      /> 
                    </div> */}

                  </div>
                </div>

              </>
            ) : (
              <>
                <div
                  id='kt_carousel_1_carousel'
                  className='carousel carousel-custom slide'
                  data-bs-ride='carousel'
                  data-bs-interval='8000'
                >
                  <div
                    className='d-flex align-items-center justify-content-between flex-wrap'
                    style={{ padding: '25px' }}
                  >
                    <span className='fs-4 fw-bolder pe-2'>Select user to start conversation</span>
                    <ol className='p-0 m-0 carousel-indicators carousel-indicators-dots'>
                      <li
                        data-bs-target='#kt_carousel_1_carousel'
                        data-bs-slide-to='0'
                        className='ms-1 active'
                      ></li>
                      <li
                        data-bs-target='#kt_carousel_1_carousel'
                        data-bs-slide-to='1'
                        className='ms-1'
                      ></li>
                      <li
                        data-bs-target='#kt_carousel_1_carousel'
                        data-bs-slide-to='2'
                        className='ms-1'
                      ></li>
                    </ol>
                  </div>

                  <div className='carousel-inner pt-8' style={{ padding: '25px' }}>
                    <div
                      className='carousel-item active'
                      style={{
                        lineHeight: '2em',
                        fontWeight: '500',
                        position: 'relative',
                        width: '100%',
                        height: '100vh',

                        borderRadius: '50%',

                      }}
                    >
                      <h1>Welcome !</h1> to our chat web app! In this tab, you can experience the
                      power of real-time communication. Connect with friends, family, or colleagues
                      instantly, no matter where they are. Our app utilizes the latest technologies
                      to ensure smooth and seamless conversations.
                      <div className='tabImage'>
                        <img
                          src={first}
                          alt=''
                          style={{ height: '250px', marginTop: '20px', marginBottom: '10px' }}
                        />
                        <div style={{ color: 'gray', fontSize: '12px' }}>
                          Instant Messaging: Send and receive messages in real time, allowing for
                          quick and efficient communication.
                        </div>
                      </div>
                    </div>

                    <div
                      className='carousel-item'
                      style={{
                        lineHeight: '2em',
                        fontWeight: '500',
                        position: 'relative',
                        width: '100%',
                        height: '100vh',
                      }}
                    >
                      We take communication to the next level by allowing you to share files,
                      images, and more. Whether it's a presentation for work, a memorable photo from
                      your last vacation, or a funny GIF, our app enables you to share and view
                      various media formats effortlessly.
                      <div className='tabImage'>
                        <img
                          src={second}
                          alt=''
                          style={{ height: '250px', marginTop: '20px', marginBottom: '10px' }}
                        />
                        <div style={{ color: 'gray', fontSize: '12px' }}>
                          Image Sharing: Share memorable moments by sending and receiving images
                          directly within the chat.
                        </div>
                      </div>
                    </div>

                    <div
                      className='carousel-item'
                      style={{
                        lineHeight: '2em',
                        fontWeight: '500',
                        position: 'relative',
                        width: '100%',
                        height: '100vh',
                      }}
                    >
                      Express yourself in fun and innovative ways with our emoji and speech-to-text
                      features. We understand that sometimes words alone are not enough, so we've
                      incorporated these tools to make your conversations more lively and engaging.
                      Speech-to-Text: Utilize the power of speech recognition to convert your spoken
                      words into text. Simply tap the microphone icon, speak your message, and watch
                      it magically appear on the screen.
                      <div className='tabImage'>
                        <img
                          src={third}
                          alt=''
                          style={{ height: '200px', marginTop: '30px', marginBottom: '10px' }}
                        />
                        <div style={{ color: 'gray', fontSize: '12px' }}>
                          Emojis: Spice up your messages with a wide variety of emojis. Choose from
                          a vast library of expressive icons to add emotions and context to your
                          conversations.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
