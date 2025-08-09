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
    TextField
} from "@mui/material";
import type { City } from "../model/City";
import { useEffect, useState } from "react";
import { get } from "../utils/ServiceAxiosHttp";
import type { Pagination } from "../model/Pagination";

const CityPages = () => {

    const [cities, setCities] = useState<City[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");

    const fetchCities = async () => {
        setLoading(true);
        try{
            const response = await get<Pagination<City>>(`/api/indonesian-region/city/v1.0/search?textSearch=${encodeURIComponent(search)}&page=${page}&size=10`);
            setCities(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log("Total Pages : ",totalPages);
        }catch(error){
            console.log("Error fetching cities : ",error);
        }finally{
            setLoading(false);
        }
    };

    const inquiryData = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
    }

    useEffect(() => {
        fetchCities();
    },[page,search]);
    
    return (
            <div>
            <Typography variant="h5" gutterBottom>List City</Typography>
            {/** inquiry search field */}
            <Box mb={2}>
                <TextField 
                label="Search City"
                variant="outlined"
                fullWidth
                value={search}
                onChange={inquiryData}
                />
            </Box>
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
                            <TableCell>Name</TableCell>
                            <TableCell>Alt Name</TableCell>
                            <TableCell>Province</TableCell>
                            <TableCell>Lat</TableCell>
                            <TableCell>Lot</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cities.map((city) => (
                            <TableRow key={city.id}>
                                <TableCell>{city.id}</TableCell>
                                <TableCell>{city.name}</TableCell>
                                <TableCell>{city.altName}</TableCell>
                                <TableCell>{city.provinceName}</TableCell>
                                <TableCell>{city.latitude}</TableCell>
                                <TableCell>{city.longitude}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" my={2}>
                <MuiPagination 
                    count={totalPages}
                    page={page + 1}
                    onChange={(_,newPage) => setPage(newPage -1)}
                    color="primary"/>
            </Box>
                </>
            )}
        </div>
    )
}

export default CityPages;