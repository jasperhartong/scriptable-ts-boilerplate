import { Button, ButtonBase, Collapse, Fab, Fade, makeStyles, useTheme } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ClipboardIcon from "@material-ui/icons/FileCopy";
import clsx from 'clsx';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useClipboard } from "use-clipboard-copy";



interface Props {
    value: string;
    collapsedHeight: number;
    inActive: boolean;
}

const useStyles = makeStyles(theme => ({
    code: {
        padding: theme.spacing(3),
        paddingTop: theme.spacing(8),
        margin: 0,
        borderRadius: theme.shape.borderRadius,
        border: 'solid 1px ' + theme.palette.grey[700],
    },
    root: {
        position: "relative",
        overflow: "hidden"
    },
    button: {
        position: "absolute",
        left: theme.spacing(2),
        top: theme.spacing(2),
        color: "white"
    },
    toggle: {
        position: "absolute",
        bottom: theme.spacing(1),
        textAlign: "center",
        paddingTop: theme.spacing(1),
        width: "100%",
        display: "block",
        opacity: 0.85,
        transition: "all 300ms ease-in-out",
        "&:hover": {
            opacity: 1
        }
    },
    chevron: {
        transition: "all 300ms ease-in-out",
        transform: "rotate(90deg)"
    },
    chevronUp: {
        transform: "rotate(-90deg)"
    }
}))


export const CodeWithClipboard = (
    { value, collapsedHeight, inActive }: Props
) => {
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const preElement = useRef<HTMLPreElement>(null);
    const clipboard = useClipboard({ copiedTimeout: 800 })

    const theme = useTheme()
    const classes = useStyles()

    const handleCopy = useCallback(() => {
        clipboard.copy(value)
    }, [value])

    const handleToggle = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setIsCollapsed(collapsed => !collapsed);
    }, [value])

    useEffect(() => {
        setIsSupported((_) => clipboard.isSupported())
    }, [clipboard])

    useEffect(() => {
        hljs.registerLanguage("javascript", javascript)
        hljs.highlightBlock(preElement.current);
        setIsHighlighted(true)
    }, [value]);

    return (
        <Fade in={isHighlighted} timeout={800}>
            <div className={classes.root} >
                <Collapse in={!isCollapsed} collapsedHeight={collapsedHeight}>
                    <div >
                        {!inActive && isSupported && (
                            <Button variant="contained" color="primary" onClick={handleCopy} className={classes.button}>
                                <span style={{ marginRight: 8 }}>Copy</span>
                                {clipboard.copied ? <CheckCircleIcon /> : <ClipboardIcon />}
                            </Button>
                        )}
                        <pre className={classes.code} ref={preElement}>
                            <code>{value}</code>
                        </pre>
                    </div>
                </Collapse>
                {!inActive && <ButtonBase className={classes.toggle} onClick={handleToggle} color="textPrimary" component="div">
                    <Fab size="small"><ChevronRightIcon className={clsx({ [classes.chevron]: true, [classes.chevronUp]: !isCollapsed })} /></Fab>
                </ButtonBase>}
            </div>
        </Fade>
    )

}