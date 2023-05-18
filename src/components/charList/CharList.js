import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage.js';
import MarvelService from '../../services/MarvelService';
import './charList.scss';
import PropTypes from 'prop-types'


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoadind: false,
        offset: 210,
        charEnded: false
    }
   

    marvelService = new MarvelService();

    onCharLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoadind: false,
            offset: offset + 9,
            charEnded: ended              
        }))
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoadind: true
        })
    }

     // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {

        const elements = arr.map(item => {
            const {id, name, thumbnail}  = item;
            let imgStyle = {'objectFit' : 'cover'};
            if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            const active = this.props.charId === id;
            const clazz = active ? 'char__item char__item_selected': "char__item";   

            return (
                    <li className={clazz}
                         tabIndex={0}
                         key ={id}
                         onClick={() => this.props.onCharSelected(id)}>
                        <img src={thumbnail}
                             alt="thumbnail"
                             style={imgStyle}/>
                        <div className="char__name">{name}</div>
                    </li>
                )
            });

             // А эта конструкция вынесена для центровки спиннера/ошибки
             return (
                <ul className="char__grid">
                    {elements}
                </ul>                
            )
    }

    render() {
        const {charList, loading, error, offset, newItemLoadind, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

    
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoadind}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;

