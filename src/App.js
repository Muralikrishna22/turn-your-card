import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Cookies from 'universal-cookie';
import { Container, Row, Col, Button, Form, Tabs, Tab, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import Drawer from './drawer';
import { BiArrowToRight } from 'react-icons/bi'
import { GiPlayButton } from 'react-icons/gi'
import { HiUserRemove } from 'react-icons/hi'


function App() {
  const [shuffledArray, setShuffledArray] = useState([]);
  const [playername, setPlayername] = useState('');
  const cookies = new Cookies();
  const [drawer, setDrawer] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const nodeRef = useRef()


  const flipCard = (flipedCard) => {
    setShuffledArray((prevArray) => {
      const newArray = prevArray.map((obj) =>
        obj.id === flipedCard?.id ? { ...obj, flipped: true } : { ...obj, flipped: false }
      );
      return newArray;
    });
    setTimeout(() => {
      shuffleArray(shuffledArray);
      if (flipedCard?.type != 'one more choice') {
        let currentPlayerIndex = players.findIndex((obj) => obj.id == currentPlayer?.id)
        let newPlayerIndex = currentPlayerIndex == (players.length - 1) ? 0 : currentPlayerIndex + 1
        setCurrentPlayer(players[newPlayerIndex])
      }
    }, 2000);
    let updatedPlayersScore = [...players].map((player) => currentPlayer?.id == player.id ? { ...player, score: flipedCard.type === 'score zero' ? 0 : parseInt(player.score) + parseInt(flipedCard.points) } : player)
    setPlayers(updatedPlayersScore)
  };

  const shuffleArray = (array) => {
    const newArray = array.map((obj) => ({ ...obj, flipped: false }));
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setShuffledArray(newArray);
  };

  useEffect(() => {
    const cardsList = cookies.get('MY_CARDS');
    const plyersList = cookies.get('PLAYERS');
    if (cardsList) {
      setShuffledArray(cardsList);
    }
    if (plyersList) {
      setPlayers(plyersList)
      setCurrentPlayer(plyersList?.[0])
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleClickOutside = (event) => {
    if (nodeRef.current && !nodeRef.current.contains(event.target)) {
      return setDrawer(false)
    }
  };

  const addPlayer = () => {
    let newPlayer = {
      id: new Date()?.getTime(),
      score: 0,
      name: playername
    }
    if (players?.length === 0) {
      setCurrentPlayer(newPlayer)
    }
    setPlayers([...players, newPlayer])
    cookies.set('PLAYERS', [...players, newPlayer], { path: '/' });
    setPlayername('')
  }


  const removePlayer = (player) => {
    const filteredPlayers = players?.filter(obj => obj.id != player.id)
    setPlayers(filteredPlayers)
    cookies.set('PLAYERS', filteredPlayers, { path: '/' });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Flip your card</h1>
        </div>
        <div>
          <button onClick={() => setDrawer(!drawer)}>{'Edit cards'}</button>
          <div ref={nodeRef} className={`drawer ${drawer ? 'open' : ''}`}>
            <div className="drawer-header">
              <button onClick={() => setDrawer(!drawer)}><BiArrowToRight /></button>
              <h2>Cards List</h2>
            </div>
            <div className="drawer-body">
              <Drawer shuffledArray={shuffledArray} setShuffledArray={setShuffledArray} />
            </div>
          </div>
        </div>
      </header>
      <Container className='main-container'>
        <Row>
          <Col md={3}>
            <div className='gamers-container'>
              <div>
                <div className='add-gammer'>
                  <input type={'text'} placeholder='Name' value={playername} onChange={(e) => setPlayername(e.target.value)} />
                  <button className={`btn btn-primary ${playername?.length == 0 && 'button-dim'}`} onClick={() => addPlayer()} >Add player</button>
                </div>
              </div>
              <div className='gamers-list'>
                <h4>Players</h4>

                {players?.map((obj => (
                  <div className={`player ${currentPlayer?.id == obj.id ? "current-player" : null}`}>
                    <p>{currentPlayer?.id == obj.id && <GiPlayButton />} {obj.name} : <span>{obj?.score}</span></p>
                    <Button onClick={() => removePlayer(obj)} ><HiUserRemove /></Button>
                  </div>
                )))}
              </div>
            </div>
          </Col>
          <Col md={9}>
            <div className="cards-list">
              {shuffledArray.map((obj, index) => (
                <div
                  key={index}
                  className={`nameCard ${obj.flipped ? 'flipped' : ''}`}
                  onClick={() => flipCard(obj)}
                >
                  {obj.flipped
                    ?
                    <div className="card-back">
                      <p>{obj.name}</p>
                      <br />
                      <p>{obj.points}</p>
                    </div>
                    :
                    <div className="card-front">?</div>
                  }
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
      <div
        className={drawer ? "fade_in" : undefined}
      ></div>
    </div>
  );
}

export default App;
