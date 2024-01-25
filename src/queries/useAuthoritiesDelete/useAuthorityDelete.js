import {
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { QUERY_KEY_AUTHORITIES } from '../../constants';

const useAuthorityDelete = ({ onError, onSuccess, tenantId, ...restOptions }) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const customOptions = {
    onError,
    onSuccess: async () => {
      // Creating a delay because result list takes some time to update
      await new Promise(resolve => setTimeout(resolve, 1500));
      queryClient.invalidateQueries(namespace);
      return onSuccess();
    },
  };

  const { mutate } = useMutation({
    mutationFn: id => {
      return ky.delete(`authority-storage/authorities/${id}`);
    },
    ...customOptions,
    ...restOptions,
  });

  return {
    deleteItem: mutate,
  };
};

export default useAuthorityDelete;
