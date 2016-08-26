var fs = require('fs');

//var dir         = "C:\/wamp\/www\/untitled1";
var excludeList = [];

(function(){
    if(process.argv[2]) {
        scanDirectory(process.argv[2]);
    }
    if(process.argv[3]) {
        var result = search(process.argv[3]);
        console.log(result);
    }
})();

function scanDirectory(dir) {

    var list = fs.readdirSync(dir);
    if (list.length == 0) return;

    list.forEach((file)=> {
        file = dir + '/' + file;
        if (!fs.statSync(file).isFile()) {
            scanDirectory(file);
        } else if (isText(file)) {
            toIndex(file);
        }
    });
}

function isText(file) {
    var tmpNameToArray = file.split('.');
    return tmpNameToArray[tmpNameToArray.length - 1] === 'js';
}

function toIndex(file) {

    var data = fs.readFileSync(file, 'utf8');
    var tokenizedTextArray  = data.match(/[a-zA-Z0-9]+/g),
        normalizedTextArray = normalizeText(tokenizedTextArray);

    saveIndexPerFile(file, normalizedTextArray);
    saveIndexPerTokens(file, normalizedTextArray);
    //generateTree(normalizedTextArray);
}

function normalizeText(textArray) {
    var newArray = [];
    textArray.forEach((word)=> {
        if (newArray.indexOf(word) === -1 && excludeList.indexOf(word) === -1)
            newArray.push(word);
    });

    return newArray;
}

function saveIndexPerFile(fileName, tokens) {
    fs.openSync('_indexPerFile.json', "a");
    var data       = fs.readFileSync('_indexPerFile.json', 'utf8');
    data           = data ? JSON.parse(data) : {};
    data[fileName] = tokens;

    fs.writeFileSync('_indexPerFile.json', JSON.stringify(data), 'utf8');
    //console.log('_indexPerFile.json is saved!');
}

function saveIndexPerTokens(fileName, tokens) {
    fs.openSync('_indexPerTokens.json', "a");
    var data = fs.readFileSync('_indexPerTokens.json', 'utf8');
    data     = data ? JSON.parse(data) : {};
    tokens.forEach((word)=> {
        data[word] = data[word] || [];
        if(data[word].indexOf(fileName) === -1)
            data[word].push(fileName);
    });

    fs.writeFileSync('_indexPerTokens.json', JSON.stringify(data), 'utf8');
    //console.log('_indexPerTokens.json is saved!');
}
function search(word) {
    var data = JSON.parse(fs.readFileSync('_indexPerTokens.json', 'utf8')) || {};

    return data[word];
}
function generateTree(array) {
    var head = array[0],
        tree = {};

    array.forEach((word)=> {
        if (word.localeCompare(head) > 0) {
            //tree[word]
        }
    });
}