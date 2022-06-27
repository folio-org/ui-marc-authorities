import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { QUERY_KEY_AUTHORITY_SOURCE } from '../constants';

const MARC_SOURCE_API = id => `source-storage/records/${id}/formatted?idType=AUTHORITY`;

export const useMarcSource = (recordId, { onError }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITY_SOURCE });

  const { isFetching, data } = useQuery(
    [namespace, recordId],
    async () => {
      return ky.get(MARC_SOURCE_API(recordId)).json()
        .catch(onError);
    },
  );

  return ({
    data,
    isLoading: isFetching,
  });
};
