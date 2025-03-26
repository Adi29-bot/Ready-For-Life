import { useEffect } from "react";

export const useFormHandlers = (reset, handleSubmit, getValues, formId) => {
  const handleSave = () => {
    const formData = getValues();
    localStorage.setItem(`${formId}FormData`, JSON.stringify(formData));
  };

  const handleReset = () => {
    reset();
    localStorage.removeItem(`${formId}FormData`);
    localStorage.removeItem("savedPhoto");
    window.location.reload();
  };

  const handlePrint = () => {
    handleSubmit((data) => {
      localStorage.setItem(`${formId}FormData`, JSON.stringify(data));
      window.print();
    })();
  };

  useEffect(() => {
    const resetFlag = sessionStorage.getItem("resetForm");
    if (resetFlag === "true") {
      handleReset();
      sessionStorage.removeItem("resetForm");
    } else {
      const savedData = localStorage.getItem(`${formId}FormData`);
      if (savedData) {
        try {
          reset(JSON.parse(savedData));
        } catch (error) {
          console.error("Error parsing saved data:", error);
          localStorage.removeItem(`${formId}FormData`);
        }
      }
    }
  }, [reset, formId]);

  return { handleSave, handleReset, handlePrint };
};
