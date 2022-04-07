import {
  fireEvent,
  render,
} from '@testing-library/react';
import AuthorityQuickMarcEditRoute from './AuthorityQuickMarcEditRoute';

const mockHistoryPush = jest.fn();

jest.useFakeTimers();

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

const renderAuthorityQuickMarcEditRoute = () => render(<AuthorityQuickMarcEditRoute />);

describe('Given AuthorityQuickMarcEditRoute', () => {
  it('should render quick marc plugin', () => {
    const { getByText } = renderAuthorityQuickMarcEditRoute();

    expect(getByText('QuickMarcPlugin')).toBeDefined();
  });

  describe('when click on close button', () => {
    it('should handle history.push', () => {
      const { getByText } = renderAuthorityQuickMarcEditRoute();

      fireEvent.click(getByText('close'));
      jest.runAllTimers();

      expect(mockHistoryPush).toHaveBeenCalled();
    });
  });
});
