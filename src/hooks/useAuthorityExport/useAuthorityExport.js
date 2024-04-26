import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import { useCallout } from '@folio/stripes/core';

import { useQuickExport } from '../../queries';
import { useReportGenerator } from '../useReportGenerator';

export const useAuthorityExport = (selectedRowsIds, onSuccess = noop) => {
  const callout = useCallout();
  const intl = useIntl();

  const reportGenerator = useReportGenerator('QuickAuthorityExport');

  const { exportRecords } = useQuickExport({
    onError: () => {
      const message = intl.formatMessage({ id: 'ui-marc-authorities.export.failure' });

      callout.sendCallout({ type: 'error', message });
    },
    onSuccess: () => {
      const { filename } = reportGenerator.toCSV(selectedRowsIds);

      const message = intl.formatMessage({ id: 'ui-marc-authorities.export.success' }, { exportJobName: filename });

      callout.sendCallout({ type: 'success', message });
      onSuccess();
    },
  });

  return { exportRecords };
};
