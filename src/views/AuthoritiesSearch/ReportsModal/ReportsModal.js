import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import {
  Field,
  useFormState,
} from 'react-final-form';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  Button,
  Modal,
  ModalFooter,
  Datepicker,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes-core';
import stripesFinalForm from '@folio/stripes-final-form';

import { DateRangeFieldset } from '../../../components';
import { REPORT_TYPES } from '../constants';

import styles from './ReportsModal.css';

const DATE_FORMAT = 'MM/DD/YYYY';

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  reportType: PropTypes.oneOf(Object.values(REPORT_TYPES)),
};

const ReportsModal = ({
  open,
  onClose,
  reportType,
  handleSubmit,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const { values, valid } = useFormState();

  const parseDate = date => (date ? moment.tz(date, stripes.timezone).format(DATE_FORMAT) : date);

  if (!open) {
    return null;
  }

  return (
    <Modal
      open
      size="small"
      label={intl.formatMessage({ id: `ui-marc-authorities.reportModal.${reportType}.label` })}
      id="authorities-report-modal"
      data-testid="authorities-report-modal"
      aria-label={intl.formatMessage({ id: `ui-marc-authorities.reportModal.${reportType}.label` })}
      onClose={onClose}
      contentClass={styles.reportsModalContent}
      footer={(
        <ModalFooter>
          <Button
            buttonStyle="primary"
            onClick={handleSubmit}
            disabled={!valid}
            data-testid="export-button"
          >
            {intl.formatMessage({ id: 'ui-marc-authorities.reportModal.button.export' })}
          </Button>
          <Button onClick={onClose}>
            {intl.formatMessage({ id: 'ui-marc-authorities.reportModal.button.cancel' })}
          </Button>
        </ModalFooter>
    )}
    >
      <DateRangeFieldset
        startValueGetter={() => values.fromDate}
        endValueGetter={() => values.toDate}
      >
        {({
          endDateExclude,
          startDateExclude,
        }) => (
          <div className={styles.dateRangeWrapper}>
            <Field
              dateFormat={DATE_FORMAT}
              name="fromDate"
              label={intl.formatMessage({ id: 'ui-marc-authorities.reportModal.startDate' })}
              required
              component={Datepicker}
              exclude={startDateExclude}
              usePortal
              autoFocus
              parse={parseDate}
            />
            <Field
              dateFormat={DATE_FORMAT}
              name="toDate"
              label={intl.formatMessage({ id: 'ui-marc-authorities.reportModal.endDate' })}
              required
              component={Datepicker}
              exclude={endDateExclude}
              usePortal
              parse={parseDate}
            />
          </div>
        )}
      </DateRangeFieldset>
    </Modal>
  );
};

ReportsModal.propTypes = propTypes;

ReportsModal.defaultProps = {
  reportType: '',
};

const ReportsModalForm = stripesFinalForm({
  subscription: { values: true },
  validate: values => {
    const errors = {};

    if (!values.fromDate || !moment(values.fromDate).isValid()) {
      errors.fromDate = <FormattedMessage id="ui-marc-authorities.reportModal.startDate.error" />;
    }

    if (!values.toDate || !moment(values.toDate).isValid()) {
      errors.toDate = <FormattedMessage id="ui-marc-authorities.reportModal.endDate.error" />;
    }

    if (moment(values.fromDate).isAfter(values.toDate)) {
      errors.toDate = <FormattedMessage id="ui-marc-authorities.reportModal.endDate.error.greaterThan" />;
    }

    return errors;
  },
})(ReportsModal);

export { ReportsModalForm as ReportsModal };
