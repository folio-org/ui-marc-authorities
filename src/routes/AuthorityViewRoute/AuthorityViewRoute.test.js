import { MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';

import AuthorityViewRoute from './AuthorityViewRoute';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../views/AuthorityView/AuthorityView', () => () => <div>AuthorityView</div>);

const renderAuthorityViewRoute = () => render(
  <MemoryRouter>
    <Harness>
      <AuthorityViewRoute />
    </Harness>
  </MemoryRouter>,
);

describe('Given AuthorityViewRoute', () => {
  beforeEach(() => {
  });

  it('should render view component', () => {
    const { getByText } = renderAuthorityViewRoute();

    expect(getByText('AuthorityView')).toBeDefined();
  });
});
