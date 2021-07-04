import {ResultType} from "./App";
import React, {useEffect, useState} from "react";
import {getLocalScore, LOCAL_SCORE_KEY} from "./UI";

export default function Results({results}: { results: ResultType[] }) {
    const [average, setAverage] = useState(calculateAverage());
    const [isBest, setIsBest] = useState(false);
    useEffect(() => {
        setAverage(calculateAverage());
    }, [results]);

    useEffect(() => {
        if (average) {
            const prevScore = getLocalScore() || Infinity;
            if (average < prevScore) {
                setIsBest(true);
            } else {
                setIsBest(false);
            }
            localStorage.setItem(LOCAL_SCORE_KEY, Math.min(prevScore, average).toString());
        }
    }, [average]);

    function calculateAverage() {
        if (results.length === 0) return 0;
        let tot = 0;
        for (let r of results) {
            if (typeof r === 'number') tot += r;
            //If there's an invalid result, then the average is invalid
            else return 0;
        }
        return Math.round(tot / results.length);
    }

    function formatResultType(r: ResultType) {
        return typeof r === 'number' ? `${r} ms` : r;
    }

    return (
        <div className={"popup toggled --spacing --vertical"}>
            <section className={"results --spacing --vertical"}>
                <p className={"text-header"}>{"Results"}</p>
                <div className={"results-content --spacing --vertical"}>
                    {results.map((r, ind) => (
                        <p key={ind}>{formatResultType(r)}</p>
                    ))}
                </div>
            </section>
            <section className={"results --spacing --vertical"}>
                <p className={"text-header"}>{"Average"}</p>
                {average ?
                    <p>{formatResultType(average)}</p>
                    : <p>{'Invalid result'}</p>
                }
                {isBest ? <p className={"text-header text-info"}>{"New best!"}</p> : ''}
            </section>
        </div>
    )
}