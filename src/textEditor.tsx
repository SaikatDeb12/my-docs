import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase_config";
import "react-quill/dist/quill.snow.css";
import "./App.css";

export const TextEditor = () => {
  const quillRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const isLocalChange = useRef<boolean>(false);

  const docRef = doc(db, "documents", "sample_doc");

  const saveContent = () => {
    if (quillRef.current && isLocalChange.current) {
      const content = quillRef.current.getEditor().getContents();
      console.log(`saving content to db `, content);

      setDoc(docRef, { content: content.ops }, { merge: true })
        .then(() => console.log("Content saved"))
        .catch(console.error);
      isLocalChange.current = false;
    }
  };

  useEffect(() => {
    if (quillRef) {
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const savedContent = docSnap.data().content;
            if (savedContent) {
              quillRef.current.getEditor().setContents(savedContent);
            } else {
              console.log("no doc starting with empty editor");
            }
          }
        })
        .catch(console.error);
      const editor = quillRef.current.getEditor();
      editor.on("text-change", (f_arg: any, s_arg: any, source: any) => {
        if (source == "user") {
          isLocalChange.current = true;
          setIsEditing(true);
          saveContent();

          setTimeout(() => setIsEditing(false), 5000);
        }
      });
    }
  }, []);

  return (
    <div className="editor">
      <ReactQuill ref={quillRef} />
    </div>
  );
};
