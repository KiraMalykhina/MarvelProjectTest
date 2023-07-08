import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=bdb2e9973febb4bc962261741c24b6e4';
    const _baseOffset = 210;


    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        // return res.data.results.map(this._transformCharacters)
        return res.data.results.map((item) => (_transformCharacter(item)));
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
        // из этого метода возвращ. обьект, только с теми данными, что нам нужно
    }

    const getCharacterByName = async(name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        // return _transformCharacter(res.data.results[0]);
        return res.data.results.map(_transformCharacter);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map((item) => (_transformComics(item)));
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
            return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {

        return {
            id: char.id,
            name : char.name,
            description: char.description ? char.description.slice(0, 200) + '...' : char.description = 'There is no information about this character',
            thumbnail:  char.thumbnail.path + '.' + char.thumbnail.extension ,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items   
        };
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            price : comics.prices[0].price ? `${comics.prices[0].price}$` : "not available",
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            description: comics.description || "There is no description",
            pageCount: comics.pageCount ? `${comics.pageCount} p.`: "No information about the number of pages",
            language: comics.textObjects[0]?.language || "en-us"
                        
        };
    };

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic, getCharacterByName};

}

export default useMarvelService;