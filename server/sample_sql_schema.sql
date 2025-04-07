CREATE TABLE Role (
  roleId INT IDENTITY(1,1) PRIMARY KEY,
  nameRole varchar(20) NOT NULL,
  description nvarchar(50) NOT NULL,
	dateCreated Datetime,
	dateUpdated Datetime,
);

CREATE TABLE School (
    schoolId INT IDENTITY(1,1) PRIMARY KEY,
    provinceId TINYINT NOT NULL,
    districtId TINYINT NOT NULL,
    nameSchool NVARCHAR(200) NOT NULL,
    address NVARCHAR(200) NOT NULL,
    phoneNumber CHAR(10) NOT NULL UNIQUE,
    schoolType NVARCHAR(40) NOT NULL,
		description NVARCHAR(100) NULL,
		dateCreated Datetime,
);

CREATE TABLE Account (
    accountId INT IDENTITY(1,1) PRIMARY KEY,
    roleId INT NOT NULL,
    schoolId INT NULL,
    email NVARCHAR(50) NOT NULL UNIQUE,  
		matKhau VARBINARY(200) NOT NULL, 
    passwordSalt VARBINARY(200) NOT NULL,
		dateCreated Datetime,
		dateUpdated Datetime,
		FOREIGN KEY (roleId) REFERENCES Role(roleId),
		FOREIGN KEY (schoolId) REFERENCES School(schoolId),
);

CREATE TABLE Session (
    tokenId INT IDENTITY(1,1) PRIMARY KEY,
		token VARCHAR(MAX) NOT NULL,
    accountId INT NOT NULL,
		expiresAt DateTime,
		createdAt DateTime,
		FOREIGN KEY (accountId) REFERENCES Account(accountId),
);

-- danh index cot fullname va thiet lap rule collation cho fullname 
-- COLLATE Vietnamese_CI_AI: ko phan biet chu hoa-thuong, dau Tieng Viet
-- sua thanh nhu nay
CREATE TABLE Teacher (
    teacherId INT IDENTITY(1,1) PRIMARY KEY,
    accountId INT NOT NULL,
    schoolId INT NOT NULL,
    fullname NVARCHAR(100) NOT NULL COLLATE Vietnamese_CI_AI,
    dateOfBirth DATETIME NOT NULL,
    gender BIT NOT NULL DEFAULT 1,
    address NVARCHAR(200) NOT NULL,
    status BIT NOT NULL DEFAULT 1,
		photoPath VARCHAR(255) NULL,
		dateCreate DATETIME,
		dateUpdate DATETIME,
		FOREIGN KEY (accountId) REFERENCES Account(accountId),
		FOREIGN KEY (schoolId) REFERENCES School(schoolId),
);

ALTER TABLE Teacher
ALTER COLUMN fullname NVARCHAR(100) COLLATE Vietnamese_CI_AI NOT NULL;
-- Tao index fullname
CREATE NONCLUSTERED INDEX IX_Teacher_Fullname
ON Teacher (fullname);

--// nien khoa
CREATE TABLE AcademicYear (
    academicYearId INT IDENTITY(1,1) PRIMARY KEY,
    displayAcademicYear_Name NVARCHAR(100) NOT NULL,
    yearStart DATETIME NOT NULL,
    yearEnd DATETIME NOT NULL,
		description NVARCHAR(100) NULL,
		status BIT NOT NULL DEFAULT 1,
);

CREATE TABLE Semester (
    semesterId INT IDENTITY(1,1) PRIMARY KEY,
    academicYearId INT NOT NULL,
    semesterName NVARCHAR(100) NOT NULL,
    dateStart DATETIME NOT NULL,
    dateEnd DATETIME NOT NULL,
		weekEnd datetime,
		weekStart datetime,
		description NVARCHAR(100) NULL,
		status BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (academicYearId) REFERENCES AcademicYear(academicYearId),
);

CREATE TABLE Grade (
    gradeId INT IDENTITY(1,1) PRIMARY KEY,
		academicYearId INT NOT NULL,
    gradeName NVARCHAR(50) NOT NULL,
		description NVARCHAR(100) NULL,
		dateCreated Datetime,
		dateUpdated Datetime,
    FOREIGN KEY (academicYearId) REFERENCES AcademicYear(academicYearId),
);

