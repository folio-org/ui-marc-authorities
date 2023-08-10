import {
  fireEvent,
  render,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import AuthorityQuickMarcRoute from './AuthorityQuickMarcRoute';
import Harness from '../../../test/jest/helpers/harness';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: jest.fn().mockReturnValue({ search: '' }),
  useRouteMatch: jest.fn().mockReturnValue({ path: '' }),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => 'namespace',
  Pluggable: ({ onClose }) => (
    <div>
      QuickMarcPlugin
      <button
        onClick={() => onClose('recordRoute/id')}
        type="button"
      >
        close
      </button>
    </div>
  ),
}));

const renderAuthorityQuickMarcRoute = () => render(
  <Harness>
    <AuthorityQuickMarcRoute />
  </Harness>,
);

describe('Given AuthorityQuickMarcRoute', () => {
  it('should render with no axe errors', async () => {
    const { container } = renderAuthorityQuickMarcRoute();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render quick marc plugin', () => {
    const { getByText } = renderAuthorityQuickMarcRoute();

    expect(getByText('QuickMarcPlugin')).toBeDefined();
  });

  describe('when click on close button', () => {
    it('should handle history.push', async () => {
      jest.useFakeTimers();
      const { getByText } = renderAuthorityQuickMarcRoute();

      fireEvent.click(getByText('close'));
      jest.advanceTimersByTime(1000);

      await waitFor(() => expect(mockHistoryPush).toHaveBeenCalled());
      jest.useRealTimers();
    });
  });
});
