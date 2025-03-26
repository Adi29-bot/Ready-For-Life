import React, { useState, useEffect } from "react";
import { showerIcon, shaveIcon, dryerIcon, brushIcon, clothesIcon, hairCutIcon } from "./icons";
const PersonalCareSection = ({ register, errors, showSections, handleToggle, setError, clearErrors }) => {
  const [timeFields, setTimeFields] = useState({
    bowelMovement: [],
    urination: [],
    care: [],
  });

  const [checkedCareTypes, setCheckedCareTypes] = useState({
    Showering: false,
    Shaving: false,
    "Hair Drying": false,
    "Brushing Teeth": false,
    "Clothes Changing": false,
    "Hair Cut": false,
  });

  const addTimeField = (type) => {
    setTimeFields((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }));
  };

  const removeTimeField = (type, index) => {
    setTimeFields((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleCheckboxChange = (type) => {
    setCheckedCareTypes((prev) => {
      const newChecked = { ...prev, [type]: !prev[type] };
      if (newChecked[type] && !timeFields.care.includes(type)) {
        addTimeField("care");
      } else if (!newChecked[type]) {
        removeTimeField("care", timeFields.care.indexOf(type));
      }
      return newChecked;
    });
  };

  const handleRadioChange = (type, value) => {
    handleToggle(type, value);
    if (value === true) {
      if (timeFields[type] && Array.isArray(timeFields[type]) && timeFields[type].length === 0) {
        addTimeField(type);
      }
    }
  };

  useEffect(() => {
    const isAnyChecked = Object.values(checkedCareTypes).some((isChecked) => isChecked);
    if (!isAnyChecked) {
      setError("checkbox", { type: "manual", message: "At least one checkbox must be selected" });
    } else {
      clearErrors("checkbox");
    }
  }, [checkedCareTypes, setError, clearErrors]);

  return (
    <div className='mt-1 border border-primary p-3'>
      <div className='d-flex justify-content-start'>
        <h6 className='mb-0 fw-bold text-primary'>
          <strong>Personal Care:</strong>
        </h6>
        <div className='ms-3'>
          <input type='radio' id='care-yes' value='yes' {...register("personalCare", { required: "Please select an option" })} onChange={() => handleRadioChange("care", true)} />
          <label className='ms-1 me-3' htmlFor='care-yes'>
            <strong>Yes</strong>
          </label>
          <input type='radio' id='care-no' value='no' {...register("personalCare", { required: "Please select an option" })} onChange={() => handleRadioChange("care", false)} />
          <label className='ms-1' htmlFor='care-no'>
            <strong>No</strong>
          </label>
          <span className='ms-3 text-muted'>(If yes, please specify which type of care performed)</span>
        </div>
      </div>
      {errors.personalCare && <small className='text-danger'>{errors.personalCare.message}</small>}

      {showSections.care && (
        <div className='mt-1'>
          <h6>
            <strong>Type of Care</strong>
          </h6>
          <div className='row page-break'>
            {["Showering", "Shaving", "Hair Drying", "Brushing Teeth", "Clothes Changing", "Hair Cut"].map((careType, index) => (
              <div className='col' key={index}>
                <div className='form-check'>
                  <input type='checkbox' className='form-check-input' id={careType} checked={checkedCareTypes[careType] || false} onChange={() => handleCheckboxChange(careType)} />
                  <label className='form-check-label' htmlFor={careType}>
                    {careType}
                    <img src={[showerIcon, shaveIcon, dryerIcon, brushIcon, clothesIcon, hairCutIcon][index]} alt={careType} style={{ width: "20px", marginRight: "5px" }} />
                  </label>
                  {checkedCareTypes[careType] && (
                    <div className='d-flex align-items-end mt-1'>
                      <label className='me-1' htmlFor={`careTime-${index}`}>
                        Time:
                      </label>
                      <input
                        type='time'
                        className={`form-control w-auto ${errors.careTime ? "is-invalid" : ""}`}
                        id={`careTime-${index}`}
                        {...register(`careTime[${index}]`, {
                          required: "Time is required",
                          validate: (value) => value !== "" || "Time is required",
                        })}
                      />
                      {errors.careTime && <span className='invalid-feedback'>{errors.careTime.message}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {errors.checkbox && <small className='text-danger'>At least one checkbox must be selected</small>}
          </div>
        </div>
      )}

      {/* Toilet Section */}
      <div className='row row-cols-1 row-cols-md-2 page-break '>
        {["bowelMovement", "urination"].map((type, index) => (
          <div className='col' key={index}>
            <div className='mt-3 border border-primary p-2'>
              <div className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center flex-wrap'>
                <label className='form-label me-sm-3 mb-0' htmlFor={`${type}-yes`}>
                  <strong>{type === "bowelMovement" ? "Opened Bowel Using Toilet" : "Urinated Using Toilet"}:</strong>
                </label>
                <div className='mb-2 mb-sm-0 d-flex flex-wrap'>
                  <input className='me-1' type='radio' {...register(type, { required: "Please select an option" })} value='yes' onChange={() => handleRadioChange(type, true)} id={`${type}-yes`} />
                  <label className='form-check-label me-2 text-nowrap' htmlFor={`${type}-yes`}>
                    <strong>Yes</strong>
                  </label>
                  <input className='me-1' type='radio' {...register(type, { required: "Please select an option" })} value='no' onChange={() => handleRadioChange(type, false)} id={`${type}-no`} />
                  <label className='form-check-label text-nowrap' htmlFor={`${type}-no`}>
                    <strong>No</strong>
                  </label>
                </div>
                {showSections[type] && (
                  <>
                    {timeFields[type].map((_, index) => (
                      <div key={index} className='d-flex align-items-center mt-2 mt-sm-0 flex-wrap'>
                        <label className='ms-2 me-1 mb-0 text-nowrap' htmlFor={`${type}Time-${index}`}>
                          Time:
                        </label>
                        <div className='col-auto'>
                          <input
                            type='time'
                            className={`form-control w-auto mb-2 ${errors[`${type}Time`] ? "is-invalid" : ""}`}
                            id={`${type}Time-${index}`}
                            {...register(`${type}Time[${index}]`, {
                              required: "Time is required",
                              validate: (value) => value !== "" || "Time is required",
                            })}
                          />
                          {errors[`${type}Time`] && errors[`${type}Time`][index] && <span className='text-danger'>{errors[`${type}Time`][index].message}</span>}
                        </div>
                        <button type='button' className='btn btn-danger ms-2' style={{ marginTop: "-7px" }} onClick={() => removeTimeField(type, index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className='add'>
                      <button type='button' className='btn btn-primary' onClick={() => addTimeField(type)}>
                        Add Time
                      </button>
                    </div>
                  </>
                )}
              </div>
              {errors[type] && <small className='text-danger'>{errors[type].message}</small>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalCareSection;
