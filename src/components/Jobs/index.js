import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch, BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobs: {},
    profileStatus: profileConstants.initial,
    jobsStatus: profileConstants.initial,
    employment: [],
    minPackage: '',
    search: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    const {employment, minPackage, search} = this.state
    console.log(employment)
    const employmentType = [...employment]
    console.log(employmentType)
    this.setState({jobsStatus: profileConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minPackage}&search=${search}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({jobs: data.jobs, jobsStatus: profileConstants.success})
    } else {
      this.setState({jobsStatus: profileConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileStatus: profileConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = {
        profileDetails: data.profile_details,
      }
      this.setState({
        profileDetails: updatedData.profileDetails,
        profileStatus: profileConstants.success,
      })
    } else {
      this.setState({profileStatus: profileConstants.failure})
    }
  }

  clickProfileRetry = () => {
    this.getProfileDetails()
  }

  renderProfileInProgress = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailure = () => (
    <div className="retry-btn-container">
      <button
        type="button"
        onClick={this.clickProfileRetry}
        className="retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccess = () => {
    const {profileDetails} = this.state
    const updateProfileDetails = {
      name: profileDetails.name,
      profileImageUrl: profileDetails.profile_image_url,
      shortBio: profileDetails.short_bio,
    }
    const {name, profileImageUrl, shortBio} = updateProfileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileView = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileConstants.inProgress:
        return this.renderProfileInProgress()
      case profileConstants.failure:
        return this.renderProfileFailure()
      case profileConstants.success:
        return this.renderProfileSuccess()
      default:
        return null
    }
  }

  clickJobsRetry = () => {
    this.getJobsDetails()
  }

  renderJobsFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.clickJobsRetry} className="retry-btn">
        Retry
      </button>
    </div>
  )

  jobCard = () => {
    const {jobs} = this.state
    return (
      <ul className="jobs-list">
        {jobs.map(eachJob => {
          const updateJob = {
            companyLogoUrl: eachJob.company_logo_url,
            employmentType: eachJob.employment_type,
            id: eachJob.id,
            jobDescription: eachJob.job_description,
            location: eachJob.location,
            packagePerAnnum: eachJob.package_per_annum,
            rating: eachJob.rating,
            title: eachJob.title,
          }
          const {
            companyLogoUrl,
            employmentType,
            id,
            jobDescription,
            location,
            packagePerAnnum,
            rating,
            title,
          } = updateJob
          return (
            <li className="job-item" key={id}>
              <Link to={`/jobs/${id}`} className="job-item">
                <div className="top">
                  <img
                    src={companyLogoUrl}
                    alt="job details company logo"
                    className="company-logo"
                  />
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
                <h1>Description</h1>
                <p className="description">{jobDescription}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  emptyJobCard = () => (
    <div className="no-jobs">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobs} = this.state
    return jobs.length > 0 ? this.jobCard() : this.emptyJobCard()
  }

  renderJobsView = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case profileConstants.inProgress:
        return this.renderProfileInProgress()
      case profileConstants.failure:
        return this.renderJobsFailure()
      case profileConstants.success:
        return this.renderJobsSuccess()
      default:
        return null
    }
  }

  employmentList = () => (
    <ul className="employment-list">
      {employmentTypesList.map(eachType => {
        const {employmentTypeId, label} = eachType
        const {employment} = this.state
        const onChangeType = () => {
          if (!employment.includes(employmentTypeId)) {
            this.setState(
              prevState => ({
                employment: [...prevState.employment, employmentTypeId],
              }),
              this.getJobsDetails,
            )
          } else {
            this.setState(
              prevState => ({
                employment: prevState.employment.filter(
                  each => each !== employmentTypeId,
                ),
              }),
              this.getJobsDetails,
            )
          }
        }
        return (
          <li key={employmentTypeId}>
            <input
              type="checkbox"
              id={employmentTypeId}
              onClick={onChangeType}
            />
            <label htmlFor={employmentTypeId}>{label}</label>
          </li>
        )
      })}
    </ul>
  )

  salaryList = () => (
    <ul className="salary-list">
      {salaryRangesList.map(eachSalary => {
        const {salaryRangeId, label} = eachSalary
        const onChangeSalary = () => {
          this.setState({minPackage: salaryRangeId}, this.getJobsDetails)
        }
        return (
          <li key={salaryRangeId}>
            <input
              type="radio"
              name="salary"
              id={salaryRangeId}
              onChange={onChangeSalary}
            />
            <label htmlFor={salaryRangeId}>{label}</label>
          </li>
        )
      })}
    </ul>
  )

  onChangeSearch = event => {
    this.setState({search: event.target.value})
  }

  onClickSearchIcon = () => {
    this.getJobsDetails()
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="./Login" />
    }
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-sort">
            {this.renderProfileView()}
            <hr />
            <div>
              <h1>Type of Employment</h1>
              {this.employmentList()}
            </div>
            <hr />
            <div>
              <h1>Salary Range</h1>
              {this.salaryList()}
            </div>
          </div>
          <div className="jobs">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search"
                className="search"
                onChange={this.onChangeSearch}
              />
              <div data-testid="searchButton">
                <BsSearch
                  className="search-icon"
                  onClick={this.onClickSearchIcon}
                />
              </div>
            </div>
            {this.renderJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
