import React, { useEffect, useState } from "react";
import "./App.css"
import Button from "./components/Button";
import Chat from "./components/Chat.jsx";
import { auth, db } from "./firebase/firebase";
import firebase from "firebase/app";
const App = () => {
  const [user, setUser] = useState(() => auth.currentUser);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");

  const handleAddMessages = async () => {
    
    if (db) {
      await db.collection("chatdb").add({
        title: newMessages,
        createAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      });
    }

    setNewMessages("")
  };
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    const unsub = db
      .collection("chatdb")
      .orderBy("createAt")
      .limit(100)
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(data);
      });

    return unsub;
  }, [db]);

  const handleSigninWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };

  const handleLogOut = async () => {
    await firebase.auth().signOut();
  };

  return (
    <>
      {user ? (
        <Chat
          newMessages={newMessages}
          setNewMessages={setNewMessages}
          handleAddMessages={handleAddMessages}
          messages={messages}
         
          handleLogOut={handleLogOut}
        />
      ) : (
       <div className="login">
          <Button handleSigninWithGoogle={handleSigninWithGoogle}>
            Sign in with Google
          </Button>
       </div>
      )}
    </>
  );
};

export default App;
