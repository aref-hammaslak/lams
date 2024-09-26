import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserAPI } from '../../apis/UserAPI';
import { AddCircle, Person } from "@mui/icons-material";
import { Chip } from '@mui/material';

const getNotSelectedUsers = (selectedUsers, allUsers) => {
    return Array.from(allUsers.entries())
        .filter(([userId]) => !selectedUsers.includes(userId))
        .map(item => item[1])
}

export const Recipients = (props) => {
    const { recipents, onAddRecipient, onDeleteRecipient } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const AddBtnRef = useRef(null);
    const [selectedUsers, setSelectiedUsers] = useState([]);

    const toggleUser = (userId) => {
        let newUsers;
        if (selectedUsers.includes(userId)) newUsers = selectedUsers.filter((id) => id !== userId)
        else newUsers = [...selectedUsers, userId];
        setSelectiedUsers(newUsers);
    }


    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            let users = await UserAPI.getAll(undefined, 'username , name');
            users = users.map(user => [user._id, user]);
            return new Map(users);
        },
        initialData: new Map()
    })
    const [notSelectedUsers, setNotSelectedUsers] = useState(() => getNotSelectedUsers(recipents, users));

    useEffect(() => {
        setNotSelectedUsers(getNotSelectedUsers(recipents, users));
    }, [recipents, users])

    const handelClose = () => { setIsMenuOpen(false) }

    useEffect(() => {
        if (!isMenuOpen) {
            console.log("🚀 ~ Recipients ~ selectedUsers:", selectedUsers)
            onAddRecipient(selectedUsers);
        } else setSelectiedUsers([]);
    }, [isMenuOpen])

    return (
        <div className='w-full py-2  px-4  bg-primaryLight rounded-lg relative '>
            <div className='flex justify-between w-full items-center '>
                <span className=' font-medium'>Recipient(s)</span>
                <AddCircle ref={AddBtnRef} onClick={() => {
                    if (notSelectedUsers.length === 0 && !isMenuOpen) return;
                    setIsMenuOpen(true);
                }} className='  text-green-600 w-7 h-7 cursor-pointer' />
            </div>
            <div className='flex w-full !pb-0 flex-wrap min-h-[40px] gap-2 max-h-[80px] overflow-auto bg-white p-2 mt-2 rounded-lg'>
                {
                    recipents.length === 0 && (<p className='text-sm text-gray-500'>
                        Please add recipient(s)
                    </p>)
                }
                {
                    recipents.map((recipient, i) => {
                        return (
                            <Chip
                                key={i}
                                size="small"
                                variant="filled"
                                color="success"
                                onDelete={() => {
                                    onDeleteRecipient(recipient)
                                }}
                                label={users.get(recipient)?.username || 'username'}
                            />
                        )
                    })
                }
            </div>
            <div>
                {isMenuOpen && <UsersMenu AddBtnRef={AddBtnRef} selectedUsers={selectedUsers} toggleUser={toggleUser} users={notSelectedUsers} onClose={handelClose} />}
            </div>
        </div>
    )
}

const UsersMenu = (props) => {
    const { users, onClose, selectedUsers, toggleUser, AddBtnRef } = props;
    console.log("🚀 ~ UsersMenu ~ AddBtnRef:", AddBtnRef);
    const btnRect = AddBtnRef?.current?.getBoundingClientRect();
    const right = btnRect.x || 1000;
    console.log("🚀 ~ UsersMenu ~ right:", right)
    const top = btnRect.y || 200;
    console.log("🚀 ~ UsersMenu ~ top:", top)

    return (
        <div className='fixed inset-0  ' onClick={onClose}>
            <ul className={`absolute w-[200px] p-2  top-[35vh]  right-[7.9vw] max-h-[200px] overflow-y-auto bg-white scrollbar-thin scroll-p-10 rounded-lg shadow-lg`} onClick={(e) => e.stopPropagation()}>
                {
                    users.map((user, i) => {
                        return (
                            <li key={i} className='flex items-center p-2 rounded-md justify-between hover:bg-primaryLight'>
                                <label htmlFor={'checkbox' + i} className='flex items-center gap-2 flex-1 cursor-pointer'>
                                    <Person />
                                    <div className='flex flex-col'>
                                        <span className='text-[15px] font-medium'>{user.username}</span>
                                        <span className='text-sm text-gray-700'>{user.name}</span>
                                    </div>
                                </label>

                                <input id={'checkbox' + i} onChange={() => toggleUser(user._id)} type="checkbox" value={selectedUsers.includes(user._id)} className="w-4 h-4 text-blue-600 bg-gray-100  rounded cursor-pointer " />
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
