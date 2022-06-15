import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import { formatRelative } from "date-fns/esm";
import Picker from "emoji-picker-react";
import "./Chat.css";
import firebase from "firebase/app";
import { storage } from "../firebase/firebase";

const formatDate = (date) => {
  let formattedDate = "";
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(new Date(date * 1000), new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

function Chat({
  newMessages,
  handleLogOut,
  setNewMessages,
  handleAddMessages,
  messages,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  
  const [progress, setProgress] = useState(0);
  const onEmojiClick = (event, emojiObject) => {
    setNewMessages((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const changeFiles = (e) => {
    const files = e.target[0].files[0];
    if (files) {
      setImageUpload(files);
    }
  };

  const handleUploadImages = () => {
    if (imageUpload == null) return;
    const uploadImages = storage
      .ref(`files/${imageUpload.name}`)
      .put(imageUpload);

    uploadImages.on(
      "state_changed",
      (snapshot) => {
        const progressLoad = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes * 100) 
        );
        setProgress(progressLoad);
      },
      (err) => console.log(err),
      () => {
        storage
          .ref("files")
          .child(imageUpload.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setImageUpload(url)
          });
      }
    );
  };

  return (
    <>
      <div className="header">
        <div className="header_flex">
          <h3>ChatApp</h3>
          <Button onClick={handleLogOut} variant="contained" color="primary">
            Log Out
          </Button>
        </div>
      </div>

      <div className="box_chat">
        <h1>Welcome to Chat App</h1>

        {messages.map((mess) => (
          <div className="messages" key={mess.id}>
            <div className="messages_box">
              <div className="logo">
                <img src={mess.photoURL} alt="" />
              </div>
              <div className="info">
                <div className="nickname">
                  <p>{mess.displayName}</p>
                  <span>{formatDate(mess.createAt?.seconds)}</span>
                </div>
                <div className="title">
                  <p>{mess.title}</p>
                </div>
              </div>
            </div>

         
          </div>
        ))}

        <div className="send_messages">
          <div className="send_messages_flex">
            <input
              type="text"
              className="send_input"
              value={newMessages}
              placeholder="Messages"
              onChange={(e) => setNewMessages(e.target.value)}
            />

            {showPicker && (
              <Picker
                pickerStyle={{ width: "100%", marginTop: "-400px" }}
                onEmojiClick={onEmojiClick}
              />
            )}
            <div className="btn">
              <SendIcon
                onClick={() => {
                  handleAddMessages();
                  handleUploadImages()
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
