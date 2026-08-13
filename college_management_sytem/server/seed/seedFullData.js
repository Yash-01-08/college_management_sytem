require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Department = require("../models/Department");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const TeachingAssignment = require("../models/TeachingAssignment");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Timetable = require("../models/Timetable");
const Fee = require("../models/Fee");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

const seedFullData = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb+srv://yashrathore93013_db_user:odWSTTCbEEqaQPIv@cluster0.oab3ijh.mongodb.net/college_management";

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB for seeding dataset...");
    }

    console.log("Cleaning existing collections...");
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Course.deleteMany({}),
      Subject.deleteMany({}),
      TeachingAssignment.deleteMany({}),
      Enrollment.deleteMany({}),
      Attendance.deleteMany({}),
      Result.deleteMany({}),
      Timetable.deleteMany({}),
      Fee.deleteMany({}),
      Event.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Collections cleared successfully.");

    // 1. Seed Admin (1)
    console.log("Seeding Admin User...");
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@college.edu",
      phone: "9999999999",
      password: "password123",
      role: "admin",
      isActive: true,
    });

    // 2. Seed Departments (3)
    console.log("Seeding Departments...");
    const deptCSE = await Department.create({
      name: "Computer Science & Engineering",
      code: "CSE",
      description: "Department of Computer Science & Software Engineering",
      isActive: true,
    });

    const deptECE = await Department.create({
      name: "Electronics & Communication Engineering",
      code: "ECE",
      description: "Department of Electronics, Microprocessors & Communication",
      isActive: true,
    });

    const deptME = await Department.create({
      name: "Mechanical Engineering",
      code: "ME",
      description: "Department of Thermal Engineering, Robotics & Design",
      isActive: true,
    });

    // 3. Seed Coordinators (2)
    console.log("Seeding Coordinators (2)...");
    const coordCSE = await User.create({
      name: "Prof. Amanda Miller",
      email: "coordinator@college.edu",
      phone: "9876543201",
      password: "password123",
      role: "coordinator",
      department: "CSE",
      isActive: true,
    });

    const coordECE = await User.create({
      name: "Dr. Marcus Vance",
      email: "coordinator.ece@college.edu",
      phone: "9876543202",
      password: "password123",
      role: "coordinator",
      department: "ECE",
      isActive: true,
    });

    // Assign HOD to departments
    deptCSE.hod = coordCSE._id;
    await deptCSE.save();
    deptECE.hod = coordECE._id;
    await deptECE.save();

    // 4. Seed Faculty (8)
    console.log("Seeding Faculty Members (8)...");
    const faculty1 = await User.create({
      name: "Dr. Robert Smith",
      email: "faculty@college.edu",
      phone: "9876543211",
      password: "password123",
      role: "faculty",
      department: "CSE",
      isActive: true,
    });

    const faculty2 = await User.create({
      name: "Dr. Sarah Jenkins",
      email: "sarah.jenkins@college.edu",
      phone: "9876543212",
      password: "password123",
      role: "faculty",
      department: "CSE",
      isActive: true,
    });

    const faculty3 = await User.create({
      name: "Dr. Alan Turing",
      email: "alan.turing@college.edu",
      phone: "9876543213",
      password: "password123",
      role: "faculty",
      department: "CSE",
      isActive: true,
    });

    const faculty4 = await User.create({
      name: "Prof. David Wilson",
      email: "david.wilson@college.edu",
      phone: "9876543214",
      password: "password123",
      role: "faculty",
      department: "ECE",
      isActive: true,
    });

    const faculty5 = await User.create({
      name: "Dr. Elena Rostova",
      email: "elena.rostova@college.edu",
      phone: "9876543215",
      password: "password123",
      role: "faculty",
      department: "ECE",
      isActive: true,
    });

    const faculty6 = await User.create({
      name: "Dr. Michael Chang",
      email: "michael.chang@college.edu",
      phone: "9876543216",
      password: "password123",
      role: "faculty",
      department: "ME",
      isActive: true,
    });

    const faculty7 = await User.create({
      name: "Prof. Patricia Jones",
      email: "jones@college.edu",
      phone: "9876543217",
      password: "password123",
      role: "faculty",
      department: "ME",
      isActive: true,
    });

    const faculty8 = await User.create({
      name: "Dr. Nikola Tesla",
      email: "nikola.tesla@college.edu",
      phone: "9876543218",
      password: "password123",
      role: "faculty",
      department: "ME",
      isActive: true,
    });

    // 5. Seed Degree Courses
    console.log("Seeding Degree Courses...");
    const courseBTechCSE = await Course.create({
      name: "B.Tech Computer Science",
      code: "BTECH-CSE",
      department: deptCSE._id,
      duration: 4,
      totalSemesters: 8,
      isActive: true,
    });

    const courseBTechECE = await Course.create({
      name: "B.Tech Electronics",
      code: "BTECH-ECE",
      department: deptECE._id,
      duration: 4,
      totalSemesters: 8,
      isActive: true,
    });

    const courseBTechME = await Course.create({
      name: "B.Tech Mechanical",
      code: "BTECH-ME",
      department: deptME._id,
      duration: 4,
      totalSemesters: 8,
      isActive: true,
    });

    // 6. Seed Curriculum Subjects
    console.log("Seeding Curriculum Subjects...");
    const subDS = await Subject.create({
      name: "Data Structures & Algorithms",
      code: "CS301",
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 4,
      credits: 4,
      type: "theory",
      isActive: true,
    });

    const subOS = await Subject.create({
      name: "Operating Systems",
      code: "CS302",
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 4,
      credits: 4,
      type: "theory",
      isActive: true,
    });

    const subDBMS = await Subject.create({
      name: "Database Management Systems",
      code: "CS303",
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 4,
      credits: 4,
      type: "theory",
      isActive: true,
    });

    const subWeb = await Subject.create({
      name: "Web Technologies Lab",
      code: "CS304",
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 4,
      credits: 2,
      type: "lab",
      isActive: true,
    });

    const subEC1 = await Subject.create({
      name: "Digital Electronics",
      code: "EC301",
      department: deptECE._id,
      course: courseBTechECE._id,
      semester: 4,
      credits: 4,
      type: "theory",
      isActive: true,
    });

    const subEC2 = await Subject.create({
      name: "Microprocessors & Interfacing",
      code: "EC302",
      department: deptECE._id,
      course: courseBTechECE._id,
      semester: 4,
      credits: 4,
      type: "theory",
      isActive: true,
    });

    const subME1 = await Subject.create({
      name: "Thermodynamics & Heat Transfer",
      code: "ME301",
      department: deptME._id,
      course: courseBTechME._id,
      semester: 4,
      credits: 4,
      type: "theory",
      isActive: true,
    });

    const subME2 = await Subject.create({
      name: "Fluid Mechanics Lab",
      code: "ME302",
      department: deptME._id,
      course: courseBTechME._id,
      semester: 4,
      credits: 2,
      type: "lab",
      isActive: true,
    });

    // 7. Seed Teaching Assignments
    console.log("Seeding Teaching Assignments...");
    await TeachingAssignment.create([
      { faculty: faculty1._id, subject: subDS._id, course: courseBTechCSE._id, semester: 4, academicYear: "2024-2025" },
      { faculty: faculty2._id, subject: subOS._id, course: courseBTechCSE._id, semester: 4, academicYear: "2024-2025" },
      { faculty: faculty3._id, subject: subDBMS._id, course: courseBTechCSE._id, semester: 4, academicYear: "2024-2025" },
      { faculty: faculty1._id, subject: subWeb._id, course: courseBTechCSE._id, semester: 4, academicYear: "2024-2025" },
      { faculty: faculty4._id, subject: subEC1._id, course: courseBTechECE._id, semester: 4, academicYear: "2024-2025" },
      { faculty: faculty5._id, subject: subEC2._id, course: courseBTechECE._id, semester: 4, academicYear: "2024-2025" },
      { faculty: faculty6._id, subject: subME1._id, course: courseBTechME._id, semester: 4, academicYear: "2024-2025" },
      { faculty: faculty7._id, subject: subME2._id, course: courseBTechME._id, semester: 4, academicYear: "2024-2025" },
    ]);

    // 8. Seed Students (10)
    console.log("Seeding Student Accounts (10)...");
    const studentsData = [
      { name: "Alex Johnson", email: "student@college.edu", scholarNumber: "2024001", phone: "9876543221", dept: "CSE", course: "BTECH-CSE" },
      { name: "Priya Sharma", email: "priya.sharma@college.edu", scholarNumber: "2024002", phone: "9876543222", dept: "CSE", course: "BTECH-CSE" },
      { name: "Rahul Verma", email: "rahul.verma@college.edu", scholarNumber: "2024003", phone: "9876543223", dept: "CSE", course: "BTECH-CSE" },
      { name: "Sophia Martinez", email: "sophia.m@college.edu", scholarNumber: "2024004", phone: "9876543224", dept: "CSE", course: "BTECH-CSE" },
      { name: "Rohan Gupta", email: "rohan.gupta@college.edu", scholarNumber: "2024005", phone: "9876543225", dept: "CSE", course: "BTECH-CSE" },
      { name: "Emily Davis", email: "emily.davis@college.edu", scholarNumber: "2024006", phone: "9876543226", dept: "ECE", course: "BTECH-ECE" },
      { name: "James Wilson", email: "james.w@college.edu", scholarNumber: "2024007", phone: "9876543227", dept: "ECE", course: "BTECH-ECE" },
      { name: "Sneha Reddy", email: "sneha.reddy@college.edu", scholarNumber: "2024008", phone: "9876543228", dept: "ECE", course: "BTECH-ECE" },
      { name: "Ananya Patel", email: "ananya.patel@college.edu", scholarNumber: "2024009", phone: "9876543229", dept: "ME", course: "BTECH-ME" },
      { name: "Vikram Singh", email: "vikram.singh@college.edu", scholarNumber: "2024010", phone: "9876543230", dept: "ME", course: "BTECH-ME" },
    ];

    const seededStudents = [];
    for (const sData of studentsData) {
      const student = await User.create({
        name: sData.name,
        email: sData.email,
        phone: sData.phone,
        password: "password123",
        role: "student",
        scholarNumber: sData.scholarNumber,
        department: sData.dept,
        course: sData.course,
        semester: 4,
        batch: "2023-2027",
        dateOfBirth: new Date("2003-05-14"),
        isActive: true,
      });
      seededStudents.push(student);
    }

    // 9. Seed Student Enrollments
    console.log("Seeding Enrollments...");
    const cseStudents = seededStudents.slice(0, 5);
    const eceStudents = seededStudents.slice(5, 8);
    const meStudents = seededStudents.slice(8, 10);

    const cseSubjects = [subDS, subOS, subDBMS, subWeb];
    for (const stu of cseStudents) {
      for (const sub of cseSubjects) {
        await Enrollment.create({
          student: stu._id,
          subject: sub._id,
          semester: 4,
          academicYear: "2024-2025",
          status: "active",
        });
      }
    }

    for (const stu of eceStudents) {
      for (const sub of [subEC1, subEC2]) {
        await Enrollment.create({
          student: stu._id,
          subject: sub._id,
          semester: 4,
          academicYear: "2024-2025",
          status: "active",
        });
      }
    }

    for (const stu of meStudents) {
      for (const sub of [subME1, subME2]) {
        await Enrollment.create({
          student: stu._id,
          subject: sub._id,
          semester: 4,
          academicYear: "2024-2025",
          status: "active",
        });
      }
    }

    // 10. Seed Attendance Records
    console.log("Seeding Attendance Records...");
    const pastDates = ["2026-08-01", "2026-08-02", "2026-08-05", "2026-08-08", "2026-08-10"];
    for (const stu of cseStudents) {
      for (let i = 0; i < pastDates.length; i++) {
        await Attendance.create({
          student: stu._id,
          subject: subDS._id,
          faculty: faculty1._id,
          date: new Date(pastDates[i]),
          status: i === 2 ? "absent" : i === 4 ? "late" : "present",
          remarks: i === 2 ? "Absent without leave" : i === 4 ? "Late by 10 mins" : "Regular attendance",
        });
        await Attendance.create({
          student: stu._id,
          subject: subOS._id,
          faculty: faculty2._id,
          date: new Date(pastDates[i]),
          status: "present",
          remarks: "Active participant",
        });
      }
    }

    // 11. Seed Exam Results
    console.log("Seeding Exam Results...");
    for (const stu of cseStudents) {
      await Result.create({
        student: stu._id,
        subject: subDS._id,
        semester: 4,
        academicYear: "2024-2025",
        internalMarks: 35 + Math.floor(Math.random() * 10),
        externalMarks: 45 + Math.floor(Math.random() * 10),
      });
      await Result.create({
        student: stu._id,
        subject: subOS._id,
        semester: 4,
        academicYear: "2024-2025",
        internalMarks: 30 + Math.floor(Math.random() * 10),
        externalMarks: 40 + Math.floor(Math.random() * 10),
      });
    }

    // 12. Seed Timetables
    console.log("Seeding Class Timetables...");
    await Timetable.create([
      { subject: subDS._id, faculty: faculty1._id, course: courseBTechCSE._id, semester: 4, day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", room: "LH-101", type: "lecture" },
      { subject: subOS._id, faculty: faculty2._id, course: courseBTechCSE._id, semester: 4, day: "Monday", startTime: "10:15 AM", endTime: "11:15 AM", room: "LH-102", type: "lecture" },
      { subject: subDBMS._id, faculty: faculty3._id, course: courseBTechCSE._id, semester: 4, day: "Tuesday", startTime: "11:30 AM", endTime: "12:30 PM", room: "LH-101", type: "lecture" },
      { subject: subWeb._id, faculty: faculty1._id, course: courseBTechCSE._id, semester: 4, day: "Wednesday", startTime: "02:00 PM", endTime: "04:00 PM", room: "Lab-3", type: "lab" },
      { subject: subEC1._id, faculty: faculty4._id, course: courseBTechECE._id, semester: 4, day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", room: "ECE-201", type: "lecture" },
      { subject: subME1._id, faculty: faculty6._id, course: courseBTechME._id, semester: 4, day: "Tuesday", startTime: "10:00 AM", endTime: "11:00 AM", room: "ME-105", type: "lecture" },
    ]);

    // 13. Seed Student Fees
    console.log("Seeding Student Fees...");
    for (const stu of seededStudents) {
      await Fee.create({
        student: stu._id,
        academicYear: "2024-2025",
        semester: 4,
        amount: 50000,
        paidAmount: 50000,
        dueDate: new Date("2026-09-15"),
        transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
      });
      await Fee.create({
        student: stu._id,
        academicYear: "2024-2025",
        semester: 4,
        amount: 25000,
        paidAmount: 10000,
        dueDate: new Date("2026-10-01"),
        transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
      });
    }

    // 14. Seed Campus Events
    console.log("Seeding Events...");
    await Event.create([
      {
        title: "DevFusion 4.0 Hackathon 2026",
        description: "Annual university 48-hour software & IoT hackathon",
        type: "workshop",
        startDate: new Date("2026-08-20"),
        endDate: new Date("2026-08-22"),
        venue: "Main Campus Auditorium & Innovation Lab",
        department: deptCSE._id,
        createdBy: coordCSE._id,
        isPublished: true,
      },
      {
        title: "National Tech Symposium",
        description: "Technical paper presentations and keynote lectures by industry leaders",
        type: "academic",
        startDate: new Date("2026-09-05"),
        endDate: new Date("2026-09-06"),
        venue: "Seminar Hall A",
        department: deptECE._id,
        createdBy: coordECE._id,
        isPublished: true,
      },
      {
        title: "Annual Sports Meet 2026",
        description: "Inter-departmental athletics, football, and basketball tournaments",
        type: "sports",
        startDate: new Date("2026-10-10"),
        endDate: new Date("2026-10-12"),
        venue: "University Sports Ground",
        createdBy: admin._id,
        isPublished: true,
      },
    ]);

    // 15. Seed Notifications
    console.log("Seeding Notifications...");
    for (const stu of seededStudents) {
      await Notification.create({
        recipient: stu._id,
        title: "Semester 4 Timetable Released",
        message: "Your academic timetable for Semester 4 is now active.",
        type: "announcement",
        isRead: false,
      });
      await Notification.create({
        recipient: stu._id,
        title: "Mid-Term Exam Results Published",
        message: "Your mid-term exam marks for Data Structures are available in your portal.",
        type: "result",
        isRead: true,
      });
    }

    for (const fac of [faculty1, faculty2, faculty3, faculty4, faculty5, faculty6, faculty7, faculty8]) {
      await Notification.create({
        recipient: fac._id,
        title: "Welcome to Faculty Portal",
        message: "Your teaching assignments and student rosters are updated.",
        type: "system",
        isRead: false,
      });
    }

    console.log("\n=======================================================");
    console.log("DATABASE SEEDED SUCCESSFULLY WITH FULL DATASET!");
    console.log("Accounts created:");
    console.log("- Admin (1): admin@college.edu / password123");
    console.log("- Coordinators (2): coordinator@college.edu, coordinator.ece@college.edu / password123");
    console.log("- Faculty (8): faculty@college.edu, sarah.jenkins@college.edu, alan.turing@college.edu, david.wilson@college.edu, elena.rostova@college.edu, michael.chang@college.edu, jones@college.edu, nikola.tesla@college.edu / password123");
    console.log("- Students (10): student@college.edu, priya.sharma@college.edu, rahul.verma@college.edu, sophia.m@college.edu, rohan.gupta@college.edu, emily.davis@college.edu, james.w@college.edu, sneha.reddy@college.edu, ananya.patel@college.edu, vikram.singh@college.edu / password123");
    console.log("=======================================================\n");

    return true;
  } catch (error) {
    console.error("Error seeding full data:", error);
    throw error;
  }
};

if (require.main === module) {
  seedFullData()
    .then(() => {
      mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedFullData;
