create database capiLoja
use capiLoja
go

create table Client (
    idClient int primary key identity(1, 1),
    UserName varchar(50) unique not null,
    ClientName varchar(50) not null,
    email varchar(100) unique not null,
    passwordHash varchar(16) not null,
    phone varchar(20) unique,
    isSeller bit not null default 0,
    birthDate date
)
go

create table Item (
    idItem int primary key identity(1, 1),
    itemName varchar(50) not null,
    itemDescription varchar(200) not null,
    price decimal(10, 2) not null,
    idVendedor int,
    foreign key (idVendedor) references Client (idClient)
)
go

create table Avaliation (
    idAvaliation int primary key identity(1, 1),
    score tinyint not null,
    comment varchar(200),
    idClient int,
    idItem int,
    foreign key (idClient) references Client (idClient),
    foreign key (idItem) references Item (idItem)
)
go

create table Purchase (
    idPurchase int primary key identity(1, 1),
    purchaseDatetime datetime not null,
    purchaseArrival datetime,
    totalValue decimal(10, 2) not null,
    idClient int,
    foreign key (idClient) references Client (idClient)
)
go

create table Sale (
    idSale int primary key identity(1, 1),
    quantity int not null default 1,
    idItem int,
    idPurchase int,
    foreign key (idItem) references Item (idItem),
    foreign key (idPurchase) references Purchase (idPurchase)
)
go

create trigger TRG_updateTotal
on Sale
after insert, update, delete
as
    declare
    @idPurchase int,
    @oldQuantity int,
    @newQuantity int,
    @price decimal(10, 2)

    select @idPurchase = d.idPurchase, @oldQuantity = d.quantity, @price = i.price
    from DELETED d
    inner join Item i on d.idItem = i.idItem

    select @idPurchase = ISNULL(ins.idPurchase, @idPurchase),
	@price = ISNULL(i.price, @price),
	@newQuantity = ins.quantity
    from inserted ins
    inner join Item i on ins.idItem = i.idItem

    update Purchase
    set totalValue = totalValue - (ISNULL(@oldQuantity, 0) * @price) + (ISNULL(@newQuantity, 0) * @price)
    where idPurchase = @idPurchase
go