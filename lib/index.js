'use strict';

const {SubmissionError}         = require('redux-form');
const {validate, util: {shake}} = require('v6e');
const {isEmpty, assign}         = require('lodash');

const {splitErrors} = require('./common');

/**
 * Create a submit handler function for use with redux-form
 * @param {*} schema V6e schema
 * @param {Boolean} [debug = false] Whether to show debug information if the validation fails
 * @param {Boolean} [strict = true] Whether to enable strict validation in v6e (doesn't allow "un-specified" fields)
 */
module.exports = (schema,
    {
        debug = false,
        strict = true,
    } = {}) => cb => values => validate(schema, values, null, {strict})
    .then(shake)
    .then(errors => {

        if (!isEmpty(errors)) {
            console.warn('A validation error occurred while submitting the form.');
            if (debug) {
                console.warn('Validation errors:', errors);
                console.warn('Validation values:', values);
                console.warn('Validation schema:', schema);
            }
            const {form, fields} = splitErrors(errors, schema);
            throw new SubmissionError(assign({}, fields, {_error: form}));
        }

        else return cb(values);
    });