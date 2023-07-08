import { useParams, Link } from 'react-router-dom';
import {useState, useEffect} from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage.js';
import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';


const SinglePage = ({Component, dataType}) => {

    const {id} = useParams ();
    const [data, setData] = useState(null);

    const {loading, error, getComic, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateData()
    }, [id])

    const updateData = () => {
        clearError();

        switch(dataType) {
            case 'character':
                getCharacter(id)
                .then(onDataLoaded);
            break;
            case 'comic':
                getComic(id)
                .then(onDataLoaded);    
        }
    }
    
    const onDataLoaded = (data) => {
        setData(data);
    
    }
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>  <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
        
    )
}



export default SinglePage;