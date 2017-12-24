'use strict';

const makeValidator = require('./lib');

const {rules: {string}} = require('v6e');
const {SubmissionError} = require('redux-form');

const schema = {
    username: string(),
};

const successful = {
    username: 'hunter',
};

const error = {
    illegal: 'hacking!!',
    nested:  {
        illegal: 'hi',
        fields:  'hi',
    }
};

it('should not throw when when the validation succeeds', () => {

    return makeValidator(schema)(successful);
});

it('should throw a SubmissionError when the validation fails', async () => {

    expect.assertions(2);

    try {
        await makeValidator(schema)(error);
    } catch (e) {
        expect(e).toBeInstanceOf(SubmissionError);
        expect(e.errors).toEqual({
            username: 'Must be a string',
            _error:   [
                'illegal: Illegal attribute.',
                'nested: Illegal attribute.',
            ]
        });
    }
});