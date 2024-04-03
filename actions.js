//TODO: fetch the token metadatausing @metaplex-foundation/js
const {Metaplex} = require("@metaplex-foundation/js");
const {Connection, PublicKey} = require("@solana/web3.js");
const {ENV, TokenListProvider} = require("@solana/spl-token-registry");

class SPLMetaData {
    /**
     * Constructs meta-data
     * @param {any} config settings
     */
    constructor(config) {
        this.connection = new Connection(config.baseUrl)
        this.metaplex = Metaplex.make(this.connection)
    }

    /**
     * the address of token which we want to fetch the meta-data
     * @param {string} address 
     * @returns {string} the address of the Metadata Account
     */
    async getmetaDataAccount(address){
        const metaDataAccount = this.metaplex
        .nfts()
        .pdas()
        .metadata({mint: address})
        return metaDataAccount
    }

    async getMetaDataAccountInfo(mintAddress){
        const mintAddress = new PublicKey(mintAddress)
        const metaDataAccountInfo = await this.connection.getAccountInfo(this.getmetaDataAccount(mintAddress))
        if (metaDataAccountInfo){
            const token = await this.metaplex.nfts().findByMint({mintAddress: mintAddress})
            tokenName = token.tokenName;
            tokenSymbol = token.tokenSymbol
            tokenLogo = token.json?.image;
        }
        else{
            const provider = await new TokenListProvider().resolve();
            const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList();
            console.log(tokenList)
            const tokenMap = tokenList.reduce((map,item) => {
                map.set(item.address,item);
            }, new Map());

            const token  = tokenMap.get(mintAddress.toBase58());
            tokenName = token.tokenName;
            tokenSymbol = token.tokenSymbol
            tokenLogo = token.logoURI;

        }
    }
}

class SPL:
    //We call from here