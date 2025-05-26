'use client';

import * as React from 'react';
import { COLOURS } from '../../constants';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import Link from 'next/link';


export default function Navbar() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <CastForEducationIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        letterSpacing: '5px'
                    }}>
                        TrainingTracker
                    </Typography>
                    <Link href={"#"}>
                        <Button color="inherit" sx={{color: COLOURS.textPrimary}}>My Training</Button>
                    </Link>
                    <Link href={"#"}>
                        <Button color="inherit" sx={{color: COLOURS.textPrimary}}>Calendar</Button>
                    </Link>
                    <Link href={"#"}>
                        <Button color="inherit" sx={{color: COLOURS.textPrimary}}>Login</Button>
                    </Link>
                    <Link href={"#"}>
                        <Button color="inherit" sx={{color: COLOURS.textPrimary}}>Logout</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );

    return (
        <></>
    );
}
