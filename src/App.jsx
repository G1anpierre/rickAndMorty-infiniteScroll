import {useState, useEffect, useRef} from 'react'
import reactLogo from './assets/react.svg'
import {useInView} from 'react-intersection-observer'
import {useRickAndMorty} from '../hooks/rickAndMorty'
import './App.css'

function App() {
  const {rickAndMorty, isLoading, isSuccess, loadMoreCards} = useRickAndMorty()
  const {ref: loadMore, inView: isInView} = useInView({
    onChange: (inView, entry) => {
      if (inView) {
        loadMoreCards()
      }
    },
  })

  useEffect(() => {
    const items = document.querySelectorAll('.list')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const intersecting = entry.isIntersecting
          const item = entry.target
          if (intersecting) {
            item.classList.add('is-visible')
          }
        })
      },
      {threshold: 0.5},
    )

    items.forEach(item => {
      observer.observe(item)
    })
  })

  return (
    <div className="App">
      <div className="wrapper">
        <h1>Rick and Morty - Infinite Scroll</h1>
        {isLoading && <div className="loading">Loading...</div>}
        {isSuccess && (
          <div>
            <ul>
              {rickAndMorty.characters.map((character, index) => (
                <li key={`${character.id}-${index}`} className="list">
                  <h2>{character.name}</h2>
                  <img src={character.image} alt={character.name} />
                </li>
              ))}
            </ul>
            <div className="load-more-border">
              <button onClick={loadMoreCards} ref={loadMore}>
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
