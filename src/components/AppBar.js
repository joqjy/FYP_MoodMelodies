import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';

function LoginAppBar() {
    return (
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MoodMelodies
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                </Toolbar>
            </AppBar>
            <br/><br/><br/>
        </div>
    );
}

function HomeAppBar(props) {
    const {handleLogout} = props

    return (
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        MoodMelodies
                    </Typography>
                    <IconButton aria-label="logout" color="inherit" style={{fontSize:'medium'}} onClick={handleLogout}>
                        Logout &ensp;<Logout />
                    </IconButton>
                    {/* <Button color="inherit">Login</Button> */}
                </Toolbar>
            </AppBar>
            <br/><br/><br/>
        </div>
    );
}

export {LoginAppBar, HomeAppBar}