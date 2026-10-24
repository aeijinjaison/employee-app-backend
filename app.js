// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 
// Put your Atlas string in a .env file:  MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/employeeDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.log('DB connection error:', err.message));

const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});
const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const data = await Employee.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const data = await Employee.findById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const newEmployee = new Employee({
            name: req.body.name,
            location: req.body.location,
            position: req.body.position,
            salary: req.body.salary
        });
        const saved = await newEmployee.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        const id = req.body._id || req.body.id;
        const updated = await Employee.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                location: req.body.location,
                position: req.body.position,
                salary: req.body.salary
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));