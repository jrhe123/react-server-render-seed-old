let mysql = require('mysql');
import { sql_host } from '../../src/utilities/urlPath';

let pw = '';

if(process.env.NODE_ENV === 'development') {
  pw = 'Changeme@123';
} else {
  pw = 't0n1ght@T0r0nt0';
}

let pool = mysql.createPool({
  connectionLimit : 20,
  host     : sql_host,
  user     : 'root',
  password: pw, // password for development
  database : 'sms',
  debug    : false
});

export default pool;