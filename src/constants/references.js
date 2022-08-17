import { navigationSegments } from './navigationSegments';

export const REFERENCES_VALUES_MAP = {
  excludeSeeFrom: 'excludeSeeFrom',
  excludeSeeFromAlso: 'excludeSeeFromAlso',
};

export const REFERENCES_OPTIONS_BY_SEGMENT = {
  [navigationSegments.search]: [
    {
      labelId: `ui-marc-authorities.search.${REFERENCES_VALUES_MAP.excludeSeeFrom}`,
      value: REFERENCES_VALUES_MAP.excludeSeeFrom,
    },
    {
      labelId: `ui-marc-authorities.search.${REFERENCES_VALUES_MAP.excludeSeeFromAlso}`,
      value: REFERENCES_VALUES_MAP.excludeSeeFromAlso,
    },
  ],
  [navigationSegments.browse]: [
    {
      labelId: `ui-marc-authorities.search.${REFERENCES_VALUES_MAP.excludeSeeFrom}`,
      value: REFERENCES_VALUES_MAP.excludeSeeFrom,
    },
  ],
};
