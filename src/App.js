import logo from './logo.svg';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import githubLogo from './assets/github-logo.svg';
import opensealogo from './assets/opensea.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ethers } from "ethers";
import { Form, FormGroup, Input, Label } from 'reactstrap';
import letsAskNftContract from './utils/LetsAskNftContract.json';
import ReactCanvasConfetti from "react-canvas-confetti";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// Constants
const TWITTER_HANDLE = '0xVignesh';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const GITHUB_LINK = `https://github.com/vickycj`;
const HELLO = 'Hello';
const OPENSEA_LINK = 'https://opensea.io';
const POLYSCAN_LINK = 'https://polygonscan.com';
const CONTRACT_ADDRESS = "0xAD5CA872f92a8C789c13E2487251dE2849173Bb1";
const CHAIN_ID = "0x89";

const MINT_STATUS = {
  NOT_MINTED: 1,
  MINTING: 2,
  SUCCESS: 3,
  FAILED: 4,
  MINED: 5,
  PROCESSING: 6,
};


const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};

const firebaseConfig = {
  apiKey: "AIzaSyDrgKfLXqz1y8RCgy25hiwavRRwtWEM04w",
  authDomain: "letsask-f4407.firebaseapp.com",
  projectId: "letsask-f4407",
  storageBucket: "letsask-f4407.appspot.com",
  messagingSenderId: "254366609396",
  appId: "1:254366609396:web:f1eca3b8972a9ce70153a1",
  measurementId: "G-2YX02FN0BR"
};

function getAnimationSettings(angle, originX) {
  return {
    particleCount: 3,
    angle,
    spread: 55,
    origin: { x: originX },
    colors: ["#FC5C7D", "#6A82FB"]
  };
}


const App = () => {

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const [currentAccount, setCurrentAccount] = useState("");

  const [buttonState, setButtonState] = useState(false);

  const [mintingStatus, setMintingStatus] = useState(MINT_STATUS.NOT_MINTED);

  const [buttonText, setbuttonText] = useState("Mint NFT");

  const [transactionHash, setTransactionHash] = useState("");

  const [tokenIdValue, setTokenId] = useState("");

  const [disclaimerText, setDisclaimerText] = useState("");

  const [toValue, setToValue] = useState('');

  const [qValue, setQValue] = useState('');


  const refAnimationInstance = useRef(null);
  const [intervalId, setIntervalId] = useState();

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(60, 0));
      refAnimationInstance.current(getAnimationSettings(120, 1));
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!intervalId) {
      setIntervalId(setInterval(nextTickAnimation, 16));
    }
  }, [nextTickAnimation, intervalId]);

  const pauseAnimation = useCallback(() => {
    clearInterval(intervalId);
    setIntervalId(null);
  }, [intervalId]);

  const stopAnimation = useCallback(() => {
    clearInterval(intervalId);
    setIntervalId(null);
    refAnimationInstance.current && refAnimationInstance.current.reset();
  }, [intervalId]);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  const checkIfWalletIsConnected = async () => {
    logEvent(analytics, 'page_load');
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
      logEvent(analytics, 'wallet_connect');
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
    console.log("Setup event listener!")
    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, letsAskNftContract.abi, signer);


        connectedContract.on("LetsAskNftMinted", (from, tokenId) => {
          console.log(tokenId + ": minted token");
          console.log(tokenIdValue);

          setMintingStatus(MINT_STATUS.SUCCESS);
          setButtonState(false);
          setbuttonText("Check on Opensea");
          setDisclaimerText("It will take sometime to reflect on Open sea");
          setTokenId(tokenId.toNumber())
          startAnimation();
          setTimeout(() => {
            pauseAnimation();
          }, 10000);
        });



      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setMintingStatus(MINT_STATUS.FAILED);
      setButtonState(true);
      setbuttonText("Failed");
      setDisclaimerText("Not connected to network");
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
        logEvent(analytics, 'check_on_polygon');
        const url = `${POLYSCAN_LINK}/tx/${transactionHash}`;
        window.open(url, '_blank');
        return;
      } else if (mintingStatus == MINT_STATUS.SUCCESS) {
        logEvent(analytics, 'check_on_open_sea');
        const url = `${OPENSEA_LINK}/assets/${CONTRACT_ADDRESS}/${tokenIdValue}`
        window.open(url, '_blank');
        return;
      }

      setMintingStatus(MINT_STATUS.PROCESSING);
      setButtonState(true);
      setbuttonText("Processing....")
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, letsAskNftContract.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mintLetsAskNft(`${toValue}`, `${qValue}`);
        logEvent(analytics, 'minting');
        setMintingStatus(MINT_STATUS.MINTING);
        setbuttonText("Minting....")
        console.log("Mining...please wait.")
        await nftTxn.wait();
        setMintingStatus(MINT_STATUS.MINED);
        setButtonState(false);
        setTransactionHash(nftTxn.hash)
        setbuttonText("Check on Polyscan")
        startAnimation();
        setTimeout(() => {
          pauseAnimation();
        }, 10000);
        logEvent(analytics, 'minting_succees');
        console.log(`Mined, see transaction: ${POLYSCAN_LINK}/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      logEvent(analytics, 'minting_failed');
      setMintingStatus(MINT_STATUS.FAILED);
      setButtonState(true);
      setbuttonText("Failed");
      setDisclaimerText("Try increasing gas limit in metamask");
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );



  const handleToValueChange = (event) => {
    setToValue(event.target.value);
  };

  const onClickCollection = () => {
    logEvent(analytics, 'open_collection');
    const url = `${OPENSEA_LINK}/collection/letsask`
    window.open(url, '_blank');
  };

  const handleQValueChange = (event) => {
    setQValue(event.target.value);
  };

  const twitterClick = () => {
    logEvent(analytics, 'twitter_clicked');
    const url = `${TWITTER_LINK}`
    window.open(url, '_blank');
  };

  const githubClick = () => {
    logEvent(analytics, 'github_clicked');
    const url = `${GITHUB_LINK}`
    window.open(url, '_blank');
  };

  useEffect(() => {
    logEvent(analytics, 'opened');
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Question the status Quo</p>
          <p className="sub-text">
            Ask anybody anything. Mint as Fully On Chain NFT.
          </p>
          <div class="container">
            <div class="d-none d-md-block spacer"></div>
            <div class="row">
              <div class="col-sm">
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
                  <div className='disclaimer-text'>{disclaimerText}</div>
                </div>
              </div>
              <div class="col-sm">
                <div class="container justify-content-center">

                  {
                    toValue !== "" || qValue !== "" ? (<p className="sub-text gradient-text">
                      {`${HELLO}`} {`${toValue}`} {toValue ? ", " : null} {`${qValue}`}
                    </p>) : (

                      <div class="container" onClick={onClickCollection} className="cursor-div" ><div className='sub-text-left'>Check out our Collection on</div> <div><img alt="Open Sea" src={opensealogo} /></div> </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="footer-container">
          <div className='footer-text'>Created by </div>
          <img alt="Twitter Logo" className="github-logo" src={githubLogo} />
          <div onClick={githubClick}
            className="footer-text"
          >{`@vickycj`}</div>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <div onClick={twitterClick}
            className="footer-text"
          >{`@${TWITTER_HANDLE}`}</div>
        </div>
      </div>
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
    </div>
  );
};

export default App;