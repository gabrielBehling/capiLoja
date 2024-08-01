create database capiLoja
use capiLoja
go

create table User (
  idUser int primary key identiy(1, 1),
  userName varchar(50) unique not null,
  name varchar(50) not null,
  email varchar(100) unique not null,
  passwordHash varchar(16) not null,
  phone varchar(20) unique,
  isSeller boolean not null default false,
  birthDate date
)
go

create table Product (
  idProduct int primary key identity(1, 1),
  name varchar(50) not null,
  description varchar(200) not null,
  price decimal(10, 2) not null,
  idVendedor int,
  foreign key (idVendedor) references User (idUser)
)
go

create table Avaliation (
  idAvaliation int primary key identity(1, 1),
  score tinyint not null,
  comment varchar(200),
  idUser int,
  idProduct int,
  foreign key (idUser) references User (idUser),
  foreign key (idProduct) references Product (idProduct)
)
go
  
create table Purchase (
  idPurchase int primary key identity(1, 1),
  purchaseDatetime datetime not null,
  purchaseArrival datetime,
  totalValue decimal(10, 2) not null,
  idUser int,
  foreign key (idUser) references User (idUser)
)
go
  
create table Sale (
  idSale int primary key identity(1, 1),
  quantity int not null default 1,
  idProduct int,
  idPurchase int,
  foreign key (idProduct) references Product (idProduct),
  foreign key (idPurchase) references Purchase (idPurchase)
)
go
