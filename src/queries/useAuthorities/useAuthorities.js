import { useState } from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';
import template from 'lodash/template';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

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
      if (!searchQuery && Object.keys(filters).length === 0) {
        return { authorities: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
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
