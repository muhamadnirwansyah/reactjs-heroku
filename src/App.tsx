import { Box, Container } from '@mui/material';
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProvincesPages from './pages/ProvincesPages';
import CityPages from './pages/CityPages';
import DistrictPages from './pages/DistrictPages';
import VillagePages from './pages/VillagePages';
import ProductPage from './pages/ProductPages';
import ProductFormPages from './pages/ProductFormPages';

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{display: 'flex'}}>
        <Topbar/>
        <Sidebar/>

       <Box component="main" sx={{flexGrow: 1}}>
          {/** route */}
          <Container maxWidth="xl" sx={{ px: 3, pt: 9}}>
              <Routes>
                  <Route path="/province" element={<ProvincesPages/>}/>
                  <Route path="/city" element={<CityPages/>}/>
                  <Route path="/district" element={<DistrictPages/>}/>
                  <Route path="/village" element={<VillagePages/>}/>
                  <Route path="/product" element={<ProductPage/>}/>
                  <Route path="/product-form" element={<ProductFormPages/>}/>
                  <Route path="/product-form/:id" element={<ProductFormPages/>}/>
              </Routes>
          </Container>
       </Box>
    </Box>
    </BrowserRouter>
  )
}


export default App
