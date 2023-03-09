// interface userProps {
//     username: string;
//     email: string;
// }

export default function User({ user }: any) {
    return (
        <div>
            <p>{user.id}</p>
            <p>{user.username}</p>
        </div>
    );
}
