
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=bdb2e9973febb4bc962261741c24b6e4';
    _baseOffset = 210;


    getResource = async (url) =>  {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        // return res.data.results.map(this._transformCharacters)
        return res.data.results.map((item) => (this._transformCharacter(item)))
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
        // из этого метода возвращ. обьект, только с теми данными, что нам нужно
    }

    _transformCharacter = (char) => {

        return {
            id: char.id,
            name : char.name,
            description: char.description ? char.description.slice(0, 200) + '...' : char.description = 'There is no information about this character',
            thumbnail:  char.thumbnail.path + '.' + char.thumbnail.extension ,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items   
        }
    }

}

export default MarvelService;