# Avtodiva Frontend (ERP for Driving Schools)


## 💡Overview

This project represents a complete architectural transition from a legacy [Java Swing desktop client](https://github.com/AndreyPolezhaiev/avtodiva) to a modern web ecosystem. It is designed to handle school management operations with a focus on security, scalability, and maintainability.


## 🛠 Tech Stack

* **Frontend:** Angular, TypeScript, HTML5, SCSS.
* **API Integration:** Consumes the REST API provided by the [backend](https://github.com/AndreyPolezhaiev/avtodiva-advanced).
* **Infrastructure:** Docker, Nginx (Reverse Proxy & SSL termination), Linux (Hetzner).


## 🏗 Architecture Highlights

* **Full-Stack Integration:** RESTful API architecture connecting the Angular frontend with a robust Spring Boot backend.
* **Modern UI/UX:** Responsive design optimized for school management workflow.
* **Secure Deployment:** Automated production environment setup using Docker and Nginx, ensuring secure traffic routing.


## 📂 Project Structure

* `src/app/...`: Frontend business logic and components.
* `src/styles/...`: Styles.
* `docker-compose.yml`: Infrastructure orchestration.


## 🚀 How to Run
1. Clone the repository: `git clone https://github.com/AndreyPolezhaiev/avtodiva-frontend`
2. Configure your `.env` file.
3. Run with Docker: `docker-compose up --build`


## 🔗 Related Projects

* **Backend Repository:** [AndreyPolezhaiev/avtodiva-backend](https://github.com/AndreyPolezhaiev/avtodiva-advanced)

---

Developed and maintained by **Andrii Polezhaiev**.