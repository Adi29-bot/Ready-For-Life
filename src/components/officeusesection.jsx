import React from "react";
import { useFieldArray } from "react-hook-form";

const OfficeUseSection = ({ register, errors, control, currentDate }) => {
  const { fields: staffFields, append: appendStaff, remove: removeStaff } = useFieldArray({ control, name: "officeUseEntries" });

  return (
    <div className='mt-1 border border-primary p-3 office-use'>
      <h6 className='mb-0 fw-bold text-primary'>
        <strong>For Office Use Only:</strong>
      </h6>
      <div className='row'>
        {staffFields.map((staffEntry, staffIndex) => (
          <div key={staffEntry.id} className='col-md-4 mb-3'>
            <div className='border p-2 page-break'>
              <h5>Staff Working with the Client</h5>
              <div className='form-group'>
                <label htmlFor={`clientName-${staffIndex}`}>Staff Full Name</label>
                <input type='text' id={`clientName-${staffIndex}`} placeholder="Enter staff's full name" className='form-control' {...register(`officeUseEntries.${staffIndex}.clientName`, { required: "Please enter staff name" })} />
                {errors.officeUseEntries?.[staffIndex]?.clientName && <small className='text-danger'>{errors.officeUseEntries[staffIndex].clientName.message}</small>}
              </div>
              <div className='form-group'>
                <label htmlFor={`clientSignature-${staffIndex}`}>Signature</label>
                <input type='text' id={`clientSignature-${staffIndex}`} placeholder='Enter staff signature' className='form-control' {...register(`officeUseEntries.${staffIndex}.clientSignature`, { required: "Please enter staff signature" })} />
                {errors.officeUseEntries?.[staffIndex]?.clientSignature && <small className='text-danger'>{errors.officeUseEntries[staffIndex].clientSignature.message}</small>}
              </div>
              <div className='form-group'>
                <label htmlFor={`clientDate-${staffIndex}`}>Date</label>
                <input type='date' id={`clientDate-${staffIndex}`} className='form-control' {...register(`officeUseEntries.${staffIndex}.clientDate`, { required: "Please select a date" })} defaultValue={currentDate} />
                {errors.officeUseEntries?.[staffIndex]?.clientDate && <small className='text-danger'>{errors.officeUseEntries[staffIndex].clientDate.message}</small>}
              </div>

              <button type='button' className='btn btn-danger btn-sm mt-2' onClick={() => removeStaff(staffIndex)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type='button' className='btn btn-outline-dark btn-sm' onClick={() => appendStaff({})}>
        Add Staff Entry
      </button>
    </div>
  );
};

export default OfficeUseSection;
