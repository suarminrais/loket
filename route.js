const db = require('./conn')
const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('guest/index', {
        title: 'Palopo Antrian',
    })
})

router.get('/awas', (req, res) => {
    for (var i = 1; i <= 120; i++) {
        db.query("INSERT INTO priaor VALUES('','0','F " + (+i) +
            "','0')")
    }
})

// route
router.get('/operator', (req, res) => {
    db.query("SELECT number FROM queues WHERE operator='" + req.cookies.op_ppdb + "' ORDER BY time DESC", (err, results) => {
        res.render('operator/index', {
            title: 'Selamat Bertugas Operator!',
            queues: results
        })
    })
})

router.post('/operator', (req, res) => {
    db.query("UPDATE queues SET operator='" + req.body.operator + "', time='" + Date.now() + "' WHERE (operator='0' OR operator='" + req.body.operator + "') AND number='" + req.body.number + "'")
})
router.post('/operator/next', (req, res) => {
    db.query("SELECT number FROM queues WHERE operator='0' LIMIT 0,1", (err, results) => {
        res.json({
            number: results[0].number
        })
    })
})
router.post('/operator/next/query', (req, res) => {
    db.query("UPDATE queues SET operator='" + req.body.operator + "', time='" + Date.now() + "' WHERE number='" + req.body.number + "'")
})

//wni
router.get('/wni', (req, res) => {
    db.query("SELECT number FROM prior WHERE operator='" + req.cookies.op_ppd + "' ORDER BY time DESC;SELECT number FROM wni WHERE operator='" + req.cookies.op_ppd + "' ORDER BY time DESC;", (err, results) => {
        res.render('operator/wni', {
            title: 'Selamat Bertugas Operator!',
            queues: results[1],
            prior: results[0]
        })
    })
})

router.post('/wni', (req, res) => {
    db.query("UPDATE wni SET operator='" + req.body.operator + "', time='" + Date.now() + "' WHERE (operator='0' OR operator='" + req.body.operator + "') AND number='" + req.body.number + "'")
})
router.post('/wni/next', (req, res) => {
    db.query("SELECT number FROM wni WHERE operator='0' LIMIT 0,1", (err, results) => {
        res.json({
            number: results[0].number
        })
    })
})
router.post('/wni/next/query', (req, res) => {
    db.query("UPDATE wni SET operator='" + req.body.operator + "', time='" + Date.now() + "' WHERE number='" + req.body.number + "'")
})

//prior
router.post('/prior', (req, res) => {
    db.query("UPDATE prior SET operator='" + req.body.operator + "', time='" + Date.now() + "' WHERE (operator='0' OR operator='" + req.body.operator + "') AND number='" + req.body.number + "'")
})
router.post('/prior/next', (req, res) => {
    db.query("SELECT number FROM prior WHERE operator='0' LIMIT 0,1", (err, results) => {
        res.json({
            number: results[0].number
        })
    })
})
router.post('/prior/next/query', (req, res) => {
    db.query("UPDATE prior SET operator='" + req.body.operator + "', time='" + Date.now() + "' WHERE number='" + req.body.number + "'")
})

// ajax
router.get('/ajax/guest/table-queue', (req, res) => {
    db.query("SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM wni WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM wni WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM wni WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1; SELECT number from queues WHERE operator = '0' limit 0,3", ['1', '1', '2', '3', 'foto 2', 'foto 3'], (err, results) => {
        res.render('ajax/table-queue', {
            op: results,
            layout: false
        })
    })
})

// queues reset
router.get('/reset', (req, res) => {
    db.query("UPDATE queues SET operator='0', time='0'")
    res.send('Berhasil Reset!..')
})

module.exports = router