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
        'Kyler',
        'libvorbis',
        'libvpx',
        'nerfed',
        'nerfing',
        'precmd',
        'prismock',
        'webm',
        'webrtc',
    ],
};
