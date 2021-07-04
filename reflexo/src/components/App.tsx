import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Reflexer from "./Reflexer";
import UI from "./UI";


export type ResultType = (number | string);

export const SettingsContext = React.createContext({
    numberOfTries: 3,
    setNumberOfTries: (value: number) => {
    }
});
ReactDOM.render(<App/>, document.getElementById('root'));

function App() {

    const [numberOfTries, setNumberOfTries] = useState(3);
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState([] as ResultType[]);

    useEffect(() => {
        if (results.length >= numberOfTries) {
            setRunning(false);
        }
    }, [results]);

    function start() {
        if (!running) {
            setResults([]);
            setRunning(true);
        }
    }

    return (
        <div className={"full-size"}>
            <SettingsContext.Provider value={{numberOfTries, setNumberOfTries}}>

                <Reflexer
                    running={running}
                    onResult={result => {
                        setResults(prev => prev.concat(result));
                    }}
                />
                <UI running={running} onStart={start} results={results}/>
            </SettingsContext.Provider>
        </div>
    );
}