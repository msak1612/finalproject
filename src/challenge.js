import React, { useEffect } from "react";
import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import {
    setChallenge,
    setDraftSolution,
    setResult,
    unlockSolution,
    resetChallenge,
    setCurrentTab
} from "./actions";
import AceEditor from "react-ace";
import Posts from "./posts";
import ReactMarkdown from "react-markdown";
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
    const defaultSolution = useSelector(
        state => state.challenges.challenge.defaultSolution
    );
    const name = useSelector(state => state.challenges.challenge.name);
    const currentTab = useSelector(state => state.challenges.currentTab);
    const challenges = useSelector(state => state.challenges.challenges);
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
                        template: atob(data.template),
                        defaultSolution: data.solution,
                        draftSolution: data.usersolution
                            ? atob(data.usersolution)
                            : atob(data.template),
                        solvedAlready: data.usersolution
                            ? true
                            : data_unlocked
                            ? true
                            : false,
                        unlocked: data_unlocked
                    })
                );
                dispatch(setCurrentTab("codeeditor"));
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

    function handleResetClick() {
        dispatch(resetChallenge());
    }

    function handleTabClick(e) {
        dispatch(setCurrentTab(e.target.id));
    }

    function handleCopyClick() {
        dispatch(setDraftSolution(atob(defaultSolution)));
        dispatch(setCurrentTab("codeeditor"));
    }

    function handleNextClick() {
        let index = challenges.findIndex(item => item.id == id);
        index++;
        if (index < challenges.length) {
            location.replace("/challenge/" + challenges[index].id);
        } else {
            location.replace("/challenges");
        }
    }

    function TabButton(props) {
        return (
            <button
                className={
                    currentTab == props.id ? "activetablink" : "inactivetablink"
                }
                id={props.id}
                onClick={e => handleTabClick(e)}
            >
                {props.text}
            </button>
        );
    }

    function TestResults() {
        return (
            <div className="tc">
                <h4>
                    <div>Score: {result.score}</div>
                </h4>
                {result.testResults &&
                    result.testResults.map(result => (
                        <div key={result.title}>
                            <img
                                className="testresult"
                                src={
                                    result.status == "passed"
                                        ? "/images/right.png"
                                        : "/images/wrong.png"
                                }
                            />
                            <b>{result.title}</b>
                        </div>
                    ))}
            </div>
        );
    }

    return (
        <section className="challenge-container ">
            <div className="left-part">
                <h2>{name}</h2>
                <ReactMarkdown source={description} />
            </div>
            <div className="right-part">
                <div className="ace">
                    <div className="tab">
                        <TabButton id="codeeditor" text="Code Editor" />
                        <TabButton id="discussion" text="Discussions" />
                        <TabButton id="solution" text="Solution" />
                    </div>
                    {currentTab == "codeeditor" && (
                        <div>
                            <AceEditor
                                mode="javascript"
                                theme="monokai"
                                enableBasicAutocompletion={true}
                                enableLiveAutocompletion={true}
                                showGutter={true}
                                showPrintMargin={true}
                                highlightActiveLine={true}
                                wrapEnabled={true}
                                height="50vh"
                                onChange={handleChange}
                                name="editor"
                                value={draftSolution}
                                editorProps={{ $blockScrolling: true }}
                            />
                            <div className="code-submit">
                                {!result && (
                                    <button
                                        name="save"
                                        onClick={handleSubmitClick}
                                    >
                                        Submit
                                    </button>
                                )}
                                <button name="reset" onClick={handleResetClick}>
                                    Reset
                                </button>
                                {result && (
                                    <button
                                        name="next"
                                        onClick={handleNextClick}
                                    >
                                        Next Challenge
                                    </button>
                                )}
                            </div>
                            {result && <TestResults />}
                        </div>
                    )}
                    {currentTab == "discussion" && <Posts id={id} />}
                    {currentTab == "solution" && (
                        <div id="solutiontab">
                            {unlocked == 1 && (
                                <div>
                                    <AceEditor
                                        mode="javascript"
                                        theme="monokai"
                                        enableBasicAutocompletion={true}
                                        enableLiveAutocompletion={true}
                                        showGutter={true}
                                        showPrintMargin={true}
                                        highlightActiveLine={true}
                                        wrapEnabled={true}
                                        height="50vh"
                                        name="editor"
                                        value={atob(defaultSolution)}
                                        editorProps={{ $blockScrolling: true }}
                                        readOnly={true}
                                    />
                                    <button
                                        name="copy"
                                        onClick={handleCopyClick}
                                    >
                                        Copy to Editor
                                    </button>
                                </div>
                            )}
                            {unlocked == 0 && (
                                <button
                                    name="unlock"
                                    onClick={handleUnlockClick}
                                >
                                    Unlock
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
} //Challenges
//
