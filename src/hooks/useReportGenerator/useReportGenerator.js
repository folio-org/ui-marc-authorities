import moment from 'moment';
import noop from 'lodash/noop';

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
      filename: `${fileNamePrefix}${moment().format()}`,
    };
    const generateReport = !isTestEnv() ? exportCsv : noop;

    generateReport(parsedRecords, fileTitle);
  };

  return {
    parse,
    toCSV,
  };
};

export default useReportGenerator;
