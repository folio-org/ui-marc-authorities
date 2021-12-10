import { useState } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useQuery } from 'react-query';
import queryString from 'query-string';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { template } from 'lodash';

import { buildQuery } from '../utils';

const AUTHORITIES_API = 'search/authorities';

const useAuthorities = ({
  searchQuery,
  searchIndex,
  pageSize,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const history = useHistory();
  const location = useLocation();

  const [offset, setOffset] = useState(0);

  const queryParams = {
    query: searchQuery,
  };

  const compileQuery = template(
    buildQuery(searchIndex),
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlQuery = queryParams.query?.trim().replace('*', '').split(/\s+/)
    .map(query => compileQuery({ query }))
    .join(' and ');

  const searchParams = {
    query: cqlQuery,
    limit: pageSize,
    offset,
  };

  const fillOffsetWithNull = (authorities = []) => {
    const authoritiesArray = new Array(offset);

    authoritiesArray.splice(offset, 0, ...authorities);

    return authoritiesArray;
  };

  const { isFetching, data } = useQuery(
    [namespace, searchParams],
    async () => {
      if (!searchQuery) {
        return { authorities: [], totalRecords: 0 };
      }

      const locationSearchParams = queryString.parse(location.search);
      locationSearchParams.query = searchQuery;
      locationSearchParams.qindex = searchIndex;
      location.search = queryString.stringify(locationSearchParams);
      history.replace({
        pathname: location.pathname,
        search: location.search,
      });

      return ky.get(AUTHORITIES_API, { searchParams }).json();
    }, {
      keepPreviousData: true,
    },
  );

  return ({
    totalRecords: data?.totalRecords || 0,
    authorities: fillOffsetWithNull(data?.authorities),
    isLoading: isFetching,
    query: cqlQuery,
    setOffset,
  });
};

export default useAuthorities;
