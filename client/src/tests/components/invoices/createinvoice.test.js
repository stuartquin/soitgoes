// Link.react-test.js
import React from 'react';
import Immutable from 'immutable';
import { CreateInvoice } from '../../../components/invoices/createinvoice';
import renderer from 'react-test-renderer';

it('Click button to show project list', () => {
  const component = renderer.create(
    <CreateInvoice projects={Immutable.List([])} />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // Maybe a better way...
  let button = tree.children[0].children[0];
  button.props.onClick();

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
