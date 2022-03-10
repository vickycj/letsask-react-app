import logo from './logo.svg';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import githubLogo from './assets/github-logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';

// Constants
const TWITTER_HANDLE = '0xVignesh';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const GITHUB_LINK = `https://github.com/vickycj`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

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
              <div class="col-sm">
                <div class="container">
                  <Form inline>
                    <FormGroup floating>
                      <Input
                        id="to"
                        name="to"
                        placeholder="To"
                        type="text"
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
                        placeholder="Question"
                        rows="3"
                        type="textarea"
                      />
                      <Label for="question">
                        Question
                      </Label>
                    </FormGroup>
                    {' '}
                  </Form>
                  {renderNotConnectedContainer()}
                </div>
              </div>
              <div class="col-sm">
                One of three columns
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