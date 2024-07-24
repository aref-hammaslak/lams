import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, Grid, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import dayjs from "dayjs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import MultipleStopIcon from '@mui/icons-material/MultipleStop';

const TYPE_COLOR = {
	'weekly': 'primary',
	'monthly': 'secondary'
};

const CCell = ({ day, mute, items, handleAdd, today, openMenu }) => {

	return (
		<Grid
			item
			// flexGrow={1}
			xs={1}
			sx={{
				color: mute? 'gray' : 'black',
				marginTop: '.1rem', marginRight: '.1rem',
			}}
			onClick={() => handleAdd(day)}
		>
			<Stack direction='column' component={Paper} height='100%'>
				<Typography>{
					today.getTime() !== day.getTime()
					? day.getDate()
					: <Chip size='small' variant='outlined' color='success' clickable label={day.getDate()} />
				}</Typography>
				<Box
					height='5.5rem'
					sx={{
						overflowY: 'auto'
					}}
				>
					{items.map(item => (
						<Chip
							avatar={item.pfp ? <Avatar /> : null}
							key={item._id}
							label={item.name}
							color={TYPE_COLOR[item.recurrence]}
							// deleteIcon={<CloseIcon />}
							size='small'
							onClick={e => openMenu(e, item)}
							sx={{ margin: '2px'}}
						/>
					))}
				</Box>
			</Stack>
		</Grid>
	)
}

function generateDays(date) {
	const days = [];
	const d = dayjs(date).startOf('month').toDate();
	const backCount = d.getDay() + 1;
	d.setDate(d.getDate() - backCount);
	for (let i = 0; i < 42; i++) {
		d.setDate(d.getDate() + 1);
		days.push(new Date(d));
	}
	return days;
}

export const Calendar = ({ date, setDate, schedules, handleAdd, handleDelete, setItemToEdit, ...params}) => {
	const [today, setToday] = useState(dayjs().startOf('day').toDate());
	const [days, setDays] = useState(() => generateDays(date));

	useEffect(() => {
		setDays(generateDays(date));
	}, [date]);


	const prevMonth = () => {
		setDate(dayjs(date).subtract(1, 'month').toDate())
	}
	const nextMonth = () => {
		setDate(dayjs(date).add(1, 'month').toDate())
	}

	const [anchorEl, setAnchorEl] = useState(null);
	const closeMenu = () => {
		setAnchorEl(null);
		setItemToEdit(null);
	};
	const openMenu = (e, item) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
		setItemToEdit(item);
	}

	return (
		<>
			<Grid
				container
				direction='column'
				width='inherit'
				height='100%'
				padding='1rem'
				rowSpacing='1rem'
				component={Paper}
				bgcolor='lightgray'
				alignItems='center'
				justifyContent='center'
				{...params}
			>
				<Grid item alignSelf='stretch'>
					<Stack direction='row' spacing='2rem'>
						<IconButton size='large' onClick={prevMonth} color='primary'>
							<ChevronLeftIcon />
						</IconButton>
						<IconButton size='large' onClick={nextMonth} color='primary'>
						<ChevronRightIcon />
						</IconButton>
						<Typography variant='h4' marginLeft='auto !important' color='primary' fontWeight='800'>{date.toLocaleString('default', { month: 'long' })}{' '}{date.getFullYear()}</Typography>
					</Stack>
				</Grid>
				<Grid item container columns={7}>
					<Grid item xs={1}><Typography color='secondary'>Sunday</Typography></Grid>
					<Grid item xs={1}><Typography color='secondary'>Monday</Typography></Grid>
					<Grid item xs={1}><Typography color='secondary'>Tuesday</Typography></Grid>
					<Grid item xs={1}><Typography color='secondary'>Wednesday</Typography></Grid>
					<Grid item xs={1}><Typography color='secondary'>Thursday</Typography></Grid>
					<Grid item xs={1}><Typography color='secondary'>Friday</Typography></Grid>
					<Grid item xs={1}><Typography color='secondary'>Saturday</Typography></Grid>
				</Grid>
				<Grid item container columns={7.1} flexGrow={1}>
					{days.map(day => (
						<CCell
							day={day}
							items={schedules.get(day.toDateString()) || []}
							key={day.toLocaleDateString('en-US')}
							mute={day.getMonth() !== date.getMonth()}
							handleAdd={handleAdd}
							openMenu={openMenu}
							today={today}
						/>
					))}
				</Grid>
			</Grid>
			<Menu
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={closeMenu}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
			>
				<MenuItem onClick={() => {}}>
					<ListItemIcon><MultipleStopIcon /></ListItemIcon>
					<ListItemText>Move</ListItemText>
				</MenuItem>
				<MenuItem onClick={() => {
					handleDelete();
					closeMenu();
				}}>
					<ListItemIcon><DeleteIcon color='error' /></ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
		</>
	)
}