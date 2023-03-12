import { Component } from 'react';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <Viev char={char}/> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const Viev = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;

// жизненный цикл компонентов (lifecycle lifecycle hooks)

// у компонентов в реакте есть 3 этапа жизненного цикла 

// 1 - компонент появился на странице 
// 2 - компонент может обновляться, двумя способами. если компонент получает новое свойство - он перерисовывается и если внутри компонента пришёл новый стейт
// 3 - компонент становится не нужным и просто удаляется со страницы

// есть дополнительный этап - этап ошибки 


// на каждои таком этапе мы можем вызвать свои функции - хуки жизненного цикла или lifecycle hooks

// hooks - componentDidMount() -> componentDidUpdate() -> componentWillInmount() 

// если ошбика - componentDidCatch

// хуки нужны для контроля утечек памяти, к примеру в них можно остановить сет интервал 

// mount(монтирование) - constructor -> render -> React обновляет DOM и рефы -> hook componentDidMount

// update - (компонент начинает обновляться) (new props, setState, forceUpdate(позволяет насильно обновить компонент)) -> render (without constructor) -> обновление ДОМ и рефов -> componentDidUpdate()

// SETSTATE всегда вызывает метод рендер

// размонтирование - componentWillInmount() БЕЗ ВСЕГО

// конструктор - рендер - моунт 
// ошибка была в том что мы делали запрос на этапе конструктора. запрос отправляли тогда, когда компонент ещё не был создан
// нам некуда было засунуть данные мб и стейт не был готов 

// поэтому реакт отправлял второй запрос, чтобы адекватно сформировать компонент (update срабатывал два раза)

// в реакте есть два этапа - рендер (все до метода рендер) и коммит (обновляет рефы и хуки)

// назначать обновления мы можем только на этапе коммита

// поэтому эти хуки (дид маунт) - отличное место для вызова сетевых функций

// любые обновления, запросы к апи и серверы мы должны делать в компонент дид маунт 
// но никак не в конструкторе 

// интервал надо останавливать в componentWillUnmount