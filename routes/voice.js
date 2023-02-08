// route/voice.js
const express = require('express');
const axios = require('axios');
const {conn} = require('../config/db');
const router = express.Router();

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const state = ['', 'selfMute', 'selfDeaf', 'serverMute', 
               'serverDeaf', 'streaming', 'selfVideo'];

router.post('/', (req, res) => {
    const { channelId, guildId, memberId } = req.body.data;
    const rtn = {
        success : true,
        error : null
    }
    // console.log(req.body);
    for (const ele of state) {
        if (ele === '' || req.body.data[ele] === true) {
            const insertQuery = 
            `INSERT INTO voiceUse${capitalize(ele)}(guild, channel, user, startTime) VALUES(?, ?, ?, NOW());`;
            const param = [guildId, channelId, memberId];
            conn.query(insertQuery, param, (err, row, field) => {
                // console.log(insertQuery);
                if (err) {
                    console.log(err);
                    rtn.success = false;
                    rtn.error = err;
                    return res.status(400).json(rtn);
                }
            });
        }
    }
    
    return res.status(200).json(rtn);
});

router.put('/', (req, res) => {
    const { channelId, memberId } = req.body.data;
    const rtn = {
        success : true,
        error : null
    }

    for (const ele of state) {
        const updateQuery = 
        `UPDATE voiceUse${capitalize(ele)} SET endTime = NOW() WHERE channel = ? AND user = ? AND endTime IS NULL;`;
        const param = [channelId, memberId];
        conn.query(updateQuery, param, (err, row, field) => {
            if (err) {
                rtn.success = false;
                rtn.error = err;
                return res.status(400).json(rtn);
            }
        });
    }

    return res.status(200).json(rtn);
});

router.post('/toggle', (req, res) => {
    const { guildId, channelId, memberId, toggle } = req.body.data;
    const rtn = {
        success : true,
        error : null
    }

    for (const ele in toggle) {
        if (!toggle[ele]) continue;
        const insertQuery = 
        `INSERT INTO voiceUse${capitalize(ele)}(guild, channel, user, startTime) VALUES(?, ?, ?, NOW());`;
        const param = [guildId, channelId, memberId];
        conn.query(insertQuery, param, (err, row, field) => {
            if (err) {
                console.log(err);
                rtn.success = false;
                rtn.error = err;
                return res.status(400).json(rtn);
            }
        });
    }
});

router.put('/toggle', (req, res) => {
    const { channelId, memberId, toggle } = req.body.data;
    const rtn = {
        success : true,
        error : null
    }

    for (const ele in toggle) {
        if (!toggle[ele]) continue;
        const updateQuery = 
        `UPDATE voiceUse${capitalize(ele)} SET endTime = NOW() WHERE channel = ? AND user = ? AND endTime IS NULL;`;
        // console.log(updateQuery);
        const param = [channelId, memberId];
        conn.query(updateQuery, param, (err, row, field) => {
            if (err) {
                rtn.success = false;
                rtn.error = err;
                return res.status(400).json(rtn);
            }
        });
    }
});

router.put('/clean', (req, res) => {
    const rtn = {
        success : true,
        error : null
    }

    const selectQueries = state.map((ele) => 
    `SELECT startTime FROM voiceUse${capitalize(ele)} WHERE endTime IS NULL`);

    const selectAllQuery = selectQueries.join(' UNION ');
    const selectMaxQuery = 
    `SELECT MAX(startTime) AS maxTime FROM (${selectAllQuery}) AS voiceUseAll;`
    conn.query(selectMaxQuery, (err, row, field) => {
        if (err) {
            rtn.success = false;
            rtn.error = err;
            return res.status(400).json(rtn);
        }
        const maxTime = row[0].maxTime;
        console.log(maxTime);
        for (const ele of state) {
            const updateQuery = 
            `UPDATE voiceUse${capitalize(ele)} SET endTime = ? WHERE endTime IS NULL`;
            conn.query(updateQuery, [maxTime], (err, row, field) => {
                if (err) {
                    rtn.success = false;
                    rtn.error = err;
                    return res.status(400).json(rtn);
                }
            });
        }
    }) 
});

module.exports = router;
