import React, { useContext, useEffect, useState } from 'react'
import DayContext, { DayMap } from '../contexts/DayProvider'
import { userTaskAPI } from '../apis/userTaskAPI';
import dayjs from 'dayjs';
import useAuth from './useAuth';

const useTask = ({ isAdmin }) => {
  const { days, setDays, currDate } = useContext(DayContext);
  const [loading, setLoading] = useState(false);
  const [tasksmap, setTasksmap] = useState([]);
  // const [labID, setLabID] = useState(null);
  const { lab_id } = useAuth();
  const user_id = '66af4cb82e3da1ed76442b7b';


  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const sm = currDate.startOf('month');
      const sc = sm.subtract(sm.weekday(), 'day');
      const params = {
        startDate: sc.toDate(),
        endDate: sc.add(42, 'day').toDate(),
      }
      let userTasks;
      if (isAdmin) {
        params.lab_id = lab_id;
        userTasks = await userTaskAPI.fetchAllInLab(params);
        setTasksmap(userTasks);
        console.log(userTasks)

      } else {
        userTasks = await userTaskAPI.fetchById(user_id, params);
        setTasksmap(userTasks?.schedulemaps);
      }

    }
    try {
      fetchTasks();
    } catch (error) {
      console.error(error);
    }

  }, [currDate]);

  useEffect(() => {
    if (!tasksmap) return setLoading(false);
    const daysmap = new Map();
    let i = 0;
    days.forEach((dayValue, day) => {
      const dayTasks = tasksmap.find(tasksDay => {
        return dayjs(day).isSame(dayjs(tasksDay.date), 'day');
      })

      const mute = ((dayValue.date.date() > 24 && i < 8) || (dayValue.date.date() < 13 && i > 24)) ? true : false;
      i++;
      daysmap.set(day, {
        tasks: dayTasks?.tasks || [],
        mute,
        date: dayValue.date,
      })
    });
    console.log(daysmap)

    setDays(daysmap);
    setLoading(false);
  }, [tasksmap, currDate])



  return {
    loading
  }
}

export default useTask