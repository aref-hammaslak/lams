import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { UserAPI } from "../../apis/UserAPI.js";
import { Controller, useForm } from "react-hook-form";
import {
    Grid, Stack, Button, IconButton,
    Paper, ImageList, ImageListItem, ImageListItemBar, TextField,
    Select, InputLabel, FormControl, MenuItem, ButtonGroup,
} from "@mui/material";
import { BoxController } from "../../components/BoxController";
import EditIcon from "@mui/icons-material/Edit";
import { DocAPI } from "../../apis/DocAPI.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined.js";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";

import { USER_ROLES } from "../../consts/index.js";
import { useGetUserRole } from "../../hooks/useGetUserRole.js";




export function Profile() {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    console.log("🚀 ~ Profile ~ user:", user)
    const [pfpDoc, setPfpDoc] = useState(null);
    const pfpInputRef = useRef();
    const userRolde = useGetUserRole();

    useEffect(() => {
        UserAPI.getSelf().then(
            user => setUser(user),

            err => setError(err)
        )
    }, []);

    useEffect(() => {
        if (!user) return;

        console.log(user);
        reset({
            ceu: '',
            ...user,
            // roles: USER_ROLES[user.roles.toString()].label,
            license_exp: user.license_exp ? dayjs(user.license_exp) : null
        });
        if (user.pfp) {
            DocAPI.get(user.pfp).then(
                doc => setPfpDoc(doc),
                err => setError(err)
            )
        } else {
            setPfpDoc(null);
        }
    }, [user]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { dirtyFields, isDirty }
    } = useForm();

    console.log('isDirty', isDirty);
    console.log('dirtyFields', dirtyFields);

    const updateUserHandler = (data) => {
        const updates = dirtyValues(dirtyFields, data);
        // if (updates.roles) updates.roles = USER_ROLES[updates.roles]

        console.log(updates);
        UserAPI.updateUser(user._id, updates).then(
            newUser => setUser(newUser),
            err => setError(err)
        )
    }

    const navigate = useNavigate();
    // const deleteUserHandler = () => {
    //     UserAPI.deleteUser(id).then(
    //         _ => navigate('/setting/users', { replace: true }),
    //         err => setError(err)
    //     )
    // }

    const cvInputRef = useRef();
    const ceuInputRef = useRef();
    const licenseInputRef = useRef();
    const degreeInputRef = useRef();
    const trainingRecsInputRef = useRef();

    const [lingCV, setLingCV] = useState(false);
    const [lingCeu, setLingCeu] = useState(false);
    const [lingLicense, setLingLicense] = useState(false);
    const [lingDegree, setLingDegree] = useState(false);
    const [lingTraRec, setLingTraRec] = useState(false);

    const uploadHandler = (name, file, setUploading) => {
        if (!file) return;

        setUploading(true);

        DocAPI.upload(name, file).then(
            (doc) => {
                setUploading(false);
                setValue(name, doc._id, { shouldDirty: true });
                if (name === 'pfp')
                    setPfpDoc(doc);
            },
            (err) => {
                setUploading(false);
                setError(err);
            }
        );
    };

    const linkOpenerRef = useRef();
    const [link, setLink] = useState(null);
    useEffect(() => {
        if (link) {
            linkOpenerRef.current.click();
            setLink(null);
        }
    }, [link]);

    const openFileHandler = (doc_id) => {
        DocAPI.get(doc_id).then(
            (doc) => {
                setLink(`http://localhost:3001/uploads/${doc.filename}`);
            },
            (err) => setError(err)
        );
    };

    return (
        <Stack component={Paper} className="p-8 mx-auto">
            <Link
                ref={linkOpenerRef}
                sx={{ display: "none" }}
                target="_blank"
                to={link}
            />
            <BoxController
                componentProps={{
                    hover: false
                }}
                onHoverProps={{
                    hover: true
                }}
                renderComponent={(props) => (
                    <ImageList sx={{ width: '8rem', height: '8rem', borderRadius: '15px' }}>
                        <ImageListItem cols={12}>
                            <img
                                alt='profile-image'
                                src={
                                    pfpDoc
                                        ? `http://localhost:3001/uploads/${pfpDoc.filename}`
                                        : '/pfp_placeholder.png'
                                }
                            />
                            {props.hover &&
                                <ImageListItemBar
                                    subtitle={`@${user?.username}`}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'white' }}
                                            onClick={() => pfpInputRef.current.click()}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    }
                                />
                            }
                        </ImageListItem>
                    </ImageList>
                )}
            >
            </BoxController>
            <input
                type='file'
                ref={pfpInputRef}
                style={{ display: 'none' }}
                onChange={(e) => uploadHandler('pfp', e.target.files[0], () => { })}
            />
            <Grid
                className="mt-2"
                container
                component='form'
                onSubmit={handleSubmit(updateUserHandler)}
                rowSpacing='1rem'
                columnSpacing='2rem'
                justifyContent='center'
            >
                <Controller
                    name='pfp'
                    control={control}
                    render={({ field }) => (
                        <TextField
                            value={field.value || ''}
                            sx={{ display: 'none' }}
                            onChange={e => field.onChange(e.target.value)}
                        />
                    )} />
                <Grid item xs={3}>
                    <Controller
                        name='name'
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth
                                label='Name'
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                </Grid>
                <Grid item xs={3}>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth
                                label='Email'
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                </Grid>
                <Grid item xs={3}>
                    <Controller
                        name='position'
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth
                                label='Position'
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                </Grid> 
                <Grid item xs={3}>
                    <Controller
                        name='job_title'
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth
                                label='Job Title'
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                </Grid>
                <Grid item xs={3}>
                    <Controller
                        name='roles'
                        control={control}
                        render={({ field }) => (
                            <TextField label='Role' fullWidth InputProps={{readOnly:true}}   value={userRolde.at(0).toUpperCase() + userRolde.slice(1)}/>
                            // <FormControl fullWidth>
                            //     <InputLabel id="role-field-label">Role</InputLabel>
                            //     <Select
                            //         labelId="role-field-label"
                            //         value={field.value ? field.value : 'staff'}
                            //         label="Age"
                            //         onChange={({ target }) => field.onChange(target.value)}
                            //     >
                            //         <MenuItem value='staff'>Staff</MenuItem>
                            //         <MenuItem value='supervisor'>Supervisor</MenuItem>
                            //     </Select>
                            // </FormControl>
                        )} />
                </Grid>
                <Grid item xs={3}>
                    <Controller
                        name="license_exp"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                openTo="year"
                                views={["year", "month", "day"]}
                                value={field.value || null}
                                onChange={(newDate) =>
                                    field.onChange(newDate)
                                }
                                slotProps={{
                                    textField: {
                                        label: "License Exp",
                                    },
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Controller
                        name='license_type'
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth
                                label='License Type'
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                </Grid>
                <Grid item xs={3}>
                    <Controller
                        name='license_no'
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth
                                label='License Number'
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                </Grid>
                <Grid item xs={3}>
                    <Controller
                        name='ceu_no'
                        control={control}
                        render={({ field }) => (
                            <TextField fullWidth
                                label='Number of CEUs'
                                type='number'
                                value={field.value || '0'}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                </Grid>
                <Grid item xs={9}></Grid>
                <Grid item>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        ref={ceuInputRef}
                        onChange={(e) =>
                            uploadHandler(
                                "ceu",
                                e.target.files[0],
                                setLingCeu
                            )
                        }
                    />
                    <Controller
                        name='ceu'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                value={field.value || ''}
                                sx={{ display: 'none' }}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                    <ButtonGroup size='large'>
                        <Button fullWidth
                            disabled={!watch('ceu')}
                            onClick={() =>
                                openFileHandler(user.ceu)
                            }
                        >
                            CEU
                        </Button>
                        <LoadingButton
                            loading={lingCeu}
                            variant="outlined"
                            onClick={() =>
                                ceuInputRef.current.click()
                            }
                        // sx={{ width: "215px", height: "55px" }}
                        >
                            <DriveFolderUploadOutlinedIcon />
                        </LoadingButton>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        ref={ceuInputRef}
                        onChange={(e) =>
                            uploadHandler(
                                "cv",
                                e.target.files[0],
                                setLingCV
                            )
                        }
                    />
                    <Controller
                        name='cv'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                value={field.value || ''}
                                sx={{ display: 'none' }}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                    <ButtonGroup size='large'>
                        <Button fullWidth
                            disabled={!watch('cv')}
                            onClick={() =>
                                openFileHandler(user.cv)
                            }
                        >
                            CV
                        </Button>
                        <LoadingButton
                            loading={lingCV}
                            variant="outlined"
                            onClick={() =>
                                cvInputRef.current.click()
                            }
                        >
                            <DriveFolderUploadOutlinedIcon />
                        </LoadingButton>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        ref={licenseInputRef}
                        onChange={(e) =>
                            uploadHandler(
                                "license",
                                e.target.files[0],
                                setLingLicense
                            )
                        }
                    />
                    <Controller
                        name='license'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                value={field.value || ''}
                                sx={{ display: 'none' }}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                    <ButtonGroup size="large">
                        <Button fullWidth
                            disabled={!watch('license')}
                            onClick={() =>
                                openFileHandler(user.license)
                            }
                        >
                            License
                        </Button>
                        <LoadingButton
                            loading={lingLicense}
                            variant="outlined"
                            onClick={() =>
                                licenseInputRef.current.click()
                            }
                        >
                            <DriveFolderUploadOutlinedIcon />
                        </LoadingButton>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        ref={degreeInputRef}
                        onChange={(e) =>
                            uploadHandler(
                                "degree",
                                e.target.files[0],
                                setLingDegree
                            )
                        }
                    />
                    <Controller
                        name='degree'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                value={field.value || ''}
                                sx={{ display: 'none' }}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                    <ButtonGroup size="large">
                        <Button fullWidth
                            disabled={!watch('degree')}
                            onClick={() =>
                                openFileHandler(user.degree)
                            }
                        >
                            Degree
                        </Button>
                        <LoadingButton
                            loading={lingDegree}
                            variant="outlined"
                            onClick={() =>
                                degreeInputRef.current.click()
                            }
                        >
                            <DriveFolderUploadOutlinedIcon />
                        </LoadingButton>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        ref={trainingRecsInputRef}
                        onChange={(e) =>
                            uploadHandler(
                                "training_recs",
                                e.target.files[0],
                                setLingTraRec
                            )
                        }
                    />
                    <Controller
                        name='training_recs'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                value={field.value || ''}
                                sx={{ display: 'none' }}
                                onChange={e => field.onChange(e.target.value)}
                            />
                        )} />
                    <ButtonGroup size="large">
                        <Button fullWidth
                            disabled={!watch('training_recs')}
                            onClick={() =>
                                openFileHandler(user.training_recs)
                            }
                        >
                            Training Recs
                        </Button>
                        <LoadingButton
                            loading={lingTraRec}
                            variant="outlined"
                            onClick={() =>
                                degreeInputRef.current.click()
                            }
                        >
                            <DriveFolderUploadOutlinedIcon />
                        </LoadingButton>
                    </ButtonGroup>
                </Grid>
                <Grid
                    item xs={12}
                    display='flex'
                    justifyContent='flex-end' alignItems='center'
                    gap='1rem'
                    mt='2rem'
                >
                    <Typography variant='caption' color='orange' hidden={!Object.keys(dirtyFields).length}>
                        unsaved changes *
                    </Typography>
                    <Button
                        color='success'
                        type='submit'
                        variant='contained'
                    >Save</Button>
                    {/* <Button
                        color='error'
                        onClick={deleteUserHandler}
                        variant='contained'
                    ><DeleteIcon /></Button> */}
                </Grid>
            </Grid>
        </Stack>
    )
}

export function dirtyValues(dirtyFields, allValues) {
    // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
    // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
    if (dirtyFields === true || Array.isArray(dirtyFields))
        return allValues;
    // Here, we have an object
    return Object.fromEntries(Object.keys(dirtyFields).map(key => [key, dirtyValues(dirtyFields[key], allValues[key])]));
}