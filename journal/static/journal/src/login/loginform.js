import React from 'react';
import { Link } from 'react-router'

export const LoginForm = (props) => {
  let fields = {
    username: props.username,
    password: props.password
  };

  const handleChange = (field, value) => {
    fields[field] = value;
  };

  return (
    <div>
      <input type='text'
        value={fields.username}
        onChange={(e) => handleChange('username', e.target.value)} />

      <input type='password'
        value={fields.password}
        onChange={(e) => handleChange('password', e.target.value)} />

      <button
        className='btn btn-default'
        onClick={() => props.onSubmit(fields)}>Login</button>
    </div>
  );
};
