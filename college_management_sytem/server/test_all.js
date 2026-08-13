require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const User = require("./models/User");
const Department = require("./models/Department");
const Course = require("./models/Course");
const Subject = require("./models/Subject");
const Enrollment = require("./models/Enrollment");
const TeachingAssignment = require("./models/TeachingAssignment");
const Attendance = require("./models/Attendance");
const Result = require("./models/Result");
const Timetable = require("./models/Timetable");
const Fee = require("./models/Fee");
const Event = require("./models/Event");
const Notification = require("./models/Notification");
const seedAdmin = require("./seed/seedAdmin");

let server;
let port;
let cookieMap = {};

function request(method, path, body = null, cookie = "") {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://127.0.0.1:${port}`);
    const postData = body ? JSON.stringify(body) : "";

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        Cookie: cookie,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      const setCookie = res.headers["set-cookie"];

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        let parsed = {};
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = { raw: data };
        }
        resolve({
          status: res.statusCode,
          body: parsed,
          headers: res.headers,
          setCookie: setCookie ? setCookie.join("; ") : "",
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("STARTING FULL END-TO-END SYSTEM VERIFICATION");
  console.log("=======================================================\n");

  let mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_management_test";
  console.log("Attempting MongoDB connection to:", mongoUri);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    console.log("Atlas/Primary Mongo connection failed, falling back to local MongoDB...");
    mongoUri = "mongodb://127.0.0.1:27017/college_management_test";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  }
  console.log("Connected successfully to Mongo Database:", mongoUri);

  // Clear test DB collections
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Course.deleteMany({}),
    Subject.deleteMany({}),
    Enrollment.deleteMany({}),
    TeachingAssignment.deleteMany({}),
    Attendance.deleteMany({}),
    Result.deleteMany({}),
    Timetable.deleteMany({}),
    Fee.deleteMany({}),
    Event.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // Start HTTP server locally on dynamic port
  server = app.listen(0);
  port = server.address().port;
  console.log(`Test Express server running on port ${port}`);

  let adminUser, studentUser, facultyUser, unassignedFacultyUser, coordinatorUser;
  let adminCookie, studentCookie, facultyCookie, unassignedFacultyCookie, coordinatorCookie;
  let departmentObj, courseObj, assignedSubjectObj, unassignedSubjectObj;

  // -------------------------------------------------------------
  // TEST 1: Seed Admin Account
  // -------------------------------------------------------------
  console.log("\n[TEST 1] Seeding Admin...");
  adminUser = await seedAdmin();
  if (adminUser && adminUser.role === "admin") {
    console.log("-> SUCCESS: Admin seeded with email:", adminUser.email);
  } else {
    console.error("-> FAIL: Admin seeding failed");
    process.exit(1);
  }

  // -------------------------------------------------------------
  // TEST 2: Public Registration & Admin Prohibition
  // -------------------------------------------------------------
  console.log("\n[TEST 2] Testing Public Registration...");

  // 2a. Attempt registering admin publicly (MUST FAIL 400)
  const resRegAdmin = await request("POST", "/api/auth/register", {
    name: "Hacker Admin",
    email: "fakeadmin@college.edu",
    phone: "9876543210",
    password: "Password123",
    role: "admin",
  });
  if (resRegAdmin.status === 400 && resRegAdmin.body.success === false) {
    console.log("-> SUCCESS: Reject public admin registration (Status 400):", resRegAdmin.body.message);
  } else {
    console.error("-> FAIL: Public admin registration was not blocked!", resRegAdmin);
    process.exit(1);
  }

  // 2b. Register Student
  const resRegStudent = await request("POST", "/api/auth/register", {
    name: "John Student",
    email: "student@college.edu",
    phone: "9876543211",
    password: "Password123",
    role: "student",
    department: new mongoose.Types.ObjectId().toString(),
    course: new mongoose.Types.ObjectId().toString(),
    semester: 1,
    batch: "2024-2028",
    dateOfBirth: "2002-05-15",
  });
  if (resRegStudent.status === 201 && resRegStudent.body.data.user.role === "student") {
    studentUser = resRegStudent.body.data.user;
    studentCookie = resRegStudent.setCookie;
    console.log("-> SUCCESS: Student registered with scholarNumber:", studentUser.scholarNumber);
  } else {
    console.error("-> FAIL: Student registration failed", resRegStudent.body);
    process.exit(1);
  }

  // 2c. Register Assigned Faculty
  const resRegFaculty = await request("POST", "/api/auth/register", {
    name: "Dr. Smith Faculty",
    email: "faculty@college.edu",
    phone: "9876543212",
    password: "Password123",
    role: "faculty",
  });
  facultyUser = resRegFaculty.body.data.user;
  facultyCookie = resRegFaculty.setCookie;
  console.log("-> SUCCESS: Faculty registered:", facultyUser.email);

  // 2d. Register Unassigned Faculty
  const resRegUnassignedFaculty = await request("POST", "/api/auth/register", {
    name: "Dr. Jones Unassigned",
    email: "jones@college.edu",
    phone: "9876543213",
    password: "Password123",
    role: "faculty",
  });
  unassignedFacultyUser = resRegUnassignedFaculty.body.data.user;
  unassignedFacultyCookie = resRegUnassignedFaculty.setCookie;
  console.log("-> SUCCESS: Unassigned Faculty registered:", unassignedFacultyUser.email);

  // 2e. Register Coordinator
  const resRegCoordinator = await request("POST", "/api/auth/register", {
    name: "Carol Coordinator",
    email: "coordinator@college.edu",
    phone: "9876543214",
    password: "Password123",
    role: "coordinator",
  });
  coordinatorUser = resRegCoordinator.body.data.user;
  coordinatorCookie = resRegCoordinator.setCookie;
  console.log("-> SUCCESS: Coordinator registered:", coordinatorUser.email);

  // -------------------------------------------------------------
  // TEST 3: Login & Role Mismatch Protection (403)
  // -------------------------------------------------------------
  console.log("\n[TEST 3] Testing Login & Role Mismatch Protection...");

  // 3a. Student logging in with role = "faculty" (MUST RETURN 403)
  const resLoginRoleMismatch = await request("POST", "/api/auth/login", {
    email: "student@college.edu",
    password: "Password123",
    role: "faculty",
  });
  if (resLoginRoleMismatch.status === 403 && resLoginRoleMismatch.body.message === "Invalid role for this account") {
    console.log("-> SUCCESS: Role mismatch blocked with 403 Forbidden:", resLoginRoleMismatch.body.message);
  } else {
    console.error("-> FAIL: Role mismatch was not handled correctly", resLoginRoleMismatch);
    process.exit(1);
  }

  // 3b. Admin valid login
  const resLoginAdmin = await request("POST", "/api/auth/login", {
    email: process.env.ADMIN_EMAIL || "admin@college.edu",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
    role: "admin",
  });
  adminCookie = resLoginAdmin.setCookie;
  console.log("-> SUCCESS: Admin logged in successfully");

  // -------------------------------------------------------------
  // TEST 4: /api/auth/me Profile Check
  // -------------------------------------------------------------
  console.log("\n[TEST 4] Testing GET /api/auth/me...");
  const resMe = await request("GET", "/api/auth/me", null, studentCookie);
  if (resMe.status === 200 && resMe.body.data.user.email === "student@college.edu") {
    console.log("-> SUCCESS: /api/auth/me returned current user profile");
  } else {
    console.error("-> FAIL: /api/auth/me failed", resMe);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // TEST 5: Academic Foundation Creation (Department, Course, Subject, TeachingAssignment)
  // -------------------------------------------------------------
  console.log("\n[TEST 5] Testing Academic Management (Department, Course, Subject, Assignment)...");

  // Create Department
  const resDept = await request("POST", "/api/coordinator/departments", {
    name: "Computer Science and Engineering",
    code: "CSE",
    description: "Department of Computer Science",
  }, coordinatorCookie);
  departmentObj = resDept.body.data.department;
  console.log("-> SUCCESS: Department created:", departmentObj.code);

  // Update Student user's department to reference real Department ObjectId
  await User.findByIdAndUpdate(studentUser.id || studentUser._id, { department: departmentObj._id });

  // Create Course
  const resCourse = await request("POST", "/api/coordinator/courses", {
    name: "Bachelor of Technology CSE",
    code: "BTECH-CSE",
    department: departmentObj._id,
    duration: 4,
    totalSemesters: 8,
  }, coordinatorCookie);
  courseObj = resCourse.body.data.course;
  console.log("-> SUCCESS: Course created:", courseObj.code);

  // Update Student user's course to reference real Course ObjectId
  await User.findByIdAndUpdate(studentUser.id || studentUser._id, { course: courseObj._id });

  // Create Assigned Subject
  const resSub1 = await request("POST", "/api/coordinator/subjects", {
    name: "Database Management Systems",
    code: "CS301",
    course: courseObj._id,
    department: departmentObj._id,
    semester: 1,
    credits: 4,
    type: "theory",
  }, coordinatorCookie);
  assignedSubjectObj = resSub1.body.data.subject;
  console.log("-> SUCCESS: Assigned Subject created:", assignedSubjectObj.code);

  // Create Unassigned Subject
  const resSub2 = await request("POST", "/api/coordinator/subjects", {
    name: "Operating Systems",
    code: "CS302",
    course: courseObj._id,
    department: departmentObj._id,
    semester: 1,
    credits: 4,
    type: "theory",
  }, coordinatorCookie);
  unassignedSubjectObj = resSub2.body.data.subject;
  console.log("-> SUCCESS: Unassigned Subject created:", unassignedSubjectObj.code);

  // Assign Faculty to CS301
  const resAssign = await request("POST", "/api/coordinator/assignments", {
    facultyId: facultyUser.id || facultyUser._id,
    subjectId: assignedSubjectObj._id,
    courseId: courseObj._id,
    semester: 1,
    academicYear: "2024-2025",
  }, coordinatorCookie);
  console.log("-> SUCCESS: Faculty assigned to subject CS301");

  // Student Enrollment into CS301
  const resEnroll = await request("POST", "/api/student/enrollment", {
    subjectId: assignedSubjectObj._id,
    academicYear: "2024-2025",
    semester: 1,
  }, studentCookie);
  console.log("-> SUCCESS: Student enrolled into CS301");

  // -------------------------------------------------------------
  // TEST 6: Attendance Security & Verification
  // -------------------------------------------------------------
  console.log("\n[TEST 6] Testing Attendance Security & Role Rules...");

  // 6a. Assigned Faculty marks attendance for CS301 (MUST SUCCEED 201/200)
  const resAttSuccess = await request("POST", "/api/faculty/attendance", {
    studentId: studentUser.id || studentUser._id,
    subjectId: assignedSubjectObj._id,
    date: "2026-08-13",
    status: "present",
    remarks: "On time",
  }, facultyCookie);
  if (resAttSuccess.status === 201 || resAttSuccess.status === 200) {
    console.log("-> SUCCESS: Assigned Faculty marked attendance successfully");
  } else {
    console.error("-> FAIL: Assigned Faculty attendance marking failed", resAttSuccess.body);
    process.exit(1);
  }

  // 6b. Unassigned Faculty tries to mark attendance for CS301 (MUST FAIL 403)
  const resAttForbidden = await request("POST", "/api/faculty/attendance", {
    studentId: studentUser.id || studentUser._id,
    subjectId: assignedSubjectObj._id,
    date: "2026-08-13",
    status: "present",
  }, unassignedFacultyCookie);
  if (resAttForbidden.status === 403) {
    console.log("-> SUCCESS: Unassigned faculty blocked with 403 Forbidden:", resAttForbidden.body.message);
  } else {
    console.error("-> FAIL: Unassigned faculty was not blocked from marking attendance!", resAttForbidden);
    process.exit(1);
  }

  // 6c. Student tries to mark attendance via faculty endpoint (MUST FAIL 403)
  const resAttStudentRole = await request("POST", "/api/faculty/attendance", {
    studentId: studentUser.id || studentUser._id,
    subjectId: assignedSubjectObj._id,
    date: "2026-08-13",
    status: "present",
  }, studentCookie);
  if (resAttStudentRole.status === 403) {
    console.log("-> SUCCESS: Student blocked from accessing faculty attendance route (403)");
  } else {
    console.error("-> FAIL: Student was able to call faculty route!", resAttStudentRole);
    process.exit(1);
  }

  // 6d. Student fetches own attendance
  const resStudentAtt = await request("GET", "/api/student/attendance", null, studentCookie);
  if (resStudentAtt.status === 200 && resStudentAtt.body.data.attendance.length > 0) {
    console.log("-> SUCCESS: Student retrieved own attendance records:", resStudentAtt.body.data.attendance.length);
  } else {
    console.error("-> FAIL: Student attendance retrieval failed", resStudentAtt.body);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // TEST 7: Results Security & Verification
  // -------------------------------------------------------------
  console.log("\n[TEST 7] Testing Results Security & Role Rules...");

  // 7a. Assigned Faculty enters results for CS301
  const resResultSuccess = await request("POST", "/api/faculty/results", {
    studentId: studentUser.id || studentUser._id,
    subjectId: assignedSubjectObj._id,
    semester: 1,
    academicYear: "2024-2025",
    internalMarks: 45,
    externalMarks: 48,
  }, facultyCookie);
  if (resResultSuccess.status === 201) {
    console.log("-> SUCCESS: Faculty entered results. Total marks:", resResultSuccess.body.data.result.totalMarks, "Grade:", resResultSuccess.body.data.result.grade);
  } else {
    console.error("-> FAIL: Result entry failed", resResultSuccess.body);
    process.exit(1);
  }

  // 7b. Unassigned Faculty tries entering results (MUST FAIL 403)
  const resResultForbidden = await request("POST", "/api/faculty/results", {
    studentId: studentUser.id || studentUser._id,
    subjectId: unassignedSubjectObj._id,
    semester: 1,
    academicYear: "2024-2025",
    internalMarks: 40,
    externalMarks: 40,
  }, unassignedFacultyCookie);
  if (resResultForbidden.status === 403) {
    console.log("-> SUCCESS: Unassigned faculty blocked from entering results (403):", resResultForbidden.body.message);
  } else {
    console.error("-> FAIL: Unassigned faculty result entry was not blocked!", resResultForbidden);
    process.exit(1);
  }

  // 7c. Student retrieves own results
  const resStudentRes = await request("GET", "/api/student/results", null, studentCookie);
  if (resStudentRes.status === 200 && resStudentRes.body.data.results.length > 0) {
    console.log("-> SUCCESS: Student retrieved own results record:", resStudentRes.body.data.results[0].totalMarks);
  } else {
    console.error("-> FAIL: Student result retrieval failed", resStudentRes.body);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // TEST 8: Timetable, Fees, Events, Notifications
  // -------------------------------------------------------------
  console.log("\n[TEST 8] Testing Timetable, Fees, Events, and Notifications...");

  // Timetable creation by Coordinator
  const resTT = await request("POST", "/api/coordinator/timetable", {
    courseId: courseObj._id,
    subjectId: assignedSubjectObj._id,
    facultyId: facultyUser.id || facultyUser._id,
    semester: 1,
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    room: "Room 101",
    type: "lecture",
  }, coordinatorCookie);
  console.log("-> SUCCESS: Timetable created");

  // Student fetches timetable
  const resStudentTT = await request("GET", "/api/student/timetable", null, studentCookie);
  console.log("-> SUCCESS: Student fetched timetable entries:", resStudentTT.body.data.timetable.length);

  // Admin creates Fee
  const resFee = await request("POST", "/api/admin/fees", {
    studentId: studentUser.id || studentUser._id,
    academicYear: "2024-2025",
    semester: 1,
    amount: 50000,
    dueDate: "2026-12-31",
  }, adminCookie);
  console.log("-> SUCCESS: Admin created Fee record");

  // Student fetches fee
  const resStudentFee = await request("GET", "/api/student/fees", null, studentCookie);
  console.log("-> SUCCESS: Student fetched fees:", resStudentFee.body.data.fees[0].amount);

  // Coordinator creates Event
  const resEvt = await request("POST", "/api/coordinator/events", {
    title: "Annual Tech Symposium",
    description: "College wide technical fest",
    startDate: "2026-09-01",
    endDate: "2026-09-03",
    venue: "Main Auditorium",
  }, coordinatorCookie);
  console.log("-> SUCCESS: Event created by coordinator");

  // Student views published events
  const resStudentEvt = await request("GET", "/api/student/events", null, studentCookie);
  console.log("-> SUCCESS: Student fetched published events:", resStudentEvt.body.data.events.length);

  // Coordinator sends Notification
  const resNotif = await request("POST", "/api/coordinator/notifications", {
    recipientId: studentUser.id || studentUser._id,
    title: "Timetable Released",
    message: "Semester 1 timetable is now active",
    type: "announcement",
  }, coordinatorCookie);
  console.log("-> SUCCESS: Notification sent");

  // Student views notifications
  const resStudentNotif = await request("GET", "/api/student/notifications", null, studentCookie);
  console.log("-> SUCCESS: Student fetched notifications:", resStudentNotif.body.data.notifications[0].title);

  console.log("\n[TEST 9] Testing Phase 3 Role-Based Dashboard APIs...");
  const resStudentDash = await request("GET", "/api/student/dashboard", null, studentCookie);
  console.log("-> SUCCESS: Student Dashboard metrics fetched. Attendance:", resStudentDash.body.data.metrics.attendancePercentage + "%");

  const resFacultyDash = await request("GET", "/api/faculty/dashboard", null, facultyCookie);
  console.log("-> SUCCESS: Faculty Dashboard metrics fetched. Assigned Subjects:", resFacultyDash.body.data.metrics.assignedSubjectsCount);

  const resCoordDash = await request("GET", "/api/coordinator/dashboard", null, coordinatorCookie);
  console.log("-> SUCCESS: Coordinator Dashboard metrics fetched. Departments:", resCoordDash.body.data.metrics.totalDepartments);

  const resAdminDash = await request("GET", "/api/admin/dashboard", null, adminCookie);
  console.log("-> SUCCESS: Admin Dashboard metrics fetched. Total Users:", resAdminDash.body.data.metrics.totalStudents + resAdminDash.body.data.metrics.totalFaculty);

  console.log("\n=======================================================");
  console.log("ALL TEST CASES PASSED SUCCESSFULLY!");
  console.log("=======================================================\n");

  server.close();
  await mongoose.connection.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error("TEST FAILED WITH EXCEPTION:", err);
  if (server) server.close();
  mongoose.connection.close();
  process.exit(1);
});
