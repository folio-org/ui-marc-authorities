import {
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  useLocation,
  useHistory,
} from 'react-router';

import differenceBy from 'lodash/differenceBy';
import isNil from 'lodash/isNil';
import filter from 'lodash/filter';

import { SelectedAuthorityRecordContext } from '../../../context';
import { areRecordsEqual } from '../utils';

export const useHighlightEditedRecord = (authorities) => {
  const prevAuthorities = useRef();
  const location = useLocation();
  const history = useHistory();

  const [selectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);

  useEffect(() => {
    prevAuthorities.current = authorities;
  }, [authorities]);

  const findRecordToHighlight = () => {
    // first we have to check that there still exists a record that exactly matches what we have in context
    // is it exists - that means that edited fields were not related to Heading/Ref
    const exactMatchExists = !!authorities.find(authority => areRecordsEqual(authority, selectedAuthorityRecord));

    if (exactMatchExists) {
      return null;
    }

    // if exact match doesn't exist we have to search for a record which Heading/Ref changed after editing
    // this `difference` will remove all records whose Heading/Ref did not change
    // and we're left with records whose Heading/Ref changed
    const prevList = prevAuthorities.current.filter(authority => authority.id === selectedAuthorityRecord?.id);
    const currentList = filter(authorities, (val) => !isNil(val)).filter(authority => authority.id === selectedAuthorityRecord?.id);
    const diff = differenceBy(currentList, prevList, 'headingRef');

    let updatedRecord = null;

    if (diff.length === 1) {
      // if only one record's Heading/Ref changed - that's the record we edited
      updatedRecord = diff[0];
    } else {
      // however if there are more than one - we just have to find record with same id and authRefType and hope that it's the one we edited
      // unfortunately there's no 100% certain way to know which record was edited in this case
      updatedRecord = diff.find(authority => authority.id === selectedAuthorityRecord?.id && authority.authRefType === selectedAuthorityRecord?.authRefType);
    }

    return updatedRecord;
  };

  if (!location.state?.editSuccessful) {
    return null;
  }

  if (!prevAuthorities.current?.length || prevAuthorities.current === authorities) {
    return null;
  }

  if (!selectedAuthorityRecord) {
    return null;
  }

  history.replace({ ...location, state: null });
  return findRecordToHighlight();
};
