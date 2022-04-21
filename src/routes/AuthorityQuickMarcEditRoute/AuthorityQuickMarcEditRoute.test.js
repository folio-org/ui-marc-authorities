import {
  fireEvent,
  render,
} from '@testing-library/react';
import AuthorityQuickMarcEditRoute from './AuthorityQuickMarcEditRoute';
import Harness from '../../../test/jest/helpers/harness';

const mockHistoryGoBack = jest.fn();

jest.useFakeTimers();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
  useLocation: jest.fn().mockReturnValue({ search: '' }),
  useRouteMatch: jest.fn().mockReturnValue({ path: '' }),
}));

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
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
  it('should render quick marc plugin', () => {
    const { getByText } = renderAuthorityQuickMarcEditRoute();

    expect(getByText('QuickMarcPlugin')).toBeDefined();
  });

  describe('when click on close button', () => {
    it('should handle history.goBack', () => {
      const { getByText } = renderAuthorityQuickMarcEditRoute();

      fireEvent.click(getByText('close'));
      jest.runAllTimers();

      expect(mockHistoryGoBack).toHaveBeenCalled();
    });
  });
});
