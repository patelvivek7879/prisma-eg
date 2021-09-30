create table employee(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NUll,
    email VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO employee(name,email) VALUES('Deepak Soni','deepak@email.com'),('Charitra Prajapati','charitra@email.com'),('Sanjay Prajapat','sanjay@email.com');