import { render } from '@folio/jest-config-stripes/testing-library/react';

import {
  useMarcSource,
  useAuthority,
} from '@folio/stripes-authority-components';
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
        tenantId: 'consortia',
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
        tenantId: authority.tenantId,
      });
    });
  });
});
