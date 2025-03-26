import React, { useState } from "react";
import { useLottie } from "lottie-react";
import happyAnimation from "./happy.json";
import neutralAnimation from "./neutral.json";
import sadAnimation from "./sad.json";

const moodOptions = [
  { value: "happy", animation: happyAnimation },
  { value: "neutral", animation: neutralAnimation },
  { value: "sad", animation: sadAnimation },
];

const lottieStyle = {
  width: "40px",
  height: "40px",
  display: "inline-block",
  cursor: "pointer",
};

const MoodSection = ({ register, errors }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const lottieRefs = {};

  return (
    <div className='mt-1 border border-primary p-3'>
      <h6 className='mb-0 fw-bold text-primary'>
        <strong>Service User Mood Expressions when arrived at Centre:</strong>
      </h6>
      <div className='d-flex align-items-center'>
        {moodOptions.map((mood) => {
          const { View, play, stop } = useLottie({
            animationData: mood.animation,
            loop: false,
            autoplay: false,
            style: lottieStyle,
          });

          lottieRefs[mood.value] = { play, stop };

          const handleChange = () => {
            if (selectedMood && lottieRefs[selectedMood]) {
              lottieRefs[selectedMood].stop();
            }
            play();
            setSelectedMood(mood.value);
          };

          return (
            <div key={mood.value} className='form-check me-3'>
              <input className='form-check-input' type='radio' style={{ width: "15px", height: "15px" }} {...register("emojiExpression", { required: "Please select a mood expression" })} value={mood.value} id={`emoji-${mood.value}`} onChange={handleChange} />
              <label className='form-check-label' htmlFor={`emoji-${mood.value}`} style={lottieStyle} onMouseEnter={play} onMouseLeave={stop}>
                {View}
              </label>
            </div>
          );
        })}
      </div>
      {errors.emojiExpression && <small className='text-danger'>{errors.emojiExpression.message}</small>}
    </div>
  );
};

export default MoodSection;
