import { Button, Divider, Grid, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { RHFAutocomplete } from "../RHFAutocomplete/index.jsx";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import EastIcon from '@mui/icons-material/East';
import { UserAPI } from "../../apis/UserAPI.js";
import { EquAPI } from "../../apis/EquAPI.js";
import { SurfAPI } from "../../apis/SurfAPI.js";
import { ThermAPI } from "../../apis/ThermAPI.js";
import { RHFToggleButtonGroup } from "../RHFToggleButtonGroup/index.jsx";
import { LogTmpAPI } from "../../apis/LogTmpAPI.js";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const LOG_TYPE = [
	'Daily',
	'Monthly',
	'Quarterly',
	'Semiannually',
	'Annually'
]

export const ShMenu = ({ date, item, onSubmit, onClose }) => {
	const [error, setError] = useState(null);
	const [type, setType] = useState('user')
	const [options, setOptions] = useState([]);
	const [logs, setLogs] = useState([]);

	const [disabled, setDisabled] = useState(false);

	console.log({
		item
	});
	const defaultValues = item ? {
		type: item.type,
		recurrence: item.recurrence,
		initial_date: dayjs(item.initial_date),
		end_date: item.end_date && dayjs(item.end_date)
	} : {
		recurrence: 'weekly',
		initial_date: date,
		end_date: date?.endOf('month'),
	}

	const {
		control,
		handleSubmit,
		watch,
		setValue
	} = useForm({ defaultValues });

	useEffect(() => {
		const subscription = watch((value, {name, type}) => {
			if (name === 'recurrence' && type === 'change') {
				switch (value.recurrence) {
					case 'none':
						setValue('end_date', watch('initial_date'));
						break;
					case 'weekly':
						setValue('end_date', date.endOf('month'))
						break;
					case 'monthly':
						setValue('end_date', date.endOf('year'))
						break;
					default:
						setValue('end_date', date.startOf('year').add(5, 'year'))
				}
				return;
			}

			if (name === 'equipment' && type === 'change') {
				setValue('item', null)
				if (!value.equipment) return;
				setDisabled(true)
				LogTmpAPI.getAll(value.equipment._id).then(
					logs => {
						setLogs(logs);
						setDisabled(false);
					},
					err => setError(err)
				)
				return;
			}
			if (name !== 'type' || type !== 'change') return;
			setDisabled(true);
			setValue('item', null);
			let api = null;
			switch (value.type) {
				case 'user':
					api = UserAPI; break;
				case 'equipment':
					api = EquAPI;
					setValue('equipment', null);
					break;
				case 'surface':
					api = SurfAPI; break;
				case 'thermometer':
					api = ThermAPI;
			}
			api.getAll().then(
				items => {
					setOptions(items)
					setDisabled(false)
				},
				err => setError(err)
			)
		});

		return () => subscription.unsubscribe();
	}, [watch]);


	return (
		<Grid
			container
			direction='column'
			width='fit-content'
			component={'form'}
			marginTop='1rem'
			spacing='1rem'
			mx='1rem'
			onSubmit={handleSubmit(onSubmit)}
		>
			{!item
			&& <><Grid item>
					<RHFAutocomplete
						label={'Type'}
						control={control}
						rules={{ required: true }}
						options={['user', 'equipment', 'surface', 'thermometer']}
						name={'type'}
						autocompleteProps={{
							getOptionLabel: op => capWord(op),
							disabled,
						}}
					/>
				</Grid>
				<Grid item container>
					<Grid item xs={watch('type') === 'equipment'? 8 : 12}>
						<RHFAutocomplete
							label={capWord(watch('type'))}
							control={control}
							rules={{ required: true }}
							name={watch('type') === 'equipment' ? 'equipment':'item'}
							options={options}
							autocompleteProps={{
								getOptionLabel: op => op.name || op.username,
								isOptionEqualToValue: (op, val) => op._id === val._id,
								disabled
							}}
						/>
					</Grid>
					{watch('type') === 'equipment' &&
						<Grid item xs={4}>
							<RHFAutocomplete
								label={'Log'}
								control={control}
								rules={{ required: true }}
								name={'item'}
								options={logs}
								autocompleteProps={{
									getOptionLabel: op => LOG_TYPE[op.type],
									isOptionEqualToValue: (op, val) => op._id === val._id,
									disabled: disabled || !Boolean(watch('equipment'))
								}}
							/>
						</Grid>
					}
				</Grid></>
			}
			<Grid item container>
				<Grid item xs={5.5}>
					<Controller
						name='initial_date'
						control={control}
						disabled={disabled}
						rules={{ required: true }}
						render={({ field, fieldState: { error }}) => (
							<DatePicker
								format='YYYY/MM/DD'
								label='Start'
								{...field}
								minDate={dayjs()}
								onChange={(val, _) => field.onChange(val)}
								slotProps={{
									textField: {
										error: Boolean(error)
									}
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={1} alignSelf='center' sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<EastIcon sx={{ color: 'gray'}} />
				</Grid>
				<Grid item xs={5.5}>
					<Controller
						name='end_date'
						control={control}
						disabled={disabled || watch('recurrence') === 'none'}
						// rules={{ required: watch('recurrence') !== 'none' }}
						render={({ field, fieldState: { error }}) => (
							<DatePicker
								format='YYYY/MM/DD'
								label='End'
								{...field}
								minDate={watch('initial_date')}
								onChange={(val, _) => field.onChange(val)}
								slotProps={{
									textField: {
										error: Boolean(error),
									}
								}}
							/>
						)}
					/>
				</Grid>
			</Grid>
			<Grid item mb='1rem'>
				<RHFToggleButtonGroup
					name={'recurrence'}
					control={control}
					rules={{ required: true }}
					toggleButtonGroupProps={{
						disabled,
						exclusive: true,
						required: true
					}}
				>
					<ToggleButton value={'none'}>Once</ToggleButton>
					<ToggleButton value={'weekly'} color='primary'>Weekly</ToggleButton>
					<ToggleButton value={'monthly'} color='secondary'>Monthly</ToggleButton>
					<ToggleButton value={'quarterly'} color='warning'>Quarterly</ToggleButton>
					<ToggleButton value={'semiannually'} color='warning'>Semiannually</ToggleButton>
					<ToggleButton value={'annually'} color='warning'>Annually</ToggleButton>
				</RHFToggleButtonGroup>
			</Grid>
			<Divider />
			<Grid container item direction='row-reverse' spacing='1rem'>
				<Grid item mb='1rem'>
					<Button variant='outlined' color='success' type='submit'>save</Button>
				</Grid>
				<Grid item mb='1rem'>
					<Button variant='outlined' color='error' onClick={onClose}>cancel</Button>
				</Grid>
			</Grid>
		</Grid>
	)
}

function capWord(str) {
	if (!str) return str;
	return str.charAt(0).toUpperCase()
		+ str.slice(1);
}