/**
 * @author Nicolas BONNEAU
 * @description A parser function to parser reference into an object
 * @version 1.0.0
 */

const objectPath = require('object-path');
const extend = require('extend');

// Export or define or add to global
;
(function(global, factory) {

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.refParser = factory();

}(this, function factory() {
    'use strict';

    return function(opts) {

        const ObjectReference = function(opts) {

            const options = {
                "referenceCharKey": '%',
                "recursive": true,
                "global": {},
                "removeGlobal": true
            }

            extend(true, options, opts);

            this._opts = options;
        }

        /**
         * Set ObjectReference options
         * 
         * @param {object} opts The ObjectReference options
         * @return
         */
        ObjectReference.prototype.setOptions = function(opts) {
            extend(true, this._opts, opts);
            return this;
        }

        /**
         * The parser function
         * 
         * @param {object}      data        The object to parse
         * @param {string|null} keyToParse  Define the object key to parse
         */
        ObjectReference.prototype.parse = function(data, keyToParse) {

            if (typeof data !== "object") {
                return;
            }

            // Extend data from global data
            extend(true, data, this._opts.global);

            // Call parser function
            return (function parser(data, global, objectReference, keyToParse) {
                Object.keys(data || {}).forEach((key) => {
                    if (!keyToParse || key === keyToParse) {
                        // If value is an object (Object or Array) and recursive option is true
                        if (typeof data[key] === "object" && objectReference._opts.recursive) {
                            // Parse object
                            parser(data[key], global, objectReference);
                        }
                        // Else if value is a string and one or more references are present inside it
                        else if (typeof data[key] === "string" && objectReference.hasReferences(data[key])) {
                            // Parse references
                            data[key] = objectReference.parseReferences(data[key], global);
                        }
                    }
                });

                if (objectReference._opts.removeGlobal) {
                    Object.keys(objectReference._opts.global || {}).forEach((key) => {
                        delete data[key];
                    });
                }

                return objectReference;
            })(data, data, this, keyToParse);
        };

        /**
         * Parse a string with values from "object" argument
         * If no value is found for a reference then keep initial value
         * Return the parsed string
         * 
         * @param {string} value  The string to parse
         * @param {object} object The object to search reference
         * @return
         */
        ObjectReference.prototype.parseReferences = function(value, object) {

            let result = value;

            // Extract reference keys
            this.getReferenceKeys(value)
                // Iterate on each reference key
                .forEach((referenceKey) => {

                    // Set reference value to reference key
                    let referenceValue = referenceKey;

                    // While one or more references are present inside 
                    while (this.hasReferences(referenceValue)) {
                        this.getReferenceKeys(referenceValue).forEach((key) => {

                            const refCharKeyRegexp = new RegExp(this._opts.referenceCharKey, 'g');

                            referenceValue = referenceValue === key ?
                                objectPath.get(object, referenceValue.replace(refCharKeyRegexp, '')) :
                                referenceValue.replace(key, objectPath.get(object, key.replace(refCharKeyRegexp, '')));
                        });
                    }

                    //if (referenceValue) {
                    result = value === referenceKey ?
                        referenceValue :
                        result.replace(referenceKey, referenceValue);
                    //}

                });

            return result;
        }

        /**
         * Extract all references from a string
         * Return an array of string references
         * 
         * @param {string} str 
         * @param {string} referenceCharKey 
         * @return
         */
        ObjectReference.prototype.getReferenceKeys = function(str, referenceCharKey = null) {
            referenceCharKey = referenceCharKey || this._opts.referenceCharKey;
            const results = str.match(new RegExp(referenceCharKey + '[a-z\.0-9A-Z_]*' + referenceCharKey, 'g'));
            if (!results) {
                return [];
            }
            return results.filter((d) => isValidReference(d, this._opts.referenceCharKey));
        }

        /**
         * Return true if string contains one or more references
         * 
         * @param {string} str 
         * @param {string} referenceCharKey 
         * @return
         */
        ObjectReference.prototype.hasReferences = function(str, referenceCharKey = null) {
            referenceCharKey = referenceCharKey || this._opts.referenceCharKey;
            return new RegExp(referenceCharKey + '[a-z\.0-9A-Z_]*' + referenceCharKey, 'g').test(str);
        }

        // Instanciate ObjectReference
        return new ObjectReference(opts);
    }
}));

function isValidReference(val, referenceCharKey) {
    return val !== referenceCharKey + '' + referenceCharKey;
}