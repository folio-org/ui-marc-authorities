import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import {
  useAuthoritiesBrowse,
  useBrowseResultFocus,
} from '@folio/stripes-authority-components';
import BrowseRoute from './BrowseRoute';
import Harness from '../../../test/jest/helpers/harness';
import { AuthoritiesSearch } from '../../views';

const mockIsPaginationClicked = { current: false };
const mockHandleLoadMore = jest.fn();

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthoritiesBrowse: jest.fn(),
  useBrowseResultFocus: jest.fn(),
}));

jest.mock('../../views', () => ({
  AuthoritiesSearch: jest.fn(({ children }) => (
    <div>
      AuthoritiesSearch
      <div>{children}</div>
    </div>
  )),
}));

const renderBrowseRoute = () => render(
  <Harness>
    <BrowseRoute>
      children content
    </BrowseRoute>
  </Harness>,
);

describe('Given BrowseRoute', () => {
  beforeEach(() => {
    mockIsPaginationClicked.current = false;

    useAuthoritiesBrowse.mockReturnValue({
      authorities: [],
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: false,
      isLoaded: false,
      handleLoadMore: mockHandleLoadMore,
      query: '(headingRef>="" or headingRef<"") and isTitleHeadingRef==false',
      totalRecords: 0,
    });

    useBrowseResultFocus.mockReturnValue({
      resultsContainerRef: { current: null },
      isPaginationClicked: mockIsPaginationClicked,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderBrowseRoute();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render children', () => {
    const { getByText } = renderBrowseRoute();

    expect(getByText('children content')).toBeDefined();
  });

  describe('when a user clicks on the pagination button', () => {
    it('should invoke handleLoadMore and assign isPaginationClicked to true', () => {
      const args = [100, 95, 0, 'next'];

      renderBrowseRoute();
      AuthoritiesSearch.mock.calls[0][0].handleLoadMore(...args);

      expect(mockHandleLoadMore).toHaveBeenCalledWith(...args);
      expect(mockIsPaginationClicked.current).toBeTruthy();
    });
  });
});
