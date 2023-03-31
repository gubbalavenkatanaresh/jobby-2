import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    console.log(history)
    Cookies.remove('jwt_token')
    history.replace('./login')
  }

  return (
    <nav className="navbar">
      <ul className="list-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li>
          <div>
            <Link to="/" className="li-item">
              Home
            </Link>

            <Link to="/jobs" className="li-item">
              Jobs
            </Link>
          </div>
        </li>
        <li>
          <button type="button" onClick={onClickLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
