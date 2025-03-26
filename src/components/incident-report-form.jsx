import React from "react";
import { useForm, Controller } from "react-hook-form";
import { baseStaffOptions, clientOptions, useCoStaffFields, handleFieldChange, renderCoFields } from "./formHelpers";
import Creatable from "react-select/creatable";
import CustomTextarea from "./customtextarea";
import ScrollButton from "./scrollbutton";
import { useFormHandlers } from "./formhandlers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";

const IncidentReportForm = () => {
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

  const { coStaffFields: staffFields, setCoStaffFields: setStaffFields } = useCoStaffFields();
  const { coStaffFields: personCompletingFields, setCoStaffFields: setPersonCompletingFields } = useCoStaffFields();
  const { coStaffFields: witnessFields, setCoStaffFields: setWitnessFields } = useCoStaffFields();

  const { handleSave, handleReset, handlePrint } = useFormHandlers(reset, handleSubmit, getValues, "incidentReportForm");
  const firstAidRequired = watch("firstAidRequired");
  const physicalInterventionUsed = watch("physicalInterventionUsed");
  const furtherActionRequired = watch("furtherActionRequired");
  const { manager, supportStaff, parents, other } = watch("recommendationsShared") || {};

  return (
    <form className='container-fluid mb-3' id='myForm'>
      <div className='row align-items-center'>
        <div className='mt-3 text-center'>
          <h2 style={{ marginBottom: "5px" }}>Minor/Recurring Incident Report Form</h2>
        </div>
      </div>

      <div className='row mb-0'>
        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Client's Name</strong>
          </h6>
          <Controller
            name='client'
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
                    setValue("client", { value: label, label });
                  }}
                />
              </div>
            )}
          />
          {errors && errors.client && <small className='text-danger'>{errors.client.message}</small>}
        </div>

        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Staff Name</strong>
          </h6>
          <Controller
            name='staffName'
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
                    handleFieldChange(selectedOption, setStaffFields);
                  }}
                />
              </div>
            )}
          />
          {errors.staffName && <small className='text-danger'>{errors.staffName.message}</small>}
        </div>
        {renderCoFields(staffFields, control, "Co-Staff Member", setStaffFields)}
      </div>

      <div className='row mb-1'>
        <div className='col'>
          <label htmlFor='date' className='form-label mb-0 fw-bold text-primary'>
            <strong>Date</strong>
          </label>
          <input type='date' id='date' {...register("date", { required: "Date is required" })} className={`form-control border-primary ${errors.date ? "is-invalid" : ""}`} defaultValue={currentDate} />
          {errors.date && <span className='invalid-feedback'>{errors.date.message}</span>}
        </div>
        <div className='col'>
          <label htmlFor='time' className='form-label mb-0 fw-bold text-primary'>
            <strong>Time</strong>
          </label>
          <input type='time' id='time' {...register("time", { required: "Time is required" })} className={`form-control border-primary ${errors.time ? "is-invalid" : ""}`} />
          {errors.time && <span className='invalid-feedback'>{errors.time.message}</span>}
        </div>
      </div>

      <div className='row mb-1'>
        <div className='col'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Incident Type</strong>
          </h6>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"type"} errors={errors} placeholder={"Specify the type of incident (e.g., accident, injury, etc.)"} />
        </div>
        <div className='col'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Incident Location</strong>
          </h6>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"location"} errors={errors} placeholder={"Specify the exact location of the incident"} />
        </div>
      </div>

      <div className='row mb-1'>
        <div className='col'>
          <label htmlFor='people-involved' className='form-label mb-0 fw-bold text-primary'>
            <strong>People Involved</strong>
          </label>
          <input type='text' id='people-involved' {...register("peopleInvolved", { required: "Mention people involved" })} className={`form-control border-primary ${errors.peopleInvolved ? "is-invalid" : ""}`} placeholder={"Enter the names of individuals involved in the incident"} />
          {errors.peopleInvolved && <span className='invalid-feedback'>{errors.peopleInvolved.message}</span>}
        </div>
      </div>

      <div className='mb-1'>
        <h6 className='form-label mb-0 fw-bold text-primary'>
          <strong>Brief Incident Description</strong>
        </h6>
        <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"briefDescription"} errors={errors} placeholder={"Provide a brief overview of what happened"} />
      </div>

      <div className='mb-1'>
        <h6 className='form-label mb-0 fw-bold text-primary'>
          <strong>What support was given / Intervention Used / Action Taken </strong>
        </h6>
        <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"supportGiven"} errors={errors} placeholder={"Detail the support provided or any interventions or actions taken"} />
      </div>

      <div className='mb-2'>
        <h6 className='form-label mb-0 fw-bold text-primary'>
          <strong>What happened after the incident (Person's responses, wellbeing)</strong>
        </h6>
        <div className='page-break'>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"afterIncident"} errors={errors} placeholder={"Summarize what occurred following the incident"} />
        </div>
      </div>

      <div className='mb-1 border border-primary p-2'>
        <h6 className='mb-0 fw-bold text-primary'>
          <strong>Any further action required? Including any immediate recommendations?</strong>
        </h6>
        <div>
          <label htmlFor='further-yes'>
            <input type='radio' id='further-yes' value='yes' {...register("furtherActionRequired", { required: "Please select an option" })} className='me-1' />
            <strong>Yes</strong>
          </label>
          <label className='ms-3' htmlFor='further-no'>
            <input type='radio' id='further-no' value='no' {...register("furtherActionRequired")} className='me-1' />
            <strong>No</strong>
          </label>
        </div>
        {errors.furtherActionRequired && <small className='text-danger'>{errors.furtherActionRequired.message}</small>}
        {furtherActionRequired === "yes" && <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"furtherAction"} errors={errors} placeholder={"Specify any additional actions or recommendations needed"} />}
      </div>

      <div className='mb-1'>
        <h6 className='mb-0 fw-bold text-primary'>
          <strong>Have recommendations been shared with staff team, parent/carers?</strong>
        </h6>
        <div>
          <label className='me-3' htmlFor='manager'>
            <input type='checkbox' id='manager' {...register("recommendationsShared.manager")} className='me-1' />
            <strong>Manager</strong>
          </label>
          <label className='me-3' htmlFor='staff'>
            <input type='checkbox' id='staff' {...register("recommendationsShared.supportStaff")} className='me-1' />
            <strong>Support Staff</strong>
          </label>
          <label className='me-3' htmlFor='parents'>
            <input type='checkbox' id='parents' {...register("recommendationsShared.parents")} className='me-1' />
            <strong>Parents</strong>
          </label>
          <label className='me-3' htmlFor='other'>
            <input type='checkbox' id='other' {...register("recommendationsShared.other")} className='me-1' />
            <strong>Any Other</strong>
          </label>
          {other && <input type='text' {...register("recommendationsShared.otherDetails", { required: "Please specify" })} className={`form-control d-inline-block ${errors.recommendationsShared?.otherDetails ? "is-invalid" : ""}`} style={{ width: "auto" }} placeholder='Specify...' />}
          {errors.recommendationsShared?.otherDetails && <div className='invalid-feedback'>{errors.recommendationsShared.otherDetails.message}</div>}
        </div>
        {!manager && !supportStaff && !parents && !other && <small className='text-danger'>Please select at least one option</small>}
      </div>

      <div className='mb-1 border border-primary p-2'>
        <div className='inline-print'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Was First Aid Administered? If Yes, On Whom?</strong>
          </h6>
          <div>
            <label className='me-3' htmlFor='firstAid-yes'>
              <input type='radio' id='firstAid-yes' value='yes' {...register("firstAidRequired", { required: "Please select an option" })} className='me-1' />
              <strong>Yes</strong>
            </label>
            <label className='me-3' htmlFor='firstAid-no'>
              <input type='radio' id='firstAid-no' value='no' {...register("firstAidRequired")} className='me-1' />
              <strong>No</strong>
            </label>
          </div>
        </div>
        {errors.firstAidRequired && <small className='text-danger'>{errors.firstAidRequired.message}</small>}
        {firstAidRequired === "yes" && (
          <div className='row'>
            <div className='col-6'>
              <label htmlFor='onWhom' className='form-label mb-0 fw-bold text-primary'>
                <strong>On Whom</strong>
              </label>
              <input type='text' id='onWhom' {...register("onWhom", { required: "Please specify on whom first aid was administered" })} className='form-control border-primary' placeholder='Enter the name of the person who received assistance' />
              {errors.onWhom && <small className='text-danger'>{errors.onWhom.message}</small>}
            </div>
            <div className='col-6'>
              <label htmlFor='firstAider' className='form-label mb-0 fw-bold text-primary'>
                <strong>First Aider</strong>
              </label>
              <input type='text' id='firstAider' {...register("firstAider", { required: "Please specify the name of the first aider" })} className='form-control border-primary' placeholder='Enter the name of the first aider' />
              {errors.firstAider && <small className='text-danger'>{errors.firstAider.message}</small>}
            </div>

            <div className='col-6'>
              <h6 className='form-label mb-0 fw-bold text-primary'>
                <strong>Paramedic</strong>
              </h6>
              <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"paramedic"} errors={errors} placeholder={"Enter the names of the paramedics involved"} />
            </div>
            <div className='col-6'>
              <h6 className='form-label mb-0 fw-bold text-primary'>
                <strong>Details</strong>
              </h6>
              <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"firstAidDetails"} errors={errors} placeholder={"Enter any relevant information or observations"} />
            </div>
          </div>
        )}
      </div>

      <div className='mb-2 border border-primary p-2 '>
        <div className='inline-print'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Was Physical Intervention Support used?If yes who?</strong>
          </h6>
          <div>
            <label className='me-3' htmlFor='physicalIntervention-yes'>
              <input type='radio' id='physicalIntervention-yes' value='yes' {...register("physicalInterventionUsed", { required: "Please select an option" })} className='me-1' />
              <strong>Yes</strong>
            </label>
            <label className='me-3' htmlFor='physicalIntervention-no'>
              <input type='radio' id='physicalIntervention-no' value='no' {...register("physicalInterventionUsed")} className='me-1' />
              <strong>No</strong>
            </label>
          </div>
        </div>
        {errors.physicalInterventionUsed && <small className='text-danger'>{errors.physicalInterventionUsed.message}</small>}
        {physicalInterventionUsed === "yes" && <input type='text' {...register("physicalother", { required: "Please specify the name(s)" })} className={`form-control border-primary ${errors.physicalother ? "is-invalid" : ""}`} placeholder='Specify the person(s) who administered the intervention' />}
        {errors.physicalother && <small className='invalid-feedback'>{errors.physicalother.message}</small>}

        <div className='mt-1 d-flex align-items-center'>
          <label className='mb-0 fw-bold text-primary me-2' htmlFor='staffEscorted'>
            <strong>Total Number of Staff Escorts</strong>
          </label>
          <input
            type='number'
            id='staffEscorted'
            {...register("staffEscorted", {
              required: "Please enter the number of staff escorts",
              min: { value: 1, message: "Number must be at least 1" },
            })}
            className={`form-control border-primary ${errors.staffEscorted ? "is-invalid" : ""}`}
            min='1'
            style={{ width: "80px" }}
          />
          {errors.staffEscorted && <small className='text-danger ms-2'>{errors.staffEscorted.message}</small>}
        </div>
      </div>

      <div className='mb-3'>
        <h6 className='form-label mb-0 fw-bold text-primary'>
          <strong>Post Incident Observation of Person</strong>
        </h6>
        <div className='page-break'>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"postIncidentObservation"} errors={errors} placeholder={"Provide insights into the person's recovery or response"} />
        </div>
      </div>

      <div className='mb-3 border border-primary p-2'>
        <div className='inline-print'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Parents/Carers notified by:</strong>
          </h6>
          <div>
            <label className='me-3' htmlFor='textMessage'>
              <input type='radio' id='textMessage' value='textMessage' {...register("notificationMethod", { required: "Please select an option" })} className='me-1' />
              <strong>Text Message</strong>
            </label>
            <label className='me-3' htmlFor='phoneCall'>
              <input type='radio' id='phoneCall' value='phoneCall' {...register("notificationMethod")} className='me-1' />
              <strong>Phone Call</strong>
            </label>
            <label className='me-3' htmlFor='inPerson'>
              <input type='radio' id='inPerson' value='inPerson' {...register("notificationMethod")} className='me-1' />
              <strong>In Person</strong>
            </label>
          </div>
        </div>
        {errors.notificationMethod && <small className='text-danger'>{errors.notificationMethod.message}</small>}
      </div>
      <div className='alert alert-warning text-center'>
        <strong>If incidents are frequent a behaviour review meeting may be required to look at strategies/support/triggers/patterns.</strong>
      </div>

      <div className='row mb-1'>
        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Person completing form</strong>
          </h6>
          <Controller
            name='personCompleting'
            control={control}
            rules={{ required: "Provide person's name completing the form" }}
            render={({ field }) => (
              <div className='react-select-container'>
                <Creatable
                  {...field}
                  options={[...baseStaffOptions, { label: "Add another co-member", value: "add_co_member" }]}
                  isClearable
                  isSearchable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleFieldChange(selectedOption, setPersonCompletingFields);
                  }}
                />
              </div>
            )}
          />
          {errors.personCompleting && <small className='text-danger'>{errors.personCompleting.message}</small>}
        </div>
        {renderCoFields(personCompletingFields, control, "Person Completing Form", setPersonCompletingFields)}

        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Witness</strong>
          </h6>
          <Controller
            name='witness'
            control={control}
            rules={{ required: "Provide Witness Name" }}
            render={({ field }) => (
              <div className='react-select-container'>
                <Creatable
                  {...field}
                  options={[...baseStaffOptions, { label: "Add another co-member", value: "add_co_member" }]}
                  isClearable
                  isSearchable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleFieldChange(selectedOption, setWitnessFields);
                  }}
                />
              </div>
            )}
          />
          {errors.witness && <small className='text-danger'>{errors.witness.message}</small>}
        </div>
        {renderCoFields(witnessFields, control, "Witness", setWitnessFields)}
      </div>

      <div className='col-md-5'>
        <h6 className='form-label mb-0 fw-bold text-primary'>
          <strong>Parent/Carer</strong>
        </h6>
        <input type='text' {...register("parentCarer")} className='form-control border-primary' placeholder='Parent/Carer Name' />
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

export default IncidentReportForm;
