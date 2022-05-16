import { render } from '@testing-library/react';

import BrowseRoute from './BrowseRoute';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../views', () => ({
  AuthoritiesSearch: ({ children }) => (
    <div>
      AuthoritiesSearch
      <div>{children}</div>
    </div>
  ),
}));

const renderBrowseRoute = () => render(
  <Harness>
    <BrowseRoute>
      children content
    </BrowseRoute>
  </Harness>,
);

describe('Given BrowseRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const { getByText } = renderBrowseRoute();

    expect(getByText('children content')).toBeDefined();
  });
});
