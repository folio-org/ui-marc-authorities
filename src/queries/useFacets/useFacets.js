import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const AUTHORITIES_API = 'search/authorities/facets';

const useFacets = ({
  query,
  facets,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const searchParams = {
    query,
    facet: facets.join(','),
  };

  const { isFetching, data } = useQuery(
    [namespace, searchParams],
    async () => {
      return ky.get(AUTHORITIES_API, { searchParams }).json();
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
