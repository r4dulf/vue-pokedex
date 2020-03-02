import qs from 'query-string'

const API_URL = `https://pokeapi.co/api/v2`

export
  async function getData(type = 'pokemon', target = '', params = {}) {
    const path = `${API_URL}/${type || 'pokemon'}/${target || ''}?${qs.stringify(params)}`
    
    try {
      return await (await fetch(path)).json()
    } catch (err) {
      return null
    }
  }
