import { render } from '@testing-library/react';

import AuthorityViewRoute from './AuthorityViewRoute';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../views/AuthorityView/AuthorityView', () => function () {
  return <div>AuthorityView</div>;
});

const renderAuthorityViewRoute = () => render(
  <Harness>
    <AuthorityViewRoute />
  </Harness>,
);

describe('Given AuthorityViewRoute', () => {
  it('should render view component', () => {
    const { getByText } = renderAuthorityViewRoute();

    expect(getByText('AuthorityView')).toBeDefined();
  });
});
