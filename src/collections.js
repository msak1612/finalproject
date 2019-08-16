import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import {
    setCollections,
    addCollection,
    removeCollection,
    removeChallenge,
    draftCollectionName,
    draftCollectionDescription,
    setEditCollection
} from "./actions";

export default function Collections(props) {
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
    const editingCollection = useSelector(state =>
        state.challenges.collection.editingCollection
            ? state.challenges.collection.editingCollection
            : -1
    );
    const creator_id = useSelector(state => state.user.id);
    // const creator_id = props.creator_id ? props.creator_id : 0;
    const url = "/api/collections";
    useEffect(() => {
        axios
            .get(url, {
                params: {
                    creator_id: creator_id
                }
            })
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

    function handleEditClick(event) {
        dispatch(setEditCollection(event.target.getAttribute("collection_id")));
        dispatch(
            draftCollectionName(event.target.getAttribute("collection_name"))
        );
        dispatch(
            draftCollectionDescription(
                event.target.getAttribute("collection_description")
            )
        );
    } //closes handleEditClick

    function handleNameChange(event) {
        dispatch(draftCollectionName(event.target.value));
    } //closes handleNameChange

    function handleDescriptionChange(event) {
        dispatch(draftCollectionDescription(event.target.value));
    } //closes handleDescriptionChange

    function handleCancelClick() {
        dispatch(draftCollectionName(""));
        dispatch(draftCollectionDescription(""));
        dispatch(setEditCollection(-1));
    }

    function handleSubmitClick() {
        let collection_id = editingCollection != -1 ? editingCollection : null;

        axios
            .post(url, {
                name: draftName,
                description: draftDescription,
                collection_id: collection_id
            })
            .then(({ data }) => {
                dispatch(draftCollectionName(""));
                dispatch(draftCollectionDescription(""));
                dispatch(addCollection(data.id));
            })
            .catch(err => {
                console.log(err);
                alert("Add collection failed");
            });
    } //closes handleSubmitClick

    return (
        <div className="display-colwise">
            {editingCollection == -1 && (
                <div className="add-collection">
                    <input
                        name="name"
                        className="collection-name"
                        onChange={e => handleNameChange(e)}
                        onPaste={e => handleNameChange(e)}
                        value={draftName}
                        placeholder="Name of the collection"
                    />
                    <textarea
                        name="description"
                        className="collection-description"
                        value={draftDescription}
                        onChange={e => handleDescriptionChange(e)}
                        onPaste={e => handleDescriptionChange(e)}
                        placeholder="Describe the collection"
                    />
                    <button onClick={() => handleSubmitClick()}>Add</button>
                </div>
            )}
            {collections.map(collection => (
                <div key={collection.id} className="collections-container">
                    <div
                        className="display-colwise collection-info"
                        id="left-half"
                    >
                        {editingCollection != collection.id && (
                            <div>
                                <span>
                                    <b>{collection.name}</b>
                                </span>
                                <span>
                                    <p>
                                        <i>{collection.description}</i>
                                    </p>
                                </span>
                                {creator_id == collection.creator && (
                                    <div className="display-colwise">
                                        <button
                                            collection_id={collection.id}
                                            onClick={e => handleDeleteClick(e)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            collection_id={collection.id}
                                            collection_name={collection.name}
                                            collection_description={
                                                collection.description
                                            }
                                            onClick={e => handleEditClick(e)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {editingCollection == collection.id && (
                            <div className="add-collection">
                                <input
                                    name="name"
                                    className="collection-name"
                                    defaultValue={draftName}
                                    onChange={e => handleNameChange(e)}
                                    onPaste={e => handleNameChange(e)}
                                    placeholder="Name of the collection"
                                />
                                <textarea
                                    name="description"
                                    className="collection-description"
                                    defaultValue={draftDescription}
                                    onChange={e => handleDescriptionChange(e)}
                                    onPaste={e => handleDescriptionChange(e)}
                                    placeholder="Describe the collection"
                                />
                                <button onClick={() => handleSubmitClick()}>
                                    Save
                                </button>
                                <button onClick={() => handleCancelClick()}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {collection.challenges.length > 0 && (
                        <div className="display-colwise" id="right-half">
                            {collection.challenges.map(challenge => (
                                <div key={challenge.id}>
                                    <Link
                                        id="challenge-title"
                                        to={"/challenge/" + challenge.id}
                                    >
                                        {challenge.name}
                                    </Link>
                                    <p>{challenge.preview}</p>
                                    {creator_id == collection.creator && (
                                        <button
                                            to="/collections"
                                            challenge_id={challenge.id}
                                            collection_id={collection.id}
                                            onClick={e => handleRemoveClick(e)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <hr id="line1"></hr>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
} //Challenges
