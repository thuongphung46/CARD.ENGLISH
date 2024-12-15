import { FC } from 'react';
import { Link } from 'react-router-dom';

export const ErrorPage: FC = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column"
        }}>
            <h1>404 - Not Found!</h1>
            <Link to={"/home"}>Quay về trang chủ</Link>
        </div>
    );
};
