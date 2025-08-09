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
    Pagination as MuiPagination
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Province } from "../model/Province";
import { get } from "../utils/ServiceAxiosHttp";
import type { Pagination } from "../model/Pagination";


const ProvincesPages = () => {

    //declare
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);

    const fetchProvinces = async () => {
        setLoading(true);
        try{
            const response = await get<Pagination<Province>>(`/api/indonesian-region/province/v1.0/search?page=${page}&size=10`);
            setProvinces(response.data.content);
            setTotalPages(response.data.totalPages);
        }catch(error){
            console.log("Error fetching provinces : ",error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProvinces();
    },[page]);

    return (
        <div>
            <Typography variant="h5" gutterBottom>List Province</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress/>
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Alt Name</TableCell>
                                <TableCell>Lat</TableCell>
                                <TableCell>Lot</TableCell>
                            </TableHead>
                            <TableBody>
                                {provinces.map((province) => (
                                    <TableRow key={province.id}>
                                        <TableCell>{province.id}</TableCell>
                                        <TableCell>{province.name}</TableCell>
                                        <TableCell>{province.altName}</TableCell>
                                        <TableCell>{province.latitude}</TableCell>
                                        <TableCell>{province.longitude}</TableCell>
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
    )
}

export default ProvincesPages;