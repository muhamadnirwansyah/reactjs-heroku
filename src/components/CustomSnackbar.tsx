import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert, { type AlertColor } from "@mui/material/Alert";

interface CustomSnackbarProps {
    open: boolean;
    message: string;
    severity: AlertColor; // 'success' | 'error' | 'warning' | 'info'
    onClose: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackbar;