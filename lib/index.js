'use strict';

const {SubmissionError}           = require('redux-form');
const {validate, util: {shake}}   = require('v6e');
const {isEmpty, assign, defaults} = require('lodash');

const {splitErrors} = require('./common');

/**
 * redux-form compatible validation using v6e
 * @param {*} schema v6e schema
 * @param {Boolean} [debug = false] Whether to show debug information if the validation fails
 * @param {Object} [v6eOptions = {}] Other options to pass to v6e
 * @param {Boolean} [v6eOptions.strict = true] Whether to enable strict validation in v6e (doesn't allow "un-specified" fields)
 */
module.exports = (schema, v6eOptions = {}, {debug = false} = {}) => values => {

    defaults(v6eOptions, {
        strict: true,
    });

    return validate(schema, values, null, v6eOptions)
        .then(shake)
        .then(errors => {
            if (!isEmpty(errors)) {
                console.warn('A validation error has occurred.');
                if (debug) {
                    console.warn('Validation errors:', errors);
                    console.warn('Validation values:', values);
                    console.warn('Validation schema:', schema);
                }
                const {form, fields} = splitErrors(errors, schema);
                throw new SubmissionError(assign({}, fields, {_error: form}));
            }
        });
};