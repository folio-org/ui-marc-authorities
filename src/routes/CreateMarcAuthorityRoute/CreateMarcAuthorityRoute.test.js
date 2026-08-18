import {
  MemoryRouter,
  useHistory,
  Route,
} from 'react-router';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useStripes, Pluggable } from '@folio/stripes/core';

import { CreateMarcAuthorityRoute } from './CreateMarcAuthorityRoute';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn().mockImplementation(({ onCreateAndKeepEditing, onClose, onSave }) => (
    <>
      Pluggable
      <button type="button" onClick={() => onCreateAndKeepEditing('id')}>Save and Keep editing</button>
      <button type="button" onClick={() => onClose('id')}>Close</button>
      <button type="button" onClick={() => onSave('id')}>Save</button>
    </>
  )),
  useStripes: jest.fn(),
}));

const wrapper = ({ children }) => (
  <Harness
    Router={MemoryRouter}
    routerProps={{
      initialEntries: ['/create-authority'],
    }}
    authoritiesCtxValue={{ setIsGoingToBaseURL: jest.fn() }}
  >
    <Route
      path="/create-authority"
      render={() => children}
    />
  </Harness>
);

const renderCreateMarcAuthorityRoute = (props = {}) => render(
  <CreateMarcAuthorityRoute {...props} />,
  { wrapper },
);

describe('CreateMarcAuthorityRoute', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useHistory.mockClear().mockReturnValue({
      push: mockPush,
    });

    useStripes.mockClear().mockReturnValue(buildStripes());
  });

  it('should render Pluggable component', () => {
    renderCreateMarcAuthorityRoute();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();

    expect(Pluggable).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValues: expect.objectContaining({
          marcFormat: 'AUTHORITY',
          leader: expect.stringMatching(/^00000nz/),
          fields: expect.arrayContaining([
            expect.objectContaining({ tag: '001' }),
            expect.objectContaining({ tag: '005' }),
            expect.objectContaining({
              tag: '008',
              content: expect.objectContaining({ RecUpd: 'a' }),
            }),
            expect.objectContaining({ tag: '999' }),
          ]),
        }),
      }),
      {}
    );
  });

  describe('when handling save and keep editing', () => {
    it('should redirect to marc authority edit route', () => {
      renderCreateMarcAuthorityRoute();

      fireEvent.click(screen.getByText('Save and Keep editing'));
      expect(mockPush).toHaveBeenCalledWith('edit-authority/id');
    });
  });

  describe('when handling save', () => {
    it('should redirect to authority record', () => {
      renderCreateMarcAuthorityRoute();

      fireEvent.click(screen.getByText('Save'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/marc-authorities/authorities/id',
        search: '',
        state: { isClosingFocused: true, isNewRecord: true },
      });
    });
  });

  describe('when handling close', () => {
    it('should redirect to authority record', () => {
      renderCreateMarcAuthorityRoute();

      fireEvent.click(screen.getByText('Close'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/marc-authorities/authorities/id',
        search: '',
        state: { isClosingFocused: true, isNewRecord: false },
      });
    });
  });
});
