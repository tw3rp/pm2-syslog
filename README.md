# pm2-syslog

Redirect all logs of PM2 + Apps managed into `syslog`


## Install module

```
# Install
$ pm2 install pm2-syslog2

# Configure pm2-syslog2 depending to where your syslog daemon listens
$ pm2 set pm2-syslog:hostname localhost  # localhost is the default.
$ pm2 set pm2-syslog:port 514  # 514 is the default.
# or
$ pm2 set pm2-syslog:path /dev/log

# Optionally change the facility
$ pm2 set pm2-syslog:facility local0  # user is the default

# Optionally change the log format
$ pm2 set pm2-syslog:format json  # text is the default

# Uninstall
$ pm2 uninstall pm2-syslog2
```

# License

MIT
