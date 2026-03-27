const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const Student = require('./models/Student');
const Course = require('./models/Course');

const app = express();
app.use(express.json());
app.use(express.static('public')); 
app.use(cors());


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studentDB')
  .then(() => {
      console.log('Connected to MongoDB');
      seedCourses(); 
  })
  .catch(err => console.error('MongoDB Connection Error:', err));


app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find(); 
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch courses" });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save(); 
        res.status(201).json({ 
            message: "Student registered successfully!", 
            studentId: savedStudent._id 
        });
    } catch (err) {
        res.status(400).json({ error: "Registration failed. Email might exist." });
    }
});
app.post('/api/enroll', async (req, res) => {
    const { studentId, courseId } = req.body;

    try {
        await Student.findByIdAndUpdate(studentId, {
            $addToSet: { enrolledCourses: courseId } // $addToSet prevents duplicates
        });
        res.json({ message: "Successfully enrolled in the course!" });
    } catch (err) {
        res.status(500).json({ error: "Enrollment failed." });
    }
});


const seedCourses = async () => {
    try {
        const count = await Course.countDocuments();
        if (count === 0) {
            await Course.create([
                { title: "Full Stack Web Dev", instructor: "Dr. Smith", credits: 4 },
                { title: "Database Management", instructor: "Prof. Jones", credits: 3 },
                { title: "UI/UX Design", instructor: "Ms. Davis", credits: 2 }
            ]);
            console.log("Database seeded with initial courses!");
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
};


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));