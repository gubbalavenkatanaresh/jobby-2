import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import './index.css'

const jobViewConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {jobItem: {}, jobViewStatus: jobViewConstants.initial}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobViewStatus: jobViewConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const {match} = this.props
    const {id} = match.params
    console.log(id)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const updatedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      this.setState({
        jobItem: updatedData,
        jobViewStatus: jobViewConstants.success,
      })
    } else {
      this.setState({jobViewStatus: jobViewConstants.failure})
    }
  }

  renderInProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  clickJobRetry = () => {
    this.getJobDetails()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We connot seem to find the page your are looking for.</p>
      <button type="button" onClick={this.clickJobRetry} className="retry-btn">
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobItem} = this.state
    const {jobDetails, similarJobs} = jobItem
    const updatedJobDetails = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      id: jobDetails.id,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      packagePerAnnum: jobDetails.package_per_annum,
      rating: jobDetails.rating,
      skills: jobDetails.skills,
      lifeAtCompany: jobDetails.life_at_company,
      title: jobDetails.title,
    }
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
      lifeAtCompany,
      title,
    } = updatedJobDetails

    return (
      <div className="job-item-container">
        <div className="job-details">
          <div className="top">
            <img src={companyLogoUrl} alt={title} className="company-logo" />
            <div>
              <h1>{title}</h1>
              <div className="rating">
                <BsStarFill className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="mid">
            <div className="location-type">
              <div className="location">
                <MdLocationOn className="location-icon" />
                <p>{location}</p>
              </div>
              <div className="type">
                <BsFillBriefcaseFill className="case-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div className="description-visit">
            <h1>Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>

          <p className="description">{jobDescription}</p>
        </div>
      </div>
    )
  }

  renderView = () => {
    const {jobViewStatus} = this.state
    switch (jobViewStatus) {
      case jobViewConstants.inProgress:
        return this.renderInProgressView()
      case jobViewConstants.failure:
        return this.renderFailureView()
      case jobViewConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="./Login" />
    }
    return (
      <>
        <Header />
        {this.renderView()}
      </>
    )
  }
}

export default JobItemDetails
