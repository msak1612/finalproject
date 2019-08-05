import React, { useState, useEffect } from "react";
import axios from "./axios";

import { UserList } from "./user";

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

    let input = (
        <input
            onChange={e => setVal(e.target.value)}
            defaultValue={val}
            style={{ width: "30vw" }}
            autoFocus
        />
    );
    return (
        <section className="display-colwise">
            <div style={{ textAlign: "center" }}>
                <h4>Are you looking for someone in particular?</h4>
                {input}
            </div>
            <UserList
                list={users}
                title={val ? null : "Checkout who just joined!"}
            />
        </section>
    );
} //closes FindPeople

export default FindPeople;
