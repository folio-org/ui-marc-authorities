import { render } from '@folio/jest-config-stripes/testing-library/react';
import { Settings } from '@folio/stripes/smart-components';

import Harness from '../../../test/jest/helpers/harness';

import { MarcAuthoritySettings } from './MarcAuthoritySettings';

const renderMarcAuthoritySettings = () => render(
  <Harness>
    <MarcAuthoritySettings />
  </Harness>,
);

describe('Given Settings', () => {
  beforeEach(() => {
    Settings.mockClear();
  });

  it('should be rendered', () => {
    const { getByText } = renderMarcAuthoritySettings();

    expect(getByText('Settings')).toBeVisible();
  });
});
