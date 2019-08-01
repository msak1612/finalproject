import React, { useState, useEffect } from "react";
import axios from "./axios";

function FindPeople() {
    const [users, setUsers] = useState("");
    const [val, setVal] = useState("");

    useEffect(() => {
        let ignore;
        (async () => {
            const { data } = await axios.get("/api/users", {
                params: {
                    search: val
                }
            });
            if (!ignore) {
                setUsers(data);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [val]); //closes useEffect

    return (
        <section style={{ display: "flex", flexDirection: "column" }}>
            <h2>Find People</h2>
            {val && (
                <input
                    onChange={e => setVal(e.target.value)}
                    defaultValue={val}
                    style={{ width: "40vw", marginBottom: "5vh" }}
                    autoFocus
                />
            )}
            {!val && (
                <div>
                    <h4>Checkout who just joined!</h4>
                </div>
            )}
            {users &&
                users.map(user => (
                    <div key={user.id}>
                        <img
                            src={user.profile_pic}
                            style={{
                                width: "10vh",
                                height: "10vh",
                                margin: "0px 5px 5px",
                                verticalAlign: "middle"
                            }}
                        />
                        <span>
                            <a href={"/user/" + user.id}>
                                {user.first_name} {user.last_name}
                            </a>
                        </span>
                    </div>
                ))}
            {!val && (
                <div>
                    <h4>Are you looking for someone in particular?</h4>
                    <input
                        onChange={e => setVal(e.target.value)}
                        style={{ width: "40vw", marginBottom: "5vh" }}
                        autoFocus
                    />
                </div>
            )}
        </section>
    );
} //closes FindPeople

export default FindPeople;
