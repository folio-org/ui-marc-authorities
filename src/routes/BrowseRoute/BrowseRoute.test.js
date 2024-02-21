import { render } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { useAuthoritiesBrowse } from '@folio/stripes-authority-components';
import BrowseRoute from './BrowseRoute';
import Harness from '../../../test/jest/helpers/harness';
import { AuthoritiesSearch } from '../../views';

const mockHandleLoadMore = jest.fn();

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthoritiesBrowse: jest.fn(),
}));

jest.mock('../../views', () => ({
  AuthoritiesSearch: jest.fn(({ children }) => (
    <div>
      AuthoritiesSearch
      <div>{children}</div>
    </div>
  )),
}));

const renderBrowseRoute = (authoritiesCtxValue) => render(
  <Harness authoritiesCtxValue={authoritiesCtxValue}>
    <BrowseRoute>
      children content
    </BrowseRoute>
  </Harness>,
);

describe('Given BrowseRoute', () => {
  beforeEach(() => {
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

  describe('when search query is empty', () => {
    it('should show default document.title', () => {
      renderBrowseRoute();

      expect(document.title).toEqual('ui-marc-authorities.meta.title - FOLIO');
    });
  });

  describe('when search query is not empty', () => {
    it('should show default document.title', () => {
      renderBrowseRoute({ searchQuery: 'test' });

      expect(document.title).toEqual('ui-marc-authorities.documentTitle.browse - FOLIO');
    });
  });

  describe('when a user clicks on the pagination button', () => {
    it('should invoke handleLoadMore', () => {
      const args = [100, 95, 0, 'next'];

      renderBrowseRoute();
      AuthoritiesSearch.mock.calls[0][0].handleLoadMore(...args);

      expect(mockHandleLoadMore).toHaveBeenCalledWith(...args);
    });
  });
});
