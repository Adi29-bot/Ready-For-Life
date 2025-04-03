import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { clientOptions } from "./formHelpers";
import Creatable from "react-select/creatable";
import CustomTextarea from "./customtextarea";
import ScrollButton from "./scrollbutton";
import { useFormHandlers } from "./formhandlers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";

const BehavioralRecordingSheet = () => {
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
  const { handleSave, handleReset, handlePrint } = useFormHandlers(reset, handleSubmit, getValues, "BRS_Form");
  const [highlightedOther, sethighlightedOther] = useState(false);
  const [otherEnvironment, setOtherEnvironment] = useState("");
  const clientDoing = watch("clientDoing") || [];
  const whatDidHeDo = watch("whatDidHeDo") || [];

  const handleHighlightedOther = (value) => {
    if (value === "Other") {
      sethighlightedOther(true);
    } else {
      sethighlightedOther(false);
    }
  };

  return (
    <form className='container-fluid mb-3' id='myForm'>
      <div className='row align-items-center'>
        <div className='mt-3 mb-1 text-center'>
          <h3 style={{ marginBottom: "5px" }}>Behavioural Recording Sheet for things that were difficult</h3>
        </div>
      </div>
      {/* Section 1: Name and Date/Time */}
      <div className='row align-items-center mb-2'>
        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Name</strong>
          </h6>
          <Controller
            name='clientBehaviour'
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
                    setValue("clientBehaviour", { value: label, label });
                  }}
                />
              </div>
            )}
          />
          {errors.clientBehaviour && <small className='text-danger'>{errors.clientBehaviour.message}</small>}
        </div>
        <div className='col-md-6'>
          <label className='form-label mb-0 fw-bold text-primary' htmlFor='dateTime'>
            Date and Time of Event
          </label>
          <input type='datetime-local' id='dateTime' className={`form-control border-primary ${errors.date ? "is-invalid" : ""}`} {...register("dateTime", { required: "Date and Time are required" })} />
          {errors.dateTime && <small className='text-danger'>{errors.dateTime.message}</small>}
        </div>
      </div>

      {/* Section 2: What happened IMMEDIATELY BEFORE the behaviour? */}
      <div className='mb-3 border border-primary p-2'>
        <h6 className='mb-2 fw-bold'>What happened IMMEDIATELY BEFORE the behaviour?</h6>
        <h6 className='mb-0 form-label fw-bold text-primary'>Where was the individual during the activities?</h6>
        <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"activity"} errors={errors} placeholder={"Specify the individual's location during the activities"} />

        <div className='mt-2 mb-2'>
          <h6 className='form-label fw-bold text-primary mb-0'>What was the individual doing?</h6>
          <div className='d-flex flex-wrap'>
            {["Making Loud Noise", "Slapping his thigh", "Clapping his hands", "Talking to himself", "Other"].map((option) => (
              <button
                key={option}
                type='button'
                className={`btn ${clientDoing && clientDoing.includes(option) ? "btn-primary selected" : "btn-outline-primary"} me-2 mb-1`}
                onClick={() => {
                  const currentValues = watch("clientDoing") || [];
                  if (currentValues.includes(option)) {
                    setValue(
                      "clientDoing",
                      currentValues.filter((val) => val !== option)
                    );
                  } else {
                    setValue("clientDoing", [...currentValues, option]);
                  }
                  handleHighlightedOther(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {clientDoing.length === 0 && <small className='text-danger'>Please select at least one option</small>}
          {highlightedOther && (
            <div>
              <input type='text' {...register("otherAction", { required: "Please specify other behavior" })} placeholder='Please specify' className={`form-control border-primary mt-1 ${errors.otherAction ? "is-invalid" : ""}`} />
              {errors.otherAction && <span className='invalid-feedback'>{errors.otherAction.message}</span>}
            </div>
          )}
        </div>

        <div className='mb-2'>
          <h6 className='form-label fw-bold text-primary mb-0'>What was going on around the individual?</h6>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"environment"} errors={errors} placeholder={"Describe the context of the surrounding environment"} />
        </div>

        <div className='mb-2'>
          <div className='inline-print'>
            <h6 className='form-label fw-bold text-primary mb-0'>What was the environment?</h6>
            <div>
              {["Noisy", "Quiet", "Other"].map((env) => (
                <div key={env} className='form-check form-check-inline'>
                  <input className='form-check-input' type='radio' id={`environment-${env}`} value={env} {...register("environmentType", { required: "Please select an option" })} />
                  <label className='form-check-label' htmlFor={`environment-${env}`}>
                    <strong>{env}</strong>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {errors.environmentType && <small className='text-danger'>{errors.environmentType.message}</small>}
          {watch("environmentType") === "Other" && <input type='text' {...register("environmentother", { required: "Specify the environment" })} className={`form-control border-primary ${errors.environmentother ? "is-invalid" : ""}`} placeholder='Please specify' value={otherEnvironment} onChange={(e) => setOtherEnvironment(e.target.value)} />}
        </div>

        <div className='mb-2'>
          <label className='form-label fw-bold text-primary mb-0' htmlFor='whoWith'>
            Who was with the individual?
          </label>
          <input type='text' id='whoWith' className={`form-control border-primary ${errors.whoWith ? "is-invalid" : ""}`} {...register("whoWith", { required: "Mention people involved" })} placeholder='List all people present with the individual' />
          {errors.whoWith && <span className='invalid-feedback'>{errors.whoWith.message}</span>}
        </div>

        <div>
          <h6 className='form-label fw-bold text-primary mb-0'>How well had the individual been interacting with others prior to the incident?</h6>
          <div className='d-flex justify-content-between flex-wrap'>
            {[...Array(10)].map((_, index) => {
              const value = index + 1;
              return (
                <div key={value} className='text-center mb-2'>
                  <Controller
                    name='interactionRating'
                    control={control}
                    rules={{ required: "Please select a rating" }}
                    render={({ field }) => (
                      <div>
                        <input type='radio' value={value} checked={field.value === value} onChange={() => field.onChange(value)} className='form-check-input' id={`rating-${value}`} />
                        <label htmlFor={`rating-${value}`} className='form-check-label'>
                          {value}
                        </label>
                      </div>
                    )}
                  />
                </div>
              );
            })}
          </div>
          {errors.interactionRating && <small className='text-danger'>{errors.interactionRating.message}</small>}
          <div className='text-center mt-2 rating'>
            <p className='mb-0'>1 - Very little interaction, withdrawn & sullen</p>
            <p className='mb-0'>10 - Happy & smiling, friendly & sociable</p>
          </div>
        </div>
      </div>

      {/* Section 3: What happened DURING the incident? */}
      <div className='mb-3 border border-primary p-2'>
        <h6 className='mb-2 fw-bold text-dark'>What happened DURING the incident?</h6>
        <div className='mb-2'>
          <h6 className='form-label fw-bold text-primary mb-0'>What was the first warning sign that the individual's mood may be changing?</h6>
          <div className='page-break'>
            <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"during"} errors={errors} placeholder={"Describe the first observed sign of mood alteration"} />
          </div>
        </div>

        <div className='mb-2'>
          <div className='inline-print'>
            <h6 className='form-label fw-bold text-primary mb-0'>Were there any other signs that made you concerned?</h6>
            <div>
              <div className='form-check form-check-inline'>
                <input className='form-check-input' type='radio' id='other-signs-yes' value='yes' {...register("otherSigns", { required: "Please select an option" })} />
                <label className='form-check-label' htmlFor='other-signs-yes'>
                  <strong>Yes</strong>
                </label>
              </div>
              <div className='form-check form-check-inline'>
                <input className='form-check-input' id='other-signs-no' type='radio' value='no' {...register("otherSigns")} />
                <label className='form-check-label' htmlFor='other-signs-no'>
                  <strong>No</strong>
                </label>
              </div>
            </div>
          </div>
          {errors.otherSigns && <small className='text-danger'>{errors.otherSigns.message}</small>}
          <div className='page-break'>{watch("otherSigns") === "yes" && <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"concernDetails"} errors={errors} placeholder={"If yes then list any additional signs that raised concern"} />}</div>
        </div>

        <div className='mb-2'>
          <h6 className='form-label fw-bold text-primary mb-0'>What did the individual do? </h6>
          <div className='d-flex flex-wrap'>
            {["Making Loud Noise", "Slapping his thigh", "Clapping his hands", "Talking to himself", "Other"].map((option) => (
              <button
                key={option}
                type='button'
                className={`btn ${whatDidHeDo && whatDidHeDo.includes(option) ? "btn-primary selected" : "btn-outline-primary"} me-2 mb-1`}
                onClick={() => {
                  const currentValues = watch("whatDidHeDo") || [];
                  if (currentValues.includes(option)) {
                    setValue(
                      "whatDidHeDo",
                      currentValues.filter((val) => val !== option)
                    );
                  } else {
                    setValue("whatDidHeDo", [...currentValues, option]);
                  }
                  handleHighlightedOther(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {clientDoing.length === 0 && <small className='text-danger'>Please select at least one option</small>}
          {highlightedOther && (
            <div>
              <input type='text' {...register("otherBehavior", { required: "Please specify other behavior" })} placeholder='Please specify' className={`form-control border-primary mt-1 ${errors.otherBehavior ? "is-invalid" : ""}`} />
              {errors.otherBehavior && <span className='invalid-feedback'>{errors.otherBehavior.message}</span>}
            </div>
          )}
        </div>

        <div className='mb-2'>
          <div className='inline-print'>
            <h6 className='form-label fw-bold text-primary mb-0'>Was the individual's behaviour directed towards anyone?</h6>
            <div>
              <div className='form-check form-check-inline'>
                <input className='form-check-input' type='radio' id='directed-towards-yes' value='yes' {...register("directedTowards", { required: "Please select an option" })} />
                <label className='form-check-label' htmlFor='directed-towards-yes'>
                  <strong>Yes</strong>
                </label>
              </div>
              <div className='form-check form-check-inline'>
                <input className='form-check-input' type='radio' id='directed-towards-no' value='no' {...register("directedTowards")} />
                <label className='form-check-label' htmlFor='directed-towards-no'>
                  <strong>No</strong>
                </label>
              </div>
            </div>
          </div>
          {errors.directedTowards && <small className='text-danger'>{errors.directedTowards.message}</small>}
          {watch("directedTowards") === "yes" && <input type='text' className={`form-control border-primary ${errors.whoDirected ? "is-invalid" : ""}`} {...register("whoDirected", { required: "Please specify the name" })} placeholder='Who?' />}
          {errors.whoDirected && <span className='invalid-feedback'>{errors.whoDirected.message}</span>}
        </div>
      </div>

      {/* Section 4: How did you try to calm down? */}
      <div className='mb-3 border border-primary p-2'>
        <h6 className='fw-bold text-dark'>How did you try to calm down? What did you do & say?</h6>
        <div className='mb-2 page-break'>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"calmingMethods"} errors={errors} placeholder={"Describe the verbal and physical interventions employed"} />
        </div>

        <div className='mb-2'>
          <h6 className='form-label fw-bold text-primary mb-0'>How long did it take the individual to calm down?</h6>
          <div className='page-break'>
            <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"calmDownDuration"} errors={errors} placeholder={"Indicate the length of time taken to calm the individual down"} />
          </div>
        </div>

        <div className='mb-2'>
          <h6 className='form-label fw-bold text-primary mb-0'>What seemed to help most?</h6> <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"helpedMost"} errors={errors} placeholder={"Describe the action that proved most beneficial"} />
        </div>
      </div>

      {/* Section 5: Did anything else happen later? */}
      <div className='mb-3 border border-primary p-2'>
        <h6 className='fw-bold text-dark'>Did anything else happen later? Did the incident have any consequences for the individual?</h6>
        <div className='mb-2 page-break'>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"laterConsequences"} errors={errors} placeholder={"Detail any subsequent occurrences or outcomes for the individual"} />
        </div>

        <div>
          <h6 className='form-label fw-bold text-primary mb-0'>How well was the individual interacting with others after the behaviour?</h6>
          <div className='d-flex justify-content-between flex-wrap'>
            {[...Array(10)].map((_, index) => {
              const value = index + 1;
              return (
                <div key={value} className='text-center mb-2'>
                  <Controller
                    name='postInteractionRating'
                    control={control}
                    rules={{ required: "Please select a rating" }}
                    render={({ field }) => (
                      <div>
                        <input type='radio' value={value} checked={field.value === value} onChange={() => field.onChange(value)} className='form-check-input' id={`postrating-${value}`} />
                        <label htmlFor={`postrating-${value}`} className='form-check-label'>
                          {value}
                        </label>
                      </div>
                    )}
                  />
                </div>
              );
            })}
          </div>
          {errors.postInteractionRating && <small className='text-danger'>{errors.postInteractionRating.message}</small>}
          <div className='text-center mt-2 rating'>
            <p className='mb-0'>1 - Very little interaction, withdrawn & sullen</p>
            <p className='mb-0'>10 - Happy & smiling, friendly & sociable</p>
          </div>
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

export default BehavioralRecordingSheet;
