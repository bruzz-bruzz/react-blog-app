import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './components/Register.tsx'
import Login from './components/Login.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
    </Routes>
  </BrowserRouter>
)
