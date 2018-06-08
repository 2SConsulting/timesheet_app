 'use strict';
 
const pg = require('pg');
const async = require('async');

/*
const databaseUser = process.env.DB_USER;
const databasePassword = process.env.DB_PASSWORD;
const databaseName = process.env.DB_DB_NAME;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;
const databaseMaxCon = process.env.DB_MAX_CONNECTIONS;
*/

exports.handler = (event, context) => {
    console.log('Received event : ' + JSON.stringify(event) + ' at ' + new Date());
 
    let dbConfig = {
        user: 's2admin',
        password: 'Cparade1',
        database: 's2ihs',
        host: 's2ihs.caqhm1rtsyb3.eu-central-1.rds.amazonaws.com',
        port: 5432,
    };
 
    let pool = new pg.Pool(dbConfig);
    pool.connect(function(err, client, done) {
 
        if (err) {
            console.error('Error connecting to pg server' + err.stack);
            callback(err);
        } else {
            console.log('Connection established with pg db server');
 
            client.query("select * from country", (err, res) => {
 
                    if (err) {
                        console.error('Error executing query on pg db' + err.stack);
                        callback(err);
                    } else {
                        console.log('Got query results : ' + res.rows.length);
                         
                         
                       async.each(res.rows, function(empRecord) {  
                                console.log(empRecord.country);
                        });
                    }
                    client.release();
                    pool.end();
                    console.log('Ending lambda at ' + new Date());
 
                });
        }
 
    });   
};
