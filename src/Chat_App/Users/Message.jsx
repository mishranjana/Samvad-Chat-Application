import  { useEffect, useState, useRef } from 'react';
import Moment from 'react-moment';
import './message.css';
import { db } from '../firebase';
import 'firebase/firestore';

const Message = ({ msg, user1, text, isSeen }) => {
  const [seenByUser2, setSeenByUser2] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    const fetchMessageStatus = async () => {
      try {
        const messageRef = db.collection('messages').doc(msg.id);
        const messageSnapshot = await messageRef.get();

        if (messageSnapshot.exists) {
          const messageData = messageSnapshot.data();
          setSeenByUser2(messageData.seenByUser2);
        }
      } catch (error) {
        console.error('Error fetching message status:', error);
      }
    };

    fetchMessageStatus();
  }, [msg.id]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [msg]);



  const isUserSender = msg.from === user1;

  return (
    <div className={`Message_wrapper ${isUserSender ? 'own' : ''}`}>
      <p id="p" className={isUserSender ? 'me' : 'friend'} ref={messageRef}>
        {!isUserSender && !seenByUser2 ? null : (
          <img
            id="user2-image"
            src={msg.user2Image}
            alt="User 2"
            style={{ display: seenByUser2 ? 'inline' : 'none' }}
          />
        )}
        {msg.media ? <img id="simage" src={msg.media} alt={msg.text} /> : null}
        {msg.text}
        <br />
        <small className="small">
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
        <div className={`message ${isSeen ? 'seen' : ''}`}>
          <div className="text">{text}</div>
          {isSeen && <div className="status">Seen</div>}
        </div>
      </p>
    </div>
  );
};

export default Message;



