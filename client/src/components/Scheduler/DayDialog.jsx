import { Chip, Dialog, DialogContent, DialogTitle, Divider, Typography, Grid, Box, CircularProgress, IconButton } from "@mui/material";

import dayjs from "dayjs";
import { ScheduleAPI } from "../../apis/ScheduleAPI.js";
import { useEffect, useRef, useState } from "react";
import DeviceThermostatRoundedIcon from "@mui/icons-material/DeviceThermostatRounded.js";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded.js";
import CloseIcon from '@mui/icons-material/Close';
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { BoxController } from "../BoxController";
import { UserAPI } from "../../apis/UserAPI.js";
import { useSnackbar } from "notistack";

const TYPE_COLOR = {
	'daily': "primary",
	'weekly': 'primary',
	'monthly': 'warning',
	'quarterly': 'secondary',
	'semiannually': "secondary",
	'annually': "secondary",
};

const TYPE_ICON = {
	'thermometer': <DeviceThermostatRoundedIcon />,
	'surface': <TableRestaurantRoundedIcon />,
	'equipment': <BiotechRoundedIcon />,
};

export const DayDialog = ({ open, onClose, day, info }) => {
	const today = dayjs().startOf('day');
	const [error, setError] = useState(null);
	const [staff, setStaff] = useState([]);
	const [items, setItems] = useState([]);
	const [selectedCount, setSelectedCount] = useState(0);
	const [toggleReload, setToggleReload] = useState(false);
	const reload = () => setToggleReload(!toggleReload);
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();


	useEffect(() => {
		if (!day) return;
		const fetchData = async () => {
			try {
				let alreadyAssignedItems = [];
				const schMaps = await ScheduleAPI.getMaps(
					day.date.format('YYYY-MM-DD'),
					day.date.add(1, 'day').format('YYYY-MM-DD'),
					false,
					'user_id'
				);

				const staff = await UserAPI.getAll(undefined,undefined, true, day.date.format('YYYY-MM-DD'));
				const deserializedStaff = staff.map((staff) => {

					const items = schMaps[staff._id]?.map(item => {
						return {
							sch_map_id: item._id,
							...item.sch,
						}
					}) || [];
					alreadyAssignedItems.push(...items)
					return {
						_id: staff._id,
						username: staff.username,
						name: staff.name,
						active: staff.active,
						isAbsent: staff.isAbsent,
						items
					}
				}).filter((staff) => staff.active);
				setStaff(deserializedStaff)
				const notAssignedItems = day.schedules.map((sch) => {
					return {
						_id: sch._id,
						name: info[sch.type][sch.id].name,
						recurrence: sch.recurrence

					}
				}).filter(item => {
					const allreadyAssigned = alreadyAssignedItems.find(alItem => alItem._id === item._id)
					return allreadyAssigned ? false : true
				})
				setItems(notAssignedItems);


			} catch (error) {
				setError(error.message);
				console.error(error);
			}

		}
		fetchData();

	}, [day, info, toggleReload]);

	useEffect(() => {
		if (!error) return;
		console.log(error);
		enqueueSnackbar('Something went wrong', { variant: 'error' });
	}, [error])

	const assignTasks = async (user) => {
		setLoading(true);

		ScheduleAPI.createMap(
			day.date.format('YYYY-MM-DD'),
			user._id,
			items.filter(i => i.selected).map(i => i._id)
		).then(
			res => {
				if (res.errors) {
					res.errors.map(err => enqueueSnackbar(err.message, { variant: 'error' }))
				}
				reload()
			},
			err => {
				setError(err);
				setLoading(false);
			}
		).finally(() => {
			setLoading(false);
		})
	}

	const removeTask = async (sch_map_id) => {
		setLoading(true);
		ScheduleAPI.destroyMap(sch_map_id)
			.then(
				_ => reload(),
				err => {
					setError(err);
					setLoading(false);
				}
			).finally(() => setLoading(false));
	}

	return (
		<Dialog open={open} fullWidth maxWidth='md' onClose={onClose}>
			<IconButton onClick={onClose} className="absolute right-4 top-4">
				<CloseIcon className="w-7 h-7" />
			</IconButton>
			{loading ?
				<DialogTitle>
					<CircularProgress
					/>
				</DialogTitle> :

				<DialogTitle component={Box}>
					{day?.date.isSame(today)
						? <Typography
							variant='h4' fontWeight='900'
							color='white' bgcolor='green'
							px='0.7rem' width='fit-content'
							borderRadius='50px'
						>
							{day?.date.format('D')}
						</Typography>
						: <Typography
							variant='h4' fontWeight='900'
							px='0.7rem' width='fit-content'
						>
							{day?.date.format('D')}
						</Typography>
					}
				</DialogTitle>
			}

			<Divider />

			<DialogContent >
				<Box height='30rem'>
					<Grid container justifyContent='space-between' alignItems='start'>
						<Grid item xs={5.5} mb='1rem'>
							<Typography variant='h6'>Assignments</Typography>
							<Divider />
						</Grid>
						<Grid item xs={5.5} mb='1rem'>
							<Typography variant='h6'>Items</Typography>
							<Divider />
						</Grid>
						<Grid item xs={5.5} container>
							{staff.map(user => (
								<Grid
									item
									key={user._id}
									xs={12}
									sx={{
										minHeight: '5rem',
										marginLeft: '1rem',
										backgroundColor: 'white',
										'&:hover': selectedCount ? {
											borderRadius: '5px',
											filter: 'brightness(70%)'
										} : null,
										'&:hover .add-task-icon': selectedCount ? {
											display: 'block'
										} : null
									}}
									onClick={() => {
										if (!selectedCount) return;
										if (user.isAbsent) {
											enqueueSnackbar(`${user.username} is absent today`, { variant: 'error' });
											return;
										}
										setSelectedCount(0);
										assignTasks(user);
									}}
								>
									<AddRoundedIcon
										key={user._id}
										className='add-task-icon'
										sx={{
											position: 'absolute',
											left: '14rem',
											top: '1.5rem',
											display: 'none',
										}}
										fontSize='large'
									/>
									<Typography
										className={`${user.isAbsent && 'text-red-600'}`}
									>
										{user.username}</Typography>
									<Divider />
									<Grid container>
										{user?.items?.map(item => (

											info[item.type] ? (
												<Grid item key={item._id}>
													<BoxController
														componentProps={{
															deleteIcon: TYPE_ICON[item.type]
														}}
														onHoverProps={{
															deleteIcon: <HighlightOffRoundedIcon />
														}}
														renderComponent={(props) => (
															<Chip
																{...props}
																onDelete={() => removeTask(item.sch_map_id)}
																label={(() => {
																	let name = '';

																	name += info[item.type][item.id].name || 'DELETED'
																	switch (item.recurrence) {
																		case 'daily': name += ' [D]';
																			break;
																		case 'weekly': name += ' [W]';
																			break;
																		case 'quarterly': name += ' [Q]';
																			break;
																		case 'semiannual': name += ' [S]';
																			break;
																		case 'annually': name += ' [A]';
																			break;
																	}
																	return name;
																})()}
																color={item ? TYPE_COLOR[item.recurrence] : 'error'}

																style={{
																	userSelect: 'none'
																}}
																sx={{
																	'&:hover': {
																		cursor: 'pointer',
																		boxShadow: '-2px 2px 5px gray'
																	},
																	'&:active': {
																		cursor: 'pointer',
																		boxShadow: '-5px 5px 10px gray',
																	}
																}}
															/>

														)}
													/>
												</Grid>
											) : null


										))}
									</Grid>
								</Grid>
							))}
						</Grid>
						<Grid item xs={5.5} container spacing='5px'>
							{items?.map(item => (

								<Grid item key={item._id}>
									<Chip
										componentProps={{
											deleteIcon: TYPE_ICON[item.type]
										}}
										deleteIcon={TYPE_ICON[item.type]}
										onDelete={() => { }}
										label={(() => {
											let name = '';
											name += item.name || 'DELETED'
											switch (item.recurrence) {
												case 'daily': name += ' [D]';
													break;
												case 'weekly': name += ' [W]';
													break;
												case 'quarterly': name += ' [Q]';
													break;
												case 'semiannual': name += ' [S]';
													break;
												case 'annually': name += ' [A]';
													break;
											}
											return name;
										})()}
										color={item ? TYPE_COLOR[item.recurrence] : 'error'}
										onClick={() => {
											setItems(
												items.map(i => {
													if (i._id === item._id) {
														if (i.selected) setSelectedCount(selectedCount - 1)
														else setSelectedCount(selectedCount + 1)
														return {
															...i,
															selected: !i.selected
														}
													} else
														return i;
												})
											)
										}}
										sx={{
											userSelect: 'none',
											boxShadow: item.selected ? '-5px 5px 10px gray' : 'none',
											'&:hover': {
												cursor: 'pointer',
												// boxShadow: item.selected ? '-5px 5px 10px gray' : '-2px 2px 5px gray',
											},
											'&:active': {
												cursor: 'pointer',
												boxShadow: item.selected ? '-5px 5px 10px gray' : '-5px 5px 10px gray',
											}
										}}
									/>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
		</Dialog>
	)
}