'use strict';

const {forEach, keys, has, get, unset, isObject, isFunction, transform} = require('lodash');

/**
 * Get an array of keys that are present in "compare" but not in "base"
 * @param {Object} compare
 * @param {Object} base
 */
const foreignPropsDeep = (compare, base) => {

    const foreignProps = (compare, base) => {

        const keysInCompare = keys(compare);

        return transform(keysInCompare, (result, key) => {

            // Check if the property is present in the base object
            const present = has(base, key);

            // If it is not present, just add the key to the "absents" array
            if (!present) result.push(key);

            else {

                const compareVal         = get(compare, key);
                const compareValIsObject = isObject(compareVal) && !isFunction(compareVal);
                const baseVal            = get(base, key);
                const baseValIsObject    = isObject(baseVal) && !isFunction(baseVal);
                // Note we're not counting functions as objects as functions indicate validation rules

                // If neither of the two values is an object, it seems this property is
                // present and in good shape. Let's continue the loop at the next key
                if (!baseValIsObject && !compareValIsObject) return;

                // If the key is present in the "base" object, but the value is an object
                // whereas the "compare" value is not, we should still treat it as foreign
                // (non-present) because of the structural equality
                if (baseValIsObject && !compareValIsObject) result.push(key);

                // In any other case, perform a recursive comparison
                // That means even if the "base" object is not an object, we will just
                // treat it as an empty object as every key should turn up as foreign
                // Append all the results to the array with the current object path prefixed
                else {
                    const subForeign = foreignProps(compareVal, baseVal);
                    forEach(subForeign, foreign => result.push(`${key}.${foreign}`));
                }
            }
        }, []);
    };

    return foreignProps(compare, base);
};

/**
 * Splits an object of errors into one object (fields) that specifies
 * all errors for fields that are actually defined in the scheme,
 * and an array (form) with flattened error descriptions for fields
 * that are not actually present in the scheme and thus can not be shown
 * @param {Object} errors
 * @param {Object} schema
 * @returns {{fields: Object, form: Array}}
 */
const splitErrors = (errors, schema) => {

    const foreign = foreignPropsDeep(errors, schema);
    const form    = [];

    forEach(foreign, foreignProp => {

        const error = get(errors, foreignProp);
        form.push(`${foreignProp}: ${error}`);
        unset(errors, foreignProp);
    });

    return {fields: errors, form};
};

module.exports = {foreignPropsDeep, splitErrors};