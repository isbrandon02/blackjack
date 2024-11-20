import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from "./compoenents/Card.jsx"
import cardsData from "./data/cardData.js"
import TurnedCard from "./compoenents/TurnedCard.jsx"
import LoseScreen from './compoenents/LoseScreen.jsx'
import TiedScreen from './compoenents/TiedScreen.jsx'
import WonScreen from './compoenents/WonScreen.jsx'
import hitSound from "./data/audio.mp3"
import winSound from "./data/victory-royale.mp3"
import loseSound from "./data/bonk.mp3"

function App() { 

  const hitAudio = new Audio(hitSound);
  const winAudio = new Audio(winSound);
  const loseAudio = new Audio(loseSound)

  const [isDealerTurn, setIsDealerTurn] = useState(false)
  const [myCards, setMyCards] = useState([cardsData[Math.floor(Math.random() * 52)]])
  const [dealerCards, setDealerCards] = useState(["turned", cardsData[Math.floor(Math.random() * 52)]])
  const [myTotal, setMyTotal] = useState(0)
  const [dealerTotal, setDealerTotal] = useState(0)

  const [lost, setLost] = useState(false)
  const [won, setWon] = useState(false)
  const [tied, setTied] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(function() {
    setMyTotal(() => {
      return calculateTotal(myCards);
    })
  }, [myCards])
  
  useEffect(function() {
    setDealerTotal(() => {
      return calculateTotal(dealerCards.filter(card => card !== "turned"));
    })
  }, [dealerCards])
  
  function calculateTotal(cards) {
    let total = 0;
    for (let card of cards) {
      if (['J', 'Q', 'K'].includes(card.value)) {
        total += 10;
      } else if (card.value === 'A') {
        total += 11;
      } else {
        total += Number(card.value);
      }
    }
    return total;
  }

  function Hit() {
    const newCard = cardsData[Math.floor(Math.random() * 52)]
    setMyCards(prevHand => {
      const newHand = [...prevHand, newCard];
      const newTotal = calculateTotal(newHand);
      if (newTotal > 21) {
        setGameEnded(true);
        setLost(true);
      }
      setMyTotal(newTotal); 
      return newHand;
    })
    setGameStarted(true)
    hitAudio.play()
  }

  function Reset() {
    setMyCards([cardsData[Math.floor(Math.random() * 52)]]);
    setDealerCards(["turned", cardsData[Math.floor(Math.random() * 52)]]);
    setIsDealerTurn(false);
    setGameEnded(false);
    setLost(false);
    setWon(false);
    setTied(false);
    setGameStarted(false);
  }

  function Stand() {
    setDealerCards(prevHand => {
      let newHand = [...prevHand]
      newHand[0] = cardsData[Math.floor(Math.random() * 52)]
      hitAudio.play()
      return newHand
    })
    if (dealerTotal > myTotal) {
      setLost(true)
      loseAudio.play()
      setGameEnded(true)
    }
    setIsDealerTurn(true)
    setGameStarted(true)
  }

  useEffect(function() {
    let timer;
    if (isDealerTurn && dealerTotal < 17) {
      timer = setTimeout(function() {
        drawDealerHand()
      }, 1000)
    }
    else if (isDealerTurn) {
      setIsDealerTurn(false)
      setGameEnded(true)
    }
    return () => clearTimeout(timer)
  }, [isDealerTurn, dealerTotal])

  useEffect(() => {
    if (gameStarted && (gameEnded || myTotal > 21)) {
      if (myTotal > 21) {
        setLost(true);
        loseAudio.play()
      } else if (gameEnded) {
        if (dealerTotal > 21) {
          setWon(true);
          winAudio.play()
        } else if (dealerTotal > myTotal) {
          setLost(true);
          loseAudio.play()
        } else if (myTotal > dealerTotal) {
          setWon(true);
          winAudio.play()
        } else {
          setTied(true);
        }
      }
    }
  }, [gameStarted, gameEnded, myTotal, dealerTotal]);


  function drawDealerHand() {
    const newCard = cardsData[Math.floor(Math.random() * 52)]
    setDealerCards(prevHand => [...prevHand, newCard])
    hitAudio.play()
  }
  
  const cardElements = myCards.map(card => <Card key={card.id} suit={card.suit} number={card.value}/>)
  const dealerCardElements = dealerCards.map((card, index) => {
    if (card === "turned") {
      return <TurnedCard key={"turned"} />
    }
    else {
      return <Card key={index} suit={card.suit} number={card.value} />
    }
  })


  return (
    <>
      <div className="game">
      {lost && <div className="overlay"></div>}
      {lost ? <LoseScreen reset={Reset}/> : <></>}
      {won && <div className="overlay"></div>}
      {won ? <WonScreen reset={Reset}/> : <></>}
      {tied && <div className="overlay"></div>}
      {tied ? <TiedScreen reset={Reset}/> : <></>}

        <div className='dealer-hand--container'>
          <h3 className="your--hand">Dealers Hand ({dealerTotal})</h3>

          <div className='dealer--cards'>
            {dealerCardElements}
          </div>
        </div>
        <div className='board'>
          <button className="button" disabled={lost} onClick={Hit}>Hit</button>
          <button className="button" disabled={lost} onClick={Reset}>Reset</button>
          <button className="button" disabled={lost} onClick={Stand}>Stand</button>
        </div>
        <div className='hand--container'>
          <h3 className="your--hand">Your Hand ({myTotal})</h3>
          <div className="myCards">
              {cardElements}
            </div>
        </div>
      </div>
        

    </>
  )
}

export default App