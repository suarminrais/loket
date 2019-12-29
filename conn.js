const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'conco',
    multipleStatements: true
})
db.connect((err) => {
    if (err) console.log(err)
    else console.log('Oke Fine')
})


module.exports = db