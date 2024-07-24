import { useState } from "react";
import { useForm } from "react-hook-form";
import { Grid, Paper, Stack, TextField, Button } from "@mui/material";
import { DevTool } from "@hookform/devtools";
import { UserAPI } from "../../apis/UserAPI.js";
import useAuth from "../../hooks/useAuth.js";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function Login() {
	const { setAuth } = useAuth();
	const [error, setError] = useState(null);

	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();

	const loginHandler = ({ username, password }) => {
		setError(null);
		UserAPI.login(username, password).then(
			(user) => {
				setAuth(user);
				navigate("/laboratory");
			},
			(error) => setError(error)
		);
	};

	return (
		<Grid
			container
			width="100vw"
			height="100vh"
			alignItems="center"
			justifyContent="center"
		>
			<Grid
				item
				width="25rem"
				height="25rem"
				component="form"
				onSubmit={handleSubmit(loginHandler)}
			>
				<Stack component={Paper} spacing="2rem" sx={{ padding: "2rem" }}>
					<Typography variant="h5">Login</Typography>
					<Typography variant="subtitle2" color="error">
						{error ? error.message : null}
					</Typography>
					<TextField
						label="username"
						{...register("username", { required: true })}
						error={!!errors.username}
						fullWidth
					/>
					<TextField
						label="password"
						type="password"
						{...register("password", { required: true })}
						error={!!errors.password}
						fullWidth
					/>
					<Button variant="contained" type="submit">
						Login
					</Button>
				</Stack>
			</Grid>
			<DevTool control={control} />
		</Grid>
	);
}

export default Login;
