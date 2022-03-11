import logo from './logo.svg';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import githubLogo from './assets/github-logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { ethers } from "ethers";
import { Form, FormGroup, Input, Label } from 'reactstrap';
import letsAskNftContract from './utils/LetsAskNftContract.json';

// Constants
const TWITTER_HANDLE = '0xVignesh';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const GITHUB_LINK = `https://github.com/vickycj`;
const HELLO = 'Hello';
const OPENSEA_LINK = 'https://testnets.opensea.io';
const POLYSCAN_LINK = 'https://mumbai.polygonscan.com';
const CONTRACT_ADDRESS = "0x15575c63bf876BB2617282661634b218Bc4578aF";
const CHAIN_ID = "0x13881";

const MINT_STATUS = {
  NOT_MINTED: 1,
  MINTING: 2,
  SUCCESS: 3,
  FAILED: 4,
  MINED: 5,
};

const App = () => {



  const [currentAccount, setCurrentAccount] = React.useState("");

  const [buttonState, setButtonState] = React.useState(false);

  const [mintingStatus, setMintingStatus] = React.useState(MINT_STATUS.NOT_MINTED);

  const [buttonText, setbuttonText] = React.useState("Mint NFT");

  const [transactionHash, setTransactionHash] = React.useState("");

  const [tokenId, setTokenId] = React.useState("");

  const [disclaimerText, setDisclaimerText] = React.useState("");

  const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }


    const accounts = await ethereum.request({ method: 'eth_accounts' });


    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);



      if (chainId !== CHAIN_ID) {
        alert("You are not connected to the Polygon Network!");
        return;
      }

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  }

  const setupEventListener = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, letsAskNftContract.abi, signer);


        connectedContract.on("LetsAskNftMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          setMintingStatus(MINT_STATUS.SUCCESS);
          setButtonState(false);
          setbuttonText("Check on Opensea");
          setDisclaimerText("It will take sometime to reflect on Open sea");
          setTokenId(tokenId.toNumber())
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const askContractToMintNft = async () => {
    try {
      if (toValue == null || toValue === "" || qValue == null || qValue === "") {
        return;
      }
      if (mintingStatus == MINT_STATUS.MINTING || mintingStatus == MINT_STATUS.FAILED) {
        return;
      } else if (mintingStatus == MINT_STATUS.MINED) {
       // const url = `${POLYSCAN_LINK}/tx/${transactionHash}`;
       // window.open(url, '_blank');
        return;
      } else if (mintingStatus == MINT_STATUS.SUCCESS) {
        const url = `${OPENSEA_LINK}/assets/${CONTRACT_ADDRESS}/${tokenId}`
        window.open(url, '_blank');
        return;
      }
      setMintingStatus(MINT_STATUS.MINTING);
      setButtonState(true);
      setbuttonText("Minting....")

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, letsAskNftContract.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mintLetsAskNft(`${toValue}`, `${qValue}`);

        console.log("Mining...please wait.")
        await nftTxn.wait();
        setMintingStatus(MINT_STATUS.MINED);
       // setButtonState(false);
        setTransactionHash(nftTxn.hash)
       // setbuttonText("Check on Polyscan")
        console.log(`Mined, see transaction: ${POLYSCAN_LINK}/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  const [toValue, setToValue] = React.useState('');

  const handleToValueChange = (event) => {
    setToValue(event.target.value);
  };

  const [qValue, setQValue] = React.useState('');

  const handleQValueChange = (event) => {
    setQValue(event.target.value);
  };


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Question the status Quo</p>
          <p className="sub-text">
            Ask Questions. Mint as NFT. Fully On Chain.
          </p>
          <div class="container">
            <div class="d-none d-md-block spacer"></div>
            <div class="row">
              <div class="col">
                <div class="container">
                  <Form inline>
                    <FormGroup floating>
                      <Input
                        id="to"
                        name="to"
                        maxLength={10}
                        placeholder="To"
                        type="text"
                        value={toValue}
                        onChange={handleToValueChange}
                      />
                      <Label for="to">
                        To
                      </Label>
                    </FormGroup>
                    {' '}
                    <FormGroup floating>
                      <Input
                        id="question"
                        name="question"
                        maxLength={280}
                        placeholder="Question"
                        rows="3"
                        value={qValue}
                        onChange={handleQValueChange}
                        type="textarea"
                      />
                      <Label for="question">
                        Question
                      </Label>
                    </FormGroup>
                    {' '}
                  </Form>
                  {currentAccount === "" ? (
                    renderNotConnectedContainer()
                  ) : (
                    <button disabled={buttonState} onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                      {
                        buttonText
                      }
                    </button>
                  )}
                  <div className='disclaimer-text'>{ disclaimerText }</div>
                </div>
              </div>
              <div class="col">
                <div class="container justify-content-center">
                  <p className="sub-text gradient-text">
                    {`${HELLO}`} {`${toValue}`} {toValue ? ", " : null} {`${qValue}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="footer-container">
          <div className='footer-text'>Created by </div>
          <img alt="Twitter Logo" className="github-logo" src={githubLogo} />
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@vickycj`}</a>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;