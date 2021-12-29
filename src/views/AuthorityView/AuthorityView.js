import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';

import {
  LoadingView,
} from '@folio/stripes/components';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';

import { AuthorityShape } from '../../constants/shapes';

const propTypes = {
  authority: PropTypes.shape({
    data: AuthorityShape.isRequired,
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

  const onClose = () => {
    history.push('/marc-authorities');
  };

  if (marcSource.isLoading || authority.isLoading) {
    return <LoadingView />;
  }

  return (
    <MarcView
      paneTitle={authority.data.headingRef}
      paneSub={intl.formatMessage({
        id: 'ui-marc-authorities.authorityRecordSubtitle',
      }, {
        heading: authority.data.headingType,
        lastUpdatedDate: intl.formatDate(marcSource.data.metadata.lastUpdatedDate),
      })}
      marcTitle={intl.formatMessage({ id: 'ui-marc-authorities.marcHeading' })}
      marc={marcSource.data}
      onClose={onClose}
    />
  );
};

AuthorityView.propTypes = propTypes;

export default AuthorityView;
