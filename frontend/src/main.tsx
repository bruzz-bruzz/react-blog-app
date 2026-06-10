import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
<<<<<<< HEAD
import Register from './components/Register.tsx'
import Login from './components/Login.tsx'
=======
>>>>>>> 14e2c0703e06c27c6e884b35007dd474683448dc
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}></Route>
<<<<<<< HEAD
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
=======
>>>>>>> 14e2c0703e06c27c6e884b35007dd474683448dc
    </Routes>
  </BrowserRouter>
)
