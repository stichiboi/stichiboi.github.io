import React, {ReactChild} from "react";

export default function ActionButton({
                                         icon,
                                         onClick,
                                         isToggled
                                     }: { icon: ReactChild, onClick: () => unknown, isToggled?: boolean }) {

    return (
        <button className={`button-action ${isToggled ? 'toggled' : ''}`} onClick={onClick}>
            {icon}
        </button>
    )

}