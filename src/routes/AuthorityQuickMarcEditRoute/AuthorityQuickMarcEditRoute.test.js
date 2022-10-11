import {
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import AuthorityQuickMarcEditRoute from './AuthorityQuickMarcEditRoute';
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

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
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

const renderAuthorityQuickMarcEditRoute = () => render(
  <Harness>
    <AuthorityQuickMarcEditRoute />
  </Harness>,
);

describe('Given AuthorityQuickMarcEditRoute', () => {
  it('should render with no axe errors', async () => {
    const { container } = renderAuthorityQuickMarcEditRoute();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render quick marc plugin', () => {
    const { getByText } = renderAuthorityQuickMarcEditRoute();

    expect(getByText('QuickMarcPlugin')).toBeDefined();
  });

  describe('when click on close button', () => {
    it('should handle history.push', async () => {
      jest.useFakeTimers();
      const { getByText } = renderAuthorityQuickMarcEditRoute();

      fireEvent.click(getByText('close'));
      jest.advanceTimersByTime(1000);

      await waitFor(() => expect(mockHistoryPush).toHaveBeenCalled());
      jest.useRealTimers();
    });
  });
});
