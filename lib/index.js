'use strict';

const {SubmissionError: _DefaultSubmissionError} = require('redux-form');
const {validate, util: {shake}}                  = require('v6e');
const {isEmpty, assign, defaults}                = require('lodash');

const {splitErrors} = require('./common');

const logDebugInfo = ({errors, values, schema}) => {
    console.warn('A validation error has occurred.');
    console.warn('Validation errors:', errors);
    console.warn('Validation values:', values);
    console.warn('Validation schema:', schema);
};

/**
 * This adapter provides redux-form compatible validation using v6e
 *
 * @param {*} schema v6e schema
 * @param {object} v6eOptions = {} Other options to pass to v6e
 * @param {boolean} [v6eOptions.strict = true] Whether to enable strict validation in v6e (doesn't allow "un-specified" fields)
 * @param {boolean} [debug = false] Whether to show debug information if the validation fails
 * @param {object|null} [flatSchema = null] Optional "flat schema" to use for the "splitError" operation.
 *              You should provide a flatSchema when the main schema is an "higher-order" one -- i.e. a schema
 *              that is a function of itself and will return an object.
 * @param {function} [unfoldErrors = null] Optionally provide a function that is invoked with {values, errors}
 *              Before the SubmissionError is thrown. This function may be used to "map" error field names if the
 *              field names in the form don't correspond directly to the field names in the schema
 * @param {function|*} [SubmissionError = null] Optional injection of the "SubmissionError" class. Since redux-form
 *              Uses a strict "instanceOf" test, the SubmissionError instance is not caught when the "main" application
 *              and v6e-redux-form do not use the same version of redux-form.
 */
module.exports = (schema, v6eOptions, {

    debug = false,
    flatSchema = null,
    unfoldErrors = null,
    SubmissionError = null,

} = {}) => values => {

    if (!SubmissionError) SubmissionError = _DefaultSubmissionError;

    defaults(v6eOptions, {strict: true});

    return validate(schema, values, null, v6eOptions)

    // Remove "empty" values
        .then(shake)

        .then(errors => {
            if (!isEmpty(errors)) {
                if (debug) logDebugInfo({errors, values, schema});
                const splitSchema  = flatSchema !== null ? flatSchema : schema;
                let {form, fields} = splitErrors(errors, splitSchema);
                if (unfoldErrors) fields = unfoldErrors({values, errors: fields});
                throw new SubmissionError(assign({}, fields, {_error: form}));
            }
        });
};