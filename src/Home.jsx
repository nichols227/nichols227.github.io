import './App.css';
import Form from './Form.jsx';
import {useState} from 'react'

function Home() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="App">
      <div class='appHeader'>
        <header className="App-header">
          Pylon Pick 6
        </header>
        <span>Venmo/CashApp: pylonpick6</span>
      </div>
      {submitted ? <div className="centerText">Thank you for your submission!</div> : <Form setSubmitted={setSubmitted} />}
    </div>
  );
}

export default Home;
