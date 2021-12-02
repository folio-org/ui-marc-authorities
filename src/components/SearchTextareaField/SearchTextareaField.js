import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import {
  Select,
  TextArea,
} from '@folio/stripes/components';

import css from './SearchTextareaField.css';

const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeIndex: PropTypes.func,
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  selectedIndex: PropTypes.string,
  value: PropTypes.string,
};

const SearchTextareaField = ({
  className,
  id,
  value,
  onChange,
  loading,
  searchableIndexes,
  onChangeIndex,
  selectedIndex,
  disabled,
  ...rest
}) => {
  const intl = useIntl();

  const indexLabel = intl.formatMessage({ id: 'stripes-components.searchFieldIndex' });

  const searchableIndexesDropdown = (
    <Select
      aria-label={indexLabel}
      dataOptions={searchableIndexes}
      disabled={loading}
      id={`${id}-qindex`}
      marginBottom0
      onChange={onChangeIndex}
      selectClass={css.select}
      value={selectedIndex}
    />
  );

  const rootStyles = classNames(
    css.searchFieldWrap,
    className,
  );

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      <TextArea
        {...rest}
        disabled={disabled}
        id={id}
        loading={loading}
        onChange={onChange}
        type="search"
        value={value || ''}
        readOnly={loading || rest.readOnly}
      />
    </div>
  );
};

SearchTextareaField.propTypes = propTypes;
SearchTextareaField.defaultProps = {
  disabled: false,
  loading: false,
};

export default SearchTextareaField;
