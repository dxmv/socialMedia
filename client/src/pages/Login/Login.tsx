import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../../components/AccountField/Field";
import { BsFillKeyFill } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { useLoginMutation } from "../../redux/api/userSlice";
import { setToken } from "../../utils/jwtTokenHandle";

interface LoginState {
	username: string;
	password: string;
}

interface ErrorState {
	usernameError: string;
	passwordError: string;
	formError: string;
}

export default function Login() {
	const [user, setUser] = useState<LoginState>({ username: "", password: "" });
	const [error, setError] = useState<ErrorState>({
		usernameError: "",
		passwordError: "",
		formError: "",
	});
	const [login, loginResult] = useLoginMutation();

	const setUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "") {
			return;
		}
		const res =
			/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/.exec(
				e.target.value
			);
		if (res) {
			setUser(prev => {
				return { ...prev, username: e.target.value };
			});
			setError(prev => {
				return { ...prev, usernameError: "" };
			});
		} else {
			setError(prev => {
				return {
					...prev,
					usernameError: "Incorrect username format",
				};
			});
		}
	};

	const setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "") {
			return;
		}
		const res = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.exec(e.target.value);
		if (res) {
			setUser(prev => {
				return { ...prev, password: e.target.value };
			});
			setError(prev => {
				return { ...prev, passwordError: "" };
			});
		} else {
			setError(prev => {
				return {
					...prev,
					passwordError:
						"Password must be at least 8 characters long, contain at least one letter and number  ",
				};
			});
		}
	};

	const handleSubmit = async () => {
		if (error.usernameError !== "" || error.passwordError !== "") {
			return;
		}
		await login(user);
		if (loginResult.isError) {
			setError(prev => {
				const err: any = loginResult.error;
				return {
					...prev,
					formError: err.data.message,
				};
			});
			return;
		}
		if (loginResult.isUninitialized) {
			setError(prev => {
				return {
					...prev,
					formError: "There was an error, please try again",
				};
			});
			return;
		}
		if (loginResult.data) {
			setToken(loginResult.data.token);
		}
	};

	return (
		<div className="w-screen h-screen overflow-hidden flex justify-center items-center">
			<div className="flex flex-col items-center w-1/5 p-6 shadow-lg rounded-lg border-2  border-lighterOrange m-12">
				<h1 className="mb-1 font-bold text-3xl">LOGO</h1>
				<p className="mb-6" style={{ color: "red" }}>
					{error.formError}
				</p>
				<Field
					type="text"
					icon={<AiOutlineUser className="absolute top-2 left-2" size={32} />}
					placeholder="Username ..."
					error={error.usernameError}
					value={user.username}
					setValue={setUsername}
				/>
				<Field
					type="password"
					icon={<BsFillKeyFill className="absolute top-2 left-2" size={32} />}
					placeholder="Password ..."
					error={error.passwordError}
					value={user.password}
					setValue={setPassword}
				/>
				<button
					className="mb-6 bg-darkerOrange w-1/4 p-3 font-bold text-white rounded-lg text-lg"
					onClick={handleSubmit}
				>
					Login
				</button>
				<p className="text-md">
					Don't have an account?{" "}
					<Link to="/register" className="text-darkerOrange">
						Sign up here
					</Link>
				</p>
				<Link to="/register" className="text-darkerOrange text-sm mt-6">
					Forgot password?
				</Link>
			</div>
		</div>
	);
}
