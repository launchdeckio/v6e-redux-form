'use strict';

const makeValidator     = require('./lib');
const {rules: {string}} = require('v6e');
const {SubmissionError} = require('redux-form');
const sinon             = require('sinon');

const schema = {
    username: string()
};

const successful = {
    username: 'hunter',
};

const error = {};

it('should run the callback if the validation succeeds', () => {

    const cb = sinon.spy();

    return makeValidator(schema)(cb)(successful).then(() => {
        expect(cb.called).toBe(true);
    });
});

it('should throw a SubmissionError if the validation fails', async () => {

    expect.assertions(1);

    try {
        await makeValidator(schema)(null)(error);
    } catch (e) {
        expect(e).toBeInstanceOf(SubmissionError);
    }
});