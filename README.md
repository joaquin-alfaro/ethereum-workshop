# ethereum-workshop
The workshop consists in a Dapp to manage transfers of travellers and renting of buses. The project is composed by a Dapp (set of smart contracts) and a Webapp (UI for the smart contracts)

## Dapp Ethereum
### Contents
*ethereum/contracts*  
Sources of smart contracts (*.sol files)  
  
*ethereum/build*  
Result files of the compilation of smart contracts (*.json files). These files contains the abi and bytecode.  
  
*ethereum/features*  
Files related with testing of smart contracts using BDD Cucumber
### Build smart contracts
```bash
yarn ethereum:build
```
### Test smart contracts
```bash
yarn ethereum:test
```

## WEB APP
### Contents
*/pages*  
React pages of the webapp  
  
*/components*  
React components  
  
*/src/domain*  
Implementation of Domain layer. It maps services with smart contracts  

### Setup
**Ethereum node or gateway**  
Use the environment variable NEXT_PUBLIC_ETHEREUM_PROVIDER_LOCAL to specify the URL of the Ethereum node or gateway (Infura). The value can be specified at *.env* file  

> Example
>
> NEXT_PUBLIC_ETHEREUM_PROVIDER_LOCAL=http://localhost:8545

**nft.storage API key**  
Use the environment variable NEXT_PUBLIC_NFT_STORAGE_KEY to specify the API key of [nft.storage](https://nft.storage/). The value can be specified at *.env* file  

> Example
>
> NEXT_PUBLIC_NFT_STORAGE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZkODJGOUQ5QWNFNTU2NWNiYjMyRDU0ZUE4OTYzNmNmMDFiNzg5YTEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzYyODI1MTkyNiwibmFtZSI6InRyYW5zZmVycy1kYXBwIn0.h5Ft6TjVn8_tbYWHaUOE-rp4UbTHmRKJhZ_72O3ZTnQ

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

## How to launch local ethereum node
It is provided a **docker-compose** to launch an ethereum node locally.  

The node uses the implementation of [Hyperledger Besu](https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Run-Docker-Image/) and listens requests on port **8545**  
  
It can be used the following account for testing:  
**publicKey**  
0xfe3b557e8fb62b89f4916b721be55ceb828dbd73  
**privateKey**  8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63  
```bash
docker compose up
```

## Requirements to develop
- Plugin *Solidity of Juan Blanco* of Visual Studio Code
- Plugin *Cucumber (Gherkin) Full Support of Alexander Krechik* of Visual Studio Code
- Create account in nft.storage
- Create account in Infura and a project for a testnet (Optional)

## How to create the project from scratch
### 1. Create nextjs project
```bash
yarn create next-app --typescript
```
### 2. Add dependencies to develop smart contracts
```bash
yarn add @openzeppelin/contracts ganache solc web3 ts-node typescript @cucumber/cucumber --dev
```

### 3. Add dependencies to develop UI with smart contracts
```bash
yarn add react-bootstrap bootstrap @metamask/onboarding net web3 nft.storage
yarn add sass --dev
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