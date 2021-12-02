import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const AUTHORITIES_API = 'search/authorities';

export const useAuthority = (recordId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const searchParams = {
    query: `(id==${recordId})`,
  };

  const { isFetching, data } = useQuery(
    [namespace, 'authority', recordId],
    async () => {
      return ky.get(AUTHORITIES_API, { searchParams }).json();
    },
  );

  return ({
    data: data?.authorities[0],
    isLoading: isFetching,
  });
};
