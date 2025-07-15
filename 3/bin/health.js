const healthcheck = require('@hmcts/nodejs-healthcheck');
const dotenv = require('dotenv');
dotenv.config({path:"../.env"});

module.exports = function(app){
    const config = {
        checks: {
            indexCheck:healthcheck.web(process.env.INDEX_URL, (err, res) => {
                return res.body.status === 'OK' ? healthcheck.up() : healthcheck.down()
            }),
            timeout: 3000,
            deadline: 5000,
        },
        buildInfo: {
            version: "1.0.0",
            name: 'sprint3mission_psk'
        }
    }
    healthcheck.addTo(app, config);
};