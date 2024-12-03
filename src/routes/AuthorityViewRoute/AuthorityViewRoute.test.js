import { render } from '@folio/jest-config-stripes/testing-library/react';

import {
  useMarcSource,
  useAuthority,
} from '@folio/stripes-authority-components';
import { useStripes } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import AuthorityViewRoute from './AuthorityViewRoute';
import Harness from '../../../test/jest/helpers/harness';

const mockSendCallout = jest.fn().mockName('sendCalloutMock');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useCallout: () => ({
    sendCallout: mockSendCallout,
  }),
  useNamespace: () => ['@folio/marc-authorities', jest.fn()],
  useStripes: jest.fn().mockReturnValue({
    hasInterface: jest.fn().mockReturnValue(true),
    user: {
      perms: {},
      user: {
        id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
        username: 'diku_admin',
        consortium: {
          centralTenantId: 'consortia',
        },
      },
    },
  }),
}));

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useMarcSource: jest.fn(),
  useAuthority: jest.fn(),
}));

jest.mock('../../views/AuthorityView/AuthorityView', () => function () {
  return <div>AuthorityView</div>;
});

const renderAuthorityViewRoute = (selectedRecordCtxValue) => render(
  <Harness selectedRecordCtxValue={selectedRecordCtxValue}>
    <AuthorityViewRoute />
  </Harness>,
);

describe('Given AuthorityViewRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthorityViewRoute();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render view component', () => {
    const { getByText } = renderAuthorityViewRoute();

    expect(getByText('AuthorityView')).toBeDefined();
  });

  describe('when marc source request failed', () => {
    const responsePromise = Promise.resolve({ status: 404 });

    beforeEach(() => {
      useMarcSource.mockImplementation((id, { onError }) => onError({
        response: responsePromise,
      }));
    });

    it('should show error toast', async () => {
      renderAuthorityViewRoute();

      await responsePromise;

      expect(mockSendCallout).toHaveBeenCalledWith({
        type: 'error',
        message: 'stripes-authority-components.authority.view.error.notFound',
      });
    });
  });

  describe('when authority is shared/local', () => {
    it('should fetch the authority from the current tenant', () => {
      const authority = {
        shared: true,
      };
      const selectedAuthorityCtxValue = [authority];

      renderAuthorityViewRoute(selectedAuthorityCtxValue);

      expect(useAuthority.mock.calls[0][0]).toEqual({
        tenantId: undefined,
      });
    });
  });

  describe('when authority is shared', () => {
    it('should fetch data from central tenant', () => {
      const authority = {
        shared: true,
      };
      const selectedAuthorityCtxValue = [authority];

      renderAuthorityViewRoute(selectedAuthorityCtxValue);

      expect(useMarcSource.mock.calls[0][0]).toEqual({
        enabled: true,
        tenantId: 'consortia',
      });
      expect(useAuthority.mock.calls[0][0]).toEqual({
        tenantId: undefined,
      });
    });

    describe('when consortium info is not loaded', () => {
      beforeEach(() => {
        useStripes.mockReturnValueOnce({
          hasInterface: jest.fn().mockReturnValue(true),
          user: {
            perms: {},
            user: {
              id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
              username: 'diku_admin',
            },
          },
        });
      });

      it('should not fetch the marc source', () => {
        const authority = {
          shared: true,
        };
        const selectedAuthorityCtxValue = [authority];

        renderAuthorityViewRoute(selectedAuthorityCtxValue);

        expect(useMarcSource.mock.calls[0][0]).toEqual(expect.objectContaining({ enabled: false }));
      });
    });
  });

  describe('when authority is local', () => {
    it('should fetch data with authority.tenantId', () => {
      const authority = {
        shared: false,
        tenantId: 'university',
      };
      const selectedAuthorityCtxValue = [authority];

      renderAuthorityViewRoute(selectedAuthorityCtxValue);

      expect(useMarcSource.mock.calls[0][0]).toEqual({
        enabled: true,
        tenantId: authority.tenantId,
      });
      expect(useAuthority.mock.calls[0][0]).toEqual({
        tenantId: undefined,
      });
    });

    describe('when consortium info is not loaded', () => {
      beforeEach(() => {
        useStripes.mockReturnValueOnce({
          hasInterface: jest.fn().mockReturnValue(true),
          user: {
            perms: {},
            user: {
              id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
              username: 'diku_admin',
            },
          },
        });
      });

      it('should fetch the marc source', () => {
        const authority = {
          shared: false,
          tenantId: 'university',
        };
        const selectedAuthorityCtxValue = [authority];

        renderAuthorityViewRoute(selectedAuthorityCtxValue);

        expect(useMarcSource.mock.calls[0][0]).toEqual({
          enabled: true,
          tenantId: authority.tenantId,
        });
      });
    });
  });
});
