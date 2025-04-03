import React, { useEffect } from "react";
import { clientOptions } from "./formHelpers";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Creatable from "react-select/creatable";
import { useFormHandlers } from "./formhandlers";
import ScrollButton from "./scrollbutton";
import "./mar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";

const MAR = () => {
  const currentDate = new Date().toISOString().slice(0, 10);

  const defaultMedications = (() => {
    const storedMedications = localStorage.getItem("marMedications");
    return storedMedications ? JSON.parse(storedMedications) : [{ date: currentDate, time: "", medication: "", dose: "", signature1: "", signature2: "" }];
  })();

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
      medications: defaultMedications,
    },
  });

  const { handleSave, handleReset, handlePrint } = useFormHandlers(reset, handleSubmit, getValues, "MAR_Form");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  useEffect(() => {
    localStorage.setItem("marMedications", JSON.stringify(watch("medications")));
  }, [watch("medications")]);

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div>
      <form className='container-fluid mb-3 no-display' id='myForm'>
        <div className='row align-items-center'>
          <div className='mt-3 text-center'>
            <h2 style={{ marginBottom: "5px" }}>Medication Administering Recording Form</h2>
          </div>
        </div>

        <div className='row mt-2 mb-3 align-items-center'>
          <div className='col-md-6'>
            <h6 className='form-label mb-0 fw-bold text-primary'>
              <strong>Young Person's Name</strong>
            </h6>
            <Controller
              name='youngPersonName'
              control={control}
              rules={{ required: "Provide Young Person's Name" }}
              render={({ field }) => (
                <div className='react-select-container'>
                  <Creatable
                    {...field}
                    isClearable
                    isSearchable
                    options={clientOptions}
                    onCreateOption={(label) => {
                      setValue("youngPersonName", { value: label, label });
                    }}
                  />
                </div>
              )}
            />
            {errors.youngPersonName && <small className='text-danger'>{errors.youngPersonName.message}</small>}
          </div>
          <div className='col-md-6' style={{ bottom: "5px" }}>
            <label htmlFor='medication' className='form-label mb-0 fw-bold text-primary'>
              <strong>Medication</strong>
            </label>
            <input type='text' id='medication' placeholder='Medication' {...register("medication", { required: "Medication is required" })} className={`form-control border-primary ${errors.medication ? "is-invalid" : ""}`} />
            {errors.medication && <div className='invalid-feedback'>{errors.medication.message}</div>}
          </div>
        </div>

        <div className='alert alert-warning text-center'>
          <strong>Always two workers must be present to administer medications. The medication must always be in a named pack with pharmacy label</strong>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className='mb-3 border border-primary p-3'>
            <div className='row'>
              <div className='col-md-6'>
                <label htmlFor={`medicationDetails[${index}].date`} className='form-label mb-0 fw-bold text-primary'>
                  <strong>Date</strong>
                </label>
                <input type='date' id={`medicationDetails[${index}].date`} {...register(`medicationDetails[${index}].date`, { required: "Date is required" })} className={`form-control border-primary ${errors.medicationDetails?.[index]?.date ? "is-invalid" : ""}`} defaultValue={currentDate} />
                {errors.medicationDetails?.[index]?.date && <div className='invalid-feedback'>{errors.medicationDetails[index].date.message}</div>}
              </div>
              <div className='col-md-6'>
                <label htmlFor={`medicationDetails[${index}].time`} className='form-label mb-0 fw-bold text-primary'>
                  <strong>Time</strong>
                </label>
                <input type='time' id={`medicationDetails[${index}].time`} {...register(`medicationDetails[${index}].time`, { required: "Time is required" })} className={`form-control border-primary ${errors.medicationDetails?.[index]?.time ? "is-invalid" : ""}`} />
                {errors.medicationDetails?.[index]?.time && <div className='invalid-feedback'>{errors.medicationDetails[index].time.message}</div>}
              </div>
            </div>
            <div className='row mt-1'>
              <div className='col-md-6'>
                <label htmlFor={`medicationDetails[${index}].medication`} className='form-label mb-0 fw-bold text-primary'>
                  <strong>Medication</strong>
                </label>
                <input
                  type='text'
                  id={`medicationDetails[${index}].medication`}
                  placeholder='Medication'
                  {...register(`medicationDetails[${index}].medication`, {
                    required: "Medication is required",
                  })}
                  className={`form-control border-primary ${errors.medicationDetails?.[index]?.medication ? "is-invalid" : ""}`}
                />
                {errors.medicationDetails?.[index]?.medication && <div className='invalid-feedback'>{errors.medicationDetails[index].medication.message}</div>}
              </div>
              <div className='col-md-6'>
                <label htmlFor={`medicationDetails[${index}].dose`} className='form-label mb-0 fw-bold text-primary'>
                  <strong>Dose</strong>
                </label>
                <input type='text' id={`medicationDetails[${index}].dose`} placeholder='Dose' {...register(`medicationDetails[${index}].dose`, { required: "Dose is required" })} className={`form-control border-primary ${errors.medicationDetails?.[index]?.dose ? "is-invalid" : ""}`} />
                {errors.medicationDetails?.[index]?.dose && <div className='invalid-feedback'>{errors.medicationDetails[index].dose.message}</div>}
              </div>
            </div>
            <div className='row mt-1'>
              <div className='col-md-6'>
                <label htmlFor={`medicationDetails[${index}].signature1`} className='form-label mb-0 fw-bold text-primary'>
                  <strong>Signature 1</strong>
                </label>
                <input
                  type='text'
                  id={`medicationDetails[${index}].signature1`}
                  placeholder='Signature 1'
                  {...register(`medicationDetails[${index}].signature1`, {
                    required: "Signature 1 is required",
                  })}
                  className={`form-control border-primary ${errors.medicationDetails?.[index]?.signature1 ? "is-invalid" : ""}`}
                />
                {errors.medicationDetails?.[index]?.signature1 && <div className='invalid-feedback'>{errors.medicationDetails[index].signature1.message}</div>}
              </div>
              <div className='col-md-6'>
                <label htmlFor={`medicationDetails[${index}].signature2`} className='form-label mb-0 fw-bold text-primary'>
                  <strong>Signature 2</strong>
                </label>
                <input
                  type='text'
                  id={`medicationDetails[${index}].signature2`}
                  placeholder='Signature 2'
                  {...register(`medicationDetails[${index}].signature2`, {
                    required: "Signature 2 is required",
                  })}
                  className={`form-control border-primary ${errors.medicationDetails?.[index]?.signature2 ? "is-invalid" : ""}`}
                />
                {errors.medicationDetails?.[index]?.signature2 && <div className='invalid-feedback'>{errors.medicationDetails[index].signature2.message}</div>}
              </div>
            </div>

            <button type='button' className='btn btn-danger mt-2' onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type='button' className='btn btn-primary' onClick={() => append({})}>
          Add Medication Entry
        </button>

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
          <h2>Medication Administering Recording Form</h2>
          <div className='print-name'>
            <h6 className='form-label mb-0 fw-bold text-primary'>
              <strong className='text-primary'>Young Person's Name: </strong>
              <span className='text-dark'>{watch("youngPersonName")?.label}</span>
            </h6>
          </div>
          <div className='print-medication'>
            <h6 className='form-label mb-0 fw-bold text-primary'>
              <strong className='text-primary'>Medication: </strong>
              <span className='text-dark'>{watch("medication")}</span>
            </h6>
          </div>
          <div className='alert alert-warning text-center'>
            <strong>Always two workers must be present to administer medications. The medication must always be in a named pack with pharmacy label</strong>
          </div>
        </div>

        <table className='print-table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Medication</th>
              <th>Dose</th>
              <th>Signature 1</th>
              <th>Signature 2</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr className='page-break' key={field.id}>
                <td>{watch(`medicationDetails[${index}].date`)}</td>
                <td>{formatTime(watch(`medicationDetails[${index}].time`))}</td>
                <td>{watch(`medicationDetails[${index}].medication`)}</td>
                <td>{watch(`medicationDetails[${index}].dose`)}</td>
                <td>{watch(`medicationDetails[${index}].signature1`)}</td>
                <td>{watch(`medicationDetails[${index}].signature2`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MAR;
