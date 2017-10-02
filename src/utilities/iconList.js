import fs from 'fs';
import path from 'path';

export const walkSync = (dir, filelist = [], setPath) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : ( setPath ? filelist.concat(setPath + file) : filelist.concat(path.join(dir, file)));

    });
    return filelist;
}

