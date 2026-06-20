import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './components/Register.tsx'
import Login from './components/Login.tsx'
import Changeusername from './components/Changeusername.tsx'
import Changepassword from './components/Changepassword.tsx'
import Changeemail from './components/Changeemail.tsx'
import Writeblog from './components/Writeblog.tsx'
import Blog from './components/Blog'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}></Route>
      <Route path='/app/uuid' element={<App/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/changeusername/:uuid' element={<Changeusername/>}></Route>
      <Route path='/changepassword/:uuid' element={<Changepassword/>}></Route>
      <Route path='/changeemail/:uuid' element={<Changeemail/>}></Route>
      <Route path='/writeBlog/:uuid' element={<Writeblog/>}></Route>
      <Route path='/blog/:blogid' element={<Blog/>}></Route>
    </Routes>
  </BrowserRouter>
)
