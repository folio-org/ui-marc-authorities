import {
  render,
} from '@testing-library/react';
import noop from 'lodash/noop';

import Harness from '../../../test/jest/helpers/harness';
import SearchResultsList from './SearchResultsList';
import authorities from '../../../mocks/authorities';
import {
  searchResultListColumns,
  sortOrders,
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

  describe('when sort by select value is "Authorizes/Reference"', () => {
    it('should sort list by "Authorizes/Reference" in descending order', () => {
      const { container } = renderSearchResultsList({
        sortedColumn: 'authRefType',
        sortOrder: sortOrders.DES,
      });

      const firstRowCell = container.querySelectorAll('[data-row-index="row-0"] [role="gridcell"]')[0];

      expect(firstRowCell.textContent).toBe('A test');
    });
  });

  describe('when "Authorizes/Reference" is sorted column in ascending order', () => {
    it('should sort list by "Authorizes/Reference" in ascending order', () => {
      const { container } = renderSearchResultsList({
        sortedColumn: 'authRefType',
        sortOrder: sortOrders.ASC,
      });

      const firstRowCell = container.querySelectorAll('[data-row-index="row-0"] [role="gridcell"]')[0];

      expect(firstRowCell.textContent).toBe('Z test');
    });
  });
});
