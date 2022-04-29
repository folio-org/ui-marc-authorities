import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useAuthorityExport = ({ onError, onSuccess, ...restOptions }) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: 'authorities' });

  const customOptions = {
    onError,
    onSuccess: async (response) => {
      // Creating a delay because result list takes some time to update
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await response.json();

      queryClient.invalidateQueries(namespace);

      return onSuccess(data);
    },
  };

  const { mutate } = useMutation({
    mutationFn: (instanceIds) => {
      return ky.post(
        'data-export/quick-export',
        {
          json: {
            uuids: instanceIds,
            type: 'uuid',
            recordType: 'AUTHORITY',
          },
        },
      );
    },
    ...customOptions,
    ...restOptions,
  });

  return {
    exportRecords: mutate,
  };
};

export default useAuthorityExport;
