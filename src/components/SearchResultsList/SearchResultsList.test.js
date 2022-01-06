import {
  render,
} from '@testing-library/react';
import noop from 'lodash/noop';

import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';
import Harness from '../../../test/jest/helpers/harness';
import SearchResultsList from './SearchResultsList';
import authorities from '../../../mocks/authorities';
import {
  searchResultListColumns,
} from '../../constants';

const renderSearchResultsList = (props = {}) => render(
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
      sortOrder=""
      sortedColumn=""
      onHeaderClick={jest.fn()}
      {...props}
    />
  </Harness>,
);

describe('Given SearchResultsList', () => {
  mockOffsetSize(500, 500);

  it('should render MCL component', async () => {
    const { getAllByText } = renderSearchResultsList();

    expect(getAllByText('Twain, Mark')).toHaveLength(15);
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
