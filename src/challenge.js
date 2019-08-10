import React, { useEffect } from "react";
import { render } from "react-dom";
import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import { setChallenge, setSolution } from "./actions";
import AceEditor from "react-ace";
import ReactMarkdown from "react-markdown";

import "brace/mode/javascript";
import "brace/theme/github";

export default function Challenge(props) {
    const dispatch = useDispatch();
    const description = useSelector(
        state => state.challenges.challenge.description
    );
    const solution = useSelector(state => state.challenges.challenge.solution);
    const id = props.match.params.id;
    const url = "/api/challenge";
    useEffect(() => {
        axios
            .get("/api/challenge", {
                params: {
                    id: id
                }
            })
            .then(({ data }) => {
                dispatch(
                    setChallenge({
                        description: atob(data.description),
                        solution: atob(data.template)
                    })
                );
            })
            .catch(err => {
                console.log(err);
            });
    }, [url]); //closes useEffect

    function handleChange(value) {
        dispatch(setSolution(value));
    } //closes handleChange

    function handleSubmitClick() {
        axios
            .post("/api/challenge", {
                id: id,
                solution: btoa(solution)
            })
            .then(status => {
                alert("success");
            })
            .catch(err => {
                console.log(err);
                alert("failed");
            });
    } //closes handleSubmitClick

    return (
        <div className="display-rowwise">
            <div>
                <ReactMarkdown source={description} />
            </div>
            <div>
                {solution && (
                    <AceEditor
                        mode="javascript"
                        theme="github"
                        onChange={handleChange}
                        name="editor"
                        value={solution}
                        editorProps={{ $blockScrolling: true }}
                    />
                )}
                <button name="save" onClick={() => handleSubmitClick()}>
                    Submit
                </button>
            </div>
        </div>
    );
} //Challenges
