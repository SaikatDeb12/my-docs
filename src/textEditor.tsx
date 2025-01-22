import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { setDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase_config";
import "react-quill/dist/quill.snow.css";
import "./App.css";
import throttle from "lodash/throttle";

export const TextEditor = () => {
  const quillRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const isLocalChange = useRef<boolean>(false);

  const docRef = doc(db, "documents", "sample_doc");

  const saveContent = throttle(() => {
    if (quillRef.current && isLocalChange.current) {
      const content = quillRef.current.getEditor().getContents();
      console.log(`saving content to db `, content);

      setDoc(docRef, { content: content.ops }, { merge: true })
        .then(() => console.log("Content saved"))
        .catch(console.error);
      isLocalChange.current = false;
    }
  }, 1000);

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

      const unSubs = onSnapshot(docRef, (snapshort) => {
        if (snapshort.exists()) {
          const newContent = snapshort.data().content;
          if (!isEditing) {
            const editor = quillRef.current.getEditor();
            const currentCursorPos = editor.getSelection()?.index || 0;

            editor.setContents(newContent, "silent");
            editor.setSelection(currentCursorPos);
          }
        }
      });

      const editor = quillRef.current.getEditor();
      editor.on("text-change", (_: any, __: any, source: any) => {
        if (source == "user") {
          isLocalChange.current = true;
          setIsEditing(true);
          saveContent();

          setTimeout(() => setIsEditing(false), 5000);
        }
      });

      return () => {
        unSubs();
        editor.off("text-change");
      };
    }
  }, []);

  return (
    <div className="editor">
      <ReactQuill ref={quillRef} />
    </div>
  );
};
