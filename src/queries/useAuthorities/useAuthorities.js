import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';
import template from 'lodash/template';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import { defaultAdvancedSearchQueryBuilder } from '@folio/stripes/components';

import { buildQuery } from '../utils';
import {
  filterConfig,
  searchableIndexesValues,
  subjectHeadingsMap,
  FILTERS,
  QUERY_KEY_AUTHORITIES,
} from '../../constants';

const AUTHORITIES_API = 'search/authorities';

const buildRegularSearch = (searchIndex, query, filters) => {
  const compileQuery = template(
    buildQuery({
      searchIndex,
      filters,
    }),
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlSearch = [];

  if (query) {
    const queryParam = searchIndex === searchableIndexesValues.IDENTIFIER
      ? query
      : query.trim();

    const compiledQuery = compileQuery({ query: queryParam });

    cqlSearch.push(compiledQuery);
  }

  return cqlSearch;
};

const buildAdvancedSearch = (advancedSearch, filters) => {
  const rowFormatter = (index, query, comparator) => {
    const compileQuery = template(
      buildQuery({
        searchIndex: index,
        comparator,
        filters,
      }),
      { interpolate: /%{([\s\S]+?)}/g },
    );

    return compileQuery({ query });
  };

  return [defaultAdvancedSearchQueryBuilder(advancedSearch, rowFormatter)];
};

const useAuthorities = ({
  searchQuery,
  searchIndex,
  advancedSearch,
  isAdvancedSearch,
  filters,
  pageSize,
  sortOrder,
  sortedColumn,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [
    searchQuery,
    searchIndex,
    advancedSearch,
    filters,
    sortOrder,
    sortedColumn,
  ]);

  let cqlSearch = [];

  if (isAdvancedSearch) {
    cqlSearch = buildAdvancedSearch(advancedSearch, filters);
  } else {
    cqlSearch = buildRegularSearch(searchIndex, searchQuery, filters);
  }

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      let finalFilterValues = filterValues;

      if (filterName === FILTERS.SUBJECT_HEADINGS) {
        const filterValuesForSubjectHeadings = filterValues.map(name => subjectHeadingsMap[name]);

        finalFilterValues = filterValuesForSubjectHeadings;
      }

      return filterData.parse(finalFilterValues);
    });

  let cqlQuery = [...cqlSearch, ...cqlFilters].join(' and ');

  if (sortOrder && sortedColumn) {
    cqlQuery += ` sortBy ${sortedColumn}/sort.${sortOrder}`;
  }

  const searchParams = {
    query: cqlQuery,
    limit: pageSize,
    offset,
  };

  const {
    isFetching,
    isFetched,
    data,
  } = useQuery(
    [namespace, searchParams],
    async () => {
      if (!searchQuery && !Object.values(filters).find(value => value.length > 0)) {
        return { authorities: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      keepPreviousData: true,
    },
  );

  const authoritiesWithNull = useMemo(() => {
    const authoritiesArray = new Array(offset);

    authoritiesArray.splice(offset, 0, ...data?.authorities || []);

    return authoritiesArray;
  }, [data?.authorities]);

  return ({
    totalRecords: data?.totalRecords || 0,
    authorities: authoritiesWithNull,
    isLoading: isFetching,
    isLoaded: isFetched,
    query: cqlQuery,
    setOffset,
  });
};

export default useAuthorities;
