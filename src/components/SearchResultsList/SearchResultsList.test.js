import {
  render,
} from '@testing-library/react';
import noop from 'lodash/noop';

import Harness from '../../../test/jest/helpers/harness';
import SearchResultsList from './SearchResultsList';
import authorities from '../../../mocks/authorities.json';
import { searchResultListColumns } from '../../constants';

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
});
