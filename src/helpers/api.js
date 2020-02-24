const API_URL = `https://pokeapi.co/api/v2`

export
  async function getData(string = '', type = 'pokemon', limit = 20, offset = 0) {
    const path = `${API_URL}/${type}/${string}?limit=${limit}&offset=${offset}`
    try {
      return await (await fetch(path)).json()
    } catch (err) {
      return null
    }
  }
