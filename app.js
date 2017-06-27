var startPM2 = function(conf) {
    var pm2       = require('pm2');
    var SysLogger = require('ain2');

    if (conf.port) {
        conf.port = parseInt(conf.port, 10);
    }
    var logger = new SysLogger(conf);

    pm2.launchBus(function(err, bus) {
        bus.on('*', function(event, data) {
            if (event == 'process:event') {
                if (conf.format == "text") {
                    logger.warn('app=pm2 target_app=%s target_id=%s restart_count=%s status=%s',
                                data.process.name,
                                data.process.pm_id,
                                data.process.restart_time,
                                data.event);
                } else {
                    logger.warn(JSON.stringify(data));
                }
            }
        });

        bus.on('log:err', function(data) {
            if (conf.format == "text") {
                logger.error('app=%s id=%s line=%s', data.process.name, data.process.pm_id, data.data);
            } else {
                logger.error(JSON.stringify(data));
            }
        });

        bus.on('log:out', function(data) {
            if (conf.format == "text") {
                logger.log('app=%s id=%s line=%s', data.process.name, data.process.pm_id, data.data);
            } else {
                logger.error(JSON.stringify(data));
            }
        });
    });
};

module.exports = startPM2;
