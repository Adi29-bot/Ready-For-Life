import React from "react";
import CustomTextarea from "./customtextarea";

const FeedbackSection = ({ watch, register, errors, setValue }) => {
  const feedbackToParents = watch("feedbackToParents");

  return (
    <div className='mt-1 border border-primary p-3'>
      <div className='d-flex justify-content-start'>
        <h6 className='mb-0 fw-bold text-primary'>
          <strong>Feedback to Parents/Carer:</strong>
        </h6>
        <div className='ms-2 d-flex align-items-center'>
          <input type='radio' id='feedback-yes' value='yes' {...register("feedbackToParents", { required: "Please select an option" })} />
          <label className='ms-1 me-3' htmlFor='feedback-yes'>
            <strong>Yes</strong>
          </label>
          <input type='radio' id='feedback-no' value='no' {...register("feedbackToParents", { required: "Please select an option" })} />
          <label className='ms-1' htmlFor='feedback-no'>
            <strong>No</strong>
          </label>
        </div>
      </div>
      {errors.feedbackToParents && <small className='text-danger'>{errors.feedbackToParents.message}</small>}

      <div className='page-break'>{feedbackToParents === "yes" && <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName='additionalComments' errors={errors} placeholder={"Any Additional Comments (Any other Observations, Incidents or Notes)"} />}</div>
    </div>
  );
};

export default FeedbackSection;
