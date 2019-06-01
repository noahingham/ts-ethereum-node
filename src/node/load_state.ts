import { Node } from './node';
import {
    N256,
    Account, Address, emptyAccounts, emptyAccount,
    Blockchain, emptyBlockchain,
    newBlock,
    Transaction,
    assemble,
    ecrecover,
} from 'ts-ethereum-vm';

export const loadState = (json: any): Blockchain => {
    let blockchain = new Blockchain();
    let accounts = emptyAccounts;

    for (let pre of json.pre) {
        const address = new N256(pre, 'hex');
        const accData = json.pre[pre];
        const account: Account = emptyAccount
            .set('address', address)
            .set('nonce', new N256(accData.nonce, 'hex'))
            .set('balance', new N256(accData.balance, 'hex'))
            // .set("storage", new Buffer(accData.storage, "hex"))
            .set('code', new Buffer(accData.code, 'hex'));
        accounts = accounts.set(address, account);
    }

    // Genesis block
    let coinbase = new N256(json.genesisBlockHeader.coinbase, 'hex');
    const genesis = newBlock(coinbase, accounts);
    blockchain = blockchain.addBlock(genesis.commit());

    for (let blockData of json.blocks) {

        if (blockData.reverted) {
            // console.log(blockData);
            continue;
        }

        coinbase = new N256(blockData.blockHeader.coinbase, 'hex');

        let block = newBlock(coinbase, blockchain.getAccounts());

        for (let txData of blockData.transactions) {

            console.log('Running tx');
            console.log(txData);

            const transaction: Transaction = new Transaction({
                nonce: new N256(txData.nonce, 'hex'),
                value: new N256(txData.value, 'hex'),
                data: assemble(txData.data),
                gasLimit: new N256(txData.gasLimit, 'hex'),
                gasPrice: new N256(txData.gasPrice, 'hex'),
                r: new N256(txData.r, 'hex'),
                v: new N256(txData.v, 'hex'),
                s: new N256(txData.s, 'hex'),
                to: new N256(txData.to, 'hex'),
            });

            try {
                block = block.addTransaction(transaction);
            } catch (err) {
                console.log(`Transaction errored: ${err}`);
            }
        }

        blockchain = blockchain.addBlock(block.commit());

    }

    return blockchain;
};