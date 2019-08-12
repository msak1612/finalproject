import React, { useEffect } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import {
    setCollections,
    addCollection,
    removeCollection,
    removeChallenge,
    addChallenge,
    draftCollectionName,
    draftCollectionDescription
} from "./actions";

export default function Collections() {
    const dispatch = useDispatch();
    const collections = useSelector(state => state.challenges.collections);
    const draftName = useSelector(
        state => state.challenges.collection.draftName
    );
    const draftDescription = useSelector(
        state => state.challenges.collection.draftDescription
    );
    const editedCollection = useSelector(
        state => state.challenges.collection.editedCollection
    );
    const editedChallenge = useSelector(
        state => state.challenges.collection.editedChallenge
    );
    const url = "/api/collections";
    useEffect(() => {
        axios
            .get(url)
            .then(({ data }) => {
                dispatch(setCollections(data));
            })
            .catch(err => {
                console.log(err);
            });
    }, [url, editedCollection, editedChallenge]); //closes useEffect

    function handleRemoveClick(e) {
        e.preventDefault();
        let collection_id = e.target.getAttribute("collection_id");
        let challenge_id = e.target.getAttribute("challenge_id");
        axios
            .post(url, {
                challenge_id: challenge_id,
                collection_id: collection_id,
                action: "delete"
            })
            .then(({ data }) => {
                dispatch(removeChallenge(challenge_id, collection_id));
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleRemoveClick

    function handleDeleteClick(e) {
        e.preventDefault();
        let collection_id = e.target.getAttribute("collection_id");
        axios
            .post(url, {
                collection_id: collection_id,
                action: "delete"
            })
            .then(({ data }) => {
                dispatch(removeCollection(collection_id));
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleDeleteClick

    function addChallengesClick(e) {
        e.preventDefault();
        // test code to add first challenge always
        let collection_id = e.target.getAttribute("collection_id");
        axios
            .get("/api/challenges", {
                params: {
                    level: -1,
                    tag: null
                }
            })
            .then(({ data }) => {
                let challenge_id = data[0].id;
                axios
                    .post(url, {
                        collection_id: parseInt(collection_id),
                        challenge_id: challenge_id
                    })
                    .then(({ data }) => {
                        console.log(data);
                        dispatch(addChallenge(challenge_id));
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleNameChange(event) {
        dispatch(draftCollectionName(event.target.value));
    } //closes handleNameChange
    function handleDescriptionChange(event) {
        dispatch(draftCollectionDescription(event.target.value));
    } //closes handleDescriptionChange

    function handleSubmitClick() {
        axios
            .post(url, {
                name: draftName,
                description: draftDescription
            })
            .then(({ data }) => {
                dispatch(addCollection(data.id));
            })
            .catch(err => {
                console.log(err);
            });
    } //closes handleSubmitClick

    return (
        <div>
            <div>
                <input
                    name="name"
                    onChange={e => handleNameChange(e)}
                    onPaste={e => handleNameChange(e)}
                    placeholder="Name of the collection"
                />
                <input
                    name="description"
                    onChange={e => handleDescriptionChange(e)}
                    onPaste={e => handleDescriptionChange(e)}
                    placeholder="Describe the collection"
                />
                <button onClick={() => handleSubmitClick()}>Add</button>
            </div>
            {collections.map(collection => (
                <div key={collection.id}>
                    <div>{collection.name}</div>
                    <div>{collection.description}</div>
                    <Link
                        to="/collections"
                        collection_id={collection.id}
                        onClick={e => addChallengesClick(e)}
                    >
                        Add Challenges
                    </Link>
                    <Link
                        to="/collections"
                        collection_id={collection.id}
                        onClick={e => handleDeleteClick(e)}
                    >
                        Delete Collection
                    </Link>
                    {collection.challenges.map(challenge => (
                        <div key={challenge.id}>
                            <Link to={"/challenge/" + challenge.id}>
                                {challenge.name}
                            </Link>
                            <p>{challenge.preview}</p>
                            <Link
                                to="/collections"
                                challenge_id={challenge.id}
                                collection_id={collection.id}
                                onClick={e => handleRemoveClick(e)}
                            >
                                Remove From Collection
                            </Link>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
} //Challenges
