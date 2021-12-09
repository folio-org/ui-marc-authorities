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
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const history = useHistory();
  const location = useLocation();

  const queryParams = {
    query: searchQuery,
    qindex: searchIndex,
    ...filters,
  };

  const compileQuery = template(
    buildQuery(searchIndex),
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlSearch = queryParams.query?.trim().replace('*', '').split(/\s+/)
    .map(query => compileQuery({ query }));

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData.parse(filterValues);
    });

  const cqlQuery = [...cqlSearch, ...cqlFilters].join(' and ');

  const searchParams = {
    query: cqlQuery,
  };

  const { isFetching, data } = useQuery(
    [namespace, searchParams],
    async () => {
      if (!searchQuery && Object.keys(filters).length === 0) {
        return { authorities: [], totalRecords: 0 };
      }

      const searchString = `${buildSearch(queryParams, location.search)}`;

      history.replace({
        pathname: location.pathname,
        search: searchString,
      });

      return ky.get(AUTHORITIES_API, { searchParams }).json();
    },
  );

  return ({
    ...data,
    isLoading: isFetching,
    query: cqlQuery,
  });
};

export default useAuthorities;
