import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { baseStaffOptions, clientOptions, useCoStaffFields, useCoCollectorFields, useCoDroppedOffFields, handleFieldChange, renderCoFields } from "./formHelpers";
import Creatable from "react-select/creatable";

const ServiceUser = ({ register, errors, renderSelect, control }) => {
  const { coStaffFields, setCoStaffFields } = useCoStaffFields();
  const { coCollectorFields, setCoCollectorFields } = useCoCollectorFields();
  const { coDroppedOffFields, setCoDroppedOffFields } = useCoDroppedOffFields();
  return (
    <div className='intro-section'>
      <div className='row'>
        <div className='col-md-6 intro-flex mb-0'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Service User</strong>
          </h6>
          {renderSelect("serviceUser", clientOptions, { required: "Service User is required" })}
          {errors.serviceUser && <small className='text-danger'>{errors.serviceUser.message}</small>}
        </div>
        <div className='col-md-6 intro-flex mb-0'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Staff Completing Form</strong>
          </h6>
          <Controller
            name='staffCompleting'
            control={control}
            rules={{ required: "Staff Completing Form is required" }}
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
          {errors.staffCompleting && <small className='text-danger'>{errors.staffCompleting.message}</small>}
        </div>

        {/* Co-Staff Members */}
        {renderCoFields(coStaffFields, control, "Co-Staff Member", setCoStaffFields)}

        {["pickupTime", "arrivalTime", "dropoffTime", "date"].map((time, index) => (
          <div className='col-md-3 intro-flex' key={index}>
            <label className='mb-0 fw-bold text-primary' htmlFor={`${time}-input`}>
              <strong>{time.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</strong>
            </label>
            <input type={time === "date" ? "date" : "time"} className='form-control border-primary' id={`${time}-input`} {...register(time, { required: `${time.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} is required` })} />
            {errors[time] && <small className='text-danger'>{errors[time].message}</small>}
          </div>
        ))}

        {/* Collected By */}
        <div className='col-md-6 intro-flex'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Collected By</strong>
          </h6>
          <Controller
            name='collectedBy'
            control={control}
            rules={{ required: "Collected By is required" }}
            render={({ field }) => (
              <div className='react-select-container'>
                <Creatable
                  {...field}
                  options={[...baseStaffOptions, { label: "Add another co-member", value: "add_co_member" }]}
                  isClearable
                  isSearchable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleFieldChange(selectedOption, setCoCollectorFields);
                  }}
                />
              </div>
            )}
          />
          {errors.collectedBy && <small className='text-danger'>{errors.collectedBy.message}</small>}
        </div>

        {/* Co-Collectors */}
        {renderCoFields(coCollectorFields, control, "Co-Collector", setCoCollectorFields)}

        {/* Dropped Off By */}
        <div className='col-md-6'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Dropped Off By</strong>
          </h6>
          <Controller
            name='droppedOffBy'
            control={control}
            rules={{ required: "Dropped Off By is required" }}
            render={({ field }) => (
              <div className='react-select-container'>
                <Creatable
                  {...field}
                  options={[...baseStaffOptions, { label: "Add another co-member", value: "add_co_member" }]}
                  isClearable
                  isSearchable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleFieldChange(selectedOption, setCoDroppedOffFields);
                  }}
                />
              </div>
            )}
          />
          {errors.droppedOffBy && <small className='text-danger'>{errors.droppedOffBy.message}</small>}
        </div>

        {/* Co-Dropped Off Personnel */}
        {renderCoFields(coDroppedOffFields, control, "Co-Dropped Off Personnel", setCoDroppedOffFields)}
      </div>
    </div>
  );
};

export default ServiceUser;
