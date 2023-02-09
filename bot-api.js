// route/clean.js
const express = require('express');
const {conn} = require('./config/db');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const routesPath = path.join(__dirname, 'routes');
const routeFiles = fs.readdirSync(routesPath).filter(file => file.endsWith('.js'));

router.use(express.json());

for (const file of routeFiles) {
	const filePath = path.join(routesPath, file);
	const route = require(filePath);
	router.use('/'+file.slice(0, -3), route);
}

module.exports = router;