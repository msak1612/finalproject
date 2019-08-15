import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "./axios";
import { setScoreboard } from "./actions";

export default function Scoreboard() {
    const dispatch = useDispatch();
    const scoreboard = useSelector(state => state.scoreboard);

    useEffect(() => {
        axios
            .get("/api/users", {
                params: {
                    score: true
                }
            })
            .then(({ data }) => {
                console.log(data);
                dispatch(setScoreboard(data));
            })
            .catch(err => {
                console.log(err);
            });
    }, [true]);

    const columns = [
        {
            Header: "Name",
            accessor: "first_name"
        },
        {
            Header: "Score",
            accessor: "score",
            Cell: props => <span className="number">{props.value}</span>
        }
    ];

    return (
        <div>
            <table id="scoretable">
                <th>RANK</th>
                <th>USER</th>
                <th>SCORE</th>
                <tbody>
                    {scoreboard.map((user, index) => {
                        return (
                            <tr key={user.id}>
                                <td>{user.rank}</td>
                                <td>
                                    <img
                                        id="score-pic"
                                        src={
                                            user.profile_pic
                                                ? user.profile_pic
                                                : "/images/default.png"
                                        }
                                    />
                                    <span id="scorer">
                                        {user.first_name}&nbsp;{user.last_name}
                                    </span>
                                </td>
                                <td>{user.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
