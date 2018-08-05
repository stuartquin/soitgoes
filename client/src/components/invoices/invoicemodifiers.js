'use strict';
import React from 'react';

import TextField from 'material-ui/TextField';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';


const getModifierListItem = (invoice, modifier, isEditable, onAdd, onDelete) => {
  let actionBtn = null;
  if (isEditable) {
    if (invoice.get('modifier').contains(modifier.get('id'))) {
      actionBtn = (
        <IconButton
          tooltip='Remove'
          touch={true}
          tooltipPosition='bottom-right'
          className='btn-default icon-btn-right'
          onTouchTap={() => onDelete(modifier)}>
          <ContentRemoveCircleOutline />
        </IconButton>
      );
    } else {
      actionBtn = (
        <IconButton
          tooltip='Add'
          touch={true}
          tooltipPosition='bottom-right'
          className='btn-default icon-btn-right'
          onTouchTap={() => onAdd(modifier)}>
          <ContentAddCircleOutline />
        </IconButton>
      );
    }
  }
  const secondaryText = `${modifier.get('percent')}%`;
  return (
    <ListItem
      key={modifier.get('id')}
      className='invoice-summary-item'
      primaryText={modifier.get('name')}
      secondaryText={secondaryText}
      rightIconButton={actionBtn}
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
    const isEditable = this.props.isEditable;

    return (
      <List className='invoice-modifiers'>
        {modifiers.map(modifier =>
          getModifierListItem(invoice, modifier, isEditable,
            () => {
              this.props.onAddModifier(modifier)
            },
            () => {
              this.props.onRemoveModifier(modifier)
            },
          )
        )}
      </List>
    );
  }
}

export {InvoiceModifiers}
