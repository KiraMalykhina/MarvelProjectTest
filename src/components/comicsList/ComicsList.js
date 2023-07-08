import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage.js';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

const ComicsList = (props) => {

    const[comicsList, setcomicsList] = useState([]);
    const[newItemLoading, setnewItemLoading ] = useState(false);
    const[offset, setOffset] = useState(0);
    const[comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllComics(offset)
                    .then(onComicsLoaded);
    }

    const  onComicsLoaded = (newComicsList) => {
         let ended = false;
         if (newComicsList.length < 8) {
            ended = true;
         }
         setcomicsList(comicsList => [...comicsList, ...newComicsList]);
         setnewItemLoading(newItemLoading => false);
         setOffset(offset => offset + 8);
         setComicsEnded(comicsEnded => ended);

    }

    function renderItems(arr) {

        const elements = arr.map(item => {

            const {id, title, price, thumbnail} = item;
        
        return (
                <li className="comics__item"
                    key={id}>
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} 
                             alt={title} 
                             className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
               )
        });
        return (
            <ul className="comics__grid">
                {elements}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spiner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spiner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>

    )
}

export default ComicsList;