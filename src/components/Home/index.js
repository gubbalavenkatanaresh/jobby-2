import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="./Login" />
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <h1>Find The Job That Fits Your Life</h1>
        <p>Millions of people are searching for jobs</p>
        <Link to="/jobs">
          <button type="button" className="find-jobs-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
