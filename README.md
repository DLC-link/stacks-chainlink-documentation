# Chainlink on Stacks

Using [Chainlink](https://chain.link) DRM (Direct Request Model) Oracles on [Stacks](https://stacks.org).

To enable chainlink oracle usage on stacks we have deployed a Chainlink Node with it's related smart contracts:

```
oracle:         ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.oracle
stxlink-token:  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stxlink-token
```

To test the system you can use the deployed `direct-request` contract. `contract-call.js` has code that calls
this contract to fetch ETH/USD price. After a successful call you can extract the data from the contract by calling the `read-data-value` function to get the response that is stored in the `data-value` variable in the contract:

```
curl -X POST https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/direct-request/read-data-value \
--header 'Content-Type: application/json' \
--data-raw '{
"sender": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
"arguments":[] }'
```

This will give the response in the form of hex. You can decode it to string.

## Examples

Well commented example codes for both a consumer contract and the usage of it are available in this repository under `src/`.

## Writing a consumer contract

To utilize the oracle you need to write your own consumer contract. An example contract is available in this
repository (`direct-request.clar`).

You will need to implement the traits `.oracle-callback-trait.oracle-callback` and `.stxlink-transfer-trait.stxlink-transfer-trait`.

## Getting STXLINK tokens

To call the oracle contract you will need to have STXLINK tokens. To get these go to the [STXLINK Faucet](http://100.26.22.43) page and input a valid STX address.
