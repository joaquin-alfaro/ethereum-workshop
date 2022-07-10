# transfers-dapp
Dapp to manage transfers of travellers and renting of buses.

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