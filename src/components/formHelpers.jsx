import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Creatable from "react-select/creatable";

export const baseStaffOptions = [
  { label: "Abhishek Ghadge", value: "Abhishek Ghadge" },
  { label: "Abdul Daim", value: "Abdul Daim" },
  { label: "Abbas Alnahari", value: "Abbas Alnahari" },
  { label: "Abdul Baki Hamed", value: "Abdul Baki Hamed" },
  { label: "Adeeb Latif", value: "Adeeb Latif" },
  { label: "Amie Smith", value: "Amie Smith" },
  { label: "Amina Adam", value: "Amina Adam" },
  { label: "Ammar Abdulrazaq", value: "Ammar Abdulrazaq" },
  { label: "Daniel Edwards", value: "Daniel Edwards" },
  { label: "Dawn Amphlett", value: "Dawn Amphlett" },
  { label: "Hamza Razzaq", value: "Hamza Razzaq" },
  { label: "Imran Hamed", value: "Imran Hamed" },
  { label: "Ishwaq Said", value: "Ishwaq Said" },
  { label: "Mohamad Abdulrazaq", value: "Mohamad Abdulrazaq" },
  { label: "Mohammed Harkal", value: "Mohammed Harkal" },
  { label: "Mueen Zaid", value: "Mueen Zaid" },
  { label: "Munia Akhall", value: "Munia Akhall" },
  { label: "Muhammad Rizwan", value: "Muhammad Rizwan" },
  { label: "Saad Qamar", value: "Saad Qamar" },
  { label: "Sajid Rehman", value: "Sajid Rehman" },
  { label: "Sami Yasin", value: "Sami Yasin" },
  { label: "Shahid Mahmud", value: "Shahid Mahmud" },
  { label: "Sharon Blatchford", value: "Sharon Blatchford" },
  { label: "Sumaiya Abdulghani", value: "Sumaiya Abdulghani" },
  { label: "Waleed Faid", value: "Waleed Faid" },
  { label: "Jodie Henry", value: "Jodie Henry" },
].sort((a, b) => a.label.localeCompare(b.label));

export const clientOptions = [
  { label: "Joab Groves", value: "Joab Groves" },
  { label: "Lucas Hill", value: "Lucas Hill" },
  { label: "Callum Nicholls", value: "Callum Nicholls" },
  { label: "Adam Jackson", value: "Adam Jackson" },
  { label: "Luke Checketts", value: "Luke Checketts" },
  { label: "Matthew Lloyd", value: "Matthew Lloyd" },
  { label: "Llyas Mohammed", value: "Llyas Mohammed" },
  { label: "Korban Neale", value: "Korban Neale" },
  { label: "Kashif Hussain", value: "Kashif Hussain" },
  { label: "Shamas Haider", value: "Shamas Haider" },
  { label: "Rahees Mahmood", value: "Rahees Mahmood" },
  { label: "Aysha Mahmood", value: "Aysha Mahmood" },
  { label: "Asaad Alnahari", value: "Asaad Alnahari" },
  { label: "Jack Collier", value: "Jack Collier" },
  { label: "Todd Williams", value: "Todd Williams" },
  { label: "Kieran McDonald", value: "Kieran McDonald" },
  { label: "Hamza Sharif", value: "Hamza Sharif" },
  { label: "Ethan Payne", value: "Ethan Payne" },
  { label: "Asad Murad", value: "Asad Murad" },
  { label: "Tariq Yehia", value: "Tariq Yehia" },
  { label: "Ammar Kayani", value: "Ammar Kayani" },
  { label: "Callum Moore", value: "Callum Moore" },
  { label: "Gary Cubberley", value: "Gary Cubberley" },
  { label: "Abigail Nicholls", value: "Abigail Nicholls" },
  { label: "Ben Epstein", value: "Ben Epstein" },
  { label: "Joey Turner", value: "Joey Turner" },
  { label: "Harmon Hayer", value: "Harmon Hayer" },
  { label: "Hamda Safa", value: "Hamda Safa" },
  { label: "Ellie Chambers", value: "Ellie Chambers" },
].sort((a, b) => a.label.localeCompare(b.label));

const LOCAL_STORAGE_KEYS = {
  CO_STAFF_FIELDS: "coStaffFields",
  CO_COLLECTOR_FIELDS: "coCollectorFields",
  CO_DROPPED_OFF_FIELDS: "coDroppedOffFields",
};

export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const useCoStaffFields = (initialFields = []) => {
  const [coStaffFields, setCoStaffFields] = useState(() => loadFromLocalStorage(LOCAL_STORAGE_KEYS.CO_STAFF_FIELDS) || initialFields);
  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CO_STAFF_FIELDS, coStaffFields);
  }, [coStaffFields]);

  return { coStaffFields, setCoStaffFields };
};

export const useCoCollectorFields = (initialFields = []) => {
  const [coCollectorFields, setCoCollectorFields] = useState(() => loadFromLocalStorage(LOCAL_STORAGE_KEYS.CO_COLLECTOR_FIELDS) || initialFields);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CO_COLLECTOR_FIELDS, coCollectorFields);
  }, [coCollectorFields]);

  return { coCollectorFields, setCoCollectorFields };
};

export const useCoDroppedOffFields = (initialFields = []) => {
  const [coDroppedOffFields, setCoDroppedOffFields] = useState(() => loadFromLocalStorage(LOCAL_STORAGE_KEYS.CO_DROPPED_OFF_FIELDS) || initialFields);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CO_DROPPED_OFF_FIELDS, coDroppedOffFields);
  }, [coDroppedOffFields]);

  return { coDroppedOffFields, setCoDroppedOffFields };
};

export const handleAddField = (setCoStaffFields) => {
  setCoStaffFields((prevFields) => [
    ...prevFields,
    {
      id: Date.now(),
      options: [...baseStaffOptions, { label: "Add another co-member", value: "add_co_member" }],
    },
  ]);
};

export const handleRemoveField = (setCoStaffFields, id) => {
  setCoStaffFields((prevFields) => prevFields.filter((field) => field.id !== id));
};

export const handleFieldChange = (selectedOption, setCoStaffFields) => {
  if (selectedOption && selectedOption.value === "add_co_member") {
    handleAddField(setCoStaffFields);
  }
};

export const renderCoFields = (fields, control, labelPrefix, setCoStaffFields) => {
  return fields.map((field, index) => (
    <div className='col-md-6 intro-flex' key={field.id}>
      <h6 className='mb-0 fw-bold text-primary'>
        <strong>{`${labelPrefix} ${index + 2}`}</strong>
      </h6>
      <Controller
        name={`${labelPrefix.toLowerCase().replace(" ", "_")}_${field.id}`}
        control={control}
        render={({ field: controllerField }) => (
          <div className='react-select-container'>
            <Creatable
              {...controllerField}
              options={field.options}
              isClearable
              isSearchable
              onChange={(selectedOption) => {
                controllerField.onChange(selectedOption);
                handleFieldChange(selectedOption, setCoStaffFields);
              }}
            />
          </div>
        )}
      />
      <button type='button' className='btn btn-danger btn-sm mt-1 mb-1' onClick={() => handleRemoveField(setCoStaffFields, field.id)}>
        Remove
      </button>
    </div>
  ));
};
