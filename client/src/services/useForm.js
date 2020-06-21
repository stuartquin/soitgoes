import { useState } from 'react';

const useForm = (initial) => {
  const [values, setValues] = useState(initial);

  const handleChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleChange,
    values,
  };
};

export default useForm;
