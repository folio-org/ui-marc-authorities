import PropTypes from 'prop-types';

/* eslint-disable react/sort-prop-types */

export const AuthorityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  personalNameTitle: PropTypes.string,
  sftPersonalNameTitle: PropTypes.arrayOf(PropTypes.string),
  saftPersonalNameTitle: PropTypes.arrayOf(PropTypes.string),
  corporateNameTitle: PropTypes.string,
  sftCorporateNameTitle: PropTypes.arrayOf(PropTypes.string),
  saftCorporateNameTitle: PropTypes.arrayOf(PropTypes.string),
  meetingNameTitle: PropTypes.string,
  sftMeetingNameTitle: PropTypes.arrayOf(PropTypes.string),
  saftMeetingNameTitle: PropTypes.arrayOf(PropTypes.string),
  uniformTitle: PropTypes.string,
  sftUniformTitle: PropTypes.arrayOf(PropTypes.string),
  saftUniformTitle: PropTypes.arrayOf(PropTypes.string),
  topicalTerm: PropTypes.string,
  sftTopicalTerm: PropTypes.arrayOf(PropTypes.string),
  saftTopicalTerm: PropTypes.arrayOf(PropTypes.string),
  subjectHeadings: PropTypes.string,
  geographicName: PropTypes.string,
  sftGeographicName: PropTypes.arrayOf(PropTypes.string),
  saftGeographicName: PropTypes.arrayOf(PropTypes.string),
  genreTerm: PropTypes.string,
  sftGenreTerm: PropTypes.arrayOf(PropTypes.string),
  saftGenreTerm: PropTypes.arrayOf(PropTypes.string),
  identifiers: PropTypes.arrayOf(PropTypes.shape({
    identifierTypeId: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  notes: PropTypes.arrayOf(PropTypes.shape({
    note: PropTypes.string.isRequired,
    noteTypeId: PropTypes.string.isRequired,
  })),
  metadata: PropTypes.shape({
    createdByUserId: PropTypes.string,
    createdByUsername: PropTypes.string,
    createdDate: PropTypes.string,
    updateByUsername: PropTypes.string,
    updatedByUserId: PropTypes.string,
    updatedDate: PropTypes.string,
  }),
  headingType: PropTypes.string.isRequired,
  authRefType: PropTypes.string.isRequired,
  headingRef: PropTypes.string.isRequired,
});
