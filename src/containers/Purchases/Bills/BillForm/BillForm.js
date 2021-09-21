import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { CLASSES } from 'common/classes';

import { EditBillFormSchema, CreateBillFormSchema } from './BillForm.schema';
import BillFormHeader from './BillFormHeader';
import BillFloatingActions from './BillFloatingActions';
import BillFormFooter from './BillFormFooter';
import BillItemsEntriesEditor from './BillItemsEntriesEditor';

import { AppToaster } from 'components';

import { ERROR } from 'common/errors';
import { useBillFormContext } from './BillFormProvider';
import { compose, safeSumBy } from 'utils';
import {
  defaultBill,
  transformToEditForm,
  transformEntriesToSubmit,
} from './utils';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

/**
 * Bill form.
 */
function BillForm({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();

  // Bill form context.
  const { bill, isNewMode, submitPayload, createBillMutate, editBillMutate } =
    useBillFormContext();

  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(bill)
        ? {
            ...transformToEditForm(bill),
            currency_code: base_currency,
          }
        : {
            ...defaultBill,
            currency_code: base_currency,
          }),
    }),
    [bill, base_currency],
  );

  // Transform response error to fields.
  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.BILL_NUMBER_EXISTS)) {
      setErrors({
        bill_number: intl.get('bill_number_exists'),
      });
    }
  };

  // Handles form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, setErrors, resetForm },
  ) => {
    const entries = values.entries.filter(
      (item) => item.item_id && item.quantity,
    );
    const totalQuantity = safeSumBy(entries, 'quantity');

    if (totalQuantity === 0) {
      AppToaster.show({
        message: intl.get('quantity_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...values,
      open: submitPayload.status,
      entries: transformEntriesToSubmit(entries),
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_bill_has_been_created_successfully'
            : 'the_bill_has_been_edited_successfully',
          { number: values.bill_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/bills');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };
    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      handleErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      createBillMutate(form).then(onSuccess).catch(onError);
    } else {
      editBillMutate([bill.id, form]).then(onSuccess).catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_BILL,
      )}
    >
      <Formik
        validationSchema={isNewMode ? CreateBillFormSchema : EditBillFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <BillFormHeader />
          <BillItemsEntriesEditor />
          <BillFormFooter />
          <BillFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}
export default compose(withCurrentOrganization())(BillForm);