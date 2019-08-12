import React, { useEffect } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import axios from "./axios";

import { useDispatch, useSelector } from "react-redux";
import { setCompletedSolutions } from "./actions";

export function Solutions(props) {
    const dispatch = useDispatch();
    const solutions = useSelector(state => state.challenges.solutions);
    const user_id = props.user_id ? props.user_id : -1;
    const challenge_id = props.challenge_id ? props.challenge_id : -1;

    useEffect(() => {
        axios
            .get("/api/solutions", {
                params: {
                    creator_id: user_id,
                    challenge_id: challenge_id
                }
            })
            .then(({ data }) => {
                data.forEach(
                    solution => (solution.solution = atob(solution.solution))
                );
                dispatch(setCompletedSolutions(data));
            })
            .catch(err => {
                console.log(err);
            });
    }, [user_id, challenge_id]); //closes useEffect

    return (
        <div>
            {solutions.length > 0 &&
                solutions.map(solution => (
                    <div key={solution.solution}>{solution.solution}</div>
                ))}
        </div>
    );
} //Challenges
