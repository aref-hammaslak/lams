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
import useDay from "../../hooks/useDay.js";
import useSchedule from "../../hooks/useSchedule.js";

const TYPE_COLOR = {
	'weekly': 'primary',
	'monthly': 'secondary'
};

const CCell = ({ day, mute, items, onClick, itemClick, today, openMenu }) => {

	console.log(day);

	return (
		<Grid
			item
			// flexGrow={1}
			xs={1}
			sx={{
				color: mute? 'gray' : 'black',
				marginTop: '.1rem', marginRight: '.1rem',
			}}
			onClick={() => onClick(day)}
		>
			<Stack direction='column' component={Paper} height='100%'>
				<Typography>{
					today.toDate().getTime() !== day.date.toDate().getTime()
						? day.date.date()
						: <Chip size='small' variant='outlined' color='success' clickable label={day.date.date()} />
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
							onClick={e => itemClick(e, item)}
							sx={{ margin: '2px'}}
						/>
					))}
				</Box>
			</Stack>
		</Grid>
	)
}

export const CalendarV2 = ({ menuItems, prevMonth, nextMonth, cellClick, ...params }) => {
	const [today, setToday] = useState(dayjs().startOf('day'));
	const { days, currDate } = useDay();
	console.log({
		days: days.keys()
	});
	const [item, setItem] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	const closeMenu = () => {
		setAnchorEl(null);
		setItem(null);
	};
	const openMenu = (e, item) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
		setItem(item);
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
						<Typography variant='h4' marginLeft='auto !important' color='primary' fontWeight='800'>{currDate.toDate().toLocaleString('default', { month: 'long' })}{' '}{currDate.toDate().getFullYear()}</Typography>
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
					{[...days.values()].map(day => (
						<CCell
							day={day}
							items={[]}
							key={day.date.format('YYY-MM-DD')}
							mute={day.date.month() !== currDate.month()}
							onClick={cellClick}
							itemClick={openMenu}
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
				{menuItems.map(({name, onClick}) => (
					<MenuItem key={name} onClick={() => onClick()}>
						{/*<ListItemIcon><MultipleStopIcon /></ListItemIcon>*/}
						<ListItemText>{name}</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	)
}
