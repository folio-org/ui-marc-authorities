import {
  render,
} from '@testing-library/react';
import noop from 'lodash/noop';

import Harness from '../../../test/jest/helpers/harness';
import SearchResultsList from './SearchResultsList';
import authorities from '../../../mocks/authorities.json';

const renderSearchResultsList = (props = {}) => render(
  <Harness>
    <SearchResultsList
      authorities={authorities}
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
});
