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

import {
  LoadingPane,
  Dropdown,
  DropdownMenu,
  DropdownButton,
  Button,
  ConfirmationModal,
  Icon,
} from '@folio/stripes/components';
import {
  useStripes,
  IfPermission,
  CalloutContext,
} from '@folio/stripes/core';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';

import { useAuthorityMappingRules } from '@folio/stripes-authority-components/lib/queries';

import {
  markHighlightedFields,
  SelectedAuthorityRecordContext,
} from '@folio/stripes-authority-components';

import PrintPopup from '@folio/quick-marc/src/QuickMarcView/PrintPopup';
import { KeyShortCutsWrapper } from '../../components';

import useAuthorityDelete from '../../queries/useAuthoritiesDelete/useAuthorityDelete';

const propTypes = {
  authority: PropTypes.shape({
    allData: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.shape({
      authRefType: PropTypes.string,
      headingRef: PropTypes.string,
      headingType: PropTypes.string,
      id: PropTypes.string,
      numberOfTitles: PropTypes.number,
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

  const { authorityMappingRules } = useAuthorityMappingRules();

  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const callout = useContext(CalloutContext);
  const linkedRecord = authority?.allData.find(authorityRecord => authorityRecord.numberOfTitles);

  const [isShownPrintPopup, setIsShownPrintPopup] = useState(false);
  const openPrintPopup = () => setIsShownPrintPopup(true);
  const closePrintPopup = () => setIsShownPrintPopup(false);

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
    return <LoadingPane id="marc-view-pane" />;
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

  const onConfirmDelete = () => {
    deleteItem(authority.data.id);
    setDeleteModalOpen(false);
  };

  const marcTitle = intl.formatMessage({
    id: 'stripes-authority-components.marcHeading',
  });

  const paneTitle = authority.data.headingRef;

  return (
    <KeyShortCutsWrapper
      onEdit={redirectToQuickMarcEditPage}
      canEdit={hasEditPermission()}
    >
      <MarcView
        paneWidth="40%"
        paneTitle={paneTitle}
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
        marcTitle={marcTitle}
        marc={markHighlightedFields(marcSource, authority, authorityMappingRules).data}
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
                    <FormattedMessage id="ui-marc-authorities.actions" />
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
                        <Icon icon="edit">
                          <FormattedMessage id="ui-marc-authorities.authority-record.edit" />
                        </Icon>
                      </Button>
                    </IfPermission>
                    <IfPermission perm="ui-marc-authorities.authority-record.view">
                      <Button
                        buttonStyle="dropdownItem"
                        onClick={openPrintPopup}
                      >
                        <Icon icon="print">
                          <FormattedMessage id="ui-marc-authorities.authority-record.print" />
                        </Icon>
                      </Button>
                    </IfPermission>
                    <IfPermission perm="ui-marc-authorities.authority-record.delete">
                      <Button
                        onClick={() => setDeleteModalOpen(true)}
                        buttonStyle="dropdownItem"
                      >
                        <Icon icon="trash">
                          <FormattedMessage id="ui-marc-authorities.authority-record.delete" />
                        </Icon>
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
          linkedRecord
            ? (
              <FormattedMessage
                id="ui-marc-authorities.delete.linkedRecord.description"
                values={{
                  headingRef: authority.data.headingRef,
                  count: linkedRecord.numberOfTitles,
                }}
              />
            )
            : (
              <FormattedMessage
                id="ui-marc-authorities.delete.description"
                values={{ headingRef: authority.data.headingRef }}
              />
            )
        }
        onConfirm={onConfirmDelete}
        buttonStyle="danger"
        onCancel={() => setDeleteModalOpen(false)}
        confirmLabel={
          <FormattedMessage id="ui-marc-authorities.delete.buttonLabel" />
        }
      />
      <IfPermission perm="ui-marc-authorities.authority-record.view">
        {isShownPrintPopup && (
          <PrintPopup
            marc={marcSource.data}
            paneTitle={paneTitle}
            marcTitle={marcTitle}
            onAfterPrint={closePrintPopup}
          />
        )}
      </IfPermission>
    </KeyShortCutsWrapper>
  );
};

AuthorityView.propTypes = propTypes;

export default AuthorityView;
