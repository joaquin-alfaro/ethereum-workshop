const solc = require('solc')
const fs = require('fs-extra')
const path = require('path')

const buildPath = path.resolve(__dirname, 'build')
const contractsPath = path.resolve(__dirname, 'contracts')
const openzeppelin = "@openzeppelin"

getDirectoryFromPath = (path) => {
    return path.includes('.')? path.substring(0, path.lastIndexOf('/')): path
}

existsDirectory = (path) => {
    return fs.existsSync(getDirectoryFromPath(path))
}

createDirectory = (path) => {
    fs.mkdirSync(getDirectoryFromPath(path), { recursive: true })
}

compile = (contracts) => {
    console.log('Compiling smart contracts...')
    const input = {
        language: 'Solidity',
        sources: contracts,
        settings: {
            optimizer: {
                enabled: true,
            },
            outputSelection: {
                '*': {
                    '*': [ '*' ]
                }
            }
        }
    }
    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }))
    if (output.errors) {
        console.error(output.errors)
    }
    for (var contractSource in output.contracts) {
        for (var contractName in output.contracts[contractSource]) {
            let abi = output.contracts[contractSource][contractName].abi
            let bytecode = output.contracts[contractSource][contractName].evm.bytecode.object
            const built = {
                abi: JSON.stringify(abi),
                bytecode: bytecode
            }
            const target = path.resolve(buildPath, path.dirname(contractSource), contractName + ".json")
            if (!existsDirectory(target)) {
                createDirectory(target)
            }
            console.log(contractName, 'built in', target)
            fs.writeJsonSync(target, built)
        }
    }
}

findImports = (import_path) => {
    let sourcePath
    if (import_path.startsWith(openzeppelin)) {
        sourcePath = path.resolve(__dirname, '..', 'node_modules', import_path);
    } else {
        sourcePath = path.resolve(contractsPath, import_path);
    }
    
    const source = fs.readFileSync(sourcePath, 'utf-8');

    return {contents: source};
}

compileContract = (path) => {
    const source = fs.readFileSync(path, 'utf-8');
    const file = path.substring(contractsPath.length + 1);

    compile({[file]: {'content': source}});
}

execute = () => {
    // 1. Recreate build folder
    fs.removeSync(buildPath);
    fs.ensureDirSync(buildPath);

    // 2. Compile contracts
    let contracts = {};
    fs.readdirSync(contractsPath).forEach(file => {
        if (file.includes('.sol')) {
            const sourcePath = path.resolve(contractsPath, file);
            if (!fs.lstatSync(sourcePath).isDirectory()) {
                const source = fs.readFileSync(sourcePath, 'utf-8');
                contracts[file] = {'content': source}
            }
        }
    });

    compile(contracts);
}

execute()