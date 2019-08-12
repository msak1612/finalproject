import React, { useEffect } from "react";
import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import { setChallenge, setDraftSolution, setResult } from "./actions";
import AceEditor from "react-ace";
import ReactMarkdown from "react-markdown";
import { Posts } from "./posts";
import { Solutions } from "./solutions";
import "brace/mode/javascript";
import "brace/theme/github";
import "brace/theme/monokai";

export default function Challenge(props) {
    const dispatch = useDispatch();
    const description = useSelector(
        state => state.challenges.challenge.description
    );
    const solution = useSelector(
        state => state.challenges.challenge.draftSolution
    );
    const result = useSelector(state => state.challenges.challenge.result);
    const name = useSelector(state => state.challenges.challenge.name);
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
                        name: data.name,
                        description: atob(data.description),
                        draftSolution: atob(data.template)
                    })
                );
            })
            .catch(err => {
                console.log(err);
            });
    }, [url]); //closes useEffect

    function handleChange(value) {
        dispatch(setDraftSolution(value));
    } //closes handleChange

    function handleSubmitClick() {
        axios
            .post("/api/challenge", {
                id: id,
                solution: btoa(solution)
            })
            .then(status => {
                dispatch(setResult(status.data));
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleSubmitClick

    return (
        <div className="display-rowwise">
            <div>
                <h2>{name}</h2>
                <ReactMarkdown source={description} />
            </div>
            <div className="display-colwise">
                <div className="display-rowwise">
                    {solution && (
                        <AceEditor
                            mode="javascript"
                            theme="monokai"
                            enableBasicAutocompletion={true}
                            enableLiveAutocompletion={true}
                            showGutter={true}
                            showPrintMargin={true}
                            highlightActiveLine={true}
                            wrapEnabled={true}
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
                {result && (
                    <div className="display-colwise">
                        <h4>
                            {result.numPassedTests} out of{" "}
                            {result.numFailedTests + result.numPassedTests}{" "}
                            Passed
                        </h4>
                        {result.testResults &&
                            result.testResults.map(result => (
                                <div key={result.title}>
                                    <span>{result.title}</span>
                                    &nbsp;{" "}
                                    <span
                                        style={{
                                            color:
                                                result.status == "passed"
                                                    ? "green"
                                                    : "red"
                                        }}
                                    >
                                        {result.status}
                                    </span>
                                </div>
                            ))}
                    </div>
                )}
                <Posts id={id} />
                <Solutions challenge_id={id} />
            </div>
        </div>
    );
} //Challenges
