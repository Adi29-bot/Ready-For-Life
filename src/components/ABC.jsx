import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { baseStaffOptions, clientOptions, useCoStaffFields, handleFieldChange, renderCoFields } from "./formHelpers";
import Creatable from "react-select/creatable";
import CustomTextarea from "./customtextarea";
import ScrollButton from "./scrollbutton";
import { useFormHandlers } from "./formhandlers";
import "./mar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";

function ABC() {
  const currentDate = new Date().toISOString().slice(0, 10);
  const { coStaffFields, setCoStaffFields } = useCoStaffFields();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      date: [currentDate],
    },
  });
  const { handleSave, handleReset, handlePrint } = useFormHandlers(reset, handleSubmit, getValues, "ABC_Form");
  const [abcSections, setAbcSections] = useState(() => {
    const storedSections = localStorage.getItem("abcSections");
    return storedSections ? JSON.parse(storedSections) : [0];
  });

  useEffect(() => {
    localStorage.setItem("abcSections", JSON.stringify(abcSections));
  }, [abcSections]);

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const addSection = () => {
    const newIndex = abcSections.length;
    setAbcSections([...abcSections, newIndex]);
    setValue(`date${newIndex}`, currentDate);
  };

  const removeSection = (index) => {
    if (abcSections.length > 1) {
      setAbcSections(abcSections.filter((i) => i !== index));
    }
  };

  return (
    <div>
      <form className='container-fluid mb-3 no-display' id='myForm'>
        <div className='row align-items-center'>
          <div className='mt-3 text-center'>
            <h2 style={{ marginBottom: "5px" }}>ABC (Antecedent, Behavior, Consequence) Chart Form</h2>
          </div>
        </div>

        {/* Name Selection */}
        <div className='mb-3'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Client</strong>
          </h6>
          <Controller
            name='name'
            control={control}
            rules={{ required: "Provide Client Name" }}
            render={({ field }) => (
              <div className='react-select-container'>
                <Creatable
                  {...field}
                  isClearable
                  isSearchable
                  options={clientOptions}
                  onCreateOption={(label) => {
                    setValue("name", { value: label, label });
                  }}
                />
              </div>
            )}
          />
          {errors && errors.name && <small className='text-danger'>{errors.name.message}</small>}
        </div>

        {abcSections.map((_, index) => (
          <div key={index} className='mb-3 border border-primary p-3'>
            {/* Date and Time */}
            <div className='row mb-3'>
              <span className='text-muted'>(Date/Time when the behavior occurred)</span>
              <div className='col-md-3'>
                <label htmlFor={`date-${index}`} className='form-label mb-0 fw-bold text-primary'>
                  <strong>Date</strong>
                </label>
                <input type='date' id={`date-${index}`} {...register(`date${index}`, { required: "Date is required" })} className={`form-control border-primary ${errors[`date${index}`] ? "is-invalid" : ""}`} defaultValue={currentDate} />
                {errors[`date${index}`] && <div className='invalid-feedback'>{errors[`date${index}`].message}</div>}
              </div>
              <div className='col-md-3'>
                <label className='form-label mb-0 fw-bold text-primary' htmlFor={`from-${index}`}>
                  <strong>From</strong>
                </label>
                <input type='time' id={`from-${index}`} {...register(`from[${index}]`, { required: "Time is required" })} className={`form-control border-primary ${errors.from?.[index] ? "is-invalid" : ""}`} />
                {errors && errors.from && errors.from[index] && <div className='invalid-feedback'>{errors.from[index].message}</div>}
              </div>
              <div className='col-md-3'>
                <label className='form-label mb-0 fw-bold text-primary' htmlFor={`to-${index}`}>
                  <strong>To</strong>
                </label>
                <input type='time' id={`to-${index}`} {...register(`to[${index}]`, { required: "Time is required" })} className={`form-control border-primary ${errors.to?.[index] ? "is-invalid" : ""}`} />
                {errors && errors.to && errors.to[index] && <div className='invalid-feedback'>{errors.to[index].message}</div>}
              </div>
            </div>

            {/* Activity */}
            <div className='mb-3'>
              <h6 className='form-label mb-0 fw-bold text-primary'>
                <strong>Activity</strong>
                <span className='ms-2 text-muted'>(What activity was going on when the behavior occurred)</span>
              </h6>
              <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={`activity${index}`} errors={errors} placeholder={"Describe the activity..."} />
            </div>

            {/* Antecedent */}
            <div className='mb-3'>
              <h6 className='form-label mb-0 fw-bold text-primary'>
                <strong>Antecedent</strong>
                <span className='ms-2 text-muted'>(What happened right before the behavior that may have triggered the behavior)</span>
              </h6>
              <CustomTextarea watch={watch} register={register} setValue={setValue} f fieldName={`antecedent${index}`} errors={errors} placeholder={"Describe the antecedent..."} />
            </div>

            {/* Behavior */}
            <div className='mb-3'>
              <h6 className='form-label mb-0 fw-bold text-primary'>
                <strong>Behavior</strong>
                <span className='ms-2 text-muted'>(What the behavior looked like)</span>
              </h6>
              <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={`behavior${index}`} errors={errors} placeholder={"Describe the behavior..."} />
            </div>

            {/* Consequence */}
            <div className='mb-3'>
              <h6 className='form-label mb-0 fw-bold text-primary'>
                <strong>Consequence</strong>
                <span className='ms-2 text-muted'>(What happened after the behavior, or as a result of the behavior)</span>
              </h6>
              <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={`consequence${index}`} errors={errors} placeholder={"Describe the consequence..."} />
            </div>

            {abcSections.length > 1 && (
              <button type='button' className='btn btn-danger btn-sm' onClick={() => removeSection(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type='button' className='btn btn-outline-dark btn-sm mb-3' onClick={addSection}>
          Add
        </button>

        <div className='row'>
          <div className='col-md-6 intro-flex mb-0'>
            <h6 className='mb-0 fw-bold text-primary'>
              <strong>Staff Name</strong>
            </h6>
            <Controller
              name='staffNameABC'
              control={control}
              rules={{ required: "Provide Staff Name" }}
              render={({ field }) => (
                <div className='react-select-container'>
                  <Creatable
                    {...field}
                    options={[...baseStaffOptions, { label: "Add another co-member", value: "add_co_member" }]}
                    isClearable
                    isSearchable
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      handleFieldChange(selectedOption, setCoStaffFields);
                    }}
                  />
                </div>
              )}
            />
            {errors.staffNameABC && <small className='text-danger'>{errors.staffNameABC.message}</small>}
          </div>
          {renderCoFields(coStaffFields, control, "Co-Staff Member", setCoStaffFields)}
        </div>

        <div className='mt-3 mb-3 d-flex justify-content-center'>
          <button type='button' className='btn btn-primary' onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} className='me-2' />
            Save
          </button>
          <button type='button' className='ms-3 btn btn-danger' onClick={handleReset}>
            <FontAwesomeIcon icon={faFile} className='me-2' />
            New
          </button>
          <button type='button' className='ms-3 btn btn-success' onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} className='me-2' />
            Print
          </button>
        </div>
        <ScrollButton />
      </form>

      <div className='print-box'>
        <div className='print-header mt-4'>
          <h2>ABC (Antecedent, Behavior, Consequence) Chart Form</h2>
          <div className='print-name'>
            <h6 className='form-label mb-0 fw-bold text-primary'>
              <strong className='text-primary'>Name: </strong>
              <span className='text-dark'>{watch("name")?.label}</span>
            </h6>
          </div>
        </div>

        <table className='print-table'>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Activity</th>
              <th>Antecedent</th>
              <th>Behavior</th>
              <th>Consequence</th>
              <th>Staff to Sign</th>
            </tr>
          </thead>
          <tbody>
            <tr className='header-row'>
              <td>Date/Time when the behavior occurred</td>
              <td>What activity was going on when the behavior occurred</td>
              <td>What happened right before the behavior that may have triggered the behavior</td>
              <td>What the behavior looked like</td>
              <td>What happened after the behavior, or as a result of the behavior</td>
              <td></td>
            </tr>
            {abcSections.map((index) => (
              <tr className='page-break' key={index}>
                <td>
                  {watch(`date${index}`)}, {formatTime(watch(`from[${index}]`))} to {formatTime(watch(`to[${index}]`))}
                </td>
                <td>{watch(`activity${index}`)}</td>
                <td>{watch(`antecedent${index}`)}</td>
                <td>{watch(`behavior${index}`)}</td>
                <td>{watch(`consequence${index}`)}</td>
                <td>
                  {watch("staffNameABC")?.label} {coStaffFields.length > 0 && <span>{` ${coStaffFields.map((field) => watch(`co_staff_${field.id}`)?.label).join(", ")}`}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ABC;
