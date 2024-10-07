# XÂY DỰNG API VÀ HỆ THỐNG CHẤM ĐIỂM TRỰC TUYẾN CHO ĐỒ ÁN SINH VIÊN CNTT

## Tác giả
- **Trần Thái Hưng**
- Lớp: **DA20TTB**

## Giới thiệu
Dự án này xây dựng hệ thống API và giao diện trực tuyến giúp giảng viên chấm điểm đồ án sinh viên CNTT dễ dàng, tự động hóa các quy trình chấm điểm và theo dõi tiến độ.

## Công nghệ sử dụng
- **Backend**: Node.js, Express.js, MySQL, Sequelize, Puppeteer (để tạo PDF)
- **Frontend**: React.js, NextUI, Axios, Tailwind CSS, Ant Design

## Yêu cầu hệ thống
- **Node.js** v18.18.0 hoặc mới hơn
- **npm** v7.x hoặc mới hơn
- **MySQL**

## Hướng dẫn cài đặt
- git clone
- cd backend
- npm i
- cd frontend
- npm i

## Tạo file `.env` cho Backend
Tạo một file `.env` trong thư mục `backend` với nội dung sau:

```env
JWT_SECRET=my_secret_key
DB_NAME=demo_database
DB_USER=demo_user
DB_PASSWORD=demo_password
DB_HOST=localhost
DB_DIALECT=mysql
