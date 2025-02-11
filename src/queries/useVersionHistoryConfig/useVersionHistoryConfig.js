import {
  useMutation,
  useQuery,
} from 'react-query';
import omit from 'lodash/omit';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useVersionHistoryConfig = () => {
  const PAGE_SIZE = 'records.page.size';
  const SETTINGS_ENDPOINT = 'audit/config/groups/audit.authority/settings';

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'version-history-config' });

  const { data, isLoading, refetch } = useQuery(
    [namespace],
    () => ky.get(SETTINGS_ENDPOINT).json(),
  );

  const pageSizeSettings = data?.settings?.find(setting => setting.key === PAGE_SIZE);

  const {
    mutateAsync: updatePageSize,
  } = useMutation(newPageSize => ky.put(`${SETTINGS_ENDPOINT}/${PAGE_SIZE}`, {
    json: {
      ...omit(pageSizeSettings, ['metadata']),
      value: newPageSize,
    },
  }).json());

  return {
    pageSize: pageSizeSettings?.value,
    refetch,
    updatePageSize,
    isLoading,
  };
};

export { useVersionHistoryConfig };
