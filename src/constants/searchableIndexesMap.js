import { searchableIndexesValues } from './searchableIndexesValues';

export const searchableIndexesMap = {
  [searchableIndexesValues.KEYWORD]: [{
    name: 'keyword',
    plain: true,
  }],
  [searchableIndexesValues.IDENTIFIER]: [{
    name: 'identifiers.value',
    plain: true,
  }],
  [searchableIndexesValues.PERSONAL_NAME]: [{
    name: 'personalName',
    plain: true,
    sft: true,
    saft: true,
  }],
  [searchableIndexesValues.CORPORATE_CONFERENCE_NAME]: [{
    name: 'corporateName',
    plain: true,
    sft: true,
    saft: true,
  }, {
    name: 'meetingName',
    plain: true,
    sft: true,
    saft: true,
  }],
  [searchableIndexesValues.GEOGRAPHIC_NAME]: [{
    name: 'geographicName',
    plain: true,
  }, {
    name: 'sftGeographicName',
    sft: true,
  }, {
    name: 'saftGeographicName',
    saft: true,
  }],
  [searchableIndexesValues.NAME_TITLE]: [{
    name: 'personalNameTitle',
    plain: true,
    sft: true,
  }, {
    name: 'corporateNameTitle',
    plain: true,
    sft: true,
  }, {
    name: 'conferenceNameTitle',
    plain: true,
    sft: true,
  }],
  [searchableIndexesValues.UNIFORM_TITLE]: [{
    name: 'uniformTitle',
    plain: true,
    sft: true,
    saft: true,
  }],
  [searchableIndexesValues.SUBJECT]: [{
    name: 'topicalTerm',
    plain: true,
    sft: true,
    saft: true,
  }],
  [searchableIndexesValues.CHILDREN_SUBJECT_HEADING]: [{
    name: 'subjectHeadings',
    plain: true,
  }],
  [searchableIndexesValues.GENRE]: [{
    name: 'genreTerm',
    plain: true,
    sft: true,
    saft: true,
  }],
};
