import { render } from '@testing-library/react';

import AuthorityViewRoute from './AuthorityViewRoute';
import { useMarcSource } from '../../queries';
import Harness from '../../../test/jest/helpers/harness';

const mockSendCallout = jest.fn().mockName('sendCalloutMock');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useCallout: () => ({
    sendCallout: mockSendCallout,
  }),
}));

jest.mock('../../views/AuthorityView/AuthorityView', () => function () {
  return <div>AuthorityView</div>;
});

jest.mock('../../queries', () => ({
  ...jest.requireActual('../../queries'),
  useMarcSource: jest.fn(),
}));

const renderAuthorityViewRoute = () => render(
  <Harness>
    <AuthorityViewRoute />
  </Harness>,
);

describe('Given AuthorityViewRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        message: 'ui-marc-authorities.authority.view.error.notFound',
      });
    });
  });
});
