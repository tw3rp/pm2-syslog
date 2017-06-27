var startPM2 = function(conf) {
    var pm2 = require('pm2');
    var SysLogger = require('ain2');

    if (conf.port) {
        conf.port = parseInt(conf.port, 10);
    }

    var logger = new SysLogger(conf);
    var formatter;

    logger.setMessageComposer(function(message, severity) {
        if (conf.format == 'json') {
            return new Buffer('<' + (this.facility * 8 + severity) + '>' +
                              message);
        } else {
            return new Buffer('<' + (this.facility * 8 + severity) + '>' +
                              this.getDate() + ' ' + this.hostname + ' ' +
                              this.tag + '[' + process.pid + ']:' + message);
        }
    });

    if (conf.format == 'json') {
        formatter = function(message) {
            message.date = logger.getDate();
            message.pid = process.pid;
            message.hostname = logger.hostname;
            return JSON.stringify(message);
        };
    } else if (conf.format == 'text') {
        formatter = function(message) {
            var key_value_pairs = [];
            for (var key in message) {
                if (message.hasOwnProperty(key)) {
                    key_value_pairs.push(key + '=' + message[key]);
                }
            }
            return key_value_pairs.join(' ');
        };
    }

    pm2.launchBus(function(err, bus) {
        bus.on('*', function(event, data) {
            if (event == 'process:event') {
                logger.warn(formatter({
                    app: "pm2",
                    target_app: data.process.name,
                    target_id: data.process.pm_id,
                    restart_count: data.process.restart_time,
                    status: data.event
                }));
            }
        });

        bus.on('log:err', function(data) {
            logger.error(formatter({
                app: data.process.name,
                id: data.process.pm_id,
                message: data.data
            }));
        });

        bus.on('log:out', function(data) {
            logger.log(formatter({
                app: data.process.name,
                id: data.process.pm_id,
                message: data.data
            }));
        });
    });
};

module.exports = startPM2;
