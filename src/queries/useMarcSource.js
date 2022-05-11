import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const MARC_SOURCE_API = id => `source-storage/records/${id}/formatted?idType=AUTHORITY`;

export const useMarcSource = (recordId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const { isFetching, data } = useQuery(
    [namespace, 'authority-source', recordId],
    async () => {
      return ky.get(MARC_SOURCE_API(recordId)).json();
    },
  );

  return ({
    data,
    isLoading: isFetching,
  });
};
