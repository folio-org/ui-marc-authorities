import { useQuery } from 'react-query';
import filter from 'lodash/filter';
import matches from 'lodash/matches';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const AUTHORITIES_API = 'search/authorities';
const AUTHORITY_CHUNK_SIZE = 500;

export const useAuthority = (recordId, authRefType = null, headingRef = null) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const searchParams = {
    query: `(id==${recordId})`,
  };

  const { isFetching, data = [] } = useQuery(
    [namespace, 'authority', recordId],
    async () => {
      const { totalRecords } = await ky.get(AUTHORITIES_API, { searchParams: { ...searchParams, limit: 0 } }).json();

      const authorityBatchesPromises = (Array(Math.ceil(totalRecords / AUTHORITY_CHUNK_SIZE)))
        .fill(null)
        .map((a, index) => {
          return ky.get(
            AUTHORITIES_API,
            { searchParams: { ...searchParams, limit: AUTHORITY_CHUNK_SIZE, offset: index * AUTHORITY_CHUNK_SIZE } },
          ).json();
        });
      const authorityBatches = await Promise.all(authorityBatchesPromises);

      return authorityBatches.reduce((acc, { authorities = [] }) => {
        return [...acc, ...authorities];
      }, []);
    },
  );

  const authorityByAuthRefType = filter(data, matches({ authRefType, headingRef }))[0];

  return ({
    data: authorityByAuthRefType || data[0],
    isLoading: isFetching,
  });
};
