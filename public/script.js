let currentStudentId = null; 


document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/courses');
    const courses = await response.json();
    const container = document.getElementById('courses-container');

    container.innerHTML = courses.map(course => `
        <div class="course-card">
            <h3>${course.title}</h3>
            <p>Instructor: ${course.instructor}</p>
            <p>Credits: ${course.credits}</p>
            <button onclick="enroll('${course._id}')">Enroll Now</button>
        </div>
    `).join('');
});


document.getElementById('regForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    });

    const result = await response.json();
    
    if (response.ok) {
        currentStudentId = result.studentId; 
        alert(`Welcome, ${studentData.name}! You can now enroll in courses.`);
        document.getElementById('regForm').reset();
    } else {
        alert(result.error);
    }
});


async function enroll(courseId) {
    if (!currentStudentId) {
        alert("Please register first before enrolling!");
        return;
    }

    const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            studentId: currentStudentId,
            courseId: courseId
        })
    });

    const result = await response.json();
    alert(result.message);
}