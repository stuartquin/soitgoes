'use strict';
import React from 'react';

import SelectField from 'material-ui/SelectField';
import ContentAddBox from 'material-ui/svg-icons/content/add-box';
import IconButton from 'material-ui/IconButton';


const AddSelect = ({ label, items, value, onAdd, onChange }) => {
  return (
    <div className='add-select'>
      <SelectField
        className='add-select-field'
        style={{width: '90%'}}
        value={value}
        onChange={onChange}
        floatingLabelText={label}>
        {items}
      </SelectField>
      <IconButton touch={true} onTouchTap={onAdd}>
        <ContentAddBox />
      </IconButton>
    </div>
  );
};

export default AddSelect;
