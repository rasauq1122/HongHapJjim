// route/voice.js
const express = require('express');
const axios = require('axios');
const {conn} = require('../config/db');
const router = express.Router();
const { api_server_port } = require('../config.json');
const apiServer = 'http://localhost:'+api_server_port;

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const state = ['', 'selfMute', 'selfDeaf', 'serverMute', 
               'serverDeaf', 'streaming', 'selfVideo'];

router.use('/', (req, res, next) => {
    const selectQuery = `SELECT * FROM subscriber WHERE guild = ? AND user = ?;`
    const {memberId, guildId} = req.body.data;
    const param = [guildId, memberId];
    conn.query(selectQuery, param, (err, row, field) => {
        if (err) {
            throw err;
        }
        // console.log() 
        if (row.length === 0) next('Not A Subscriber!'); 
        else {
            axios.put(apiServer+'/guild/lastTime', req.body);
            next();
        }
    });
});

router.post('/use', (req, res) => {
    const { channelId, guildId, memberId } = req.body.data;
    const rtn = {
        success : true,
        error : null
    }
    for (const ele of state) {
        if (ele === '' || req.body.data[ele] === true) {
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
    }
    
    return res.status(200).json(rtn);
});

router.put('/use', (req, res) => {
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

router.use((err, req, res, next) => {
    if (err === 'Not A Subscriber!') {
        return res.status(200).json({
            success : false,
            error : 'Not A Subscriber!'
        })
    }
    else {
        return next(err);
    }
    // res.status(200);
    // res.send("hi");
    // res.status(500).send('something wrong...');
});

module.exports = router;
