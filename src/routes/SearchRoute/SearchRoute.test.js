import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SearchRoute from './SearchRoute';
import Harness from '../../../test/jest/helpers/harness';

const mockOnSubmitSearch = jest.fn();

jest.mock('../../views', () => ({
  AuthoritiesSearch:
  ({ children }) => (
    <>
      AuthoritiesSearch
      <button
        type="button"
        onClick={() => mockOnSubmitSearch('advancedSearchRowState')}
      >
        search button
      </button>
      <div>
        {children}
      </div>
    </>
  ),
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

  it('should render with no axe errors', async () => {
    const { container } = renderSearchRoute();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render children', () => {
    const { getByText } = renderSearchRoute();

    expect(getByText('children content')).toBeDefined();
  });

  describe('when click on search button', () => {
    it('should handle onSubmitSearch with advancedSearchRowState', () => {
      const { getByText } = renderSearchRoute();

      fireEvent.click(getByText('search button'));

      expect(mockOnSubmitSearch).toHaveBeenCalledWith('advancedSearchRowState');
    });
  });
});
