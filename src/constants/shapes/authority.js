import PropTypes from 'prop-types';

/* eslint-disable react/sort-prop-types */

export const AuthorityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  personalName: PropTypes.string,
  sftPersonalName: PropTypes.arrayOf(PropTypes.string),
  saftPersonalName: PropTypes.arrayOf(PropTypes.string),
  corporateName: PropTypes.string,
  sftCorporateName: PropTypes.arrayOf(PropTypes.string),
  saftCorporateName: PropTypes.arrayOf(PropTypes.string),
  meetingName: PropTypes.string,
  sftMeetingName: PropTypes.arrayOf(PropTypes.string),
  saftMeetingName: PropTypes.arrayOf(PropTypes.string),
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
