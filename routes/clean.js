// route/clean.js
const express = require('express');
const {conn} = require('../config/db');
const router = express.Router();

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const voiceState = ['', 'selfMute', 'selfDeaf', 'serverMute', 
               'serverDeaf', 'streaming', 'selfVideo'];

const table = [
    'service'
];

router.put('/', (req, res) => {
    const rtn = {
        success : true,
        error : null
    }

    const selectMaxQuery = `SELECT MAX(lastTime) AS maxTime FROM lastTime;`
    conn.query(selectMaxQuery, (err, row, field) => {
        if (err) {
            rtn.success = false;
            rtn.error = err;
            return res.status(400).json(rtn);
        }
        else {
            const maxTime = row[0].maxTime; 
            const endTimeTable = table.concat(
                voiceState.map((ele) => `voiceUse${capitalize(ele)}`)
            );

            for (const ele of endTimeTable) {
                const updateQuery = 
                `UPDATE ${ele} SET endTime = ? WHERE endTime IS NULL`;
                conn.query(updateQuery, [maxTime], (err, row, field) => {
                    if (err) {
                        rtn.success = false;
                        rtn.error = err;
                        return res.status(400).json(rtn);
                    }
                });
            }
            
            return res.status(200).json(rtn);
        }
    });
});

module.exports = router;