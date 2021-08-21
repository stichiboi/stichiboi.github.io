import React, {ReactChild} from "react";

export default function ActionButton({
                                         icon,
                                         onClick,
                                         isToggled,
                                         fill
                                     }: { icon: ReactChild, onClick: () => unknown, isToggled?: boolean, fill?: boolean }) {

    return (
        <button
            className={`button-action ${isToggled ? 'highlight-main' : ''} ${fill ? 'fill' : ''}`}
            onClick={onClick}>
            {icon}
        </button>
    )

}