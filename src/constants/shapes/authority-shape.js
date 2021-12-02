import PropTypes from 'prop-types';

/* eslint-disable react/sort-prop-types */

export const AuthorityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  personalName: PropTypes.string.isRequired,
  sftPersonalName: PropTypes.arrayOf(PropTypes.string).isRequired,
  saftPersonalName: PropTypes.arrayOf(PropTypes.string).isRequired,
  corporateName: PropTypes.string.isRequired,
  sftCorporateName: PropTypes.arrayOf(PropTypes.string).isRequired,
  saftCorporateName: PropTypes.arrayOf(PropTypes.string).isRequired,
  meetingName: PropTypes.string.isRequired,
  sftMeetingName: PropTypes.arrayOf(PropTypes.string).isRequired,
  saftMeetingName: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniformTitle: PropTypes.string.isRequired,
  sftUniformTitle: PropTypes.arrayOf(PropTypes.string).isRequired,
  saftUniformTitle: PropTypes.arrayOf(PropTypes.string).isRequired,
  topicalTerm: PropTypes.string.isRequired,
  sftTopicalTerm: PropTypes.arrayOf(PropTypes.string).isRequired,
  saftTopicalTerm: PropTypes.arrayOf(PropTypes.string).isRequired,
  subjectHeadings: PropTypes.string.isRequired,
  geographicName: PropTypes.string.isRequired,
  sftGeographicTerm: PropTypes.arrayOf(PropTypes.string).isRequired,
  saftGeographicTerm: PropTypes.arrayOf(PropTypes.string).isRequired,
  genreTerm: PropTypes.string.isRequired,
  sftGenreTerm: PropTypes.arrayOf(PropTypes.string).isRequired,
  saftGenreTerm: PropTypes.arrayOf(PropTypes.string).isRequired,
  identifiers: PropTypes.arrayOf(PropTypes.shape({
    identifierTypeId: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  notes: PropTypes.arrayOf(PropTypes.shape({
    note: PropTypes.string.isRequired,
    noteTypeId: PropTypes.string.isRequired,
  })).isRequired,
  metadata: PropTypes.shape({
    createdByUserId: PropTypes.string.isRequired,
    createdByUsername: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
    updateByUsername: PropTypes.string,
    updatedByUserId: PropTypes.string,
    updatedDate: PropTypes.string,
  }).isRequired,
  headingType: PropTypes.string.isRequired,
  authRefType: PropTypes.string.isRequired,
  headingRef: PropTypes.string.isRequired,
});
