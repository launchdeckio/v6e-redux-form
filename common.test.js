'use strict';

const {foreignProps} = require('./lib/common');

it('should return an array of the paths of all props not present in one of the objects', () => {

    const compare = {
        foo: 'bar',
        boo: 'baz',
        mad: 'science',
        b:   {
            some:   'some',
            other:  'thing',
            nested: {
                obj: 'hi',
            },
        },
    };

    const base = {
        foo: 'bar',
        boo: {
            test: 'hi',
        },
        b:   {
            other:  'thing',
            nested: 'ho',
        },
    };

    const result = foreignProps(compare, base);

    expect(result).toEqual([
        'boo',
        'mad',
        'b.some',
        'b.nested.obj',
    ]);
});