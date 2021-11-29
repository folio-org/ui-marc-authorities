import { useState } from 'react';

import {
  SearchResultsList,
} from '../components';

import authoritiesMock from '../../mocks/authorities.json';

const propTypes = {};

const Search = () => {
  const pageSize = 15;
  const [authorities] = useState(authoritiesMock);

  const onFetchNextPage = () => {};

  return (
    <SearchResultsList
      authorities={authorities}
      totalResults={authorities.length}
      pageSize={pageSize}
      onNeedMoreData={onFetchNextPage}
    />
  );
};

Search.propTypes = propTypes;

export { Search };
