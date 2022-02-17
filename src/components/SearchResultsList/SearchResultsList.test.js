import {
  render,
  fireEvent,
} from '@testing-library/react';
import noop from 'lodash/noop';

import { runAxeTest } from '@folio/stripes-testing';
import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';

import Harness from '../../../test/jest/helpers/harness';
import SearchResultsList from './SearchResultsList';
import { SelectedAuthorityRecordContext } from '../../context';
import authorities from '../../../mocks/authorities';
import {
  searchResultListColumns,
} from '../../constants';

const mockToggleFilterPane = jest.fn();
const mockSetSelectedAuthorityRecordContext = jest.fn();

const renderSearchResultsList = (props = {}) => render(
  <SelectedAuthorityRecordContext.Provider value={[null, mockSetSelectedAuthorityRecordContext]}>
    <Harness>
      <SearchResultsList
        authorities={authorities}
        visibleColumns={[
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
          searchResultListColumns.HEADING_TYPE,
        ]}
        totalResults={authorities.length}
        loading={false}
        loaded={false}
        query=""
        hasFilters={false}
        pageSize={15}
        onNeedMoreData={noop}
        toggleFilterPane={mockToggleFilterPane}
        isFilterPaneVisible
        sortOrder=""
        sortedColumn=""
        onHeaderClick={jest.fn()}
        {...props}
      />
    </Harness>
  </SelectedAuthorityRecordContext.Provider>,
);

describe('Given SearchResultsList', () => {
  mockOffsetSize(500, 500);

  it('should render MCL component', async () => {
    const { getAllByText } = renderSearchResultsList();

    expect(getAllByText('Twain, Mark')).toHaveLength(15);
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSearchResultsList();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display 3 columns', () => {
    const { getByText } = renderSearchResultsList();

    expect(getByText('ui-marc-authorities.search-results-list.authRefType')).toBeDefined();
    expect(getByText('ui-marc-authorities.search-results-list.headingRef')).toBeDefined();
    expect(getByText('ui-marc-authorities.search-results-list.headingType')).toBeDefined();
  });

  it('should display empty message', () => {
    const { getByText } = renderSearchResultsList({
      authorities: [],
      totalResults: 0,
    });

    expect(getByText('stripes-smart-components.sas.noResults.noTerms')).toBeDefined();
  });

  describe('when click on a row', () => {
    it('should handle setSelectedAuthorityRecordContext', () => {
      const [firstRowRecord] = authorities;

      const { getAllByRole } = renderSearchResultsList();

      const [rowLink] = getAllByRole('link', { name: 'Twain, Mark' });

      fireEvent.click(rowLink);

      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(firstRowRecord);
    });
  });

  describe('when search is pending', () => {
    it('should display pending message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [],
        totalResults: 0,
        loading: true,
      });

      expect(getByText('stripes-smart-components.sas.noResults.loading')).toBeDefined();
    });
  });

  describe('when search is finished and no results were returned', () => {
    it('should display pending message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [],
        totalResults: 0,
        query: 'test=abc',
        loaded: true,
      });

      expect(getByText('stripes-smart-components.sas.noResults.default')).toBeDefined();
    });
  });

  describe('when show columns checkbox for "Type of Heading" is not checked', () => {
    it('should display 2 columns', () => {
      const { queryByText } = renderSearchResultsList({
        visibleColumns: [
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
        ],
      });

      expect(queryByText('ui-marc-authorities.search-results-list.authRefType')).toBeDefined();
      expect(queryByText('ui-marc-authorities.search-results-list.headingRef')).toBeDefined();
      expect(queryByText('ui-marc-authorities.search-results-list.headingType')).toBeNull();
    });
  });
});
