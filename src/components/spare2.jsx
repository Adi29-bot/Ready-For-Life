import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStop } from "@fortawesome/free-solid-svg-icons";

const SpeechToText = ({ onTextChange, isTextCleared }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const lastTranscript = useRef("");
  const isManuallyStopped = useRef(false);

  const mobileAndTabletCheck = () => {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  const isMobileOrTablet = mobileAndTabletCheck();

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isTextCleared) {
      lastTranscript.current = "";
    }
  }, [isTextCleared]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    isManuallyStopped.current = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = !isMobileOrTablet;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscripts = "";
      let finalTranscripts = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscripts += event.results[i][0].transcript + " ";
        } else {
          interimTranscripts += event.results[i][0].transcript;
        }
      }

      if (finalTranscripts) {
        lastTranscript.current += finalTranscripts.trim();
        onTextChange(lastTranscript.current);
        if (!isMobileOrTablet) {
          recognition.stop();
        }
      } else if (interimTranscripts) {
        onTextChange(lastTranscript.current + interimTranscripts); // Show live speech text
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      alert("An error occurred during speech recognition. Please try again.");
    };

    recognition.onend = () => {
      if (!isManuallyStopped.current && !isMobileOrTablet) {
        recognition.start(); // Restart only on desktop
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    isManuallyStopped.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <button type='button' className='btn btn-primary mt-2' onClick={isListening ? stopListening : startListening} aria-label={isListening ? "Stop listening" : "Start listening"}>
      <FontAwesomeIcon icon={isListening ? faStop : faMicrophone} />
    </button>
  );
};

export default SpeechToText;

import { Font } from "@react-pdf/renderer";
// Register emoji source
Font.registerEmojiSource({
  format: "png",
  url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});


import React, { useState } from "react";

const IncidentReportForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    staffReporting: "",
    date: "",
    time: "",
    incidentType: "",
    incidentLocation: "",
    peopleInvolved: "",
    briefDescription: "",
    supportGiven: "",
    postIncident: "",
    furtherAction: "",
    recommendationsShared: [],
    firstAidRequired: "",
    firstAider: "",
    paramedic: "",
    details: "",
    physicalIntervention: "",
    staffEscorted: "",
    postObservation: "",
    parentsNotified: "",
    personCompleting: "",
    witness: "",
    parentCarer: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const recommendations = prevData.recommendationsShared.includes(value) ? prevData.recommendationsShared.filter((item) => item !== value) : [...prevData.recommendationsShared, value];
      return { ...prevData, recommendationsShared: recommendations };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    // Add validation logic here
    if (!formData.clientName) newErrors.clientName = "Client Name is required";
    if (!formData.staffReporting) newErrors.staffReporting = "Staff Reporting is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.incidentType) newErrors.incidentType = "Incident Type is required";
    if (!formData.incidentLocation) newErrors.incidentLocation = "Incident Location is required";
    if (!formData.briefDescription) newErrors.briefDescription = "Brief Description is required";
    if (!formData.personCompleting) newErrors.personCompleting = "Person Completing Form is required";
    if (!formData.witness) newErrors.witness = "Witness is required";
    if (!formData.parentCarer) newErrors.parentCarer = "Parent/Carer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle form submission logic here
    }
  };

  return (
    <div className='container-fluid mt-5'>
      <h2>Minor/Recurring Incident Report Form</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label>Client Name</label>
            <select name='clientName' className='form-control' onChange={handleChange}>
              <option value=''>Select Client</option>
              {/* Add client options here */}
            </select>
            {errors.clientName && <small className='text-danger'>{errors.clientName}</small>}
          </div>
          <div className='form-group col-md-6'>
            <label>Staff Reporting Incident</label>
            <select name='staffReporting' className='form-control' onChange={handleChange}>
              <option value=''>Select Staff</option>
              {/* Add staff options here */}
            </select>
            {errors.staffReporting && <small className='text-danger'>{errors.staffReporting}</small>}
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label>Date</label>
            <input type='date' name='date' className='form-control' onChange={handleChange} />
            {errors.date && <small className='text-danger'>{errors.date}</small>}
          </div>
          <div className='form-group col-md-6'>
            <label>Time</label>
            <input type='time' name='time' className='form-control' onChange={handleChange} />
            {errors.time && <small className='text-danger'>{errors.time}</small>}
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label>Incident Type</label>
            <input type='text' name='incidentType' className='form-control' onChange={handleChange} />
            {errors.incidentType && <small className='text-danger'>{errors.incidentType}</small>}
          </div>
          <div className='form-group col-md-6'>
            <label>Incident Location</label>
            <textarea name='incidentLocation' className='form-control' onChange={handleChange}></textarea>
            {errors.incidentLocation && <small className='text-danger'>{errors.incidentLocation}</small>}
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label>People Involved</label>
            <select name='peopleInvolved' className='form-control' onChange={handleChange}>
              <option value=''>Select People</option>
              {/* Add people options here */}
            </select>
          </div>
          <div className='form-group col-md-6'>
            <label>Brief Description of Incident</label>
            <textarea name='briefDescription' className='form-control' onChange={handleChange}></textarea>
            {errors.briefDescription && <small className='text-danger'>{errors.briefDescription}</small>}
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label>What Support was Given / Intervention Used / Action Taken</label>
            <textarea name='supportGiven' className='form-control' onChange={handleChange}></textarea>
          </div>
          <div className='form-group col-md-6'>
            <label>What Happened After the Incident</label>
            <textarea name='postIncident' className='form-control' onChange={handleChange}></textarea>
          </div>
        </div>

        <div className='form-group'>
          <label>Any Further Action Required? Including any Immediate Recommendations?</label>
          <div>
            <label>
              <input type='radio' name='furtherAction' value='yes' onChange={handleChange} /> Yes
            </label>
            <label>
              <input type='radio' name='furtherAction' value='no' onChange={handleChange} /> No
            </label>
          </div>
          {formData.furtherAction === "yes" && <textarea name='recommendations' className='form-control' onChange={handleChange}></textarea>}
        </div>

        <div className='form-group'>
          <label>Have Recommendations been Shared with Staff Team, Parent/Carers?</label>
          <div>
            <label>
              <input type='checkbox' value='manager' onChange={handleCheckboxChange} /> Manager
            </label>
            <label>
              <input type='checkbox' value='supportStaff' onChange={handleCheckboxChange} /> Support Staff
            </label>
            <label>
              <input type='checkbox' value='parents' onChange={handleCheckboxChange} /> Parents
            </label>
            <label>
              <input type='checkbox' value='anyOther' onChange={handleCheckboxChange} /> Any Other
            </label>
          </div>
        </div>

        <div className='form-group'>
          <label>First Aid Required?</label>
          <div>
            <label>
              <input type='radio' name='firstAidRequired' value='yes' onChange={handleChange} /> Yes
            </label>
            <label>
              <input type='radio' name='firstAidRequired' value='no' onChange={handleChange} /> No
            </label>
          </div>
          {formData.firstAidRequired === "yes" && (
            <div className='form-row'>
              <div className='form-group col-md-4'>
                <label>First Aider</label>
                <textarea name='firstAider' className='form-control' onChange={handleChange}></textarea>
              </div>
              <div className='form-group col-md-4'>
                <label>Paramedic</label>
                <textarea name='paramedic' className='form-control' onChange={handleChange}></textarea>
              </div>
              <div className='form-group col-md-4'>
                <label>Details</label>
                <textarea name='details' className='form-control' onChange={handleChange}></textarea>
              </div>
            </div>
          )}
        </div>

        <div className='form-group'>
          <label>Was Physical Intervention Support Used?</label>
          <div>
            <label>
              <input type='radio' name='physicalIntervention' value='yes' onChange={handleChange} /> Yes
            </label>
            <label>
              <input type='radio' name='physicalIntervention' value='no' onChange={handleChange} /> No
            </label>
          </div>
          {formData.physicalIntervention === "yes" && (
            <div className='form-group'>
              <label>Select Staff Names</label>
              <select name='staffNames' className='form-control' onChange={handleChange}>
                <option value=''>Select Staff</option>
                {/* Add staff options here */}
              </select>
            </div>
          )}
        </div>

        <div className='form-group'>
          <label>How Many Staff Escorted?</label>
          <div>
            <label>
              <input type='radio' name='staffEscorted' value='one' onChange={handleChange} /> One
            </label>
            <label>
              <input type='radio' name='staffEscorted' value='two' onChange={handleChange} /> Two
            </label>
          </div>
        </div>

        <div className='form-group'>
          <label>Post Incident Observation of Person</label>
          <textarea name='postObservation' className='form-control' onChange={handleChange}></textarea>
        </div>

        <div className='form-group'>
          <label>Parents/Carers Notified By:</label>
          <div>
            <label>
              <input type='radio' name='parentsNotified' value='textMessage' onChange={handleChange} /> Text Message
            </label>
            <label>
              <input type='radio' name='parentsNotified' value='physicalCall' onChange={handleChange} /> Physical Call
            </label>
            <label>
              <input type='radio' name='parentsNotified' value='inPerson' onChange={handleChange} /> In Person
            </label>
          </div>
        </div>

        <div className='alert alert-warning'>
          <strong>If incidents are frequent a behaviour review meeting may be required to look at strategies/support/triggers/patterns.</strong>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label>Person Completing Form</label>
            <select name='personCompleting' className='form-control' onChange={handleChange}>
              <option value=''>Select Person</option>
              {/* Add options here */}
            </select>
            {errors.personCompleting && <small className='text-danger'>{errors.personCompleting}</small>}
          </div>
          <div className='form-group col-md-6'>
            <label>Witness</label>
            <select name='witness' className='form-control' onChange={handleChange}>
              <option value=''>Select Witness</option>
              {/* Add options here */}
            </select>
            {errors.witness && <small className='text-danger'>{errors.witness}</small>}
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label>Parent/Carer</label>
            <select name='parentCarer' className='form-control' onChange={handleChange}>
              <option value=''>Select Parent/Carer</option>
              {/* Add options here */}
            </select>
            {errors.parentCarer && <small className='text-danger'>{errors.parentCarer}</small>}
          </div>
          <div className='form-group col-md-6'>
            <label>Signed</label>
            <span>____________________</span>
          </div>
        </div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default IncidentReportForm;

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';

const BehaviouralRecordingSheet = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const [clientDoingOther, setClientDoingOther] = useState(false);
  const [whatDidHeDoOther, setWhatDidHeDoOther] = useState(false);
  const [anyOtherSigns, setAnyOtherSigns] = useState(false);
  const [directedTowardsAnyone, setDirectedTowardsAnyone] = useState(false);
  const environment = watch('environment');
  const clientDoing = watch('clientDoing');
  const whatDidHeDo = watch('whatDidHeDo');

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleClientDoingClick = (value) => {
    if (value === 'Other') {
      setClientDoingOther(true);
    } else {
      setClientDoingOther(false);
      setValue('clientDoingOtherText', '');
    }
  };

  const handleWhatDidHeDoClick = (value) => {
    if (value === 'Other') {
      setWhatDidHeDoOther(true);
    } else {
      setWhatDidHeDoOther(false);
      setValue('whatDidHeDoOtherText', '');
    }
  };

  const handleAnyOtherSignsChange = (value) => {
    if (value === 'Yes') {
      setAnyOtherSigns(true);
    } else {
      setAnyOtherSigns(false);
      setValue('anyOtherSignsText', '');
    }
  };

  const handleDirectedTowardsAnyoneChange = (value) => {
    if (value === 'Yes') {
      setDirectedTowardsAnyone(true);
    } else {
      setDirectedTowardsAnyone(false);
      setValue('directedTowardsAnyoneText', '');
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1: Date & Time of Event */}
        <div className="mb-3">
          <h4>Date & Time of Event</h4>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <input {...field} type="date" className="form-control" />
                )}
              />
              {errors.date && (
                <p className="text-danger">{errors.date.message}</p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Time</label>
              <Controller
                name="time"
                control={control}
                rules={{ required: 'Time is required' }}
                render={({ field }) => (
                  <input {...field} type="time" className="form-control" />
                )}
              />
              {errors.time && (
                <p className="text-danger">{errors.time.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: What had happened IMMEDIATELY BEFORE the behaviour? */}
        <div className="mb-3">
          <h4>What had happened IMMEDIATELY BEFORE the behaviour?</h4>
          <label className="form-label">
            What activity was going on when the behavior occurred?
          </label>
          <Controller
            name="activityBefore"
            control={control}
            rules={{ required: 'Activity is required' }}
            render={({ field }) => (
              <textarea {...field} className="form-control" />
            )}
          />
          {errors.activityBefore && (
            <p className="text-danger">{errors.activityBefore.message}</p>
          )}

          <label className="form-label mt-2">What was the client doing?</label>
          <div className="d-flex flex-wrap">
            {['Making Loud Noise', 'Slapping his thigh', 'Clapping his hands', 'Talking to himself', 'Other'].map((option) => (
              <button
                key={option}
                type="button"
                className={`btn ${
                  clientDoing && clientDoing.includes(option)
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } me-2 mb-2`}
                onClick={() => {
                  const currentValues = watch('clientDoing') || [];
                  if (currentValues.includes(option)) {
                    setValue(
                      'clientDoing',
                      currentValues.filter((val) => val !== option)
                    );
                  } else {
                    setValue('clientDoing', [...currentValues, option]);
                  }
                  handleClientDoingClick(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {clientDoingOther && (
            <Controller
              name="clientDoingOtherText"
              control={control}
              rules={{ required: 'Please specify other behavior' }}
              render={({ field }) => (
                <textarea {...field} className="form-control mt-2" />
              )}
            />
          )}
          {clientDoingOther && errors.clientDoingOtherText && (
            <p className="text-danger">
              {errors.clientDoingOtherText.message}
            </p>
          )}

          <label className="form-label mt-2">
            What was going on around the client?
          </label>
          <Controller
            name="aroundClient"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <textarea {...field} className="form-control" />
            )}
          />
          {errors.aroundClient && (
            <p className="text-danger">{errors.aroundClient.message}</p>
          )}

          <label className="form-label mt-2">What was the environment?</label>
          <div className="d-flex">
            {['Noisy', 'Quiet', 'Other'].map((option) => (
              <div key={option} className="form-check me-3">
                <input
                  type="radio"
                  className="form-check-input"
                  id={`environment-${option}`}
                  value={option}
                  {...control.register('environment', {
                    required: 'Environment is required',
                  })}
                />
                <label
                  className="form-check-label"
                  htmlFor={`environment-${option}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {environment === 'Other' && (
            <Controller
              name="environmentOther"
              control={control}
              rules={{ required: 'Please specify other environment' }}
              render={({ field }) => (
                <input {...field} type="text" className="form-control mt-2" />
              )}
            />
          )}
          {errors.environment && (
            <p className="text-danger">{errors.environment.message}</p>
          )}
          {environment === 'Other' && errors.environmentOther && (
            <p className="text-danger">{errors.environmentOther.message}</p>
          )}

          <label className="form-label mt-2">Who was with the client?</label>
          <Controller
            name="withClient"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <input {...field} type="text" className="form-control" />
            )}
          />
          {errors.withClient && (
            <p className="text-danger">{errors.withClient.message}</p>
          )}

          <label className="form-label mt-2">
            How well had he been interacting with others prior to the incident?
          </label>
          <Controller
            name="interactionPrior"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="range"
                min="1"
                max="10"
                className="form-range"
              />
            )}
          />
          <div className="d-flex justify-content-between">
            <span>Very little interaction withdrawn and sullen</span>
            <span>happy and smiling friendly & sociable</span>
          </div>
          {errors.interactionPrior && (
            <p className="text-danger">{errors.interactionPrior.message}</p>
          )}
        </div>


        // window.onbeforeunload = (event) => {
  //   sessionStorage.setItem("resetForm", "true");
  //   const e = event || window.event;
  //   e.preventDefault();
  //   if (e) {
  //     e.returnValue = "";
  //   }
  //   return "";
  // };