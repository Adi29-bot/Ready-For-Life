import React, { useEffect, useState } from "react";
import SpeechToText from "./voiceinput";

const CustomTextarea = ({ register, setValue, watch, fieldName, errors, placeholder }) => {
  const [text, setText] = useState(watch(fieldName) || "");
  const [isTextCleared, setIsTextCleared] = useState(false);

  useEffect(() => {
    const subscription = watch((value) => {
      setText(value[fieldName] || "");
    });
    return () => subscription.unsubscribe();
  }, [watch, fieldName]);

  const handleSpeechInput = (speechText) => {
    if (!speechText.trim()) return;

    const textarea = document.querySelector(`textarea[name="${fieldName}"]`);
    if (textarea === null) return;
    const cursorPosition = textarea.selectionStart;

    setText((prevText) => {
      const newText = prevText.substring(0, cursorPosition) + speechText + prevText.substring(cursorPosition);

      return newText;
    });

    setIsTextCleared(false);
  };
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    setValue(fieldName, value);
    setIsTextCleared(!value);
  };

  useEffect(() => {
    const updatePrintTextareas = () => {
      document.querySelectorAll(".print-textarea").forEach((printDiv) => {
        const textarea = printDiv.previousElementSibling;
        printDiv.innerText = textarea.value.trim() ? textarea.value : "No notes provided";
      });
    };

    window.addEventListener("beforeprint", updatePrintTextareas);
    return () => window.removeEventListener("beforeprint", updatePrintTextareas);
  }, []);

  return (
    <div className='mt-1'>
      <textarea
        className={`form-control border-primary d-print-none page-break ${errors[fieldName] ? "is-invalid" : ""}`}
        placeholder={placeholder}
        {...register(fieldName, { required: "Details are required" })}
        value={text}
        onChange={handleTextChange}
        style={{
          resize: "none",
          overflow: "visible",
          whiteSpace: "pre-wrap",
          height: "150px",
        }}
      />
      <div className='print-textarea d-none d-print-block'>{text || "No notes provided"}</div>
      <SpeechToText className='mt-3' onTextChange={handleSpeechInput} isTextCleared={isTextCleared} />
      {errors[fieldName] && <span className='invalid-feedback'>{errors[fieldName].message}</span>}
    </div>
  );
};

export default CustomTextarea;
