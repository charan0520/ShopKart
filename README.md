# ShopKart
Microservices-Based E-Commerce Platform  with Analytics Dashboard
## 📌 Overview  
**ShopKart** is a microservices based e-commerce platform that allows customers to browse products, manage carts, and place orders, while administrators can efficiently manage products, users, and orders.  

A key highlight is the **analytics dashboard**, which provides insights such as sales volume, order status distribution, top-selling products, and next month sales prediction.  

---

## 🚀 Features  

### 👤 Customer Features  
- User registration & JWT-based login  
- Browse products across categories  
- Add products to cart & checkout  
- Order tracking & order history  

### 🛠️ Admin Features  
- Manage product catalog (Add, Update, Delete)  
- Manage users and orders  
- Update order status  
- Access **Analytics Dashboard** with:  
  - Sales by year, category, product  
  - Orders by status  
  - Monthly/Yearly performance  
  - Prediction of next month sales (using **SMILE linear regression**)  

---

## 🏗️ System Architecture  
- **Frontend:** ReactJS (React Router, Axios, ChartJS)  
- **Backend:** Spring Boot (Microservices architecture)  
- **Databases:** MongoDB (Atlas Cloud)  
- **API Gateway:** Spring Cloud Gateway  
- **Service Discovery:** Eureka (Naming Server)  
- **Authentication:** Spring Security with JWT Tokens  
- **Analytics:** SMILE (Statistical Machine Intelligence & Learning Engine)  

---

## 🗂️ Microservices  
- **Users Service** → Handles registration, authentication, user data  
- **Products Service** → Manages product catalog  
- **Orders Service** → Manages cart, checkout, and order tracking  
- **Auth Service** → JWT-based authentication/authorization  
- **Analytics Service** → Sales analytics & ML predictions  

---

## 📊 Sample Database Structures  

**UsersDb**  
```json
{
  "id": "68127ab6acf9d006c471cd81",
  "name": "Charan",
  "email": "charan@islander.edu",
  "password": "hashed_password",
  "role": "USER"
}
```

**ProductsDb**  
```json
{
  "id": "1",
  "title": "Fjallraven Backpack",
  "price": 109.95,
  "description": "Perfect everyday pack",
  "category": "men’s clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL.jpg",
  "rating": { "rate": 3.9, "count": 120 }
}
```

**OrdersDb**  
```json
{
  "id": "6818d0d64df70052e746c3f5",
  "userId": "68127ab6acf9d006c471cd81",
  "orderItems": [{ "productId": "2", "quantity": 2, "price": 22.3 }],
  "totalPrice": 44.6,
  "status": "delivered",
  "orderDate": "2025-07-25T18:24:00Z"
}
```

---

## 🔮 Analytics Features  
- Sales metrics (all-time, yearly, monthly)  
- Orders breakdown by status  
- Average order value  
- Top-selling products  
- Sales prediction for upcoming month (**SMILE Regression**)  
- Interactive React dashboards (ChartJS visualizations)  

---

## 🛠️ Tech Stack  
- **Frontend:** ReactJS, Axios, ChartJS  
- **Backend:** Spring Boot (Java), Spring Security, Spring Cloud Gateway, Eureka  
- **Database:** MongoDB (Atlas)  
- **Machine Learning:** SMILE  

---
