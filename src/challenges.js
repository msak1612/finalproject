import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";

import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import {
    setCollections,
    setChallenges,
    setClassifiers,
    setLevel,
    setTag,
    addChallenge,
    addToCollection
} from "./actions";
import { Challenge } from "./challenge";

export default function Challenges(props) {
    const dispatch = useDispatch();
    const collections = useSelector(state => state.challenges.collections);
    const creator_id = useSelector(state => (state.user ? state.user.id : -1));
    const challenges = useSelector(state => state.challenges.challenges);
    const level = useSelector(state => state.challenges.level);
    const tag = useSelector(state => state.challenges.tag);
    const tags = useSelector(state => state.challenges.classifiers.tags);
    const levels = useSelector(state => state.challenges.classifiers.levels);
    const editedChallenge = useSelector(
        state => state.challenges.collection.editedChallenge
    );
    const editedCollection = useSelector(
        state => state.challenges.collection.editedCollection
    );
    const solved = props.solved ? props.solved : false;
    useEffect(() => {
        axios
            .get("/api/challenges", {
                params: {
                    level: level,
                    tag: tag,
                    solved: solved
                }
            })
            .then(({ data }) => {
                dispatch(setChallenges(data));
            })
            .catch(err => {
                console.log(err);
            });
        axios
            .get("/api/challenges/classifiers")
            .then(({ data }) => {
                dispatch(setClassifiers(data));
            })
            .catch(err => {
                console.log(err);
            });
        axios
            .get("/api/collections", {
                params: {
                    creator_id: creator_id
                }
            })
            .then(({ data }) => {
                console.log(data);
                dispatch(setCollections(data));
            })
            .catch(err => {
                console.log(err);
            });
    }, [level, tag]); //closes useEffect

    function Level(props) {
        let level;
        if (props.level == 0) {
            level = "EASY";
        } else if (props.level == 1) {
            level = "MEDIUM";
        } else if (props.level < 0) {
            level = "ALL";
        } else {
            level = "HARD";
        }

        return (
            <Link
                to="/challenges"
                level={props.level}
                className="classifiers"
                onClick={e => handleLevelClick(e)}
            >
                {level}
            </Link>
        );
    } //closes Level

    function handleTagClick(e) {
        e.preventDefault();
        dispatch(setTag(e.target.getAttribute("tag")));
    } //closes handleTagClick

    function handleLevelClick(e) {
        e.preventDefault();
        dispatch(setLevel(e.target.getAttribute("level")));
    } //closes handleLevelClick

    function showCollectionModal(e) {
        dispatch(addChallenge(e.target.getAttribute("collection_id")));
    } //closes handleLevelClick

    function hideCollectionModal(e) {
        dispatch(addChallenge(-1));
    } //closes handleLevelClick

    function addToCollectionClick() {
        console.log(editedCollection);
        console.log(editedChallenge);

        axios
            .post("/api/collections", {
                collection_id: editedCollection,
                challenge_id: editedChallenge
            })
            .then(({ data }) => {
                console.log(data);
                dispatch(addChallenge(-1));
            })
            .catch(err => {
                console.log(err);
            });
    }

    function ChallengeClassifiers() {
        return (
            <div className="display-colwise" id="left-half">
                <h3>Levels</h3>
                <Level level={-1} />
                {levels.length > 0 &&
                    levels.map(mlevel => (
                        <Level
                            className="classifiers"
                            level={mlevel}
                            key={mlevel}
                        />
                    ))}
                <br></br>
                <h3>Tags</h3>
                <Link
                    to="/challenges"
                    className="classifiers"
                    onClick={e => handleTagClick(e)}
                >
                    ALL
                </Link>
                {tags.length > 0 &&
                    tags.map(mtag => (
                        <Link
                            to="/challenges"
                            className="classifiers"
                            tag={mtag}
                            onClick={e => handleTagClick(e)}
                            key={mtag}
                        >
                            {mtag}
                        </Link>
                    ))}
            </div>
        );
    }

    function handleOptionChange(e) {
        dispatch(addToCollection(editedChallenge, e.target.value));
    }

    function Modal(props) {
        return (
            <div>
                <button
                    id="add-to-collection"
                    collection_id={props.challenge_id}
                    onClick={showCollectionModal}
                >
                    Add to Collection
                </button>
                <Popup
                    open={editedChallenge != -1}
                    closeOnDocumentClick
                    onClose={hideCollectionModal}
                >
                    <div className="display-colwise" id="collection-modal">
                        <form>
                            {collections.map(collection => (
                                <div key={collection.id}>
                                    <label id="challenge-title">
                                        <input
                                            type="radio"
                                            value={collection.id}
                                            checked={
                                                editedCollection ==
                                                collection.id
                                            }
                                            onChange={handleOptionChange}
                                        />
                                        &nbsp;
                                        {collection.name}
                                    </label>
                                </div>
                            ))}
                        </form>
                        <div
                            className="display-rowwise"
                            style={{ justifyContent: "flex-end" }}
                        >
                            <button onClick={addToCollectionClick}>Add</button>
                            <button onClick={hideCollectionModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }

    return (
        <section className="challenges-container">
            {!solved && <ChallengeClassifiers />}
            {challenges.length > 0 && (
                <div className="display-colwise" id="right-half">
                    {challenges.map(challenge => (
                        <div key={challenge.id}>
                            <div id="challenge-header">
                                <Link
                                    id="challenge-title"
                                    to={"/challenge/" + challenge.id}
                                >
                                    {challenge.name}
                                </Link>
                                {collections.length > 0 && (
                                    <Modal challenge_id={challenge.id} />
                                )}
                            </div>
                            <p>{challenge.preview}</p>
                            <hr id="line1"></hr>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
} //Closes Challenges
