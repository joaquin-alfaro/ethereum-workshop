# transfers-dapp
Dapp to manage transfers of travellers and renting of buses.

## Requirements
- Plugin *Solidity of Juan Blanco* of Visual Studio Code
- Plugin *Cucumber (Gherkin) Full Support of Alexander Krechik* of Visual Studio Code

## Procedure to create the project

### 1. Create nextjs project
```bash
yarn create next-app --typescript
```
### 2. Add dependencies to develop smart contracts
```bash
yarn add @openzeppelin/contracts ganache solc web3 ts-node typescript @cucumber/cucumber --dev
```

### 3. Add script to compile smart contracts

### 4. Create structure of folders
```
ethereum
|-- build
|-- contracts
```
## DAPP

### Build smart contracts
```bash
yarn ethereum:build
```

## FRONT
### Install
```bash
yarn install
```
### Start for development
```bash
yarn dev
```
### Build
```bash
yarn build
```
### Start
```bash
yarn start
```

## Caveats
### Compilation errors when executing tests
```
/transfers-dapp/ethereum/features/step-definitions/bus-schedule_steps.ts:1
import { Given, When, Then } from '@cucumber/cucumber';
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at Object.compileFunction (node:vm:352:18)
    at wrapSafe (node:internal/modules/cjs/loader:1033:15)
    at Module._compile (node:internal/modules/cjs/loader:1069:27)
    at Module.m._compile (/Users/joaquinalfaroramonell/Documents/Clients/Axis/transfers-dapp/node_modules/ts-node/src/index.ts:1597:23)
    at Module._extensions..js (node:internal/modules/cjs/loader:1159:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/joaquinalfaroramonell/Documents/Clients/Axis/transfers-dapp/node_modules/ts-node/src/index.ts:1600:12)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:827:12)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
```

**Reason**  

The usage of *ts-node* is not compatible with module *esnext*

**Solution**  
Use 'commonjs' instead of *esnext*  

*tsconfig.json*
```json
{
  "compilerOptions": {
    "module": "commonjs"
  }
}
```