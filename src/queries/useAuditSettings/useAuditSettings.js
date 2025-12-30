import { useCallback } from 'react';
import {
  useMutation,
  useQuery,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { AUTHORITY_AUDIT_GROUP } from '../../constants';

const useAuditSettings = ({ tenantId, enabled = true, group = AUTHORITY_AUDIT_GROUP } = {}) => {
  const stripes = useStripes();
  const SETTINGS_ENDPOINT = `audit/config/groups/${group}/settings`;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'audit-settings' });

  const { data, isLoading, refetch, isError } = useQuery(
    [namespace, tenantId],
    () => ky.get(SETTINGS_ENDPOINT).json(),
    {
      enabled: enabled && stripes.hasInterface('audit-config'),
    },
  );

  const {
    mutateAsync,
  } = useMutation(({ body, settingKey }) => ky.put(`${SETTINGS_ENDPOINT}/${settingKey}`, {
    json: body,
  }).json());

  const updateSetting = useCallback(async ({ body, settingKey }) => {
    await mutateAsync({ body, settingKey });
    await refetch();
  }, [mutateAsync, refetch]);

  return {
    settings: data?.settings,
    updateSetting,
    isLoading,
    isError,
  };
};

export { useAuditSettings };
