import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';


import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage.js';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';



const CharList = (props) => {

    const [charList, setCharList] =useState([]);
    const [newItemLoadind, setNewItemLoadind] =useState(false);
    const [offset, setOffset] =useState(210);
    const [charEnded, setCharEnded] =useState(false);
    
    const{loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []) //useEffect start after render().Т.е уже после того, как наша ф-я уже существует внутри компонента.По этому мы можем ее использовать выше, чем она обявлена

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoadind(false) : setNewItemLoadind(true);
        getAllCharacters(offset)
            .then(onCharLoaded);
    }

    const onCharLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoadind(NewItemLoadind => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem =(id) => {

        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

     // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {

        const elements = arr.map((item, i) => {
            const {id, name, thumbnail}  = item;
            let imgStyle = {'objectFit' : 'cover'};
            if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
          

            return (
                   <CSSTransition  key ={id} timeout={500} classNames="char__item">
                        <li className="char__item"
                            tabIndex={0}
                            ref={el => itemRefs.current[i] = el}
                            onClick={() => {
                                props.onCharSelected(id);
                                focusOnItem(i);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === ' ' || e.key === "Enter") {
                                    props.onCharSelected(item.id);
                                    focusOnItem(i);
                                }
                            }}>
                                <img src={thumbnail}
                                    alt="thumbnail"
                                    style={imgStyle}/>
                                <div className="char__name">{name}</div>
                        </li>
                   </CSSTransition>
                )
            });

             // А эта конструкция вынесена для центровки спиннера/ошибки
             return (
                <ul className="char__grid">
                    <TransitionGroup component={null}>
                    {elements}
                    </TransitionGroup>
                </ul>                
            )
    }


    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoadind  ? <Spinner/> : null; //есть загрузка , но не загрузка новых персонажей
    


    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoadind}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;

