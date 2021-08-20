import React from "react";
import {Heart, Emoji} from 'iconoir-react';
import Popup from "./Popup";

export default function Info() {

    return (
        <Popup icon={<Heart/>}>
            <p className={"text-header"} style={{whiteSpace: 'nowrap'}}>Hello there!</p>
            <Emoji/>
        </Popup>
    )
}