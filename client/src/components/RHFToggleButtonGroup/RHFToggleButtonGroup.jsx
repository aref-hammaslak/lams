import { Controller } from "react-hook-form";
import { ToggleButtonGroup } from "@mui/material";

export const RHFToggleButtonGroup = ({ control, name, children, rules, toggleButtonGroupProps }) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error }}) => (
				<ToggleButtonGroup
					{...field}

					onChange={(_, val) => val && field.onChange(val)}
					{...toggleButtonGroupProps}
				>
					{children}
				</ToggleButtonGroup>
			)}
		/>
	)
}