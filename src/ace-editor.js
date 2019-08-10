import React from "react";
import { render } from "react-dom";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { draftCode, saveCode, showCode } from "./actions";

// Import Brace and the AceEditor Component
import brace from "brace";
import AceEditor from "react-ace";

// Import a Mode (language)
import "brace/mode/javascript";
import "brace/mode/jsx";

// Import a Theme (okadia, github, xcode etc)
import "brace/theme/monokai";
import "brace/theme/textmate";
import "brace/theme/github";

import "brace/snippets/javascript";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

export default function Aceeditor(props) {
    const {
        input,
        mode = "javascript",
        theme = "monokai",
        fontSize = 14,
        tabSize = 2,
        width = "100%",
        height = "100%"
    } = props;

    return (
        <div>
            <AceEditor
                mode={mode}
                theme={theme}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                showGutter={true}
                showPrintMargin={true}
                highlightActiveLine={true}
                wrapEnabled={true}
                fontSize={fontSize}
                tabSize={tabSize}
                width={width}
                height={height}
                onChange={() => props.input.onChange(props.input.value)}
                onCursorChange={() =>
                    props.input.onCursorChange(props.input.value)
                }
                onSelectionChange={() =>
                    props.input.onSelectionChange(props.input.value)
                }
                onBlur={() => props.input.onBlur(props.input.value)}
                editorProps={{
                    $blockScrolling: Infinity
                }}
                setOptions={{
                    showLineNumbers: props.input.showLineNumbers
                }}
                readOnly={props.input.readOnly}
                maxLines={props.input.maxLines}
                value={props.input.value}
                {...input}
            />
        </div>
    );
} //closes Aceeditor
