const { ObjectId } = require('mongodb');
const { client } = require('../db/conn');

const dbName = 'APIAssassins';

/**
 * Retrieves a collection in the specified database from the client.
 * @param {string} collectionName 
 * @returns the collection in the specified database from the client.
 */
function retrieveCollection(collectionName)
{
    return client.db(dbName).collection(collectionName);
}

function hasEmployeePrivilege(role) {
    return role.includes('employee') || role.includes('admin');
}

function hasAdminPrivilege(role) {
    return role.includes('admin');
}

module.exports = { retrieveCollection, hasEmployeePrivilege, hasAdminPrivilege }
