import './AuthPage.css';
import { Player } from '@lottiefiles/react-lottie-player'; 

import flyAnimation from '../../assets/animationAI.json';
import AuthComponent from '../../components/auth/auth';

const AuthPage = () => {
    return (
      <div className="container">
          <div className="buttons">
          <AuthComponent/>
          </div>
  
        <div className="animation">
          <Player
            autoplay
            loop
            src={flyAnimation}
            className="lottie-player"
          />
        </div>
      </div>
    );
  };
  export default AuthPage;