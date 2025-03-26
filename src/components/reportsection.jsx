import React, { useState } from "react";

const ReportSection = ({ showSections, handleToggle, register, errors }) => {
  const [selectedReports, setSelectedReports] = useState({});

  const handleReportChange = (report, value) => {
    setSelectedReports((prev) => ({
      ...prev,
      [report]: value === "yes",
    }));
  };

  return (
    <div className='mt-3 border border-primary p-3'>
      <div className='d-flex justify-content-start'>
        <h6 className='mb-0 fw-bold text-primary'>
          <strong>Incident Reports:</strong>
        </h6>
        <div className='ms-3'>
          <input type='radio' id='incident-yes' value='yes' {...register("incidentReport", { required: "Please select an option" })} onChange={() => handleToggle("incident", true)} />
          <label className='ms-1 me-3' htmlFor='incident-yes'>
            <strong>Yes</strong>
          </label>
          <input type='radio' id='incident-no' value='no' {...register("incidentReport", { required: "Please select an option" })} onChange={() => handleToggle("incident", false)} />
          <label className='ms-1' htmlFor='incident-no'>
            <strong>No</strong>
          </label>
          <span className='ms-3 text-muted'>(If yes, which incident form filled today: Please Specify)</span>
        </div>
      </div>
      {errors.incidentReport && <small className='text-danger'>{errors.incidentReport.message}</small>}

      {showSections.incident && (
        <div className='mt-3'>
          {["ABC Chart", "Incident Form", "Body Maps", "BRS (Behaviour Report Sheet)", "MAR (Medication Administration Record)"].map((report, index) => (
            <div key={index} className='d-flex align-items-center mb-2'>
              <h6 className='form-label me-2'>
                <strong>{report}</strong>
              </h6>
              <div className='form-check form-check-inline me-3'>
                <input className='form-check-input' type='radio' id={`report-${report}-yes`} value='yes' {...register(`reports.${report}`, { required: "Please select an option" })} onChange={() => handleReportChange(report, "yes")} />
                <label className='form-check-label' htmlFor={`report-${report}-yes`}>
                  Yes
                </label>
              </div>
              <div className='form-check form-check-inline'>
                <input className='form-check-input' type='radio' id={`report-${report}-no`} value='no' {...register(`reports.${report}`, { required: "Please select an option" })} onChange={() => handleReportChange(report, "no")} />
                <label className='form-check-label' htmlFor={`report-${report}-no`}>
                  No
                </label>
              </div>
              {errors.reports?.[report] && <small className='text-danger'>{errors.reports[report].message}</small>}

              {selectedReports[report] && (
                <a href={`/${report.toLowerCase().replace(/ /g, "-")}`} className='text-primary ms-3 reports-hide'>
                  Go to {report}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportSection;
