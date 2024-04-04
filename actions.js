const {
  Metaplex,
  toToken,
} = require("@metaplex-foundation/js");
const {Connection, PublicKey} = require("@solana/web3.js");
const {
  ENV,
  TokenListProvider,
} = require("@solana/spl-token-registry");
const {SPL_CONFIG} = require("./config");

class SPLMetaData {
  /**
   * Constructs meta-data
   * @param {any} config settings
   */
  constructor(config) {
    this.connection = new Connection(config.baseUrl);
    this.metaplex = Metaplex.make(this.connection);
  }

  /**
   * the address of token which we want to fetch the meta-data
   * @param {string} address
   * @returns {string} the address of the Metadata Account
   */
  async getmetaDataAccount(address) {
    const metaDataAccount = this.metaplex
      .nfts()
      .pdas()
      .metadata({mint: address});
    return metaDataAccount;
  }

  async getMetaDataAccountInfo(address) {
    const mintAddress = new PublicKey(address);
    const metaDataAccountInfo =
      await this.connection.getAccountInfo(mintAddress);
    let tokenName;
    let tokenSymbol;
    let tokenLogo;
    let description;
    let decimal;
    let owner;
    let supply;

    if (metaDataAccountInfo) {
      const token = await this.metaplex
        .nfts()
        .findByMint({mintAddress: mintAddress});

      tokenName = token.json.name;
      tokenSymbol = token.json.symbol;
      tokenLogo = token.json.image;
      description = token.json.description;
      decimal = token.mint.decimals;
      owner = token.updateAuthorityAddress.toBase58();
      supply = token.mint.supply.basisPoints
    } else {
      const provider =
        await new TokenListProvider().resolve();
      const tokenList = provider
        .filterByChainId(ENV.MainnetBeta)
        .getList();
      const tokenMap = tokenList.reduce((map, item) => {
        map.set(item.address, item);
      }, new Map());

      const token = tokenMap.get(mintAddress);
      tokenName = token.json.name;
      tokenSymbol = token.json.symbol;
      tokenLogo = token.json.image;
      description = token.json.description;
      decimal = token.mint.decimals;
      owner = token.updateAuthorityAddress.toBase58();
      supply = token.mint.supply.basisPoints
    }

    let tokenInfo = {
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      tokenLogo: tokenLogo,
      description: description,
      decimal: decimal,
      owner: owner,
      supply: supply
    };

    return tokenInfo;
  }
}

class SPLData {
  defaultConfig() {
    console.log(SPLData);
    return SPL_CONFIG;
  }
  constructor(config = false) {
    if (config === false) {
      config = this.defaultConfig();
    }
    this.Token = new SPLMetaData(config);
  }

  /**
   * Retrieves Token Meta Data Info
   * @GetTokenInfo
   * @returns {object} token info
   */
  GetTokenInfo(address) {
    return this.Token.getMetaDataAccountInfo(address);
  }
}


module.exports = {
  SPLData
}
