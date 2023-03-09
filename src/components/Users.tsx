import { useEffect, useRef, useState } from "react";

const baseUrl = "https://ulrichsocialapi.onrender.com/users";
const authUrl = "https://ulrichsocialapi.onrender.com/auth/login";

export default function Users() {
    const hasMounted = useRef(false);

    const [users, setUsers] = useState<any>([]);
    const [error, setError] = useState(0);

    const setCookie = (value: string) => {
        localStorage.setItem("acess_token", value);
        console.log("im at auth");
        console.log(`${value} was set sucessfully`);
    };

    const getAuth = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "admin",
                password: "@ulrichsocial#adminpassword",
            }),
        };
        fetch(authUrl, requestOptions).then(async (response) => {
            if (response.ok) {
                const token = await response.json();
                setCookie(token.acess_token);
            }
        });
    };

    useEffect(() => {
        if (hasMounted.current) return;

        const acess_token = localStorage.getItem("acess_token");
        if (acess_token) {
            fetch(baseUrl, {
                headers: { Authorization: `Bearer ${acess_token}` },
            })
                .then(async (response) => {
                    if (response.ok) {
                        setUsers(await response.json());
                    }
                    throw response;
                })
                .catch((error) => {
                    if (error.status == 401) {
                        setError(401);
                        getAuth();
                    }
                });
        } else {
            getAuth();
        }

        console.log("DEBUG - The user was mounted");
        hasMounted.current = true;
    }, []);

    if (!users)
        return (
            <div>
                <h1>User not found - Error {error}</h1>
            </div>
        );

    return (
        <div>
            {users.map((u: any) => (
                <ul>
                    <li key={u.id}>{u.username}</li>
                    <li key={u.id}>{u.email}</li>
                </ul>
            ))}
        </div>
    );
}
