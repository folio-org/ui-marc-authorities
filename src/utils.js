export const buildDateRangeQuery = name => (values) => {
  const [startDateString, endDateString] = values[0]?.split(':') || [];

  if (!startDateString || !endDateString) {
    return '';
  }

  return `(metadata.${name}>="${startDateString}" and metadata.${name}<="${endDateString}")`;
};
