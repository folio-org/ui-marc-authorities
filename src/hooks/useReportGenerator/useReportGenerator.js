import noop from 'lodash/noop';

import { dayjs } from '@folio/stripes/components';
import { exportCsv } from '@folio/stripes/util';

const isTestEnv = () => process.env.NODE_ENV === 'test';

const useReportGenerator = fileNamePrefix => {
  const parse = records => {
    return records.map(record => ({ id: record }));
  };

  const toCSV = records => {
    const parsedRecords = parse(records);
    const fileTitle = {
      header: false,
      filename: `${fileNamePrefix}${dayjs().format()}`,
    };
    const generateReport = !isTestEnv() ? exportCsv : noop;

    generateReport(parsedRecords, fileTitle);

    return { filename: fileTitle.filename };
  };

  return {
    parse,
    toCSV,
  };
};

export default useReportGenerator;
