import {
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Table,
    Box,
    CircularProgress,
    Pagination as MuiPagination,
    Switch,
    Button
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Product } from "../model/Product";
import { get, post } from "../utils/ServiceAxiosHttp";
import type { Pagination } from "../model/Pagination";
import type { DataResponse } from "../model/DataResponse";
import CustomSnackbar from "../components/CustomSnackbar";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    
    const navigate = useNavigate();
    const handleRedirectAddProduct = () => {
        navigate("/product-form");
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity});
    };

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false}));
    };

    const fetchProducts = async () => {
        setLoading(true);
        try{
            const response = await get<Pagination<Product>>(`/api/product/v1.0/search?page=${page}&size=10`);
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        }catch(error){
            console.log("Error fetching products : ",error);
        }finally{
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: number, checked:boolean) => {
        console.log("Toggle activated : ",id);
        console.log("Status : ",checked);
        try{
            const payload = {
                "id" : id,
                "action" : checked
            }
            const response = await post<DataResponse<Product>>(`/api/product/v1.0/active-inactive`,payload);
            const updateProductActiveInactive = response.data;
            
            setProducts((prev) => 
            prev.map((product) => 
                product.id === updateProductActiveInactive.id ? { ...product, 
                    toggleActive: updateProductActiveInactive.toggleActive} : 
                        product));
            showSnackbar(response.messageSuccess, 'success');
        }catch(error:any){
            console.log("Failed to toggle active inactive : ",error);
            const errorMessage = error?.response?.data?.messageErrors?.[0] || 'Failed activate product';
            showSnackbar(errorMessage, 'error');
        }finally{
            setTimeout(() => {
                setLoading(true);
                fetchProducts();
                setLoading(false);
            },2000)
        }
    };

    useEffect(() => {
        fetchProducts();
    },[page]);

    return (
        <div>
            <Typography variant="h5" gutterBottom>Management Product</Typography>
            <Button size="small" variant="contained" 
            onClick={handleRedirectAddProduct}
            color="primary">
                Add Product
            </Button>
            <hr/>
            {/** snack bar message */}
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={closeSnackbar}
            />
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress/>
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Start Active Date</TableCell>
                                <TableCell>End Active Date</TableCell>
                                <TableCell>Active</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>
                                            <img
                                                src={product.imagePath}
                                                alt={product.name}
                                                style={{ width: '80px',height: 'auto', borderRadius: '4px'}}
                                                loading="lazy"
                                            />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>{product.startActiveDate}</TableCell>
                                        <TableCell>{product.endActiveDate}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={product.toggleActive === 1}
                                                onChange={(e) => handleToggleActive(product.id, e.target.checked)}
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                             size="small"
                                             variant="outlined"
                                             onClick={() => navigate(`/product-form/${product.id}`)}
                                             color="primary">
                                                Detail View
                                             </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="center" my={2}>
                         <MuiPagination
                            count={totalPages}
                            page={page + 1}
                            onChange={(_,newPage) => setPage(newPage - 1)}
                            color="primary"
                         />
                    </Box>
                </>
            )}
        </div>
    );
}

export default ProductPage;