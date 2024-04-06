const {
  Metaplex,
  toToken,
} = require("@metaplex-foundation/js");
const {Connection, PublicKey} = require("@solana/web3.js");
const {
  ENV,
  TokenListProvider,
} = require("@solana/spl-token-registry");
const {TOKEN_PROGRAM_ID} = "@solana/spl-token";
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
   * the current supply
   * @param {int} supply
   * @returns {decimal} supply
   */
  async getCurrentSupply(supply) {
    let tokenSupply =  new Intl.NumberFormat().format(supply);
    console.log(tokenSupply,supply)
    return tokenSupply
  }

  /**
   * fetch total current supply
   * @param {string} mintAdress
   * @returns {int} totalSupply
   */
  async totalSupply(mintAdress) {
    try {
      let supply = await this.connection.getTokenSupply(mintAdress)
      return this.getCurrentSupply(supply.value.uiAmount);
    } catch (err) {
      return false;
    }
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
    let supply = "!!";

    try {
      let currentTokenSupply = await this.totalSupply(mintAddress);
      if (currentTokenSupply){
        supply = currentTokenSupply
      }
      if (metaDataAccountInfo) {
        const token = await this.metaplex
          .nfts()
          .findByMint({mintAddress: mintAddress});

        //console.log(token)

        tokenName = token.json.name;
        tokenSymbol = token.json.symbol;
        tokenLogo = token.json.image;
        description = token.json.description;
        decimal = token.mint.decimals;
        owner = token.updateAuthorityAddress.toBase58();
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
      }

      let tokenInfo = {
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        tokenLogo: tokenLogo,
        description: description,
        decimal: decimal,
        owner: owner,
        supply: supply,
      };

      return tokenInfo;
    } catch (err) {
      //console.log(err)
      return false;
    }
  }
}

class SPLData {
  defaultConfig() {
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
  SPLData,
};

