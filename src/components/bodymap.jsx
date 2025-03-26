import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { baseStaffOptions, clientOptions, useCoStaffFields, handleFieldChange, renderCoFields } from "./formHelpers";
import Creatable from "react-select/creatable";
import Front from "../images/front.png";
import Back from "../images/back.png";
import CustomTextarea from "./customtextarea";
import ScrollButton from "./scrollbutton";
import { useFormHandlers } from "./formhandlers";
import "./bodymap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";

const BodyMap = () => {
  const { coStaffFields, setCoStaffFields } = useCoStaffFields();
  const currentDate = new Date().toISOString().slice(0, 10);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm();

  const { handleSave, handleReset, handlePrint } = useFormHandlers(reset, handleSubmit, getValues, "bodyMap");
  const [bodyMarks, setBodyMarks] = useState({
    front: [],
    back: [],
  });

  const handleBodyClick = (event, bodyPart) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const adjustedY = y - 10;
    const adjustedX = x + 1;
    const existingMark = bodyMarks[bodyPart].find((mark) => {
      const distance = Math.sqrt(Math.pow(mark.x - adjustedX, 2) + Math.pow(mark.y - adjustedY, 2));
      return distance < 10;
    });

    if (existingMark) {
      setBodyMarks((prevMarks) => ({
        ...prevMarks,
        [bodyPart]: prevMarks[bodyPart].filter((mark) => mark !== existingMark),
      }));
    } else {
      setBodyMarks((prevMarks) => ({
        ...prevMarks,
        [bodyPart]: [...prevMarks[bodyPart], { x: adjustedX, y: adjustedY }],
      }));
    }
  };

  return (
    <form className='container-fluid mb-5' id='myForm'>
      <div className='row align-items-center'>
        <div className='mt-3 text-center'>
          <h2 style={{ marginBottom: "5px" }}>Body Map Form</h2>
        </div>
      </div>
      <div className='row align-items-center name-date'>
        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Name</strong>
          </h6>
          <Controller
            name='bodymapclient'
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
                    setValue("bodymapclient", { value: label, label });
                  }}
                />
              </div>
            )}
          />
          {errors.bodymapclient && <small className='text-danger'>{errors.bodymapclient.message}</small>}
        </div>
        <div className='col-md-6'>
          <label htmlFor='date' className='form-label mb-0 fw-bold text-primary'>
            <strong>Date</strong>
          </label>
          <input type='date' name='date' className={`form-control border-primary ${errors.date ? "is-invalid" : ""}`} id='date' {...register("date", { required: "Date is required" })} defaultValue={currentDate} />
          {errors.date && <div className='invalid-feedback'>{errors.date.message}</div>}
        </div>
      </div>

      {/* Front and Back Body Row */}
      <div className='row front-back'>
        <div className='col-md-6 d-flex flex-column align-items-center'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Front Body</strong>
          </h6>
          <div
            style={{
              position: "relative",
              border: "1px solid #ccc",
              width: "200px",
              height: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={(e) => handleBodyClick(e, "front")}
          >
            <img src={Front} alt='Front Body' style={{ width: "100%", height: "100%" }} />
            {bodyMarks.front.map((mark, index) => (
              <span
                key={index}
                style={{
                  position: "absolute",
                  left: mark.x - 5,
                  top: mark.y - 5,
                  fontSize: "20px",
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setBodyMarks((prevMarks) => ({
                    ...prevMarks,
                    front: prevMarks.front.filter((_, i) => i !== index),
                  }));
                }}
              >
                x
              </span>
            ))}
          </div>
        </div>
        <div className='col-md-6 d-flex flex-column align-items-center'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Back Body</strong>
          </h6>
          <div
            style={{
              position: "relative",
              border: "1px solid #ccc",
              width: "200px",
              height: "400px",
            }}
            onClick={(e) => handleBodyClick(e, "back")}
          >
            <img src={Back} alt='Back Body' style={{ width: "100%", height: "100%" }} />
            {bodyMarks.back.map((mark, index) => (
              <span
                key={index}
                style={{
                  position: "absolute",
                  left: mark.x - 5,
                  top: mark.y - 5,
                  fontSize: "20px",
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setBodyMarks((prevMarks) => ({
                    ...prevMarks,
                    back: prevMarks.back.filter((_, i) => i !== index),
                  }));
                }}
              >
                x
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className='mb-1'>
        <h6 className='form-label mb-0 fw-bold text-primary'>
          <strong>Injury Description</strong>
        </h6>
        <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"injury"} errors={errors} placeholder={"Describe the Injury..."} />
      </div>

      <div className='row staff page-break'>
        <div className='col-md-4'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Staff Name</strong>
          </h6>
          <Controller
            name='staffNamebodymap'
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
          {errors.staffNamebodymap && <small className='text-danger'>{errors.staffNamebodymap.message}</small>}
        </div>
        {renderCoFields(coStaffFields, control, "Co-Staff Member", setCoStaffFields)}

        <div className='col-md-4'>
          <label htmlFor='staffSignature' className='form-label mb-0 fw-bold text-primary'>
            <strong>Staff Signature</strong>
          </label>
          <input
            type='text'
            id='staffSignature'
            placeholder='Staff Signature'
            className={`form-control border-primary ${errors.staffSignature ? "is-invalid" : ""}`}
            {...register("staffSignature", {
              required: "Staff Signature is required",
            })}
          />
          {errors.staffSignature && <div className='invalid-feedback'>{errors.staffSignature.message}</div>}
        </div>
        <div className='col-md-4'>
          <label htmlFor='staffDate' className='form-label mb-0 fw-bold text-primary'>
            <strong>Date</strong>
          </label>
          <input type='date' id='staffDate' className={`form-control border-primary ${errors.staffDate ? "is-invalid" : ""}`} {...register("staffDate", { required: "Date is required" })} defaultValue={currentDate} />
          {errors.staffDate && <div className='invalid-feedback'>{errors.staffDate.message}</div>}
        </div>
      </div>

      <div className='row mb-3 parent page-break'>
        <div className='col-md-4'>
          <label htmlFor='parentName' className='form-label mb-0 fw-bold text-primary '>
            <strong>Parents/Carers Name</strong>
          </label>
          <input
            type='text'
            id='parentName'
            placeholder='Parents/Carers Name'
            className={`form-control border-primary ${errors.parentName ? "is-invalid" : ""}`}
            {...register("parentName", {
              required: "Provide Parents/Carer Name",
            })}
          />
          {errors.parentName && <div className='invalid-feedback'>{errors.parentName.message}</div>}
        </div>
        <div className='col-md-4'>
          <label htmlFor='parentSignature' className='form-label mb-0 fw-bold text-primary'>
            <strong>Staff Signature</strong>
          </label>
          <input
            type='text'
            className={`form-control border-primary ${errors.parentSignature ? "is-invalid" : ""}`}
            id='parentSignature'
            placeholder='Staff Signature'
            {...register("parentSignature", {
              required: "Staff Signature is required",
            })}
          />
          {errors.parentSignature && <div className='invalid-feedback'>{errors.parentSignature.message}</div>}
        </div>
        <div className='col-md-4'>
          <label htmlFor='parentDate' className='form-label mb-0 fw-bold text-primary'>
            <strong>Date</strong>
          </label>
          <input type='date' id='parentDate' className={`form-control border-primary ${errors.parentDate ? "is-invalid" : ""}`} {...register("parentDate", { required: "Date is required" })} />
          {errors.parentDate && <div className='invalid-feedback'>{errors.parentDate.message}</div>}
        </div>
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
  );
};

export default BodyMap;
