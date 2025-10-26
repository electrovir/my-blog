import {baseNcuConfig} from '@virmator/deps/configs/ncu.config.base';
import {RunOptions} from 'npm-check-updates';

export const ncuConfig: RunOptions = {
    ...baseNcuConfig,
    // exclude these
    reject: [
        ...baseNcuConfig.reject,
        'clsx',
        '@mdx-js/react',
        '@docusaurus/*',
        '@cmfcmf/*',
        'prism-react-renderer',
        'react',
        'react-dom',
    ],
    // include only these
    filter: [],
};
