import { render } from '@testing-library/react';

import { useMarcSource } from '@folio/stripes-authority-components';
import {runAxeTest} from "@folio/stripes-testing";

import AuthorityViewRoute from './AuthorityViewRoute';
import Harness from '../../../test/jest/helpers/harness';

const mockSendCallout = jest.fn().mockName('sendCalloutMock');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useCallout: () => ({
    sendCallout: mockSendCallout,
  }),
}));

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useMarcSource: jest.fn(),
}));

jest.mock('../../views/AuthorityView/AuthorityView', () => function () {
  return <div>AuthorityView</div>;
});

const renderAuthorityViewRoute = () => render(
  <Harness>
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
});
