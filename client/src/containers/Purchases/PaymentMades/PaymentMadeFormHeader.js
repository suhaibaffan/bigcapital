import React, { useMemo, useCallback, useState } from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Position,
  MenuItem,
  Classes,
} from '@blueprintjs/core';

import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { useParams, useHistory } from 'react-router-dom';

import moment from 'moment';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import classNames from 'classnames';
import {
  AccountsSelectList,
  ListSelect,
  ErrorMessage,
  FieldRequiredHint,
} from 'components';

import withVender from 'containers/Vendors/withVendors';
import withAccounts from 'containers/Accounts/withAccounts';

function PaymentMadeFormHeader({
  formik: { errors, touched, setFieldValue, getFieldProps, values },

  //#withVender
  vendorsCurrentPage,
  //#withAccouts
  accountsList,
}) {
  const handleDateChange = useCallback(
    (date_filed) => (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue(date_filed, formatted);
    },
    [setFieldValue],
  );

  const handleVenderRenderer = useCallback(
    (vender, { handleClick }) => (
      <MenuItem
        key={vender.id}
        text={vender.display_name}
        onClick={handleClick}
      />
    ),
    [],
  );

  const handleFilterVender = (query, vender, index, exactMatch) => {
    const normalizedTitle = vender.display_name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${vender.display_name} ${normalizedTitle}`.indexOf(normalizedQuery) >=
        0
      );
    }
  };

  const onChangeSelect = useCallback(
    (filedName) => {
      return (item) => {
        setFieldValue(filedName, item.id);
      };
    },
    [setFieldValue],
  );
  // Filter Payment accounts.
  const paymentAccounts = useMemo(
    () => accountsList.filter((a) => a?.type?.key === 'current_asset'),
    [accountsList],
  );

  return (
    <div>
      <div>
        {/* Vend name */}
        <FormGroup
          label={<T id={'vendor_name'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
          labelInfo={<FieldRequiredHint />}
          intent={errors.vendor_id && touched.vendor_id && Intent.DANGER}
          helperText={
            <ErrorMessage name={'vendor_id'} {...{ errors, touched }} />
          }
        >
          <ListSelect
            items={vendorsCurrentPage}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={handleVenderRenderer}
            itemPredicate={handleFilterVender}
            popoverProps={{ minimal: true }}
            onItemSelect={onChangeSelect('vendor_id')}
            selectedItem={values.vendor_id}
            selectedItemProp={'id'}
            defaultText={<T id={'select_vender_account'} />}
            labelProp={'display_name'}
          />
        </FormGroup>

        {/* Payment date */}
        <FormGroup
          label={<T id={'payment_date'} />}
          inline={true}
          labelInfo={<FieldRequiredHint />}
          className={classNames('form-group--select-list', Classes.FILL)}
          intent={errors.payment_date && touched.payment_date && Intent.DANGER}
          helperText={
            <ErrorMessage name="payment_date" {...{ errors, touched }} />
          }
        >
          <DateInput
            {...momentFormatter('YYYY/MM/DD')}
            value={tansformDateValue(values.payment_date)}
            onChange={handleDateChange('payment_date')}
            popoverProps={{ position: Position.BOTTOM, minimal: true }}
          />
        </FormGroup>

        {/* payment number */}
        <FormGroup
          label={<T id={'payment_no'} />}
          inline={true}
          className={('form-group--payment_number', Classes.FILL)}
          labelInfo={<FieldRequiredHint />}
          intent={
            errors.payment_number && touched.payment_number && Intent.DANGER
          }
          helperText={
            <ErrorMessage name="payment_number" {...{ errors, touched }} />
          }
        >
          <InputGroup
            intent={
              errors.payment_number && touched.payment_number && Intent.DANGER
            }
            minimal={true}
            {...getFieldProps('payment_number')}
          />
        </FormGroup>

        {/* payment account */}
        <FormGroup
          label={<T id={'payment_account'} />}
          className={classNames(
            'form-group--payment_account_id',
            'form-group--select-list',
            Classes.FILL,
          )}
          inline={true}
          labelInfo={<FieldRequiredHint />}
          intent={
            errors.payment_account_id &&
            touched.payment_account_id &&
            Intent.DANGER
          }
          helperText={
            <ErrorMessage
              name={'payment_account_id'}
              {...{ errors, touched }}
            />
          }
        >
          <AccountsSelectList
            accounts={paymentAccounts}
            labelInfo={<FieldRequiredHint />}
            onAccountSelected={onChangeSelect('payment_account_id')}
            defaultSelectText={<T id={'select_payment_account'} />}
            selectedAccountId={values.payment_account_id}
          />
        </FormGroup>
      </div>

      {/* reference */}
      <FormGroup
        label={<T id={'reference'} />}
        inline={true}
        className={classNames('form-group--reference', Classes.FILL)}
        intent={errors.reference && touched.reference && Intent.DANGER}
        helperText={<ErrorMessage name="reference" {...{ errors, touched }} />}
      >
        <InputGroup
          intent={errors.reference && touched.reference && Intent.DANGER}
          minimal={true}
          {...getFieldProps('reference')}
        />
      </FormGroup>
    </div>
  );
}

export default compose(
  withVender(({ vendorsCurrentPage }) => ({
    vendorsCurrentPage,
  })),
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
)(PaymentMadeFormHeader);