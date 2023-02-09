// route/guild.js
const express = require('express');
const {conn} = require('../config/db');
const router = express.Router();
const { api_server_port } = require('../config.json');
const apiServer = 'http://localhost:'+api_server_port;

router.post('/lastTime', (req, res) => {
    const { guildId } = req.body.data;
    
    const rtn = {
        success : true,
        error : null
    }

    const selectQuery = 
    `SELECT * FROM lastTime WHERE guild = ?`;
    const param = [guildId];

    conn.query(selectQuery, param, (err, row, field) => {
        if (err) {
            rtn.success = false;
            rtn.error = err;
            return res.status(400).json(rtn);
        }
        else {
            if (row.length === 0) {
                const insertQuery =
                `INSERT INTO lastTime(guild, lastTime) VALUES(?, NOW())`;

                conn.query(insertQuery, param, (err, row, field) => {
                    if (err) {
                        rtn.success = false;
                        rtn.error = err;
                        return res.status(400).json(rtn);
                    }
                    else {
                        return res.status(200).json(rtn);
                    }
                });
            }
        }
    });

});

router.put('/lastTime', (req, res) => {
    const { guildId } = req.body.data;
    
    const rtn = {
        success : true,
        error : null
    }

    const updateQuery = 
    `UPDATE lastTime SET lastTime = NOW() WHERE guild = ?`;
    const param = [guildId];

    conn.query(updateQuery, param, (err, row, field) => {
        if (err) {
            rtn.success = false;
            rtn.error = err;
            return res.status(400).json(rtn);
        }

    });

    return res.status(200).json(rtn);
});

router.post('/service', (req, res) => {
    const { guildId } = req.body.data;
    
    const rtn = {
        success : true,
        error : null
    }

    const insertQuery =
    `INSERT INTO service(guild, startTime) VALUES(?, NOW())`;
    const param = [ guildId ]; 
    conn.query(insertQuery, param, (err, row, field) => {
        if (err) {
            rtn.success = false;
            rtn.error = err;
            return res.status(400).json(rtn);
        }
        else {
            return res.status(200).json(rtn);
        }
    });
});

router.put('/service', (req, res) => {
    const { guildId } = req.body.data;
    
    const rtn = {
        success : true,
        error : null
    }

    const updateQuery = 
    `UPDATE service SET endTime = NOW() WHERE endTime IS NULL`;
    const param = [guildId];

    conn.query(updateQuery, param, (err, row, field) => {
        if (err) {
            rtn.success = false;
            rtn.error = err;
            return res.status(400).json(rtn);
        }

    });

    return res.status(200).json(rtn);
});

router.post('/subscribe', (req, res) => {
    const { guildId, memberId } = req.body.data;
    const rtn = {
        success : true,
        error : null,
        msg : null,
    }

    const selectQuery = 'SELECT * FROM subscriber WHERE guild = ? AND user = ?';
    conn.query(selectQuery, [guildId, memberId], (err, row, field) => {
        if (err) throw err;
        // console.log(row);
        if (row.length === 0) {
            const insertQuery = 'INSERT subscriber(guild, user) VALUES (?, ?)';
            conn.query(insertQuery, [guildId, memberId], (err, row, field) => {
                if (err) throw err;
            });
            rtn.msg = '이용해주셔서 감사합니다!';
            return res.status(200).json(rtn);
        } 
        else {
            rtn.msg = '이미 이용중입니다.';
            return res.status(200).json(rtn);
        }
    });
});

router.delete('/subscribe', (req, res) => {
    const { guildId, memberId } = req.body; // NOT req.body.data (delete METHOD)
    const rtn = {
        success : true,
        error : null,
        msg : null,
    };
    const selectQuery = 'SELECT * FROM subscriber WHERE guild = ? AND user = ?';
    conn.query(selectQuery, [guildId, memberId], (err, row, field) => {
        if (err) throw err;
        if (row.length != 0) {
            const deleteQuery = 'DELETE FROM subscriber WHERE guild = ? AND user = ?';
            conn.query(deleteQuery, [guildId, memberId], (err, row, field) => {
                if (err) throw err;
            });
            rtn.msg = '정상적으로 해지되었습니다!';
            return res.status(200).json(rtn);
        } 
        else {
            rtn.msg = '이용중인 사용자가 아닙니다.';
            return res.status(200).json(rtn);
        }
    });
});

module.exports = router;
