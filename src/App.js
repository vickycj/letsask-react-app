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
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0xF1aD06077E05ebD0e0c0e8eBC104fE436c560D6F";
const App = () => {


  const [currentAccount, setCurrentAccount] = React.useState("");
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
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
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
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, letsAskNftContract.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mintLetsAskNft(`${HELLO} ${toValue} ${toValue ? ", " : null}`, `${qValue} ${qValue ? " ?" : null}`, 0 , 0);
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
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
                    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                      Mint NFT
                    </button>
                  )}
                </div>
              </div>
              <div class="col">
                <div class="container justify-content-center">
                  <p className="sub-text">
                    {`${HELLO}`} {`${toValue}`} {toValue ? ", " : null} {`${qValue}`} {qValue ? " ?" : null}
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