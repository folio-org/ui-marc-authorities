import {
  MemoryRouter,
  useHistory,
  Route,
} from 'react-router';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { useAuthority } from '@folio/stripes-authority-components';

import { EditMarcAuthorityRoute } from './EditMarcAuthorityRoute';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn().mockImplementation(({ onClose, onSave }) => (
    <>
      Pluggable
      <button type="button" onClick={() => onClose('id')}>Close</button>
      <button type="button" onClick={() => onSave('id')}>Save</button>
    </>
  )),
  useStripes: jest.fn(),
  useNamespace: jest.fn().mockReturnValue(''),
}));

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthority: jest.fn(),
}));

const wrapper = ({ children }) => (
  <Harness
    Router={MemoryRouter}
    routerProps={{
      initialEntries: ['/edit-authority/id'],
    }}
    authoritiesCtxValue={{ setIsGoingToBaseURL: jest.fn() }}
  >
    <Route
      path="/edit-authority/:externalId"
      render={() => children}
    />
  </Harness>
);

const renderEditMarcAuthorityRoute = (props = {}) => render(
  <EditMarcAuthorityRoute {...props} />,
  { wrapper },
);

describe('EditMarcAuthorityRoute', () => {
  const mockPush = jest.fn();
  const mockRefetchAuthority = jest.fn();

  beforeEach(() => {
    useHistory.mockClear().mockReturnValue({
      push: mockPush,
    });

    useAuthority.mockClear().mockReturnValue({
      refetch: mockRefetchAuthority,
    });

    useStripes.mockClear().mockReturnValue(buildStripes());
  });

  it('should fetch an authority', () => {
    renderEditMarcAuthorityRoute();

    expect(useAuthority).toHaveBeenCalledWith({
      recordId: 'id',
      tenantId: '',
    });
  });

  it('should render Pluggable component', () => {
    renderEditMarcAuthorityRoute();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('when handling save', () => {
    it('should redirect to authority record', async () => {
      renderEditMarcAuthorityRoute();

      fireEvent.click(screen.getByText('Save'));
      waitFor(() => expect(mockPush).toHaveBeenCalledWith({
        pathname: '/marc-authorities/view/id',
        search: '',
        state: { isClosingFocused: true },
      }));
    });
  });

  describe('when handling close', () => {
    it('should redirect to authority record', async () => {
      renderEditMarcAuthorityRoute();

      fireEvent.click(screen.getByText('Close'));
      waitFor(() => expect(mockPush).toHaveBeenCalledWith({
        pathname: '/marc-authorities/view/id',
        search: '',
        state: { isClosingFocused: true },
      }));
    });
  });
});
