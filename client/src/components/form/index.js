'use strict';
import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: !!props.isEdit,
      form: {},
      original: {},
    };
  }

  setForm(form) {
    this.state.original = form;
    this.state.form = { ...this.state.original };
    this.state.isSaveRequired = this.isSaveRequired();
  }

  refreshForm() {
    this.setState({ original: { ...this.state.form } });
    this.setState({ isSaveRequired: this.isSaveRequired() });
  }

  isSaveRequired() {
    const form = this.state.form;
    const original = this.state.original;
    const req = !Object.keys(form).reduce(
      (prev, key) => prev && form[key] === original[key],
      true
    );
    return req;
  }

  handleChange(field, val) {
    let form = this.state.form;
    form[field] = val;
    this.setState({ form });
    this.setState({ isSaveRequired: this.isSaveRequired() });
  }

  render() {
    return <div />;
  }
}

export default Form;
