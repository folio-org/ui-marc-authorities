import { render } from '@testing-library/react';

import SearchRoute from './SearchRoute';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../views', () => ({
  AuthoritiesSearch: ({ children }) => <div>AuthoritiesSearch <div>{children}</div></div>,
}));

const renderSearchRoute = () => render(
  <Harness>
    <SearchRoute>
      children content
    </SearchRoute>
  </Harness>,
);

describe('Given SearchRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const { getByText } = renderSearchRoute();

    expect(getByText('children content')).toBeDefined();
  });
});
