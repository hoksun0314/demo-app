import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Strapi from 'strapi-sdk-javascript/build/main';

// Utils
import auth from '../../utils/auth';
import './styles.css';

import config from '../../utils/config';

const strapi = new Strapi(config.strapiPath);

class AuthPage extends React.Component {
  state = { value: {}, errors: [], didCheckErrors: false };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    
  }

  handleChange = ({ target }) =>{
    this.setState({
      value: { ...this.state.value, [target.name]: target.value },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    var username = this.state.value.username;
    var password = this.state.value.password
    
    this.login(username, password)
  };

  async login(username, password){
    var login = await strapi.login(username, password).catch(err => {
      alert(err)
    });
   if(login){
    auth.setToken(login.jwt);
    auth.setUserInfo(login.user);
    this.props.history.push('/');
   }
  }

  render() {
    return (
      <div className="authPage">
        <div className="wrapper">
          <div className="headerContainer">
            <span>Welcome !</span>
          </div>
          <div className="headerDescription">
            <span>Please login to access the app.</span>
          </div>

          <form onSubmit={this.handleSubmit}>
            <TextField
              id="username"
              name="username"
              label="Username"
              margin="normal"
              onChange={this.handleChange}
            />
            <br/>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              margin="normal"
              onChange={this.handleChange}
            />
            <br/>
            <Button variant="contained" type='submit'>
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default AuthPage;
