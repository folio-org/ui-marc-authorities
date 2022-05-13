import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useAuthorityExport = ({ onError, onSuccess, ...restOptions }) => {
  const ky = useOkapiKy();

  const customOptions = {
    onError,
    onSuccess: async response => {
      const data = await response.json();

      return onSuccess(data);
    },
  };

  const { mutate } = useMutation({
    mutationFn: instanceIds => {
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