CREATE TABLE Class (
    classId INT IDENTITY(1,1) PRIMARY KEY,
    gradeId INT NOT NULL,
    teacherId INT NOT NULL,
    academicYearId INT NOT NULL,
    schoolId INT NOT NULL,
    className NVARCHAR(50) NOT NULL,
		numberOfAttendants INT NULL,
    status BIT NOT NULL DEFAULT 1,
		description NVARCHAR(100) NULL,
		dateCreated Datetime,
		dateUpdated Datetime,
    FOREIGN KEY (gradeId) REFERENCES Grade(gradeId),
    FOREIGN KEY (teacherId) REFERENCES Teacher(teacherId),
    FOREIGN KEY (academicYearId) REFERENCES AcademicYear(academicYearId),
    FOREIGN KEY (schoolId) REFERENCES School(schoolId),
);

-- Diem danh
CREATE TABLE RollCall (
	rollCallId int IDENTITY(1,1) PRIMARY KEY,
	classId INT NOT NULL FOREIGN KEY (CLASSID) REFERENCES CLASS(CLASSID) ON DELETE CASCADE,
	weekId INT NOT NULL FOREIGN KEY (WEEKID) REFERENCES WEEK(WEEKID) ON DELETE CASCADE,
	dayOfTheWeek nvarchar(20),
	date_At DATETIME,
	dateCreated Datetime,
	dateUpdated Datetime,
	numberOfAttendants INT,
);

CREATE TABLE RollCallDetail (
	absenceId int IDENTITY(1,1) PRIMARY KEY,
	rollCallId int FOREIGN KEY (rollCallId) REFERENCES ROLLCALL(rollCallId) ON DELETE CASCADE,
	studentId INT NOT NULL FOREIGN KEY (studentId) REFERENCES student(studentId) ON DELETE CASCADE,
	isExcused BIT NOT NULL DEFAULT 1,
	description nvarchar(MAX)
);

CREATE TABLE Student (
    studentId INT IDENTITY(1,1) PRIMARY KEY,
    classId INT NOT NULL,
    gradeId INT NOT NULL,
    accountId INT NOT NULL,
    fullname NVARCHAR(100) NOT NULL,
		dateOfBirth Datetime null,
    status BIT NOT NULL DEFAULT 1, 
		dateCreated Datetime,
		dateUpdated Datetime,
		description NVARCHAR(100) NULL,
		address nvarchar(255) null,
    FOREIGN KEY (gradeId) REFERENCES Grade(gradeId) ,
    FOREIGN KEY (classId) REFERENCES Class(classId),
    FOREIGN KEY (accountId) REFERENCES Account(accountId),
);


CREATE TABLE Subject (
    subjectId INT IDENTITY(1,1) PRIMARY KEY,
		gradeId INT,
    subjectName NVARCHAR(100) NOT NULL,
		status BIT NOT NULL DEFAULT 1,
		FOREIGN KEY (gradeId) REFERENCES Grade(gradeId),
);

--// Phan cong giang day mon hoc cho giao vien
CREATE TABLE SubjectAssignment (
    subjectAssignmentId INT IDENTITY(1,1) PRIMARY KEY,
		teacherId INT NOT NULL,
		subjectId INT NOT NULL,
		description NVARCHAR(100) NULL,
		dateCreated Datetime,
		dateUpdated Datetime,
    FOREIGN KEY (teacherId) REFERENCES Teacher(teacherId),
    FOREIGN KEY (subjectId) REFERENCES Subject(subjectId),
);

--// diem xep loai
CREATE TABLE Classification (
    classificationId INT IDENTITY(1,1) PRIMARY KEY,
    classifyName NVARCHAR(100) NOT NULL,
		score INT NULL,
);

CREATE TABLE Week (
    weekId INT IDENTITY(1,1) PRIMARY KEY,
    semesterId INT NOT NULL,
    weekName NVARCHAR(50) COLLATE Vietnamese_CI_AI NOT NULL,
    weekStart DATETIME NOT NULL,
    weekEnd DATETIME NOT NULL,
		status BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (semesterId) REFERENCES Semester(semesterId),
);

