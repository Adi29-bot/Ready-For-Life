import React from "react";
import CustomTextarea from "./customtextarea";
import { Settled, Un_Setteled, Angry, Positive, Negative, Aggressive, Sleep, Tired, Breakfast, No_Breakfast, Cooperative, Non_Cooperative } from "./icons";

const ParentsSection = ({ watch, showSections, handleToggle, register, errors, setValue, renderCheckboxes }) => {
  return (
    <div className='mt-1 border border-primary p-3'>
      <div className='d-flex justify-content-start'>
        <h6 className='mb-0 fw-bold text-primary'>
          <strong>Anything to Report from Parents/Carer: </strong>
        </h6>
        <div className='ms-3'>
          <input type='radio' id='report-yes' value='yes' {...register("reportFromParents", { required: "Please select an option" })} onChange={() => handleToggle("mood", true)} />
          <label className='ms-1 me-3' htmlFor='report-yes'>
            <strong>Yes</strong>
          </label>
          <input type='radio' id='report-no' value='no' {...register("reportFromParents", { required: "Please select an option" })} onChange={() => handleToggle("mood", false)} />
          <label className='ms-1' htmlFor='report-no'>
            <strong>No</strong>
          </label>
          <span className='ms-3 text-muted '>(If yes, please specify)</span>
        </div>
      </div>
      {errors.reportFromParents && <small className='text-danger'>{errors.reportFromParents.message}</small>}

      {showSections.mood && (
        <div className='mt-2'>
          <h6>
            <strong>Mood</strong>
          </h6>
          <div className='row'>{renderCheckboxes(["Settled Mood", "Un-Settled Mood", "Agitated", "Positive Behaviour", "Negative Behaviour", "Aggressive", "Good Sleep", "Not a Good Sleep", "Have Breakfast ", "No Breakfast ", "Cooperative", "Non-Cooperative"], "mood", [Settled, Un_Setteled, Angry, Positive, Negative, Aggressive, Sleep, Tired, Breakfast, No_Breakfast, Cooperative, Non_Cooperative])}</div>
          {errors.mood && <small className='text-danger'>{errors.mood.message}</small>}
        </div>
      )}
      <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName='moodDetails' errors={errors} placeholder={"Anything additional to report"} />
    </div>
  );
};

export default ParentsSection;
