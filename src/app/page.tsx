'use client';
import {Box, Card, CardActionArea, CardContent, Typography} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {useRouter} from 'next/navigation';
import {COLOURS} from "@/constants";

const Home = () => {
    const router = useRouter();

    const tiles = [
        {
            title: 'Login',
            icon: <LoginIcon fontSize="large"/>,
            href: '/login',
        },
        {
            title: 'Sign Up',
            icon: <PersonAddIcon fontSize="large"/>,
            href: '/signup',
        },
    ];

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            gap={4}
            sx={{flexDirection: 'column',}}
        >
            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{
                    letterSpacing: '2px',
                    color: COLOURS.textSecondary,
                }}
            >
                Welcome to Training Tracker
            </Typography>
            <Box display="flex"
                 justifyContent="center"
                 alignItems="center"
                 gap={4}
                 sx={{backgroundColor: COLOURS.primaryBackground}}
            >
                {tiles.map((tile) => (
                    <Card
                        key={tile.title}
                        sx={{
                            width: 200,
                            height: 200,
                            textAlign: 'center',
                            transition: '0.3s',
                            borderRadius: 4,
                            boxShadow: 3,
                            '&:hover': {
                                boxShadow: 6,
                                cursor: 'pointer',
                                '& .underline': {
                                    width: '60%',
                                },
                            },
                        }}
                        onClick={() => router.push(tile.href)}
                    >
                        <CardActionArea sx={{height: '100%'}}>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                {tile.icon}
                                <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                    {tile.title}
                                </Typography>
                                <Box
                                    className="underline"
                                    sx={{
                                        mt: 1,
                                        height: '3px',
                                        width: '0%',
                                        backgroundColor: '#1976d2',
                                        transition: 'width 0.3s ease-in-out',
                                    }}
                                />
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>

        </Box>
    );
};

export default Home;
