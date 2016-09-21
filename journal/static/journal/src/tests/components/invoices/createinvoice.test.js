// Link.react-test.js
import React from 'react';
import Immutable from 'immutable';
import { CreateInvoice } from '../../../components/invoices/createinvoice';
import renderer from 'react-test-renderer';

it('Defaults to showing create button', () => {
  const component = renderer.create(
    <CreateInvoice
      projects={Immutable.List([])}
    />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
