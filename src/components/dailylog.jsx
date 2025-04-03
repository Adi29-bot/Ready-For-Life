import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Creatable from "react-select/creatable";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollButton from "./scrollbutton";
import ServiceUser from "./intro";
import ParentsSection from "./parents-carer";
import MoodSection from "./moodsection";
import PersonalCareSection from "./personalcare";
import PadChangeSection from "./padchangesection";
import BehaviourSection from "./behaviour";
import NutritionSection from "./nutrition";
import MedicationSection from "./medicationsection";
import ActivitiesSection from "./activitiessection";
import ReportSection from "./reportsection";
import FeedbackSection from "./feedbacksection";
import OfficeUseSection from "./officeusesection";
import { useFormHandlers } from "./formhandlers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";

const DailyLogForm = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: currentDate,
      officeUseEntries: [{ clientName: "", clientSignature: "", clientDate: currentDate }],
    },
  });

  const [showSections, setShowSections] = useState({
    mood: false,
    care: false,
    bowel: false,
    urination: false,
    padChange: false,
    liquid: false,
    lunch: false,
    snacks: false,
    medicine: false,
    activities: false,
    incident: false,
  });

  const { handleSave, handleReset, handlePrint } = useFormHandlers(reset, handleSubmit, getValues, "Daily_Log_Form");

  useEffect(() => {
    const savedSections = localStorage.getItem("showSections");
    if (savedSections) {
      setShowSections(JSON.parse(savedSections));
    }
  }, []);

  const handleToggle = (section, show) => {
    const newShowSections = { ...showSections, [section]: show };
    setShowSections(newShowSections);
    localStorage.setItem("showSections", JSON.stringify(newShowSections));
  };

  const renderCheckboxes = (options, name, icons = []) => {
    return (
      <div>
        <div className='row row-cols-1 row-cols-sm-3 row-cols-md-3 row-cols-lg-3 g-2 gx-5'>
          {options.map((option, index) => (
            <div key={index} className='col d-flex align-items-center flex-nowrap'>
              <input
                className='form-check-input me-2 flex-shrink-0'
                type='checkbox'
                value={option}
                {...register(name, {
                  validate: {
                    atLeastOne: (value) => {
                      const selected = value ? value.length > 0 : false;
                      return selected || "At least one checkbox must be selected";
                    },
                  },
                })}
                id={`${name}-${index}`}
              />
              <label className='form-check-label responsive-label behaviour-label' htmlFor={`${name}-${index}`} style={{ minWidth: "200px", whiteSpace: "nowrap" }}>
                {option}
                {icons[index] && <img src={icons[index]} alt='icon' className='responsive-icon' style={{ width: "25px", height: "25px", marginRight: "5px" }} />}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSelect = (name, options, rules) => {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <div className='react-select-container'>
            <Creatable {...field} options={options} isClearable isSearchable />
          </div>
        )}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(handlePrint)} className='container-fluid mb-3' id='myForm'>
      <div className='row align-items-center'>
        <div className='mt-3 text-center'>
          <h2 style={{ marginBottom: "5px" }}>Daily Log Form</h2>
        </div>
      </div>

      <ServiceUser register={register} errors={errors} control={control} renderSelect={renderSelect} />
      <ParentsSection watch={watch} showSections={showSections} handleToggle={handleToggle} register={register} errors={errors} renderCheckboxes={renderCheckboxes} setValue={setValue} />
      <MoodSection register={register} errors={errors} />
      <PersonalCareSection register={register} errors={errors} showSections={showSections} handleToggle={handleToggle} setError={setError} clearErrors={clearErrors} />
      <PadChangeSection showSections={showSections} handleToggle={handleToggle} register={register} errors={errors} control={control} />
      <BehaviourSection watch={watch} register={register} errors={errors} renderCheckboxes={renderCheckboxes} setValue={setValue} />
      <NutritionSection watch={watch} showSections={showSections} handleToggle={handleToggle} renderSelect={renderSelect} register={register} errors={errors} control={control} setValue={setValue} />
      <MedicationSection showSections={showSections} handleToggle={handleToggle} register={register} errors={errors} control={control} />
      <ActivitiesSection showSections={showSections} handleToggle={handleToggle} register={register} watch={watch} errors={errors} setValue={setValue} />
      <ReportSection showSections={showSections} handleToggle={handleToggle} register={register} errors={errors} />
      <FeedbackSection watch={watch} register={register} errors={errors} setValue={setValue} />
      <OfficeUseSection register={register} errors={errors} control={control} currentDate={currentDate} />

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

export default DailyLogForm;
