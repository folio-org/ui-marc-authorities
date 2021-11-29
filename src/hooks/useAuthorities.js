import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import { useOkapiKy } from '@folio/stripes/core';

import {
  template,
} from 'lodash';

const AUTHORITIES_API = 'search/authorities';

export const useAuthorities = () => {
  const ky = useOkapiKy();

  const { search } = useLocation();
  const queryParams = queryString.parse(search);

  const compileQuery = template(
    '(personalName=="%{query}*" or sftPersonalName=="sft %{query}*" or saftPersonalName=="saft %{query}*")',
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlQuery = queryParams.query?.trim().replace('*', '').split(/\s+/)
    .map(query => compileQuery({ query }))
    .join(' and ');

  const searchParams = {
    query: cqlQuery,
  };

  const { isFetching, data } = useQuery(
    ['ui-marc-authorities'],
    async () => {
      if (!queryParams.query) {
        return { authorities: [], totalRecords: 0 };
      }

      return ky.get(AUTHORITIES_API, { searchParams }).json();
    },
  );

  return ({
    ...data,
    isLoading: isFetching,
    query: cqlQuery,
  });
};
