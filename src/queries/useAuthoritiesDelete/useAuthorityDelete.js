import {
  useMutation,
  useQueryClient,
} from 'react-query';
import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  QUERY_KEY_AUTHORITIES,
  MARC_RECORD_STATUS_API,
  QM_RECORD_STATUS_TIMEOUT,
  QM_RECORD_STATUS_BAIL_TIME,
} from '../../constants';

const useAuthorityDelete = ({ onError, onSuccess, ...restOptions }) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const maxRequestAttempts = QM_RECORD_STATUS_BAIL_TIME / QM_RECORD_STATUS_TIMEOUT;
  let requestCount = 1;

  const customOptions = {
    onError,
    onSuccess: async (deleteResult) => {
      const { actionId } = await deleteResult.json();

      let deleteRequestStatus;

      while (deleteRequestStatus !== 'COMPLETED' && requestCount !== maxRequestAttempts) {
        const statusResponse = await ky.get(MARC_RECORD_STATUS_API, { searchParams: { actionId } });
        const { status } = statusResponse.json();

        deleteRequestStatus = status;
        requestCount++;
      }

      queryClient.invalidateQueries(namespace);

      return onSuccess();
    },
  };

  const { mutate } = useMutation({
    mutationFn: (id) => {
      return ky.delete(`records-editor/records/${id}`);
    },
    ...customOptions,
    ...restOptions,
  });

  return {
    deleteItem: mutate,
  };
};

export default useAuthorityDelete;
