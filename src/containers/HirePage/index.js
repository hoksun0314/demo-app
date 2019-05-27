import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Strapi from 'strapi-sdk-javascript/build/main';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';



// Utils
import config from '../../utils/config';

const strapi = new Strapi(config.strapiPath);

class HirePage extends React.Component {
  state = { value: {}, errors: [], didCheckErrors: false , managerList:[]};

  componentDidMount() {
      this.getAllActiveManager();
  }

  componentWillReceiveProps(nextProps) {
    
  }

  async getAllActiveManager(){
    var managerList = await strapi.getEntries('Employees',{IsManager:true, IsTerminated:false});
    this.setState({managerList:managerList})
  }

  handleChange = ({ target }) =>{
    this.setState({
      value: { ...this.state.value, [target.name]: target.value },
    });
  }

  handleCheckboxChange = ({ target }) =>{
    this.setState({
      value: { ...this.state.value, [target.name]: target.checked },
    });
  }

  handleSubmit = e => {
    e.preventDefault(); 
    this.hire(this.state.value)
  };

  async hire(newHire){
    var firstName = newHire.FirstName;
    var lastName = newHire.LastName;
    var email = newHire.Email;
    var dateOfEmploy = newHire.DateOfEmploy
    var isManager = newHire.IsManager
    var manager = newHire.Manager;
    await strapi.createEntry('Employees',{FirstName:firstName, LastName:lastName, Email:email, DateOfEmploy:dateOfEmploy, IsManager:isManager, Manager:manager, IsTerminated:false});
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="authPage">
        <div className="wrapper">
          <div className="headerContainer">
            <span>Hire Employee</span>
          </div>

          <form onSubmit={this.handleSubmit}>
            <TextField
            required
              id="firstname"
              name="FirstName"
              label="Firstname"
              margin="normal"
              onChange={this.handleChange}
            />
            <br/>
            <TextField
            required
              id="lastname"
              name="LastName"
              label="Lastname"
              margin="normal"
              onChange={this.handleChange}
            />
            <br/>
            <TextField
            required
              id="email"
              name="Email"
              label="Email"
              margin="normal"
              onChange={this.handleChange}
            />
            <br/>
            <TextField
                required
              id="dateofemploy"
              name="DateOfEmploy"
              label="Date of Employ"
              type='date'
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleChange}
            />
            <br/>
            <FormControlLabel
                control={<Checkbox checked={this.state.isManager} onChange={this.handleCheckboxChange} />}
                label="Manager"
                name='IsManager'
            />
            <br/>
            <TextField
                id="managerList"
                select
                name='Manager'
                label="Manager"
                value={this.state.value.Manager}
                onChange={this.handleChange}
                helperText="Please select new hire's manager"
                margin="normal"
            >
                {this.state.managerList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                    {option.FirstName + option.LastName}
                </MenuItem>
                ))}
            </TextField>
            <br/>
            <Button variant="contained" type='submit'>
              Hire
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default HirePage;
