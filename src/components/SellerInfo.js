// react router
import { Link } from "react-router-dom";
// redux
import { useSelector, useDispatch } from "react-redux";

export default function ShopProfile() {
  // setup redux
  const sellerInfo = useSelector((state) => state.sellerInfo);
  return (
    <div className="seller-profile">
      <figure className="shop-profile-img">
        <img src="https://via.placeholder.com/300x200" alt="seller profile" />
      </figure>
      <div>
        <p className="shop-profile-name">{sellerInfo.shop_name}</p>
        <p className="shop-profile-address">{sellerInfo.shop_location}</p>
        <button>
          <Link to="/seller-profile">Edit Profile</Link>
        </button>
      </div>
    </div>
  );
}
