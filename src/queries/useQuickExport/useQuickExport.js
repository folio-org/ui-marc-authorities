import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { EXPORT_AUTHORITY_JOB_PROFILE_ID } from '../../constants';

const useQuickExport = ({ onError, onSuccess, ...restOptions }) => {
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
            jobProfileId: EXPORT_AUTHORITY_JOB_PROFILE_ID,
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

export default useQuickExport;
