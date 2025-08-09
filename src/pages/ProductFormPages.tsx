import { Box, TextField, Typography, Button, Paper, Switch } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CustomSnackbar from "../components/CustomSnackbar";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../utils/ServiceAxiosHttp";
import type { DataResponse } from "../model/DataResponse";
import type { Product } from "../model/Product";


const ProductFormPages = () => {

    const { id } = useParams();
    const [formCreateProduct, setFormCreateProduct] = useState({
        id: 0,
        name: '',
        description: '',
        activeDate: '',
        expireDate: '',
        toggleActive: 0,
        fileBase64: 'data:image/jpeg;base64,'
    });
    const [,setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    
    const convertImageToBase64 = async (url:string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolver) => {
            const reader = new FileReader();
            reader.onloadend = () => resolver(reader.result);
            reader.readAsDataURL(blob);
        })
    }

    useEffect(() => {
        if (id){
            console.log("ID product : ",id);
            const fetchProduct = async () => {
                try{
                const response = await get<DataResponse<Product>>(`/api/product/v1.0/find-product/${id}`);
                const dataProduct = response.data;
                const base64Image = await convertImageToBase64(dataProduct.imagePath);
                setFormCreateProduct(prev => ({
                    ...prev,
                    id: dataProduct.id,
                    name: dataProduct.name,
                    description: dataProduct.description,
                    activeDate: dataProduct.startActiveDate?.split(' ')[0] || '',
                    expireDate: dataProduct.endActiveDate?.split(' ')[0] || '',
                    toggleActive: dataProduct.toggleActive,
                    fileBase64: base64Image as string
                }));
                }catch(error){
                    console.log("Error load product by id : ",error);
                }
            }
            fetchProduct();
        }
    },[id]);

    const cancelCreateProduct = () => {
        resetForm();
        navigate("/product");
    }

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        console.log("show snackbar !");
        setSnackbar({ open: true, message, severity});
    }

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false}));
    }

    const handleDateChange = (field: "activeDate" | "expireDate", value:any) => {
        setFormCreateProduct((prev) => ({
            ...prev,
            [field]: dayjs(value).format("YYYY-MM-DD"),
        }));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormCreateProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveProduct = async () => {
        setLoading(true);
        try{
            const response = await post<DataResponse<Product>>(`/api/product/v1.0/create`, formCreateProduct);
            if (response.status == 200){
                console.log("Success create product : ",JSON.stringify(response));
                resetForm();
                showSnackbar('Product has been created','success');
                setLoading(false);
            }
        }catch(error){
            console.log("Error save product : ",error);
            showSnackbar("Please check input.", 'error');
            setLoading(false);
        }
    }

    const handleUpdateProduct = async () => {
        setLoading(true);
        try{
            const response = await post<DataResponse<Product>>(`/api/product/v1.0/update`,formCreateProduct);
            if (response.status == 200){
                console.log("Success update product : ",JSON.stringify(response));
                resetForm();
                showSnackbar('Product has been update','success');
                setLoading(false);
            }
        }catch(error){
            console.log("Error update product : ",error);
            showSnackbar("Please check input.",'error');
            setLoading(false);
        }
    }

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormCreateProduct((prev) => ({
            ...prev,
            toggleActive: e.target.checked ? 1 : 0,
        }));
    };

    const resetForm = () => {
        setFormCreateProduct({
            id: 0,
            name: "",
            description: "",
            activeDate: "",
            expireDate: "",
            toggleActive: 0,
            fileBase64: ""
        });
    };

    const handleFileUpload = (event: any) => {
        const file = event.target.files?.[0];
        if (file){
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                const mimeType = file.type;
                const base64Prefix = `data:${mimeType};base64,${base64.split(',')[1]}`;
                setFormCreateProduct(prev => ({
                    ...prev,
                    fileBase64: base64Prefix
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                {id ? 'Edit Product' : 'Insert Product'}
            </Typography>
            <hr/>
             {/** snackbar message */}
             <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={closeSnackbar}
             />
             <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{marginWidth: 600, mx: "auto", mt: 4}}>
                    <Paper elevation={3} sx={{ p: 4}}>
                        <Typography variant="h5"> Create Product</Typography>
                        <TextField fullWidth
                            label="Product Name"
                            name="name"
                            value={formCreateProduct.name}
                            onChange={handleChange}
                            sx={{ my: 2}}
                            />
                        <TextField
                            fullWidth
                            label="Product Description"
                            name="description"
                            value={formCreateProduct.description}
                            onChange={handleChange}
                            sx={{ my: 2}}
                        />
                        <DatePicker
                            label="Active Date"
                            value={formCreateProduct.activeDate ? dayjs(formCreateProduct.activeDate) : null}      
                            onChange={(date) => handleDateChange("activeDate", date)}
                            sx={{ my: 2, width: "100%"}}
                        />                              
                        <DatePicker
                            label="Expire Date"
                            value={formCreateProduct.expireDate ? dayjs(formCreateProduct.expireDate) : null}
                            onChange={(date) => handleDateChange("expireDate", date)}
                            sx={{ my: 2, width: "100%"}}
                        />                              
                        <Box sx={{ display: "flex",alignItems: "center", mt: 2}}>
                            <Typography sx={{ mr: 2}}>Active</Typography>
                            <Switch
                                checked={formCreateProduct.toggleActive === 1}
                                onChange={handleToggle}
                                color="primary"
                            />
                        </Box>
                        {/** upload image */}
                        <Box mt={2}>
                            <input type="file" accept="image/*" 
                            onChange={handleFileUpload}/>
                            {formCreateProduct.fileBase64 && (
                                <Box mt={2}>
                                    <img
                                        src={formCreateProduct.fileBase64}
                                        alt="preview"
                                        style={{ maxWidth: "200px", borderRadius: 8}}
                                    />
                                </Box>
                            )}
                        </Box>  
                        {id ? 
                            <Button
                            variant="contained"
                            color="primary"
                            sx={{mt: 2}}
                            onClick={() => {
                                handleUpdateProduct()
                            }}
                            >
                            Update
                        </Button> :
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{mt: 2}}
                            onClick={() => {
                                handleSaveProduct()
                            }}
                            >
                            Save
                        </Button> 
                        }       
                        
                        &nbsp;           
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{mt:2}}
                            onClick={() => {
                                cancelCreateProduct();
                            }}>
                                Cancel
                        </Button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                    </Paper>
                </Box>
             </LocalizationProvider>
        </div>
    )

};

export default ProductFormPages;