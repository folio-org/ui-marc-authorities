import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { useIntl } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import { REPORT_TYPES } from '../../views/AuthoritiesSearch/constants';

const JOB_TYPE_MAP = {
  [REPORT_TYPES.HEADINGS_UPDATES]: 'AUTH_HEADINGS_UPDATES',
  [REPORT_TYPES.FAILED_UPDATES]: 'FAILED_LINKED_BIB_UPDATES',
};

const useExportReport = ({
  onError,
  onSuccess,
}) => {
  const ky = useOkapiKy();
  const intl = useIntl();

  const { mutate } = useMutation({
    mutationFn: json => {
      return ky.post('data-export-spring/jobs', { json })
        .json()
        .then(res => {
          onSuccess(res);
        })
        .catch(e => {
          onError(e);
        });
    },
  });

  const doExport = useCallback((type, data) => {
    mutate({
      type: JOB_TYPE_MAP[type],
      description: intl.formatMessage({ id: `ui-marc-authorities.reports.${type}.description` }),
      outputFormat: intl.formatMessage({ id: `ui-marc-authorities.reports.${type}.outputFormat` }),
      exportTypeSpecificParameters: {
        authorityControlExportConfig: data,
      },
    });
  }, [mutate, intl]);

  return {
    doExport,
  };
};

export { useExportReport };
