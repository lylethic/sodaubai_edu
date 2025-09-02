# 📘 SỔ ĐẦU BÀI - Quản lý sổ đầu bài điện tử

> A website that overcomes the disadvantages of using a physical class record book such as being lost, damaged, or forgotten by the class monitor. More importantly, it allows teachers to record and edit entries instantly with just a mobile device.

## 🧠 Purpose

- Help schools manage the class record book digitally through a website.  
- The principal can monitor teaching activities and quickly evaluate lessons across all classes.  
- Teachers can use electronic devices such as phones, tablets, or laptops to create and edit lesson information without having to physically go to class.  
- Record lesson topics and evaluate progress by day or week, enabling teachers and schools to track teaching effectiveness.  

## 🖥️ User Interface

The frontend is developed with **Next.js** and utilizes the modern **Shadcn UI** library, delivering a smooth, fast, and optimized experience across multiple devices.  

## 🔧 Technologies Used

### Front-end
- **Next.js** (React-based framework)  
- **Shadcn UI** (UI components)  

### Back-end
- **ASP.NET Core Web API**  
- **RESTful API**  
- **SQL Server** as the database management system  

### Software Architecture
- **Repository Pattern**: Applied as a middle layer between Business Logic and Data Access, making data access more structured, easier to maintain, and scalable.  

## 🚀 Key Features

- 📆 Record and edit lessons by week/day.  
- 👨‍🏫 Teachers can easily operate on mobile devices.  
- 🏫 Principals and schools can monitor overall teaching progress.  
- 🔒 Security with role-based user permissions: teacher, admin, principal.  
- 📊 Lesson statistics by week/class.  

## 📸 Demo Screenshots

### Back-end
![Project](./client-next/public/images/diagram_Sodaubai.png)  

#### Testing Back-end API
![Project](./client-next/public/images/server1.png)  
![Project](./client-next/public/images/server2.png)  

### Front-end

#### Login Page
![Project](./client-next/public/images/login_sdb.png)  

#### Admin Layout
Class record book details  
![Project](./client-next/public/images/sodaubai_chitiet.png)  
![Project](./client-next/public/images/sodaubai_chitiet2.png)  

#### Teacher Layout
Class record book details  
![Project](./client-next/public/images/sodaubai_teacher1.png)  
![Project](./client-next/public/images/sodaubai_teacher2_chitiet.png)  

Weekly class score statistics  
![Project](./client-next/public/images/thongke1.png)  

## 📂 Installation & Deployment

> Detailed instructions for both Backend and Frontend will be updated soon.  

Run frontend:  
```bash
cd client-next
yarn dev
