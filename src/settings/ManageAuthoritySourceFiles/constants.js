export const authorityFilesColumns = {
  NAME: 'name',
  CODES: 'codes',
  START_NUMBER: 'hridManagement.startNumber',
  BASE_URL: 'baseUrl',
  SELECTABLE: 'selectable',
  SOURCE: 'source',
  LAST_UPDATED: 'lastUpdated',
  ACTIONS: 'actions',
  NUMBER_OF_OBJECTS: 'numberOfObjects',
  VERSION: '_version',
};

export const SOURCES = {
  FOLIO: 'folio',
  LOCAL: 'local',
};

export const ITEM_TEMPLATE = {
  [authorityFilesColumns.NAME]: '',
  [authorityFilesColumns.CODES]: '',
  hridManagement: {
    startNumber: '',
  },
  [authorityFilesColumns.BASE_URL]: '',
  [authorityFilesColumns.SOURCE]: SOURCES.LOCAL,
  [authorityFilesColumns.SELECTABLE]: false,
};

export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

