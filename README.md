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
DB_NAME=TVU
DB_USER=demo_user
DB_PASSWORD=demo_password
DB_HOST=localhost
DB_DIALECT=mysql

### Giải thích các biến môi trường cho Backend

- **`JWT_SECRET`**: 
  - Chuỗi bí mật dùng để mã hóa và giải mã JSON Web Token (JWT). 
  - Thường được sử dụng để xác thực người dùng và bảo mật thông tin trong ứng dụng.

- **`DB_NAME`**: 
  - Tên của cơ sở dữ liệu mà ứng dụng sẽ kết nối tới. 
  - Ở đây là `TVU`.

- **`DB_USER`**: 
  - Tên người dùng của cơ sở dữ liệu. 
  - Ở đây là `demo_user`, người dùng sẽ có quyền truy cập vào cơ sở dữ liệu.

- **`DB_PASSWORD`**: 
  - Mật khẩu cho người dùng cơ sở dữ liệu. 
  - Ở đây là `demo_password`, mật khẩu này cần phải được bảo mật.

- **`DB_HOST`**: 
  - Địa chỉ IP hoặc tên miền của máy chủ cơ sở dữ liệu. 
  - Ở đây là `localhost`, nghĩa là cơ sở dữ liệu đang chạy trên cùng một máy chủ với ứng dụng.

- **`DB_DIALECT`**: 
  - Loại cơ sở dữ liệu đang sử dụng. 
  - Ở đây là `mysql`, xác định rằng ứng dụng sẽ sử dụng MySQL làm hệ quản trị cơ sở dữ liệu.

