// Link.react-test.js
import React from 'react';
import { LoadingButton } from '../../src/components/loadingbutton';
import renderer from 'react-test-renderer';

it('isLoading toggles disabled state', () => {
  const component = renderer.create(
    <LoadingButton
      isLoading={ true }
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  tree.props.isLoading = false;
  // // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
