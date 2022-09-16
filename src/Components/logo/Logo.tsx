import "./Logo.css";
import logImg from "../../assets/logo.png";

const Logo = () => {
  return (
    <div className="logo-base">
      <img className="logo" src={logImg} />
    </div>
  );
};

export default Logo;
