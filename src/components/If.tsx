import { useEffect, useState } from "react";

type Props = {
    condition: boolean;
    children: React.ReactNode;
};

export const If = (props: Props) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (props.condition !== show) {
            setShow(props.condition);
        }
    }, [props.condition, show]);

    return show ? <>{props.children}</> : null;
};
