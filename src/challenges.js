import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import { setChallenges, setClassifiers, setLevel, setTag } from "./actions";
import { Challenge } from "./challenge";

export default function Challenges() {
    const dispatch = useDispatch();
    const challenges = useSelector(state => state.challenges.challenges);
    const level = useSelector(state => state.challenges.level);
    const tag = useSelector(state => state.challenges.tag);
    const tags = useSelector(state => state.challenges.classifiers.tags);
    const levels = useSelector(state => state.challenges.classifiers.levels);

    useEffect(() => {
        axios
            .get("/api/challenges", {
                params: {
                    level: level,
                    tag: tag
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

    return (
        <section className="challenges-container">
            <div className="display-colwise" id="left-half">
                <h3>Levels</h3>

                <Level level={-1} />

                {levels.length > 0 &&
                    levels.map(mlevel => <Level level={mlevel} key={mlevel} />)}
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
            <div className="display-colwise" id="right-half">
                {challenges.map(challenge => (
                    <div key={challenge.id}>
                        <Link
                            id="challenge-name"
                            to={"/challenge/" + challenge.id}
                        >
                            {challenge.name}
                        </Link>
                        <p>{challenge.preview}</p>
                        <hr id="line1"></hr>
                    </div>
                ))}
            </div>
        </section>
    );
} //Closes Challenges
