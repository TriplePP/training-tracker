'use client';

import * as React from 'react';
import {COLOURS} from '../constants';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import Link from 'next/link';

const navButtonStyle = {
    color: COLOURS.textPrimary,
    transition: 'all 0.3s ease',
    borderBottom: `2px solid transparent`,
    '&:hover': {
        backgroundColor: 'transparent',
        borderBottom: `2px solid ${COLOURS.textPrimary}`,
        borderRadius: 0,
    },
};

export default function Navbar() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        component={Link} href="\"
                        size="large"
                        edge="start"
                        aria-label="menu"
                        sx={{mr: 2, color: COLOURS.textPrimary}}
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
                    <Button component={Link} href="#" color="inherit" sx={navButtonStyle}>My Training</Button>
                    <Button component={Link} href="#" color="inherit" sx={navButtonStyle}>Calendar</Button>
                    <Button component={Link} href="#" color="inherit" sx={navButtonStyle}>Login</Button>
                    <Button component={Link} href="#" color="inherit" sx={navButtonStyle}>Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
