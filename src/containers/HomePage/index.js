import React from 'react';
import PropTypes from 'prop-types';
import Strapi from 'strapi-sdk-javascript/build/main';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import auth from '../../utils/auth';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';



import config from '../../utils/config';
import './styles.css';


const strapi = new Strapi(config.strapiPath);

class HomePage extends React.Component {
  state={employees:[],managerList:[], value:{}}

  componentDidMount() {
    //get employee data
    this.getAllActiveEmployee()
    this.getAllActiveManager();

  }

  async getAllActiveEmployee(){
    var employees = await strapi.getEntries('Employees',{IsTerminated:false});
    this.setState({employees:employees})
  }

  async getAllActiveManager(){
    var managerList = await strapi.getEntries('Employees',{IsManager:true, IsTerminated:false});
    this.setState({managerList:managerList})
  }

  async terminate(employee){
    await strapi.updateEntry('Employees',employee.id, {IsTerminated:true, TerminateDate:new Date()});
    this.getAllActiveEmployee()
  }

  async getFilteredEmployees(){
    var employees = await strapi.getEntries('Employees',{IsTerminated:false, Manager:this.state.value.Manager, DateOfEmploy_lt: this.state.value.filterEndDate, DateOfEmploy_gt: this.state.value.filterStartDate});
    this.setState({employees:employees})
  }

  edit(employee){

  }

  handleChange = ({ target }) =>{
    this.setState({
      value: { ...this.state.value, [target.name]: target.value },
    });
  }

  renderManagerRow(employee){
    if(employee.Manager){
      return employee.Manager.FirstName + ' ' + employee.Manager.LastName
    }
    return '';
  }

  renderDateOfEmployRow(employee){
    return employee.DateOfEmploy.substring(0, employee.DateOfEmploy.indexOf('T'))
  }

  renderActionsRow(employee){
    return <div>
              <Button
                variant="contained"
                onClick={() => {
                  this.props.history.push('/edit?id='+employee.id);
                }}
              >
                Edit
            </Button>
    
            <Button
              variant="contained"
              onClick={() => {
                this.terminate(employee);
              }}
            >
              Terminate
          </Button>
          </div>
  }

  render() {
    return (
      <div className="authPage">
        <div className="wrapper">
        <div align="right">
          <span>Hi, {auth.getUserInfo().username}</span>
          
          <Button
              variant="contained"
              onClick={() => {
                auth.clearAppStorage();
                this.props.history.push('/auth/login');
              }}
            >
              Logout
          </Button>
        </div>
        <h1>Testing App by Ethan</h1>

        <div align="left">
          <Button
              variant="contained"
              onClick={() => {
                this.props.history.push('/hire');
              }}
            >
              Hire Employee
          </Button>
        </div>

        <div>
          <TextField
              id="filterStartDate"
              name="filterStartDate"
              label="Filter Start Date"
              type='date'
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleChange}
            />
            <TextField
              id="filterEndDate"
              name="filterEndDate"
              label="Filter End Date"
              type='date'
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleChange}
            />
            <TextField
                id="managerList"
                select
                name='Manager'
                label="Select manager to filter"
                value={this.state.value.Manager}
                onChange={this.handleChange}
                margin="normal"
                style = {{width: 200}}
            >
                {this.state.managerList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                    {option.FirstName + option.LastName}
                </MenuItem>
                ))}
            </TextField>
            <Button
              variant="contained"
              onClick={() => {
                this.getFilteredEmployees()
              }}
            >
              Filter
          </Button>
          <Button
              variant="contained"
              onClick={() => {
                this.getAllActiveEmployee()
              }}
            >
              All Active Employee
          </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Firstname</TableCell>
                <TableCell align="center">Lastname</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Date of Employment</TableCell>
                <TableCell align="center">Manager</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.employees.map(employee => (
                <TableRow key={employee.name}>
                  <TableCell align="left">{employee.FirstName}</TableCell>
                  <TableCell align="left">{employee.LastName}</TableCell>
                  <TableCell align="left">{employee.Email}</TableCell>
                  <TableCell align="left">{this.renderDateOfEmployRow(employee)}</TableCell>
                  <TableCell align="left">{this.renderManagerRow(employee)}</TableCell>
                  <TableCell align="left">{this.renderActionsRow(employee)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default HomePage;
