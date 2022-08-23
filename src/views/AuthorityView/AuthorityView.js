import {
  useContext,
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import queryString from 'query-string';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import {
  LoadingPane,
  Dropdown,
  DropdownMenu,
  DropdownButton,
  Button,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  useStripes,
  IfPermission,
  CalloutContext,
} from '@folio/stripes/core';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';
import { SelectedAuthorityRecordContext } from '@folio/stripes-authority-components';

import { KeyShortCutsWrapper } from '../../components';

import useAuthorityDelete from '../../queries/useAuthoritiesDelete/useAuthorityDelete';

const propTypes = {
  authority: PropTypes.shape({
    data: PropTypes.shape({
      authRefType: PropTypes.string,
      headingRef: PropTypes.string,
      headingType: PropTypes.string,
      id: PropTypes.string,
    }),
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  marcSource: PropTypes.shape({
    data: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
};

const AuthorityView = ({
  marcSource,
  authority,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const stripes = useStripes();

  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const callout = useContext(CalloutContext);

  const onClose = useCallback(
    () => {
      setSelectedAuthorityRecordContext(null);

      const parsedSearchParams = queryString.parse(location.search);
      const commonSearchParams = omit(parsedSearchParams, ['authRefType', 'headingRef']);
      const newSearchParamsString = queryString.stringify(commonSearchParams);

      history.push({
        pathname: '/marc-authorities',
        search: newSearchParamsString,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const { deleteItem } = useAuthorityDelete({
    onSettled: () => setDeleteModalOpen(false),
    onError: () => {
      const message = (
        <FormattedMessage
          id="ui-marc-authorities.authority-record.delete.error"
          values={{ headingRef: authority.data.headingRef }}
        />
      );

      callout.sendCallout({ type: 'error', message });
    },
    onSuccess: () => {
      const message = (
        <FormattedMessage
          id="ui-marc-authorities.authority-record.delete.success"
          values={{ headingRef:  authority.data.headingRef }}
        />
      );

      callout.sendCallout({ type: 'success', message });
      onClose();
    },
  });

  if (marcSource.isLoading || authority.isLoading) {
    return <LoadingPane />;
  }

  if (!authority.data) {
    return null;
  }

  if (!authority.data) {
    return null;
  }

  const redirectToQuickMarcEditPage = () => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete('relatedRecordVersion');
    searchParams.append('relatedRecordVersion', marcSource.data.generation);

    history.push({
      pathname: `/marc-authorities/quick-marc/edit-authority/${authority.data.id}`,
      search: searchParams.toString(),
    });
  };

  const hasEditPermission = () => {
    return stripes.hasPerm('ui-marc-authorities.authority-record.edit');
  };

  const hasDeletePermission = () => {
    return stripes.hasPerm('ui-marc-authorities.authority-record.delete');
  };

  const markHighlightedFields = () => {
    const highlightAuthRefFields = {
      'Authorized': /1\d\d/,
      'Reference': /4\d\d/,
      'Auth/Ref': /5\d\d/,
    };

    const marcFields = marcSource.data.parsedRecord.content.fields.map(field => {
      const tag = Object.keys(field)[0];

      const isHighlightedTag = highlightAuthRefFields[authority.data.authRefType].test(tag);

      if (!isHighlightedTag) {
        return field;
      }

      const fieldContent = field[tag].subfields.reduce((contentArr, subfield) => {
        const subfieldValue = Object.values(subfield)[0];

        return [...contentArr, subfieldValue];
      }, []).join(' ');

      const isHeadingRefMatching = fieldContent === authority.data.headingRef;

      return {
        ...field,
        [tag]: {
          ...field[tag],
          isHighlighted: isHeadingRefMatching && isHighlightedTag,
        },
      };
    });
    const marcSourceClone = cloneDeep(marcSource);

    set(marcSourceClone, 'data.parsedRecord.content.fields', marcFields);

    return marcSourceClone;
  };

  const onConfirmDelete = () => {
    deleteItem(authority.data.id);
    setDeleteModalOpen(false);
  };

  return (
    <KeyShortCutsWrapper
      onEdit={redirectToQuickMarcEditPage}
      canEdit={hasEditPermission()}
    >
      <MarcView
        paneWidth="40%"
        paneTitle={authority.data.headingRef}
        paneSub={intl.formatMessage(
          {
            id: 'stripes-authority-components.authorityRecordSubtitle',
          },
          {
            heading: authority.data.headingType,
            lastUpdatedDate: intl.formatDate(
              marcSource.data.metadata.updatedDate,
            ),
          },
        )}
        isPaneset={false}
        marcTitle={intl.formatMessage({
          id: 'stripes-authority-components.marcHeading',
        })}
        marc={markHighlightedFields().data}
        onClose={onClose}
        lastMenu={
          <>
            {(hasEditPermission || hasDeletePermission) && (
              <Dropdown
                renderTrigger={({ getTriggerProps }) => (
                  <DropdownButton
                    buttonStyle="primary"
                    marginBottom0
                    {...getTriggerProps()}
                  >
                    Actions
                  </DropdownButton>
                )}
                renderMenu={() => (
                  <DropdownMenu
                    data-role="menu"
                    aria-label="available options"
                  >
                    <IfPermission perm="ui-marc-authorities.authority-record.edit">
                      <Button
                        buttonStyle="dropdownItem"
                        onClick={redirectToQuickMarcEditPage}
                      >
                        <FormattedMessage id="ui-marc-authorities.authority-record.edit" />
                      </Button>
                    </IfPermission>
                    <IfPermission perm="ui-marc-authorities.authority-record.delete">
                      <Button
                        onClick={() => setDeleteModalOpen(true)}
                        buttonStyle="dropdownItem"
                      >
                        <FormattedMessage id="ui-marc-authorities.authority-record.delete" />
                      </Button>
                    </IfPermission>
                  </DropdownMenu>
                )}
              />
            )}
          </>
        }
      />
      <ConfirmationModal
        id="confirm-delete-note"
        open={deleteModalOpen}
        heading={
          <FormattedMessage id="ui-marc-authorities.delete.label" />
        }
        ariaLabel={intl.formatMessage({
          id: 'ui-marc-authorities.delete.label',
        })}
        message={
          <FormattedMessage
            id="ui-marc-authorities.delete.description"
            values={{ headingRef: authority.data.headingRef }}
          />
        }
        onConfirm={onConfirmDelete}
        buttonStyle="danger"
        onCancel={() => setDeleteModalOpen(false)}
        confirmLabel={
          <FormattedMessage id="stripes-smart-components.delete.buttonLabel" />
        }
      />
    </KeyShortCutsWrapper>
  );
};

AuthorityView.propTypes = propTypes;

export default AuthorityView;
