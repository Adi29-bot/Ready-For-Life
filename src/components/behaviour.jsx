import React from "react";
import CustomTextarea from "./customtextarea";
import { Settled, Un_Setteled, Calm, Happy, Sad, Excited, Normal, Neutral, Anxious, Upset, Yawn, Agitated } from "./icons";

const BehaviourSection = ({ watch, register, errors, renderCheckboxes, setValue }) => {
  return (
    <div className='mt-3 border border-primary p-3'>
      <h6 className='mb-0 text-primary'>
        <strong>Behaviour Assessment:</strong>
        <span className='ms-2 text-muted'>(What mood was the Service User in Morning & Afternoon? Please Specify)</span>
      </h6>

      <div className='row'>
        {["morning", "afternoon"].map((time, index) => (
          <div className='col-lg-6 col-md-12' key={index}>
            <div className='card p-3'>
              <h5 className='card-title'>{time.charAt(0).toUpperCase() + time.slice(1)} Mood</h5>
              {renderCheckboxes(["Settled Mood", "Un-Settled Mood", "Calm Mood", "Happy Mood", "Un-Happy Mood", "Excited Mood", "Normal Mood", "Neutral Mood", "Anxious Mood", "Upset Mood", "Tired Mood", "Agitated Mood"], `behaviour.${time}`, [Settled, Un_Setteled, Calm, Happy, Sad, Excited, Normal, Neutral, Anxious, Upset, Yawn, Agitated])}
            </div>
            {errors.behaviour && errors.behaviour[time] && <small className='text-danger'>{errors.behaviour[time].message}</small>}
          </div>
        ))}
      </div>
      <div className='page-break'>
        <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName='moodDescription' errors={errors} placeholder={"Brief description of Service User Mood throughout the day? If upset Why?"} />
      </div>
    </div>
  );
};

export default BehaviourSection;
