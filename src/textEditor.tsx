import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase_config";

export const TextEditor = () => {
  const quillRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const docRef = doc(db, "documents", "sample_doc");

  const saveContent = () => {
    if (quillRef.current) {
      const content = quillRef.current.getEditor().getContents();
      console.log(`saving content to db `, content);

      setDoc(docRef, { content: content.ops }, { merge: true })
        .then(() => console.log("Content saved"))
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (quillRef) {
      const editor = quillRef.current.getEditor();
      editor.on("text-change", () => {
        setIsEditing(true);
        saveContent();
      });
    }
  }, []);

  return (
    <div className="editor">
      <ReactQuill ref={quillRef} />
    </div>
  );
};
