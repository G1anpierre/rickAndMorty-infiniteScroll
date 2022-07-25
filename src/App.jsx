import {useState, useEffect, useRef} from 'react'
import reactLogo from './assets/react.svg'
import {useInView} from 'react-intersection-observer'

import './App.css'

function App() {
  const {ref: loadMore, inView: isInView} = useInView()
  const [rickAndMorty, setRickAndMorty] = useState({
    characters: JSON.parse(window.localStorage.getItem('rickAndMorty')) || [],
    status: 'idle',
  })
  const countRef = useRef(1)

  const getData = async count => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${count}`,
    )
    const data = await response.json()
    setRickAndMorty({
      characters: [...rickAndMorty.characters, ...data.results],
      status: 'success',
    })
  }

  useEffect(() => {
    try {
      setRickAndMorty({characters: [], status: 'loading'})
      getData(countRef.current)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleCount = () => {
    countRef.current++
    getData(countRef.current)
  }

  useEffect(() => {
    if (isInView) {
      handleCount()
    }
  }, [isInView])

  useEffect(() => {
    window.localStorage.setItem(
      'rickAndMorty',
      JSON.stringify(rickAndMorty.characters),
    )
  }, [rickAndMorty])

  return (
    <div className="App">
      <div className="wrapper">
        <h1>Rick and Morty - Infinite Scroll</h1>
        {rickAndMorty.status === 'loading' && (
          <div className="loading">Loading...</div>
        )}
        {rickAndMorty.status === 'success' && (
          <div>
            <ul>
              {rickAndMorty.characters.map((character, index) => (
                <li key={`${character.id}-${index}`}>
                  <h2>{character.name}</h2>
                  <img src={character.image} alt={character.name} />
                </li>
              ))}
            </ul>
            <div>
              <button onClick={handleCount} ref={loadMore}>
                Load more
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
