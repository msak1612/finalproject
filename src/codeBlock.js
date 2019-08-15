import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock(props) {
    return (
        <SyntaxHighlighter language={props.language} style={xonokai}>
            {props.value}
        </SyntaxHighlighter>
    );
}
