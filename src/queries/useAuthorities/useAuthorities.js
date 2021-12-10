import { useState } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { buildSearch } from '@folio/stripes-acq-components';

import { template } from 'lodash';

import { buildQuery } from '../utils';

import { filterConfig } from '../../constants';

const AUTHORITIES_API = 'search/authorities';

const useAuthorities = ({
  searchQuery,
  searchIndex,
  filters,
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
    buildQuery(searchIndex),
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlSearch = queryParams.query
    ? queryParams.query?.trim().replace('*', '').split(/\s+/)
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
      const searchString = `${buildSearch(queryParams, location.search)}`;

      history.replace({
        pathname: location.pathname,
        search: searchString,
      });

      if (!cqlSearch.length && !cqlFilters.length) {
        return { authorities: [], totalRecords: 0 };
      }

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
