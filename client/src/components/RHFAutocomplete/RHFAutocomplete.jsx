import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

// eslint-disable-next-line react/prop-types
export const RHFAutocomplete = ({ control, name, label, options, rules, autocompleteProps }) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => {
				const { onChange, value: category, ref } = field;
				return (
					<Autocomplete
						value={category || null}
						onChange={(_e, newValue) => {
							console.log({
								newValue
							})
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label={label}
								error={!!error}
								helperText={error ? `(${error.type})${error.message ? `: ${error.message}` : ""}` : ""}
								inputRef={ref}
							/>
						)}
						options={options}
						{...autocompleteProps}
					/>
				);
			}}
		/>
	);
};