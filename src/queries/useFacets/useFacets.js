import { useQuery } from 'react-query';
import queryString from 'query-string';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const FACETS_API = 'search/authorities/facets';

const useFacets = ({
  query,
  selectedFacets,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'useFacets' });

  const searchParams = {
    query: query || 'id=*', // if no filters are selected need to pass a valid cql string. this will return any record
    facet: selectedFacets.join(','),
  };

  const { isFetching, data } = useQuery(
    [namespace, searchParams],
    async () => {
      const path = `${FACETS_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      keepPreviousData: true,
    },
  );

  return ({
    facets: data?.facets,
    isLoading: isFetching,
  });
};

export default useFacets;
