import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage/>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

//Предохранители ловят не все ошибки, они ловят: ошибки при запуске метода рендер, в методах жизненого цикла и в конструторах дочерних компонентов

// Предохранители НЕ ловят ошибки: 
//1)ошибки котор. произошли внутри обработчиков событий(т.к событие происходит вне метода рендер)
//2)Асинхронный код(мы не знаем когда эта операция закончится), сетевые запросы относятся к этому типу и по этому есть доп.метод по отлову таких ошибок
//3)в самом предохранители, он ловит ошибки только дочерних компонентов, но не внутри себя
//4) Серверный рендернинг