import {
  useCallback,
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

import {
  LoadingView,
  Button,
} from '@folio/stripes/components';
import {
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';

import { KeyShortCutsWrapper } from '../../components';

const propTypes = {
  authority: PropTypes.shape({
    data: PropTypes.shape({
      headingRef: PropTypes.string,
      headingType: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  marcSource: PropTypes.shape({
    data: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
};

const AuthorityView = ({
  marcSource,
  authority,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const stripes = useStripes();

  const onClose = useCallback(
    () => {
      history.push({
        pathname: '/marc-authorities',
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  if (marcSource.isLoading || authority.isLoading) {
    return <LoadingView />;
  }

  const redirectToQuickMarcEditPage = () => {
    history.push({
      pathname: `/marc-authorities/quick-marc/edit-authority/${authority.data.id}`,
      search: location.search,
    });
  };

  const hasEditPermission = () => {
    return stripes.hasPerm('ui-marc-authorities.authority-record.edit');
  };

  return (
    <KeyShortCutsWrapper
      onEdit={redirectToQuickMarcEditPage}
      canEdit={hasEditPermission()}
    >
      <div data-testid="authority-marc-view">
        <MarcView
          paneTitle={authority.data.headingRef}
          paneSub={intl.formatMessage({
            id: 'ui-marc-authorities.authorityRecordSubtitle',
          }, {
            heading: authority.data.headingType,
            lastUpdatedDate: intl.formatDate(marcSource.data.metadata.updatedDate),
          })}
          isPaneset={false}
          marcTitle={intl.formatMessage({ id: 'ui-marc-authorities.marcHeading' })}
          marc={marcSource.data}
          onClose={onClose}
          lastMenu={(
            <IfPermission perm="ui-marc-authorities.authority-record.edit">
              <Button
                buttonStyle="primary"
                marginBottom0
                onClick={redirectToQuickMarcEditPage}
              >
                <FormattedMessage id="ui-marc-authorities.authority-record.edit" />
              </Button>
            </IfPermission>
           )}
        />
      </div>
    </KeyShortCutsWrapper>
  );
};

AuthorityView.propTypes = propTypes;

export default AuthorityView;
