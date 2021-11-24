// here we'll keep our custom hooks
import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback(); // depending on what page this useForm is used in, this callback might be different, so we make it more generic by calling the callback()
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
