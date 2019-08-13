import React, { useEffect } from "react";
import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import {
    setChallenge,
    setDraftSolution,
    setResult,
    unlockSolution
} from "./actions";
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
    const draftSolution = useSelector(
        state => state.challenges.challenge.draftSolution
    );
    const solvedAlready = useSelector(
        state => state.challenges.challenge.solvedAlready
    );
    const unlocked = useSelector(state => state.challenges.challenge.unlocked);
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
                let data_unlocked = parseInt(data.unlocked);
                dispatch(
                    setChallenge({
                        name: data.name,
                        description: atob(data.description),
                        draftSolution: data.usersolution
                            ? atob(data.usersolution)
                            : data_unlocked
                                ? atob(data.solution)
                                : atob(data.template),
                        solvedAlready: data.usersolution
                            ? true
                            : data_unlocked
                                ? true
                                : false,
                        unlocked: data_unlocked
                    })
                );
            })
            .catch(err => {
                console.log(err);
            });
    }, [url, unlocked]); //closes useEffect

    function handleChange(value) {
        dispatch(setDraftSolution(value));
    } //closes handleChange

    function handleSubmitClick() {
        axios
            .post("/api/challenge", {
                id: id,
                solution: btoa(draftSolution)
            })
            .then(status => {
                dispatch(setResult(status.data));
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleSubmitClick

    function handleUnlockClick() {
        axios
            .post("/api/solution", {
                challenge_id: id
            })
            .then(status => {
                dispatch(unlockSolution());
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className="display-rowwise">
            <div>
                <h2>{name}</h2>
                <ReactMarkdown source={description} />
            </div>
            <div className="display-colwise">
                <div className="display-rowwise">
                    {draftSolution && (
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
                            value={draftSolution}
                            editorProps={{ $blockScrolling: true }}
                            readOnly={solvedAlready}
                        />
                    )}
                    {!solvedAlready && (
                        <div>
                            <button
                                name="save"
                                onClick={() => handleSubmitClick()}
                            >
                                Submit
                            </button>
                            <button
                                name="unlock"
                                onClick={() => handleUnlockClick()}
                            >
                                Unlock Solution
                            </button>
                        </div>
                    )}
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
