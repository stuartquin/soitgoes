'use strict';
import React from 'react';

import TextField from 'material-ui/TextField';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';


const getModifierListItem = (modifier, onDelete) => {
  const deleteBtn = (
    <IconButton
      tooltip='Remove'
      touch={true}
      tooltipPosition='bottom-right'
      className='btn-default'
      onTouchTap={() => onDelete(modifier)}>
      <ContentRemoveCircleOutline />
    </IconButton>
  );

  const secondaryText = `${modifier.get('percent')}%`;
  return (
    <ListItem
      key={modifier.get('id')}
      className='invoice-summary-item'
      primaryText={modifier.get('name')}
      secondaryText={secondaryText}
      rightIconButton={deleteBtn}
      disabled={true}
    />
  );
};


class InvoiceModifiers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  updateForm(name, val) {
  }

  render() {
    const invoice = this.props.invoice;
    const project = this.props.project;
    const modifiers = this.props.modifiers;
    return (
      <List className='invoice-modifiers'>
        {modifiers.map(modifier =>
          getModifierListItem(modifier, () => {
            this.props.onRemoveModifier(modifier)
          })
        )}
      </List>
    );
  }
}

export {InvoiceModifiers}
