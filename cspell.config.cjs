const {baseConfig} = require('@virmator/spellcheck/configs/cspell.config.base.cjs');

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
        'deno',
        'dsla',
        'infima',
        'kanban',
        'libvorbis',
        'libvpx',
        'nerfed',
        'nerfing',
        'prismock',
        'webm',
        'webrtc',
    ],
};
