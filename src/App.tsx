import { useEffect } from "react";
import "./App.css";
import { auth } from "./firebase_config";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { TextEditor } from "./textEditor";

function App() {
  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) console.log(user.uid);
    });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Google Docs</h1>
      </header>
      <TextEditor />
    </div>
  );
}

export default App;
