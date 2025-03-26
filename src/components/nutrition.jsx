import React from "react";
import { useFieldArray } from "react-hook-form";
import CustomTextarea from "./customtextarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const NutritionSection = ({ watch, showSections, handleToggle, renderSelect, register, errors, control, setValue }) => {
  const { fields: liquidFields, append: appendLiquid, remove: removeLiquid } = useFieldArray({ control, name: "liquidEntries" });
  const { fields: snackFields, append: appendSnack, remove: removeSnack } = useFieldArray({ control, name: "snackEntries" });

  return (
    <>
      {/* Liquid Section */}
      <div className='mt-3 border border-primary p-3'>
        <h6 className='form-label'>
          <strong>Nutrition Log</strong>
        </h6>
        <div className='mt-2 d-flex justify-content-start'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Any Liquid:</strong>
          </h6>
          <div className='ms-3'>
            <input
              type='radio'
              value='yes'
              id='liquid-yes'
              {...register("liquidIntake", { required: "Please select an option" })}
              onChange={() => {
                handleToggle("liquid", true);
                if (liquidFields.length === 0) {
                  appendLiquid({ type: "", amount: 1, unit: "", time: "" });
                }
              }}
            />
            <label className='ms-1 me-3' htmlFor='liquid-yes'>
              <strong>Yes</strong>
            </label>
            <input type='radio' id='liquid-no' value='no' {...register("liquidIntake", { required: "Please select an option" })} onChange={() => handleToggle("liquid", false)} />
            <label className='ms-1' htmlFor='liquid-no'>
              <strong>No</strong>
            </label>
            <span className='ms-3 text-muted'>(If yes, please select type and mention amount of liquid and time)</span>
          </div>
        </div>
        {errors.liquidIntake && <small className='text-danger'>{errors.liquidIntake.message}</small>}

        {showSections.liquid && (
          <div className='mt-3 table-responsive daily-log-print page-break'>
            <table className='table table-bordered table-striped table-info ' style={{ tableLayout: "fixed", width: "60%" }}>
              <thead className='text-center table-dark align-middle'>
                <tr>
                  <th style={{ width: "200px" }}>Liquid Type</th>
                  <th style={{ width: "100px" }}>Amount</th>
                  <th style={{ width: "200px" }}>Unit</th>
                  <th style={{ width: "200px" }}>Time</th>
                  <th style={{ width: "80px" }}>Actions</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {liquidFields.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>
                      {renderSelect(
                        `liquidEntries.${index}.type`,
                        [
                          { value: "Water", label: "Water" },
                          { value: "Juice", label: "Juice" },
                          { value: "Tea", label: "Tea" },
                          { value: "Coffee", label: "Coffee" },
                          { value: "Any Other", label: "Any Other" },
                        ],
                        { required: "Liquid Type is required" }
                      )}
                      {errors.liquidEntries?.[index]?.type && <small className='text-danger'>{errors.liquidEntries[index].type.message}</small>}
                    </td>
                    <td>
                      <input
                        type='number'
                        className='form-control'
                        min={1}
                        {...register(`liquidEntries.${index}.amount`, {
                          required: "Amount is required",
                          min: { value: 1, message: "Amount must be greater than 0" },
                        })}
                      />
                      {errors.liquidEntries?.[index]?.amount && <small className='text-danger'>{errors.liquidEntries[index].amount.message}</small>}
                    </td>

                    <td>
                      {renderSelect(
                        `liquidEntries.${index}.unit`,
                        [
                          { value: "ml", label: "ml" },
                          { value: "litres", label: "Litres" },
                          { value: "cup", label: "Cup" },
                        ],
                        { required: "Unit is required" }
                      )}
                      {errors.liquidEntries?.[index]?.unit && <small className='text-danger'>{errors.liquidEntries[index].unit.message}</small>}
                    </td>
                    <td>
                      <input type='time' className='form-control' {...register(`liquidEntries.${index}.time`, { required: "Time is required" })} />
                      {errors.liquidEntries?.[index]?.time && <small className='text-danger'>{errors.liquidEntries[index].time.message}</small>}
                    </td>
                    <td className='text-center d-flex justify-content-center' style={{ padding: "25px" }}>
                      <button type='button' className='btn btn-danger btn-sm' onClick={() => removeLiquid(index)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type='button' className='btn btn-secondary btn-sm' style={{ backgroundColor: "darkblue" }} onClick={() => appendLiquid({})}>
              <FontAwesomeIcon icon={faCirclePlus} style={{ color: "white" }} />
            </button>
          </div>
        )}
      </div>

      {/* Lunch Section */}
      <div className='mt-3 border border-primary p-3'>
        <div className='d-flex justiffy-content-start'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Lunch:</strong>
          </h6>
          <div className='ms-3'>
            <input type='radio' id='lunch-yes' value='yes' {...register("lunchIntake", { required: "Please select an option" })} onChange={() => handleToggle("lunch", true)} />
            <label className='ms-1 me-3' htmlFor='lunch-yes'>
              <strong>Yes</strong>
            </label>
            <input type='radio' id='lunch-no' value='no' {...register("lunchIntake", { required: "Please select an option" })} onChange={() => handleToggle("lunch", false)} />
            <label className='ms-1' htmlFor='lunch-no'>
              <strong>No</strong>
            </label>
            <span className='ms-3 text-muted'>(If yes, please selct amount eaten and and explain what was in lunch)</span>
          </div>
        </div>
        {errors.lunchIntake && <small className='text-danger'>{errors.lunchIntake.message}</small>}

        {showSections.lunch && (
          <div className='mt-3'>
            <div className='row g-1 align-items-start'>
              <div className='col-md-4 d-flex flex-column'>
                <h6 className='form-label'>
                  <strong>Amount Eaten</strong>
                </h6>
                <div className='d-flex flex-wrap align-items-center gap-3'>
                  {["fully", "partially", "none"].map((amount, index) => (
                    <div className='form-check' key={index}>
                      <input className='form-check-input' type='radio' id={`lunchAmount-${amount}`} value={amount} {...register("lunchAmount", { required: "Please select amount eaten" })} />
                      <label className='form-check-label' htmlFor={`lunchAmount-${amount}`}>
                        {amount.charAt(0).toUpperCase() + amount.slice(1)} Eaten
                      </label>
                    </div>
                  ))}
                </div>
                {errors.lunchAmount && <small className='text-danger'>{errors.lunchAmount.message}</small>}
              </div>
              <div className='col-md-4 d-flex flex-column'>
                <h6 className='form-label'>
                  <strong>Brought From</strong>
                </h6>
                <div className='d-flex flex-wrap align-items-center gap-3'>
                  {["home", "takeaway"].map((source, index) => (
                    <div className='form-check' key={index}>
                      <input className='form-check-input' type='radio' id={`lunchFrom-${source}`} value={source} {...register("lunchFrom", { required: "Please select where lunch was brought from" })} />
                      <label className='form-check-label' htmlFor={`lunchFrom-${source}`}>
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.lunchFrom && <small className='text-danger'>{errors.lunchFrom.message}</small>}
              </div>
              <div className='col-md-2'>
                <h6 className='form-label'>
                  <strong>Time</strong>
                </h6>
                <input type='time' className='form-control' style={{ width: "auto" }} {...register("lunchTime", { required: "Time is required" })} />
                {errors.lunchTime && <small className='text-danger'>{errors.lunchTime.message}</small>}
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col-12'>
                <CustomTextarea watch={watch} register={register} setValue={setValue} fieldName='lunchDetails' errors={errors} placeholder={'Detail of the Lunch/Meal "Or" Reason if Refused'} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Snacks Section */}
      <div className='mt-3 border border-primary p-3'>
        <div className='d-flex justify-content-start'>
          <h6 className='mb-0 fw-bold text-primary'>
            <strong>Any Snacks:</strong>
          </h6>
          <div className='ms-3'>
            <input
              type='radio'
              id='snacks-yes'
              value='yes'
              {...register("snacksIntake", { required: "Please select an option" })}
              onChange={() => {
                handleToggle("snacks", true);
                if (snackFields.length === 0) {
                  appendSnack({ name: "", time: "" });
                }
              }}
            />
            <label className='ms-1 me-3' htmlFor='snacks-yes'>
              <strong>Yes</strong>
            </label>
            <input type='radio' id='snacks-no' value='no' {...register("snacksIntake", { required: "Please select an option" })} onChange={() => handleToggle("snacks", false)} />
            <label className='ms-1' htmlFor='snacks-no'>
              <strong>No</strong>
            </label>
            <span className='ms-3 text-muted'>(If yes, please write name of the snack and time)</span>
          </div>
        </div>
        {errors.snacksIntake && <small className='text-danger'>{errors.snacksIntake.message}</small>}

        {showSections.snacks && (
          <div className='mt-3 table-responsive daily-log-print page-break'>
            <table className='table table-bordered table-striped table-info ' style={{ tableLayout: "fixed", width: "45%" }}>
              <thead className='text-center table-dark align-middle'>
                <tr>
                  <th style={{ width: "250px" }}>Name of the Snack</th>
                  <th style={{ width: "200px" }}>Time</th>
                  <th style={{ width: "80px" }}>Actions</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {snackFields.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>
                      {renderSelect(
                        `snackEntries.${index}.name`,
                        [
                          { value: "popcorn", label: "Popcorn" },
                          { value: "crips", label: "Crips" },
                          { value: "mixed fruit", label: "Mixed Fruit" },
                        ],
                        { required: "Snack name is required" }
                      )}
                      {errors.snackEntries?.[index]?.name && <small className='text-danger'>{errors.snackEntries[index].name.message}</small>}
                    </td>
                    <td>
                      <input type='time' className='form-control' {...register(`snackEntries.${index}.time`, { required: "Time is required" })} />
                      {errors.snackEntries?.[index]?.time && <small className='text-danger'>{errors.snackEntries[index].time.message}</small>}
                    </td>
                    <td className='text-center d-flex justify-content-center' style={{ padding: "25px" }}>
                      <button type='button' className='btn btn-danger btn-sm' onClick={() => removeSnack(index)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type='button' className='btn btn-secondary btn-sm' style={{ backgroundColor: "darkblue" }} onClick={() => appendSnack({})}>
              <FontAwesomeIcon icon={faCirclePlus} style={{ color: "white" }} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NutritionSection;
