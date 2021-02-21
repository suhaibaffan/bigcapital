import React, { useMemo, useCallback } from 'react';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { AppToaster } from 'components';
import { pick } from 'lodash';
import CurrencyFormContent from './CurrencyFormContent';

import { useCurrencyFormContext } from './CurrencyFormProvider';
import {
  CreateCurrencyFormSchema,
  EditCurrencyFormSchema,
} from './CurrencyForm.schema';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose, transformToForm } from 'utils';

const defaultInitialValues = {
  currency_name: '',
  currency_code: '',
};

/**
 * Currency form.
 */
function CurrencyForm({
  // #withDialogActions
  closeDialog,
}) {
  const { formatMessage } = useIntl();

  const {
    createCurrencyMutate,
    editCurrencyMutate,
    dialogName,
    currency,
    isEditMode,
  } = useCurrencyFormContext();

  // Form validation schema in create and edit mode.
  const validationSchema = isEditMode
    ? EditCurrencyFormSchema
    : CreateCurrencyFormSchema;

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      // ...(isEditMode && pick(currency, Object.keys(defaultInitialValues))),
      ...transformToForm(currency, defaultInitialValues),
    }),
    [],
  );

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    // Handle close the dialog after success response.
    const afterSubmit = () => {
      closeDialog(dialogName);
    };

    const onSuccess = ({ response }) => {
      AppToaster.show({
        message: formatMessage({
          id: isEditMode
            ? 'the_currency_has_been_edited_successfully'
            : 'the_currency_has_been_created_successfully',
        }),
        intent: Intent.SUCCESS,
      });
      afterSubmit(response);
    };

    // Handle the response error.
    const onError = (errors) => {
      setSubmitting(false);
    };
    if (isEditMode) {
      editCurrencyMutate([currency.id, values]).then(onSuccess).catch(onError);
    } else {
      createCurrencyMutate(values).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <CurrencyFormContent />
    </Formik>
  );
}

export default compose(withDialogActions)(CurrencyForm);