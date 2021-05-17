const _log = require('../common/log');
const app = require('./express');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    _log.success(' SERVER IS RUNNING! ', `live on port ${port}`);
});