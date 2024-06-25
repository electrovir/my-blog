const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        '.docusaurus/',
        '*.svg',
        'build/',
    ],
    words: [
        ...baseConfig.words,
        'clsx',
        'cmfcmf',
        'infima',
        'kanban',
    ],
};