CREATE TABLE PhanCongChuNhiem (
    phanCongChuNhiemId INT IDENTITY(1,1) PRIMARY KEY,
    teacherId INT NOT NULL,
    classId INT NOT NULL,
    academicYearId INT NOT NULL,
		status BIT NOT NULL DEFAULT 1,
		dateCreated Datetime,
		dateUpdated Datetime,
		description NVARCHAR(100) NULL,
    FOREIGN KEY (teacherId) REFERENCES Teacher(teacherId),
    FOREIGN KEY (classId) REFERENCES Class(classId),
    FOREIGN KEY (academicYearId) REFERENCES academicYear(academicYearId),
);

CREATE TABLE PhanCongGiangDay (
    phanCongGiangDayId INT IDENTITY(1,1) PRIMARY KEY,
		biaSoDauBaiId INT NOT NULL,
    teacherId INT NOT NULL,
		status BIT NOT NULL DEFAULT 1,
		dateCreated Datetime,
		dateUpdated Datetime,
    FOREIGN KEY (teacherId) REFERENCES Teacher(teacherId),
		Foreign KEY (biaSoDauBaiId) REFERENCES BiaSoDauBai(biaSoDauBaiId)
);

CREATE TABLE BiaSoDauBai (
    biaSoDauBaiId INT IDENTITY(1,1) PRIMARY KEY,
    schoolId INT NOT NULL,
    academicyearId INT NOT NULL,
    classId INT NOT NULL,
    status BIT NOT NULL DEFAULT 1,
		dateCreated Datetime,
		dateUpdated Datetime,
    FOREIGN KEY (schoolId) REFERENCES School(schoolId),
    FOREIGN KEY (academicyearId) REFERENCES AcademicYear(academicyearId),
    FOREIGN KEY (classId) REFERENCES Class(classId),
);

CREATE TABLE ChiTietSoDauBai (
  chiTietSoDauBaiId INT IDENTITY(1,1) PRIMARY KEY,
  biaSoDauBaiId INT NOT NULL,
  semesterId INT NOT NULL,
  weekId INT NOT NULL,
  subjectId INT NOT NULL,
  classificationId INT NOT NULL,
  DaysOfTheWeek NVARCHAR(10) NOT NULL,
  thoiGian Datetime NOT NULL,
  buoiHoc NVARCHAR(10) NOT NULL,
  tietHoc INT NOT NULL,
  lessonContent NVARCHAR(Max) NOT NULL,
  attend INT NOT NULL,
  noteComment NVARCHAR(255),
  createdBy INT, -- Ma so cua Giao vien/Admin gi do
  createdAt DATETIME DEFAULT GETDATE(),
	updatedAt DATETIME DEFAULT NULL,
  FOREIGN KEY (biaSoDauBaiId) REFERENCES BiaSoDauBai(biaSoDauBaiId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (semesterId) REFERENCES Semester(semesterId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (weekId) REFERENCES Week(weekId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (subjectId) REFERENCES Subject(subjectId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (classificationId) REFERENCES Classification(classificationId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IDX_ChiTietSoDauBai_WeekId ON ChiTietSoDauBai(weekId);

CREATE TABLE WeeklyEvaluation (
    weeklyEvaluationId INT IDENTITY(1,1) PRIMARY KEY, 
    classId INT NULL,                             
    teacherId INT NULL,
    weekId INT NULL,
    monthEvaluation INT NULL,
		WeekNameEvaluation NVARCHAR(50),
    totalScore float NOT NULL,                  
    description NVARCHAR(255) NULL,                           
    createdAt DATETIME NUll,
    updatedAt DATETIME Null,
    FOREIGN KEY (classId) REFERENCES Class(classId) ON DELETE set null,
    FOREIGN KEY (teacherId) REFERENCES Teacher(teacherId) ON DELETE set null,
    FOREIGN KEY (weekId) REFERENCES Week(weekId) ON DELETE set null
);

CREATE TABLE MonthlyEvaluation (
    monthlyEvaluationId INT IDENTITY(1,1) PRIMARY KEY, 
		monthEvaluation int null, -- 1,2,3,4,...12                           
    weeklyEvaluationId int NULL,                              
    avgScore DECIMAL(5,2) NULL,                   
    description NVARCHAR(255),      
		createdBy int NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
		FOREIGN KEY (weeklyEvaluationId) REFERENCES WeeklyEvaluation(weeklyEvaluationId) ON DELETE set null,
);