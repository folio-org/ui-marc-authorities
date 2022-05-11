import {
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { QUERY_KEY_AUTHORITIES } from '../../constants';

const useAuthorityDelete = ({ onError, onSuccess, ...restOptions }) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const customOptions = {
    onError,
    onSuccess: async () => {
      // Creating a delay because result list takes some time to update
      await new Promise(resolve => setTimeout(resolve, 500));
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
