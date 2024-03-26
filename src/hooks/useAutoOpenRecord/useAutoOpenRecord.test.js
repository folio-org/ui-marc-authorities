import { useLocation } from 'react-router-dom';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { AuthoritiesSearchContext } from '@folio/stripes-authority-components';

import authoritiesMock from '../../../mocks/authorities';
import { useAutoOpenRecord } from './useAutoOpenRecord';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const wrapper = ({ children }, authoritiesSearchContextValue = {}) => (
  <AuthoritiesSearchContext.Provider value={{
    navigationSegmentValue: 'search',
    ...authoritiesSearchContextValue,
  }}
  >
    {children}
  </AuthoritiesSearchContext.Provider>
);

const mockRedirectToAuthorityRecord = jest.fn();

describe('Given useAutoOpenRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useLocation.mockReturnValue({
      pathname: '/marc-authorities',
      search: '',
    });
  });

  describe('Given Search lookup', () => {
    describe('when records are loading', () => {
      it('should not open record`s detail view', () => {
        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: [authoritiesMock[0]],
            isLoading: true,
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper,
        });

        expect(mockRedirectToAuthorityRecord).not.toHaveBeenCalled();
      });
    });

    describe('when there is more than one record', () => {
      it('should not open record`s detail view', () => {
        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: authoritiesMock,
            isLoading: false,
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper,
        });

        expect(mockRedirectToAuthorityRecord).not.toHaveBeenCalled();
      });
    });

    describe('when there is a record ID in URL', () => {
      it('should not open record`s detail view', () => {
        useLocation.mockReturnValue({
          pathname: '/marc-authorities/authorities/c78121c7-f496-4e07-a818-b3eda91a4e69',
        });

        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: [authoritiesMock[0]],
            isLoading: false,
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper,
        });

        expect(mockRedirectToAuthorityRecord).not.toHaveBeenCalled();
      });
    });

    describe('when closing an open single record', () => {
      it('should not reopen record`s detail view', () => {
        const authorities = [authoritiesMock[0]];

        const initialProps = {
          authorities,
          isLoading: false,
          redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
        };

        useLocation.mockReturnValue({
          pathname: '/marc-authorities/authorities/c78121c7-f496-4e07-a818-b3eda91a4e69',
        });

        const { rerender } = renderHook(useAutoOpenRecord, {
          initialProps,
          wrapper,
        });

        useLocation.mockReturnValue({
          pathname: '/marc-authorities',
        });

        rerender(initialProps);

        expect(mockRedirectToAuthorityRecord).not.toHaveBeenCalled();
      });
    });

    describe('when there is an auto-opened record, and then multiple records are requested', () => {
      describe('and then a previously auto-opened record is requested again', () => {
        it('should be auto-opened', () => {
          const initialProps = {
            authorities: [authoritiesMock[0]],
            isLoading: false,
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          };

          useLocation.mockReturnValue({
            pathname: '/marc-authorities/authorities/c78121c7-f496-4e07-a818-b3eda91a4e69',
          });

          const { rerender } = renderHook(useAutoOpenRecord, {
            initialProps,
            wrapper,
          });

          useLocation.mockReturnValue({
            pathname: '/marc-authorities',
          });

          rerender({
            ...initialProps,
            authorities: authoritiesMock,
          });

          rerender(initialProps);

          expect(mockRedirectToAuthorityRecord).toHaveBeenCalledWith(authoritiesMock[0]);
        });
      });
    });

    describe('when the single record is anchor', () => {
      it('should not be open', () => {
        const authority = {
          ...authoritiesMock[0],
          isAnchor: true,
        };

        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: [authority],
            isLoading: false,
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper,
        });

        expect(mockRedirectToAuthorityRecord).not.toHaveBeenCalled();
      });
    });

    describe('when there is a single record', () => {
      it('should be opened automatically', () => {
        const authority = authoritiesMock[0];

        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: [authority],
            isLoading: false,
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper,
        });

        expect(mockRedirectToAuthorityRecord).toHaveBeenCalledWith(authority);
      });
    });
  });

  describe('Given Browse lookup', () => {
    const authoritiesSearchContextValue = {
      navigationSegmentValue: 'browse',
    };
    const browseWrapper = ({ children }) => wrapper({ children }, authoritiesSearchContextValue);

    describe('when there is a single record', () => {
      it('should be opened automatically', () => {
        const authority = {
          ...authoritiesMock[0],
          isAnchor: true,
          isExactMatch: true,
        };

        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: [authority],
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper: browseWrapper,
        });

        expect(mockRedirectToAuthorityRecord).toHaveBeenCalledWith(authority);
      });
    });

    describe('when there is a single record and it is not anchor', () => {
      it('should not be open', () => {
        const authority = {
          ...authoritiesMock[0],
          isAnchor: false,
          isExactMatch: true,
        };

        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: [authority],
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper: browseWrapper,
        });

        expect(mockRedirectToAuthorityRecord).not.toHaveBeenCalled();
      });
    });

    describe('when there is a single record and isExactMatch is false', () => {
      it('should not be open', () => {
        const authority = {
          ...authoritiesMock[0],
          isAnchor: true,
          isExactMatch: false,
        };

        renderHook(useAutoOpenRecord, {
          initialProps: {
            authorities: [authority],
            redirectToAuthorityRecord: mockRedirectToAuthorityRecord,
          },
          wrapper: browseWrapper,
        });

        expect(mockRedirectToAuthorityRecord).not.toHaveBeenCalled();
      });
    });
  });
});
