import { useContext, useEffect, useState } from 'react'
import DayContext from '../contexts/DayProvider'
import { userTaskAPI } from '../apis/userTaskAPI';
import dayjs from 'dayjs';
import useAuth from './useAuth';
import { RefreshContext } from '../contexts/RefreshProvider';

const useTask = ({ isAdmin }) => {
  const { days, setDays, currDate } = useContext(DayContext);
  const [loading, setLoading] = useState(false);
  const [tasksmap, setTasksmap] = useState([]);
  const { auth:{lab_id, id:user_id} } = useAuth();
  const { needToRefresh } = useContext(RefreshContext);

  useEffect(() => {

    async function fetchTasks() {
      
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
      } else {
        userTasks = await userTaskAPI.fetchById(user_id, params);
        setTasksmap(userTasks?.schedulemaps ?? []);
      }

    }
    
    try {
      setLoading(true);
      fetchTasks();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

  }, [currDate, needToRefresh]);

  useEffect(() => {
    if (!tasksmap.length ) {
      
      if (loading === true) setLoading(false); 
      return
    }
    
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
        notAssignedSchcdulesStatus: dayTasks?.notAssignedSchcdulesStatus
      })
    });

    setDays(daysmap);
    setLoading(false);
  }, [tasksmap])

  return {
    loading
  }
}

export default useTask