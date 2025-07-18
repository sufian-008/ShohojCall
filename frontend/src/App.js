
import './App.css';
import  {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Authentication from './pages/authentication';
import { AuthProvider } from './contents/AuthContext';
import VideoMeetComponent from './pages/videoMeet';
function App() {
  return (
   <> 
     <Router>

      <AuthProvider>

     

         <Routes>
          {/* <Route path='/home' element= /> */}
          <Route path='/' element={<LandingPage/>} />
          <Route path='/auth' element={< Authentication/>} />
          <Route path='/:url' element={<VideoMeetComponent/>}/>
         </Routes>
             </AuthProvider>
     </Router>
   </>
  );
}

export default App;
