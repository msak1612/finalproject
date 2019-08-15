import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function CodeBlock(props) {
    return (
        <SyntaxHighlighter language={props.language} style={monokai}>
            {props.value}
        </SyntaxHighlighter>
    );
}
