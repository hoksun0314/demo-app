import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Strapi from 'strapi-sdk-javascript/build/main';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import queryString from 'query-string';



// Utils
import config from '../../utils/config';

const strapi = new Strapi(config.strapiPath);

class EditPage extends React.Component {
  state = { id:'', value: {IsManager:false}, errors: [], didCheckErrors: false , managerList:[]};

  componentDidMount() {
    this.getAllActiveManager();
    let url = this.props.location.search;
    
    let params = queryString.parse(url);
    this.getEmployee(params.id);
    this.setState({id:params.id})
  }

  componentWillReceiveProps(nextProps) {
    
  }

  async getEmployee(id){
    var result = await strapi.getEntry('Employees',id);
      this.setState({
        value: { ...this.state.value, FirstName: result.FirstName },
      });
      this.setState({
        value: { ...this.state.value, LastName: result.LastName },
      });
      this.setState({
        value: { ...this.state.value, Email: result.Email },
      });
      this.setState({
        value: { ...this.state.value, IsManager: result.IsManager },
      });
      if(result.Manager)
        this.setState({
            value: { ...this.state.value, Manager: result.Manager.id },
        });
      this.setState({
        value: { ...this.state.value, DateOfEmploy: result.DateOfEmploy.substring(0, result.DateOfEmploy.indexOf('T')) },
      });
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
    this.update(this.state.value)
  };

  async update(employee){
    var firstName = employee.FirstName;
    var lastName = employee.LastName;
    var email = employee.Email;
    var dateOfEmploy = employee.DateOfEmploy
    var isManager = employee.IsManager
    var manager = employee.Manager;
    await strapi.updateEntry('Employees', this.state.id , {FirstName:firstName, LastName:lastName, Email:email, DateOfEmploy:dateOfEmploy, IsManager:isManager, Manager:manager, IsTerminated:false});
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="authPage">
        <div className="wrapper">
          <div className="headerContainer">
            <span>Edit Employee</span>
          </div>

          <form onSubmit={this.handleSubmit}>
            <TextField
            required
              id="firstname"
              name="FirstName"
              label="Firstname"
              margin="normal"
              value={this.state.value.FirstName}
              onChange={this.handleChange}
            />
            <br/>
            <TextField
            required
              id="lastname"
              name="LastName"
              label="Lastname"
              margin="normal"
              value={this.state.value.LastName}
              onChange={this.handleChange}
            />
            <br/>
            <TextField
            required
              id="email"
              name="Email"
              label="Email"
              margin="normal"
              value={this.state.value.Email}
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
              value={this.state.value.DateOfEmploy}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleChange}
            />
            <br/>
            <FormControlLabel
                control={<Checkbox checked={this.state.value.IsManager} onChange={this.handleCheckboxChange} />}
                label="Is Manager"
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
              Update
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default EditPage;
