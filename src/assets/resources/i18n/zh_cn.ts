const win = window as any;
export const languages = {
    "Common": {},
    "Spaceflight": {},
    "RocketX": {}
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh_cn = languages;