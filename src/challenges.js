import React, { useEffect } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import { setChallenges, setLevel, setTag } from "./actions";
import { Challenge } from "./challenge";

export default function Challenges() {
    const dispatch = useDispatch();
    const challenges = useSelector(state => state.challenges.challenges);
    const level = useSelector(state => state.challenges.level);
    const tag = useSelector(state => state.challenges.tag);
    useEffect(() => {
        console.log(level);
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
    }, [level, tag]); //closes useEffect

    function Level(props) {
        let level;
        if (props.level == 0) {
            level = "EASY";
        } else if (props.level == 1) {
            level = "MEDIUM";
        } else {
            level = "HARD";
        }

        return (
            <Link
                to="/challenges"
                level={props.level}
                onClick={e => handleLevelClick(e)}
            >
                {level}
            </Link>
        );
    }

    function handleTagClick(e) {
        e.preventDefault();
        dispatch(setTag(e.target.getAttribute("tag")));
    } //closes handleTagClick

    function handleLevelClick(e) {
        e.preventDefault();
        dispatch(setLevel(e.target.getAttribute("level")));
    } //closes handleLevelClick

    return (
        <div>
            {challenges.map(challenge => (
                <div key={challenge.id}>
                    <Link to={"/challenge/" + challenge.id}>
                        {challenge.name}
                    </Link>
                    <p>{challenge.preview}</p>
                    <Level level={challenge.level} />
                    {challenge.tags.map(tag => (
                        <div key={tag} className="display-rowwise">
                            <Link
                                to="/challenges"
                                tag={tag}
                                onClick={e => handleTagClick(e)}
                            >
                                {tag}
                            </Link>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
} //Challenges
