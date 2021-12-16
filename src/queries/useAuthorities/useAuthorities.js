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

import { buildSearch } from '@folio/stripes-acq-components';

import {
  template,
  omit,
} from 'lodash';

import { buildQuery } from '../utils';

import { filterConfig } from '../../constants';

const AUTHORITIES_API = 'search/authorities';

const useAuthorities = ({
  searchQuery,
  searchIndex,
  filters,
  isExcludedSeeFromLimiter,
  pageSize,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const history = useHistory();
  const location = useLocation();

  const [offset, setOffset] = useState(0);

  const queryParams = {
    query: searchQuery,
    qindex: searchIndex,
    ...filters,
  };

  const compileQuery = template(
    buildQuery({
      searchIndex,
      isExcludedSeeFromLimiter,
    }),
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlSearch = queryParams.query
    ? queryParams.query?.trim().split(/\s+/)
      .map(query => compileQuery({ query }))
    : [];

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData.parse(filterValues);
    });

  const cqlQuery = [...cqlSearch, ...cqlFilters].join(' and ');

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
      if (isExcludedSeeFromLimiter) {
        queryParams.excludeSeeFrom = isExcludedSeeFromLimiter;
      } else {
        const parsedSearchParams = queryString.parse(location.search);
        const cleanedSearchParams = omit(parsedSearchParams, 'excludeSeeFrom');

        location.search = queryString.stringify(cleanedSearchParams);
      }

      const searchString = `${buildSearch(queryParams, location.search)}`;

      history.replace({
        pathname: location.pathname,
        search: searchString,
      });

      if (!cqlSearch.length && !cqlFilters.length) {
        return { authorities: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_API}?${queryString.stringify(searchParams)}`;

      return ky.get(path).json();
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
