import {useState, useRef, useEffect} from 'react'

export const useRickAndMorty = () => {
  const [rickAndMorty, setRickAndMorty] = useState({
    characters:
      JSON.parse(window.sessionStorage.getItem('rickAndMorty') as string) || [],
    status: 'idle',
  })
  const countRef = useRef(1)

  const getData = async count => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${count}`,
    )
    if (response.ok) {
      const data = await response.json()
      setRickAndMorty({
        characters: [...rickAndMorty.characters, ...data.results],
        status: 'success',
      })
    }
  }

  const loadMoreCards = () => {
    countRef.current++
    getData(countRef.current)
  }

  useEffect(() => {
    try {
      setRickAndMorty({characters: [], status: 'loading'})
      getData(countRef.current)
    } catch (error) {
      console.log(error)
    }
  }, [])

  // useEffect(() => {
  //   if (isInView) {
  //     loadMoreCards()
  //   }
  // }, [isInView])

  useEffect(() => {
    window.sessionStorage.setItem(
      'rickAndMorty',
      JSON.stringify(rickAndMorty.characters),
    )
  }, [rickAndMorty])

  const isLoading = rickAndMorty.status === 'loading'
  const isSuccess = rickAndMorty.status === 'success'

  return {rickAndMorty, isSuccess, isLoading, loadMoreCards}
}
