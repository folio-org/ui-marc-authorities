import { render } from '@folio/jest-config-stripes/testing-library/react';
// import { runAxeTest } from '@folio/stripes-testing';
// import { Settings } from '@folio/stripes/smart-components';

import Harness from '../../../test/jest/helpers/harness';

import { MarcAuthoritySettings } from './MarcAuthoritySettings';

const renderMarcAuthoritySettings = () => render(
  <Harness>
    <MarcAuthoritySettings />
  </Harness>,
);

describe('Given BrowseRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass correct props', () => {
    renderMarcAuthoritySettings();
    // expect(Settings).toHaveBeenCalledWith({
    //
    // }, {});
  });
});
