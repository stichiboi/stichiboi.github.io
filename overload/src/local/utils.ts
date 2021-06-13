const fs = require("fs");
const path = require("path");

export function readJSON(filePath: string, absolute?: boolean) {
    return new Promise((resolve, reject) => {
        const fullPath = absolute ? filePath : path.resolve(__dirname, filePath);
        fs.readFile(fullPath, ((err, data) => {
            if (err) {
                reject(err);
            } else {
                // @ts-ignore
                resolve(JSON.parse(data));
            }
        }));
    });
}

export function saveData(filePath: string, data: string | object) {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    fs.mkdir(dir, {recursive: true}, (err) => {
        if (err) {
            console.error(err);
        } else {
            fs.writeFile(fullPath, (typeof data === 'string') ? data : JSON.stringify(data),
                (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Saved ' + filePath);
                    }
                });
        }
    });
}