create database capiLoja
use capiLoja

create table User (
  id int primary key identiy(1, 1),
  userName string(50) unique not null,
  name string(50) not null,
  email string(100) unique not null,
  passwordHash string(16) not null,
  phone string(20) unique,
  isSeller boolean not null default false,
  birthDate date
)
