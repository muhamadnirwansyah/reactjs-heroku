import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Collapse
} from '@mui/material';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocationCityIcon from '@mui/icons-material/LocationCity'
import ProductIcon from '@mui/icons-material/Dataset';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {

    const [openMasterData, setOpenMasterData] = useState(false);
    const handleToggleMasterData = () => {
        setOpenMasterData(!openMasterData);
    }

    const navLinkStyle = ({ isActive } : { isActive: boolean }) => ({
        textDecoration: 'none',
        color: isActive ? '#1976d2' : 'inherit',
        fontWeight: isActive ? 'bold' : 'normal'
    });

    return (
        <Drawer variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                }
            }}>
                <Toolbar/>
                <Divider/>
                <List>
                    {/**Master Data*/}
                    <ListItemButton onClick={handleToggleMasterData}>
                            <ListItemIcon><DashboardIcon/></ListItemIcon>
                            <ListItemText primary="Master Data"/>
                            {openMasterData ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={openMasterData} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 4}}>
                            <NavLink to="province" style={navLinkStyle}>
                                <ListItemButton>
                                    <ListItemIcon><LocationCityIcon/></ListItemIcon>
                                    <ListItemText primary="Province"/>
                                </ListItemButton>
                            </NavLink>
                            <NavLink to="city" style={navLinkStyle}>
                                <ListItemButton>
                                    <ListItemIcon><LocationCityIcon/></ListItemIcon>
                                    <ListItemText primary="City"/>
                            </ListItemButton>
                            </NavLink>
                            <NavLink to="district" style={navLinkStyle}>
                                <ListItemButton>
                                    <ListItemIcon><LocationCityIcon/></ListItemIcon>
                                    <ListItemText primary="District"/>
                                </ListItemButton>
                            </NavLink>
                            <NavLink to="village" style={navLinkStyle}>
                                <ListItemButton>
                                    <ListItemIcon><LocationCityIcon/></ListItemIcon>
                                    <ListItemText primary="Village"/>
                                </ListItemButton>
                            </NavLink>
                            
                        </List>
                    </Collapse>
                    {/** Product Menu */}
                    <NavLink to="product" style={navLinkStyle}>
                    <ListItemButton>
                        <ListItemIcon><ProductIcon></ProductIcon></ListItemIcon>
                        <ListItemText primary="Product"/>
                    </ListItemButton>
                    </NavLink>
                
                    {/** Setting Menu */}
                    <ListItemButton>
                        <ListItemIcon><SettingsIcon/></ListItemIcon>
                        <ListItemText primary="Settings"/>
                    </ListItemButton>
                </List>
        </Drawer>
    );
}

export default Sidebar;
