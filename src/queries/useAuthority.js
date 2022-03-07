import { useQuery } from 'react-query';
import filter from 'lodash/filter';
import matches from 'lodash/matches';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const AUTHORITIES_API = 'search/authorities';

export const useAuthority = (recordId, authRefType = null, headingRef = null) => {
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

  const authorityByAuthRefType = filter(data?.authorities, matches({ authRefType, headingRef }))[0];

  return ({
    data: authorityByAuthRefType || data?.authorities[0],
    isLoading: isFetching,
  });
};
