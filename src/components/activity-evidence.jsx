import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { baseStaffOptions, clientOptions, useCoStaffFields, handleFieldChange, renderCoFields } from "./formHelpers";
import Creatable from "react-select/creatable";
import CustomTextarea from "./customtextarea";
import { useFormHandlers } from "./formhandlers";
import ScrollButton from "./scrollbutton";
import "./activity-evidence.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";

import { CommunicationIcon, ParticipationIcon, SocialisingIcon, FollowingInstructionsIcon, GoodListeningIcon, HavingFunIcon, EngagingIcon, ShowingInterestIcon } from "./icons";
const ActivityEvidence = () => {
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
  } = useForm();
  const activityOptions = [
    { label: "Energizer ⚡️", value: "energizer" },
    { label: "Arts & Craft 🎨", value: "artsAndCraft" },
    { label: "Outings 🏞️", value: "outings" },
    { label: "Swimming 🏊‍♂️", value: "swimming" },
    { label: "Bowling 🎳", value: "bowling" },
    { label: "Sports Hall 🏟️", value: "sportsHall" },
    { label: "Onsite 📍", value: "onsite" },
    { label: "GYM 🏋️‍♂️", value: "gym" },
    { label: "Cooking 🍳", value: "cooking" },
    { label: "Trampoline 🤸‍♂️", value: "trampoline" },
    { label: "Sports 🏀", value: "sports" },
    { label: "Film 🎬", value: "film" },
    { label: "Themed Topic 💡", value: "themedTopic" },
    { label: "Music 🎵", value: "music" },
    { label: "Sensory Room 🧘", value: "sensoryRoom" },
    { label: "TV/Main Area 📺", value: "tvMainArea" },
    { label: "Offsite/Onsite 🚌", value: "offsiteOnsite" },
    { label: "Park 🌳", value: "park" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const learningOptions = [
    { name: "Communication", value: "communication", icon: CommunicationIcon },
    { name: "Participation", value: "participation", icon: ParticipationIcon },
    { name: "Socialising", value: "socialising", icon: SocialisingIcon },
    { name: "Following Instructions", value: "followingInstructions", icon: FollowingInstructionsIcon },
    { name: "Good Listening", value: "goodListening", icon: GoodListeningIcon },
    { name: "Having Fun", value: "havingFun", icon: HavingFunIcon },
    { name: "Engaging", value: "engaging", icon: EngagingIcon },
    { name: "Showing Interest", value: "showingInterest", icon: ShowingInterestIcon },
  ];

  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const { handleSave, handleReset, handlePrint } = useFormHandlers(reset, handleSubmit, getValues, "activityEvidence");

  const checkIfMobileOrTablet = () => {
    const width = window.innerWidth;
    setIsMobileOrTablet(width <= 768);
  };

  useEffect(() => {
    checkIfMobileOrTablet();
    window.addEventListener("resize", checkIfMobileOrTablet);
    return () => {
      window.removeEventListener("resize", checkIfMobileOrTablet);
    };
  }, []);

  const openCamera = async () => {
    setIsCameraOpen(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setIsCameraOpen(false);
  };

  const uploadPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem("savedPhoto", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const savedImage = localStorage.getItem("savedPhoto");
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  return (
    <form className='container-fluid mb-3' id='myForm'>
      <div className='row align-items-center'>
        <div className='mt-3 text-center'>
          <h2 style={{ marginBottom: "5px" }}>Activity Evidence Sheet</h2>
        </div>
      </div>

      <div className='row name-activity'>
        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Name</strong>
          </h6>
          <Controller
            name='clientevidence'
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
                    setValue("clientevidence", { value: label, label });
                  }}
                />
              </div>
            )}
          />
          {errors.clientevidence && <small className='text-danger'>{errors.clientevidence.message}</small>}
        </div>
        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Activity</strong>
          </h6>
          <Controller
            name='activity'
            control={control}
            rules={{ required: "Activity is required" }}
            render={({ field }) => (
              <div className='react-select-container'>
                <Creatable
                  {...field}
                  isClearable
                  isSearchable
                  options={activityOptions}
                  onCreateOption={(label) => {
                    setValue("activity", { value: label, label });
                  }}
                />
              </div>
            )}
          />
          {errors.activity && <small className='text-danger'>{errors.activity.message}</small>}
        </div>
      </div>

      <div className='row mb-1 date-time'>
        <div className='col-md-6'>
          <label htmlFor='date' className='form-label mb-0 fw-bold text-primary'>
            <strong>Date</strong>
          </label>
          <input type='date' className={`form-control border-primary ${errors.date ? "is-invalid" : ""}`} id='date' {...register("date", { required: "Date is required" })} defaultValue={currentDate} />
          {errors.date && <div className='invalid-feedback'>{errors.date.message}</div>}
        </div>
        <div className='col-md-6'>
          <label htmlFor='timeevidence' className='form-label mb-0 fw-bold text-primary'>
            <strong>Time</strong>
          </label>
          <input type='time' className={`form-control border-primary ${errors.timeevidence ? "is-invalid" : ""}`} id='timeevidence' {...register("timeevidence", { required: "Time is required" })} />
          {errors.timeevidence && <div className='invalid-feedback'>{errors.timeevidence.message}</div>}
        </div>
      </div>

      <div className='photo-explanation mb-0'>
        <div className='mb-1 photo'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Photo</strong>
          </h6>
          <div className='border p-3 text-center d-flex flex-column align-items-center justify-content-center' style={{ minHeight: "200px" }}>
            {isCameraOpen ? (
              <>
                <video ref={videoRef} autoPlay className='w-50' />
                <button type='button' className='btn btn-primary mt-2' onClick={capturePhoto}>
                  Capture
                </button>
              </>
            ) : image ? (
              <div className='text-center'>
                <img src={image} alt='Captured' style={{ width: "350px", height: "350px" }} />
              </div>
            ) : (
              <span>No Image</span>
            )}
          </div>
          <div className='mt-2'>
            {!isMobileOrTablet && (
              <button type='button' className='btn btn-secondary me-2' onClick={openCamera}>
                Take Photo
              </button>
            )}
            <input type='file' className='form-control d-inline-block w-auto' accept='image/*' {...register("photo")} onChange={uploadPhoto} />
          </div>
          {errors.photo && <small className='text-danger'>{errors.photo.message}</small>}
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        <div className='mb-1 explanation'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Explanation</strong>
          </h6>
          <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName={"explanation"} errors={errors} placeholder={"Explanation..."} />
        </div>
      </div>

      <div className='mb-3'>
        <h6 className='form-label mb-0 fw-bold text-primary'>
          <strong>Learning from activity</strong>
        </h6>
        <div className='row row-cols-1 row-cols-sm-3 row-cols-md-3 row-cols-lg-3 g-2 gx-5'>
          {learningOptions.map((option) => (
            <div className='col d-flex align-items-center flex-nowrap' key={option.value}>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input me-2 flex-shrink-0'
                  id={`learning-${option.value}`}
                  value={option.value}
                  {...register("learning", {
                    validate: {
                      atLeastOne: (value) => {
                        const selected = value ? value.length > 0 : false;
                        return selected || "At least one checkbox must be selected";
                      },
                    },
                  })}
                />
                <label className='form-check-label responsive-label' htmlFor={`learning-${option.value}`} style={{ minWidth: "120px", whiteSpace: "nowrap" }}>
                  {option.name}
                  <img src={option.icon} alt={option.name} style={{ width: "25px", height: "25px", marginLeft: "8px" }} />
                </label>
              </div>
            </div>
          ))}
        </div>
        {errors.learning && <small className='text-danger'>{errors.learning.message}</small>}
      </div>

      <div className='row  mb-3 staff-signature page-break'>
        <div className='col-md-6'>
          <h6 className='form-label mb-0 fw-bold text-primary'>
            <strong>Staff Name</strong>
          </h6>
          <Controller
            name='staffevidence'
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
          {errors.staffevidence && <small className='text-danger'>{errors.staffevidence.message}</small>}
        </div>
        {renderCoFields(coStaffFields, control, "Co-Staff Member", setCoStaffFields)}
        <div className='col-md-6'>
          <label htmlFor='signature' className='form-label mb-0 fw-bold text-primary'>
            <strong>Signature</strong>
          </label>
          <input type='text' className={`form-control border-primary ${errors.signature ? "is-invalid" : ""}`} id='signature' {...register("signature", { required: "Signature is required" })} placeholder='Staff Signature' />
          {errors.signature && <div className='invalid-feedback'>{errors.signature.message}</div>}
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

export default ActivityEvidence;
