'use strict';

const {SubmissionError}         = require('redux-form');
const {validate, util: {shake}} = require('v6e');
const {isEmpty, assign}         = require('lodash');

/**
 * Create a submit handler function for use with redux-form
 * @param {*} schema V6e schema
 * @param {Boolean} [strict = true] Whether to enable strict validation in v6e (doesn't allow "un-specified" fields)
 * @param {Boolean} [hint = true] Whether to log the errors to the console if the validation fails
 */
module.exports = (schema,
    {
        strict = true,
        hint = true
    } = {}) => cb => values => validate(schema, values, null, {strict})
    .then(shake)
    .then(errors => {

        if (!isEmpty(errors)) {
            console.warn('Validation errors:', values, errors);
            throw new SubmissionError(assign({}, errors, {_error: 'Validation failed'}));
        }

        else return cb(values);
    });