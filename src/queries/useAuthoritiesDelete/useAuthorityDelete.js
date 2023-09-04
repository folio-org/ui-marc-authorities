import {
  useMutation,
  useQueryClient,
} from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '@folio/stripes-authority-components';

import { QUERY_KEY_AUTHORITIES } from '../../constants';

const useAuthorityDelete = ({ onError, onSuccess, tenantId, ...restOptions }) => {
  const ky = useTenantKy({ tenantId });
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
