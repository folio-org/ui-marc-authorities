import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import { useReportGenerator } from '../../hooks';

const useAuthorityExport = ({ onError, onSuccess, ...restOptions }) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: 'authorities' });
  const reportGenerator = useReportGenerator('QuickAuthorityExport');

  const customOptions = {
    onError,
    onSuccess: async (response) => {
      // Creating a delay because result list takes some time to update
      await new Promise((resolve) => setTimeout(resolve, 500));
      queryClient.invalidateQueries(namespace);
      console.log({ response });
      return onSuccess();
    },
  };

  const { mutate } = useMutation({
    mutationFn: (instanceIds) => {
      return ky.post(
        `data-export/quick-export`,
        {
          body: {
            uuids: instanceIds,
            type: 'uuid',
            recordType: 'INSTANCE'
          }
        }
      );
    },
    ...customOptions,
    ...restOptions
  });

  return {
    exportRecords: mutate,
  };
};

export default useAuthorityExport;
