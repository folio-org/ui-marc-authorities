import { useIntl } from 'react-intl';
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
import stripesFinalForm from '@folio/stripes-final-form';

import { DateRangeFieldset } from '../../../components';
import { REPORT_TYPES } from '../constants';

import styles from './ReportsModal.css';

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
  const intl = useIntl();
  const { values, valid } = useFormState();

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
              dateFormat="MM-DD-YYYY"
              name="fromDate"
              label={intl.formatMessage({ id: 'ui-marc-authorities.reportModal.startDate' })}
              required
              component={Datepicker}
              exclude={startDateExclude}
              usePortal
            />
            <Field
              dateFormat="MM-DD-YYYY"
              name="toDate"
              label={intl.formatMessage({ id: 'ui-marc-authorities.reportModal.endDate' })}
              required
              component={Datepicker}
              exclude={endDateExclude}
              usePortal
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

    if (!values.fromDate) {
      errors.fromDate = true;
    }

    if (!values.toDate) {
      errors.toDate = true;
    }

    if (moment(values.fromDate).isAfter(values.toDate)) {
      errors.toDate = true;
    }

    return errors;
  },
})(ReportsModal);

export { ReportsModalForm as ReportsModal };
