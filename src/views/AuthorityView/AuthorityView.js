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
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import {
  MarcView,
  PrintPopup,
} from '@folio/stripes-marc-components';

import {
  markHighlightedFields,
  SelectedAuthorityRecordContext,
  useAuthorityMappingRules,
  useUserTenantPermissions,
} from '@folio/stripes-authority-components';

import { KeyShortCutsWrapper } from '../../components';

import { useAuthorityDelete } from '../../queries';
import { isConsortiaEnv } from '../../utils';

const propTypes = {
  authority: PropTypes.shape({
    data: PropTypes.shape({
      authRefType: PropTypes.string,
      headingRef: PropTypes.string,
      headingType: PropTypes.string,
      id: PropTypes.string,
      numberOfTitles: PropTypes.number,
      shared: PropTypes.bool,
      tenantId: PropTypes.string,
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

  const isShared = authority.data?.shared;
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
  const tenantId = isShared ? centralTenantId : authority.data?.tenantId;
  const userId = stripes?.user?.user?.id;
  const deleteRecordPerm = 'ui-marc-authorities.authority-record.delete';
  const editRecordPerm = 'ui-marc-authorities.authority-record.edit';
  const linksCount = authority.data?.numberOfTitles;

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    userId,
    tenantId: centralTenantId,
  }, {
    enabled: Boolean(isShared && checkIfUserInMemberTenant(stripes)),
  });

  const { authorityMappingRules } = useAuthorityMappingRules({ tenantId, enabled: Boolean(authority.data) });

  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const callout = useContext(CalloutContext);

  const [isShownPrintPopup, setIsShownPrintPopup] = useState(false);
  const openPrintPopup = () => setIsShownPrintPopup(true);
  const closePrintPopup = () => setIsShownPrintPopup(false);

  const hasCentralTenantPerm = perm => {
    return centralTenantPermissions.some(({ permissionName }) => permissionName === perm);
  };

  const canDeleteRecord = checkIfUserInMemberTenant(stripes) && isShared
    ? hasCentralTenantPerm(deleteRecordPerm)
    : stripes.hasPerm(deleteRecordPerm);
  const canEditRecord = checkIfUserInMemberTenant(stripes) && isShared
    ? hasCentralTenantPerm(editRecordPerm)
    : stripes.hasPerm(editRecordPerm);

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
    tenantId,
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

  if (marcSource.isLoading || authority.isLoading || isCentralTenantPermissionsLoading) {
    return <LoadingPane id="marc-view-pane" />;
  }

  if (!authority.data) {
    return null;
  }

  if (!marcSource.data) {
    return null;
  }

  const redirectToQuickMarcEditPage = () => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete('relatedRecordVersion');
    searchParams.append('relatedRecordVersion', marcSource.data.generation);
    searchParams.append('shared', isShared);

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
  }, {
    shared: isConsortiaEnv(stripes) ? authority.data.shared : null,
  });

  const paneTitle = intl.formatMessage({
    id: 'stripes-authority-components.authorityRecordTitle',
  }, {
    shared: isConsortiaEnv(stripes) ? authority.data.shared : null,
    title: authority.data.headingRef,
  });

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
        tenantId={authority.data.tenantId}
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
                    {canEditRecord && (
                      <Button
                        buttonStyle="dropdownItem"
                        onClick={redirectToQuickMarcEditPage}
                      >
                        <Icon icon="edit">
                          <FormattedMessage id="ui-marc-authorities.authority-record.edit" />
                        </Icon>
                      </Button>
                    )}
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
                    {canDeleteRecord && (
                      <Button
                        onClick={() => setDeleteModalOpen(true)}
                        buttonStyle="dropdownItem"
                      >
                        <Icon icon="trash">
                          <FormattedMessage id="ui-marc-authorities.authority-record.delete" />
                        </Icon>
                      </Button>
                    )}
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
          linksCount
            ? (
              <FormattedMessage
                id="ui-marc-authorities.delete.linkedRecord.description"
                values={{
                  headingRef: authority.data.headingRef,
                  count: linksCount,
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
