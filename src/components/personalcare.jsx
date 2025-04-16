import React, { useState, useEffect } from "react";
import { showerIcon, shaveIcon, dryerIcon, brushIcon, clothesIcon, hairCutIcon } from "./icons";

const CARE_TYPES = [
  { name: "Showering", icon: showerIcon },
  { name: "Shaving", icon: shaveIcon },
  { name: "Hair Drying", icon: dryerIcon },
  { name: "Brushing Teeth", icon: brushIcon },
  { name: "Clothes Changing", icon: clothesIcon },
  { name: "Hair Cut", icon: hairCutIcon },
];

const PersonalCareSection = ({ register, errors, showSections, handleToggle }) => {
  const [state, setState] = useState(() => {
    const savedState = JSON.parse(localStorage.getItem("personalCareState")) || {
      timeFields: { bowel: [], urination: [], care: [] },
      checkedCareTypes: CARE_TYPES.reduce((acc, { name }) => ({ ...acc, [name]: false }), {}),
      personalCareYes: false,
      bowelYes: false,
      urinationYes: false,
    };
    return savedState;
  });

  useEffect(() => {
    localStorage.setItem("personalCareState", JSON.stringify(state));
  }, [state]);

  const addTimeField = (type) => {
    setState((prev) => ({
      ...prev,
      timeFields: { ...prev.timeFields, [type]: [...prev.timeFields[type], ""] },
    }));
  };

  const removeTimeField = (type, index) => {
    setState((prev) => ({
      ...prev,
      timeFields: { ...prev.timeFields, [type]: prev.timeFields[type].filter((_, i) => i !== index) },
    }));
  };

  const handleCheckboxChange = (type) => {
    setState((prev) => {
      const newChecked = { ...prev.checkedCareTypes, [type]: !prev.checkedCareTypes[type] };
      if (newChecked[type] && !prev.timeFields.care.includes(type)) {
        addTimeField("care");
      } else if (!newChecked[type]) {
        removeTimeField("care", prev.timeFields.care.indexOf(type));
      }
      return { ...prev, checkedCareTypes: newChecked };
    });
  };

  const handleRadioChange = (type, value) => {
    handleToggle(type, value);
    if (value && state.timeFields[type].length === 0) {
      addTimeField(type);
    }
  };

  const renderCheckbox = (careType, index) => (
    <div className='col' key={index}>
      <div className='form-check'>
        <input type='checkbox' className='form-check-input' id={careType.name} checked={state.checkedCareTypes[careType.name]} onChange={() => handleCheckboxChange(careType.name)} />
        <label className='form-check-label' htmlFor={careType.name}>
          {careType.name}
          <img src={careType.icon} alt={careType.name} style={{ width: "20px", marginRight: "5px" }} />
        </label>
        {state.checkedCareTypes[careType.name] && (
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
  );

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
            {CARE_TYPES.map(renderCheckbox)}
            <input
              type='hidden'
              {...register("checkedCareTypes", {
                validate: () => {
                  const isAnyChecked = Object.values(state.checkedCareTypes).some(Boolean);
                  return isAnyChecked || "At least one checkbox must be selected";
                },
              })}
            />
            {errors.checkedCareTypes && <small className='text-danger'>{errors.checkedCareTypes.message}</small>}
          </div>
        </div>
      )}

      {/* Bowel Section */}
      <div className='row row-cols-1 row-cols-md-2 page-break'>
        {["bowel", "urination"].map((type, index) => (
          <div className='col' key={index}>
            <div className='mt-3 border border-primary p-2'>
              <div className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center flex-wrap'>
                <label className='form-label me-sm-3 mb-0' htmlFor={`${type}-yes`}>
                  <strong>{type === "bowel" ? "Opened Bowel Using Toilet" : "Urinated Using Toilet"}:</strong>
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
                    {state.timeFields[type].map((_, index) => (
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
