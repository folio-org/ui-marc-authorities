import { render } from '@folio/jest-config-stripes/testing-library/react';
import { Settings } from '@folio/stripes/smart-components';

import Harness from '../../../test/jest/helpers/harness';

import { MarcAuthoritySettings } from './MarcAuthoritySettings';
import { useAuditSettings } from '../../queries';
import { VERSION_HISTORY_ENABLED_SETTING } from '../../constants';

jest.mock('../../queries', () => ({
  ...jest.requireActual('../../queries'),
  useAuditSettings: jest.fn(),
}));

const renderMarcAuthoritySettings = () => render(
  <Harness>
    <MarcAuthoritySettings />
  </Harness>,
);

describe('Given Settings', () => {
  beforeEach(() => {
    Settings.mockClear();

    useAuditSettings.mockReturnValue({
      settings: [{
        key: VERSION_HISTORY_ENABLED_SETTING,
        value: true,
      }],
      isLoading: false,
    });
  });

  it('should be rendered', () => {
    const { getByText } = renderMarcAuthoritySettings();

    expect(getByText('Settings')).toBeVisible();
  });

  describe('when version history feature is not enabled', () => {
    it('should not render Version History page', () => {
      useAuditSettings.mockReturnValue({
        settings: [{
          key: VERSION_HISTORY_ENABLED_SETTING,
          value: false,
        }],
        isLoading: false,
      });

      renderMarcAuthoritySettings();

      expect(Settings.mock.calls[0][0].pages.find(page => page.route === 'version-history')).toBeUndefined();
    });
  });

  describe('when version history settings are loading', () => {
    it('should not render Version History page', () => {
      useAuditSettings.mockReturnValue({
        settings: [{
          key: VERSION_HISTORY_ENABLED_SETTING,
          value: true,
        }],
        isLoading: true,
      });

      const { queryByText } = renderMarcAuthoritySettings();

      expect(queryByText('Settings')).toBeNull();
    });
  });
});
