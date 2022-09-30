'use strict'
const { hash, compare } = require('bcrypt');

/**
 * Function that hash text and return it
 * @param {string} field text to be hashed
 * @returns {Promise<String>} A promise to be either resolved with the hash result or reject with an error
 */
exports.hashField = async field => await hash(field, 12);

/**
 * Validate if plain text is same that hashed text
 * @param {string} field text to be compared with hashed string
 * @param {string} hashedField hashed text needed to compare
 * @returns {Promise<boolean>} A promise to be either resolved with the comparison result or reject with an error
 */
exports.compareWithHash = async (field, hashedField) => await compare(field, hashedField);